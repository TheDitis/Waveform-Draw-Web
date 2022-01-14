import {readable, writable, derived, get, Readable, Writable} from "svelte/store";
import {tick} from "svelte";
import _ from "lodash";
import type {Note} from "./music";

type Point = [number, number]

const createWaveform = () => {
    const points: Writable<Point[]> = writable([[0, 0], [0, 0]]);
    const lastUpdatedIndex: Writable<number> = writable(0);
    const isDrawing: Writable<boolean> = writable(false);
    const svgPath: Readable<string> = derived(points, ($points) => (
        `M ${_.flattenDeep($points).join(" ")}`
    ))
    type AudioNodesObject = Partial<{ [key in Note]: AudioBufferSourceNode }>;
    const audioNodes: Writable<AudioNodesObject> = writable({});

    const audioCtx = new window.AudioContext();

    const addPoint = (pt: Point) => {
        /// ADD A POINT TO THE WAVEFORM REPRESENTATION
        const greaterOrEqualX = (pt2: Point): boolean => pt2[0] >= pt[0];
        points.update((points): Point[] => {
            let insertionIndex: number = points.findIndex(greaterOrEqualX);
            insertionIndex = insertionIndex >= 0 ? insertionIndex : points.length - 1;
            let deleteCount: number = 0;
            let unzipped: number[][] = _.unzip(points);
            let index = unzipped[0].indexOf(pt[0]);
            if (index >= 0) {
                deleteCount += 1;
            }

            // REMOVE SKIPPED POINTS
            if (get(isDrawing)) {
                const lastIndex = get(lastUpdatedIndex);
                let diff: number = insertionIndex - lastIndex;
                // if any items were skipped:
                if (diff > 1 || diff <= -1) {
                    insertionIndex = points[insertionIndex][0] < points[lastIndex][0] ? insertionIndex : lastIndex;
                    deleteCount += Math.abs(diff);
                    if (points[insertionIndex][0] <= points[lastIndex][0] && insertionIndex < points.length - 5) {
                        deleteCount += 1;
                    }
                    console.log("delete count: ", deleteCount)
                }
            }

            points.splice(insertionIndex, deleteCount, pt);
            lastUpdatedIndex.set(insertionIndex);
            points.sort((a, b) => a[0] - b[0]);
            return points;
        });
        if (Object.keys(get(audioNodes)).length) {
            updateAllPlayingNotes();
        }
    }

    // // TODO: Finish this. Filling in waveform data in between drawn points
    // const calcAllPoints = (): number[] => {
    //     const unzipped = _.unzip(get(points));
    //     const xs = unzipped[0];
    //     const ys = unzipped[1];
    //     const output: number[] = [];
    //     for (let i of xs) {
    //         if (i < unzipped[0].length - 1) {
    //             console.log("inside!")
    //             const x: number = xs[i];
    //             const y: number = ys[i];
    //             const x_next: number = xs[i + 1];
    //             const y_next: number = ys[i + 1];
    //             output.push(y);
    //             // Get the space between points in the x
    //             const x_diff = x_next - x;
    //             if (x_diff > 1) {
    //                 const y_diff = y - y_next;
    //                 const increment = y_diff / x_diff;
    //                 for (let j = 1; j < x_diff; j++) {
    //                     output.push(y + (increment * (j + 1)))
    //                 }
    //             }
    //             output.push(y_next);
    //         }
    //     }
    //     return output
    // }
    const updateExistingNode = (note, node) => {
        node.buffer = pointsToAudioBuffer();
    }

    const pointsToAudioBuffer = (): AudioBuffer => {
        let wav = _.unzip(get(points))[1];
        let max = Math.max(...wav);
        let min = Math.min(...wav);
        let mid = (max - min) / 2;
        console.log('max: ', max);
        console.log('min: ', min);
        console.log('mid: ', mid);
        wav = wav.map((val) => {
            return (val - mid) / mid;
        })
        let buffer = audioCtx.createBuffer(2, wav.length, audioCtx.sampleRate);
        for (let chan = 0; chan < 2; chan++) {
            const channelBuffer = buffer.getChannelData(chan);
            for (let i = 0; i < buffer.length; i++) {
                channelBuffer[i] = wav[i];
            }
        }
        return buffer;
    }

    const play = (note) => {
        const audioNode = audioCtx.createBufferSource();
        audioNode.buffer = pointsToAudioBuffer()
        audioNode.loop = true;
        audioNode.connect(audioCtx.destination);
        audioNode.start();
        audioNodes.update((current) => ({...current, [note]: audioNode}))

    }

    const updateAllPlayingNotes = async () => {
        Object.entries(get(audioNodes)).forEach(([note, node]) => {
            updateExistingNode(note, node);
        })
    }

    const calcAllPoints = (): number[] => [1, 2, 3]

    return {
        subscribe: points.subscribe,
        set: points.set,
        addPoint,
        fill: calcAllPoints,
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
        },
        endDraw: () => {
            isDrawing.set(false);
            // let filled = calcAllPoints()
            // filled = points;
            // console.log("filled: ", filled)
            // let filled2 = filled.map((v, i) => [i, v])
            // console.log("filled2: ", filled2)
            // points.set(filled2)
        },
    }
}


export const waveform = createWaveform();
