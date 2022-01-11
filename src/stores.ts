import {readable, writable, derived, get, Readable, Writable} from "svelte/store";
import {tick} from "svelte";
import _ from "lodash";

const createWaveform = () => {
    const points: Writable<number[][]> = writable([[0, 0]]);
    const lastUpdatedIndex: Writable<number> = writable(0);
    const isDrawing: Writable<boolean> = writable(false);
    const svgPath: Readable<string> = derived(points, ($points) => (
        `M ${_.flattenDeep($points).join(" ")}`
    ))

    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();

    const addPoint = (pt: number[]) => {
        /// ADD A POINT TO THE WAVEFORM REPRESENTATION
        const greaterOrEqual = (pt2: number[]): boolean => pt2[0] >= pt[0];
        points.update((points: number[][]): number[][] => {
            let insertionIndex: number = points.findIndex(greaterOrEqual);
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
            tick();
            return points;
        })
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

    const calcAllPoints = (): number[] => [1, 2, 3]

    return {
        subscribe: points.subscribe,
        set: points.set,
        addPoint,
        fill: calcAllPoints,
        play: (note) => {
            // audioCtx.createPeriodicWave()
            // osc.setPeriodicWave()
            osc.setPeriodicWave(_.unzip(get(points))[0])
            osc.start();
            osc.stop(2);

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
