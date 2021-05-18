import {readable, writable, derived, get, Readable, Writable} from "svelte/store";
import _ from "lodash";

const createWaveform = () => {
    const points: Writable<number[][]> = writable([[0, 0]]);

    // const tempPoints: Writable<number[][]> = writable([[0, 0]]);

    const lastUpdatedIndex: Writable<number> = writable(0);

    const isDrawing: Writable<boolean> = writable(false);

    const svgPath: Readable<string> = derived(points, ($points) => (
        `M ${_.flattenDeep($points).join(" ")}`
    ))

    return {
        subscribe: points.subscribe,
        set: points.set,
        addPoint: (pt: number[]) => {
            // tempPoints.update(tempPoints => {
            //     tempPoints.push(pt);
            //     return tempPoints;
            // })
            const greaterOrEqual = (pt2: number[]): boolean => pt2[0] >= pt[0]
            points.update((points: number[][]): number[][] => {
                let insertionIndex: number = points.findIndex(greaterOrEqual);
                insertionIndex = insertionIndex >= 0 ? insertionIndex : points.length - 1;
                let deleteCount: number = 0;
                let unzipped: number[][] = _.unzip(points);
                let index = unzipped[0].indexOf(pt[0]);
                if (index >= 0) {
                    console.log(unzipped[0])
                    deleteCount += 1
                }

                // REMOVE SKIPPED POINTS
                if (get(isDrawing)) {
                    let diff: number = insertionIndex - get(lastUpdatedIndex)
                    if (Math.abs(diff) > 1) {
                        console.log("BIG FREAKING DIFF");
                        console.log("pre insertionIndex: ", insertionIndex);
                        insertionIndex = Math.min(insertionIndex, insertionIndex + diff);
                        console.log("post insertionIndex: ", insertionIndex)

                        deleteCount += Math.abs(diff) - 1;
                        // deleteCount = 0
                        console.log("deleteCount: ", deleteCount)
                    }
                }
                points.splice(insertionIndex, deleteCount, pt);
                lastUpdatedIndex.set(insertionIndex);
                return points;
            })
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
        },
    }
}


export const waveform = createWaveform();
