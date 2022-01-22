import { derived, get, writable } from "svelte/store";
import _ from "lodash";
import {drawnWaveformToAudioBuffer} from "../utils/audioUtils";
import type {NumberedNote} from "../music/music";
import type {AudioNodesObject} from "./synthStore";
import type { Readable, Writable } from "svelte/store";

export type Point = [number, number];


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
                node.buffer = drawnWaveformToAudioBuffer(note as NumberedNote, get(points));
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
        startDraw,
        endDraw,
    }
}
