import {derived, get, Readable, writable, Writable} from "svelte/store";
import _ from "lodash";
import {getNoteFrequency} from "../music";
import {make_download} from "../utils/toWav";
import {drawnPointsToWaveform} from "../utils/audioUtils";
import type {NumberedNote} from "../music/music";

export type Point = [number, number]

// TODO: [x] Center line on waveform drawing
// TODO: [x] Fix point over-deletion (sort of)
// TODO: [x] Fill in missing points (not specifically drawn) for output waveform
// TODO: [x] Make notes actually play selected pitch
// TODO: [x] Play notes with keyboard
// TODO: [x] Correct phase of output waveform
// TODO: [x] Add grid to drawing canvas

const createWaveform = () => {
    // Drawn points on the svg interface
    const points: Writable<Point[]> = writable([[0, 0], [0, 0]]);
    // Index of the last point in points updated in the middle of a draw
    const lastUpdatedIndex: Writable<number> = writable(0);
    // Whether the mouse is down and being dragged over the svg canvas
    const isDrawing: Writable<boolean> = writable(false);
    // SVG path representing the waveform
    const svgPath: Readable<string> = derived(points, ($points) => (
        `M ${_.flattenDeep($points).join(" ")}`
    ))
    type AudioNodesObject = Partial<{ [key in NumberedNote]: AudioBufferSourceNode }>;
    // Object of actively playing audio nodes by note
    const audioNodes: Writable<AudioNodesObject> = writable({});

    let sampleInterval;  // used to update node audio while you draw

    const audioCtx = new window.AudioContext();
    const mainGainNode = audioCtx.createGain();
    mainGainNode.connect(audioCtx.destination);

    /** Add a new point to points (called when drawing line)
     * @param {Point} pt - new point to add
     */
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

    /** Turns raw audio data into and AudioBuffer object (also sets download link)
     * @param {number[]} wav - array of raw audio data
     * @returns {AudioBuffer} - buffer to be used with web-audio API
     */
    const waveformToAudioBuffer = (wav: number[]): AudioBuffer => {
        let max = Math.max(...wav);
        let min = Math.min(...wav);
        let mid = (max + min) / 2;
        wav = wav.map((val) => - (val - (mid + min)) / mid) // center between -1 & 1 (flipping phase too)
        max = Math.max(...wav);
        min = Math.min(...wav);
        mid = (max + min) / 2;
        let buffer = audioCtx.createBuffer(1, wav.length, audioCtx.sampleRate);
        for (let chan = 0; chan < 1; chan++) {
            const channelBuffer = buffer.getChannelData(chan);
            for (let i = 0; i < buffer.length; i++) {
                channelBuffer[i] = wav[i];
            }
        }
        make_download(buffer, buffer.length);
        return buffer;
    }

    /** Adjust the output gain based on the number of nodes to avoid clipping
     * @param {number} numNodes - number of playing audio nodes
     */
    const updateVolume = (numNodes: number) => {
        numNodes = Math.max(numNodes, 1);
        mainGainNode.gain.value = 0.75 / (numNodes ** 0.6);
    }

    /** Start playing the waveform at the pitch of the given note
     * @param {NumberedNote} note - note to play frequency of
     */
    const play = (note: NumberedNote) => {
        const audioNode = newAudioNode(note);
        audioNodes.update((current) => {
            updateVolume(Object.keys(current).length + 1);
            return ({...current, [note]: audioNode})
        });
    }

    /** Stop playing the given note if it is playing
     * @param {NumberedNote} note - note to stop playing
     */
    const stop = (note: NumberedNote) => {
        if (note in get(audioNodes)) {
            audioNodes.update((current) => {
                updateVolume(Object.keys(current).length - 1);
                current[note].stop();
                delete current[note];
                return current;
            });
        }
    }

    /** Create & start a new audio node playing the current waveform
     * @param {NumberedNote} note - note to play the frequency of
     * @returns {AudioBufferSourceNode} - node loaded with pitched data and started
     */
    const newAudioNode = (note: NumberedNote) => {
        const audioNode = audioCtx.createBufferSource();
        audioNode.buffer = waveformToAudioBuffer(
            drawnPointsToWaveform(
                get(points),
                Math.floor(audioCtx.sampleRate / getNoteFrequency(note))),
        )
        audioNode.loop = true;
        audioNode.connect(mainGainNode);
        audioNode.start();
        return audioNode;
    }

    /** Refresh all playing audio nodes */
    const updateAllPlayingNotes = () => {
        audioNodes.update((nodes) => {
            Object.entries(get(audioNodes)).forEach(([note, node]) => {
                node.stop();
                node.disconnect(mainGainNode);
                delete nodes[note];
                nodes[note] = newAudioNode(note as NumberedNote);
            })
            return nodes;
        })
    }

    /** Mark the start of a drawing session (click & drag) */
    const startDraw = () => {
        isDrawing.set(true);
        if (Object.keys(get(audioNodes)).length) {
            sampleInterval = setInterval(updateAllPlayingNotes, 200);
        }
    }

    /** Mark that you are done drawing (click & drag) */
    const endDraw = () => {
        isDrawing.set(false);
        if (sampleInterval) {
            clearInterval(sampleInterval);
        }
        updateAllPlayingNotes();
    }

    return {
        subscribe: points.subscribe,
        set: points.set,
        addPoint,
        play,
        stop,
        svgPath,
        get isDrawing(): boolean {
            return get(isDrawing)
        },
        startDraw,
        endDraw,
    }
}


export const waveformStore = createWaveform();
