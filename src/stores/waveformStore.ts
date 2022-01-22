import type {Readable, Writable} from "svelte/store";
import {derived, get, writable} from "svelte/store";
import _ from "lodash";
import {drawnPointsToWaveform} from "../utils/audioUtils";
import type {NumberedNote} from "../music/music";
import type {AudioNodesObject} from "./synthStore";
import {getNoteFrequency} from "../music";
import {make_download} from "../utils/toWav";

export type Point = [number, number];


const audioCtx = new window.AudioContext();

export const createWaveform = (audioNodes: Writable<AudioNodesObject>) => {
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
    const drawingHeight: Writable<number> = writable(0);

    let sampleInterval;  // used to update node audio while you draw

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

    /** Refresh all playing audio nodes */
    const updateAllPlayingNotes = () => {
        audioNodes.update((nodes) => {
            Object.entries(get(audioNodes)).forEach(([note, node]) => {
                node.buffer = toAudioBuffer(note as NumberedNote);
                node.hardStart();
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

    /** Turns raw audio data into and AudioBuffer object (also sets download link)
     * @param {NumberedNote} note - note this waveform should play
     * @returns {AudioBuffer} - buffer to be used with web-audio API
     */
    const toAudioBuffer = (note: NumberedNote): AudioBuffer => {
        // get initial waveform from drawn points, passing the desired frequency
        let wav = drawnPointsToWaveform(
            get(points),
            Math.floor(audioCtx.sampleRate / getNoteFrequency(note))
        )
        // let max = Math.max(...wav);
        let max = get(drawingHeight)
        let min = 0 // Math.min(...wav);
        let mid = Math.round(max / 2);
        wav = wav.map((val) => - (val - (mid + min)) / mid) // center between -1 & 1 (flipping phase too)
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

    return {
        subscribe: points.subscribe,
        set: points.set,
        get points() {
            return get(points);
        },
        addPoint,
        get drawnPoints() {
            return get(points);
        },
        svgPath,
        get isDrawing(): boolean {
            return get(isDrawing)
        },
        drawingHeight,
        startDraw,
        endDraw,
        toAudioBuffer,
    }
}
