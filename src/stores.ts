import {derived, get, Readable, writable, Writable} from "svelte/store";
import _ from "lodash";
import type {Note} from "./music";
import {make_download} from "./utils/toWav";
import {drawnPointsToWaveform} from "./utils/audioUtils";

export type Point = [number, number]

// TODO: [x] Center line on waveform drawing
// TODO: [x] Fix point over-deletion (sort of)
// TODO: [ ] Fill in missing points (not specifically drawn) for output waveform
// TODO: [ ] Make notes actually play selected pitch
// TODO: [ ] Play notes with keyboard

const createWaveform = () => {
    const points: Writable<Point[]> = writable([[0, 0], [0, 0]]);
    const lastUpdatedIndex: Writable<number> = writable(0);
    const isDrawing: Writable<boolean> = writable(false);
    const svgPath: Readable<string> = derived(points, ($points) => (
        `M ${_.flattenDeep($points).join(" ")}`
    ))
    type AudioNodesObject = Partial<{ [key in Note]: AudioBufferSourceNode }>;
    const audioNodes: Writable<AudioNodesObject> = writable({});

    let sampleInterval;

    const audioCtx = new window.AudioContext();

    const addPoint = (pt: Point) => {
        /// ADD A POINT TO THE WAVEFORM REPRESENTATION
        const greaterOrEqualX = (pt2: Point): boolean => pt2[0] >= pt[0];
        points.update((points): Point[] => {
            let insertionIndex: number = points.findIndex(greaterOrEqualX);
            insertionIndex = insertionIndex >= 0 ? insertionIndex : points.length - 1;
            let deleteCount: number = 0;
            let unzipped: number[][] = _.unzip(points); // 2 arrays, one of all x coords & one of all y coords
            const lastIndex = get(lastUpdatedIndex);
            let diff: number = insertionIndex - lastIndex; // difference between the clicked index and the lastUpdated index
            // see if there is a point already at that x coordinate, add it to delete count
            let index = unzipped[0].indexOf(pt[0]); // index
            if (index >= 0) {
                deleteCount += 1;
            }

            // REMOVE SKIPPED POINTS
            if (get(isDrawing)) {
                // if any items were skipped:
                if (diff > 1 || diff <= -1) {
                    // reassign insertionIndex to lastUpdatedIndex if insertionIndex.x >= lastIndex.x
                    if (points[insertionIndex][0] >= points[lastIndex][0]) {
                        insertionIndex = lastIndex;
                    }
                    deleteCount += Math.abs(diff);
                    // if insertionIndex.x <= lastIndex.x and insertionIndex is not right at the right end
                    if (points[insertionIndex][0] < points[lastIndex][0] && insertionIndex < points.length - 5 && diff < 0) {
                        deleteCount += 1;
                    }
                }
            }

            if (diff < 0 && deleteCount) {
                deleteCount -= 1;
            }

            points.splice(insertionIndex, deleteCount, pt);
            lastUpdatedIndex.set(points.indexOf(pt));
            points.sort((a, b) => a[0] - b[0]);
            return points;
        });
    }


    const pointsToAudioBuffer = (wav: number[]): AudioBuffer => {
        let max = Math.max(...wav);
        let min = Math.min(...wav);
        let mid = (max + min) / 2;
        wav = wav.map((val) => (val - (mid + min)) / mid) // center between -1 & 1
        max = Math.max(...wav);
        min = Math.min(...wav);
        mid = (max + min) / 2;
        let buffer = audioCtx.createBuffer(2, wav.length, audioCtx.sampleRate);
        for (let chan = 0; chan < 2; chan++) {
            const channelBuffer = buffer.getChannelData(chan);
            for (let i = 0; i < buffer.length; i++) {
                channelBuffer[i] = wav[i];
            }
        }
        make_download(buffer, buffer.length);
        return buffer;
    }

    const play = (note) => {
        const audioNode = newAudioNode(note);
        audioNodes.update((current) => ({...current, [note]: audioNode}));
    }

    const newAudioNode = (note) => {
        const audioNode = audioCtx.createBufferSource();
        audioNode.buffer = pointsToAudioBuffer(
            drawnPointsToWaveform(get(points))
        )
        audioNode.loop = true;
        audioNode.connect(audioCtx.destination);
        audioNode.start();
        return audioNode;
    }

    const updateAllPlayingNotes = () => {
        audioNodes.update((nodes) => {
            Object.entries(get(audioNodes)).forEach(([note, node]) => {
                node.stop();
                node.disconnect(audioCtx.destination);
                delete nodes[note];
                nodes[note] = newAudioNode(note);
            })
            return nodes;
        })

    }


    return {
        subscribe: points.subscribe,
        set: points.set,
        addPoint,
        play,
        stop: (note) => {
            if (note in get(audioNodes)) {
                audioNodes.update((current) => {
                    current[note].stop();
                    delete current[note];
                    return current;
                });
            }
        },
        svgPath,
        get isDrawing(): boolean {
            return get(isDrawing)
        },
        startDraw: () => {
            isDrawing.set(true);
            if (Object.keys(get(audioNodes)).length) {
                sampleInterval = setInterval(updateAllPlayingNotes, 200);
            }
        },
        endDraw: () => {
            isDrawing.set(false);
            if (sampleInterval) {
                clearInterval(sampleInterval);
            }
            updateAllPlayingNotes();
        },
    }
}


export const waveform = createWaveform();
