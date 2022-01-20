import {derived, get, Readable, writable, Writable} from "svelte/store";
import _ from "lodash";
import {drawnWaveformToAudioBuffer} from "../utils/audioUtils";
import type {NumberedNote} from "../music/music";

export type Point = [number, number]

// TODO: [x] Center line on waveform drawing
// TODO: [x] Fix point over-deletion (sort of)
// TODO: [x] Fill in missing points (not specifically drawn) for output waveform
// TODO: [x] Make notes actually play selected pitch
// TODO: [x] Play notes with keyboard
// TODO: [x] Correct phase of output waveform
// TODO: [x] Add grid to drawing canvas

const audioCtx = new window.AudioContext();
const mainGainNode = audioCtx.createGain();
mainGainNode.connect(audioCtx.destination);

class WaveformOscillatorNode {
    node: AudioBufferSourceNode;
    gain: GainNode;
    note: NumberedNote;

    constructor(buffer: AudioBuffer, note: NumberedNote, start: boolean = true) {
        this.note = note;
        this.gain = audioCtx.createGain();
        this.gain.connect(mainGainNode);
        this.node = audioCtx.createBufferSource();
        this.node.connect(this.gain);
        this.node.buffer = buffer;
        this.node.loop = true;
        if (start) {
            this.node.start();
        }
    }

    stop() {
        this.node.stop();
    }

    disconnect(node: AudioNode) {
        this.gain.disconnect(node);
    }
}

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
    type AudioNodesObject = Partial<{ [key in NumberedNote]: WaveformOscillatorNode }>;
    // Object of actively playing audio nodes by note
    const audioNodes: Writable<AudioNodesObject> = writable({});

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

    /** Adjust the output gain based on the number of nodes to avoid clipping
     * @param {number} numNodes - number of playing audio nodes
     */
    const updateVolume = (numNodes: number) => {
        if (numNodes === 0) {
            console.log(numNodes);
            mainGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
        }
        else if (numNodes === 1) {
            mainGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            mainGainNode.gain.linearRampToValueAtTime(0.75, audioCtx.currentTime + 0.01);
        } else {
            numNodes = Math.max(numNodes, 1);
            mainGainNode.gain.value = 0.75 / (numNodes ** 0.6);
        }
    }

    /** Start playing the waveform at the pitch of the given note
     * @param {NumberedNote} note - note to play frequency of
     */
    const play = (note: NumberedNote) => {
        const buffer = drawnWaveformToAudioBuffer(note, get(points));
        const audioNode = new WaveformOscillatorNode(buffer, note);
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

    /** Refresh all playing audio nodes */
    const updateAllPlayingNotes = () => {
        audioNodes.update((nodes) => {
            Object.entries(get(audioNodes)).forEach(([note, node]) => {
                node.stop();
                node.disconnect(mainGainNode);
                delete nodes[note];
                const buffer = drawnWaveformToAudioBuffer(note as NumberedNote, get(points));
                nodes[note] = new WaveformOscillatorNode(buffer, note as NumberedNote);
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
