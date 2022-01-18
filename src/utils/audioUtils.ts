import {NUM_SAMPLES} from "../const";
import _ from "lodash";
import type {Point} from "../stores";

/** Fills in points to the waveform that weren't specifically drawn
 * Example: clicking once in the top left and once in the bottom right creates
 * a saw wave, but points will only have the two clicked points (and the
 * starting & ending 0s). This will add samples in-between for each x value
 * to make it a valid waveform
 * @param {Point[]} pts - array of drawn points
 * @returns {number[]} - newly generated waveform
 */
export const drawnPointsToWaveform = (pts: Point[]): number[] => {
    // Make an empty array the size of the desired output file
    let wav = Array(NUM_SAMPLES).fill(0);
    const [xs, ys] = _.unzip(pts);
    const nSamplesIn = xs[xs.length - 1];
    const nSamplesOut = NUM_SAMPLES;

    let loInd = 0;
    let hiInd = 1;
    return wav.map((_, i) => {
        const xPosition = i * nSamplesIn / nSamplesOut;  // analogous (decimal) x position of i in samples array
        let loX = xs[loInd];
        let hiX = xs[hiInd];
        while (xPosition >= hiX) {
            loInd++;
            hiInd++;
            loX = xs[loInd];
            hiX = xs[hiInd];
        }
        const fadeRatio = (xPosition - loX) / (hiX - loX);
        const loVal = ys[loInd];
        const hiVal = ys[hiInd];
        const scaledHalfwayVal = (hiVal - loVal) * fadeRatio;

        return loVal + scaledHalfwayVal;
    })
}

// /** Fills in points to the waveform that weren't specifically drawn
//  * Example: clicking once in the top left and once in the bottom right creates
//  * a saw wave, but points will only have the two clicked points (and the
//  * starting & ending 0s). This will add samples in-between for each x value
//  * to make it a valid waveform
//  * @param {Point[]} pts - array of drawn points
//  * @returns {number[]} - newly generated waveform
//  */
// export const drawnPointsToWaveform = (pts: Point[]): number[] => {
//     // Make an empty array the size of
//     let wav = Array(NUM_SAMPLES).fill(0);
//     const [xs, ys] = _.unzip(pts);
//     const nSamplesInDrawn = xs[xs.length - 1];
//     console.log("points: ", pts)
//     // TODO: Found the problem: this goes off the index in drawn as if they were evenly spaced, rather than the xposition
//     let loInd = 0;
//     let hiInd = 1;
//     let output = wav.map((_, i) => {
//         const xPosition = i * nSamplesInDrawn / NUM_SAMPLES;  // analogous (decimal) x position of i in samples array
//         const loX = Math.floor(xPosition);  // analogous index of i in samples array
//         // const hiX = loX < nSamplesInDrawn - 1 ? loX + 1 : loX;  // index of next item
//
//         // if xPosition is past the xPos at hiInd, increment hiInd & loInd and return it's value
//         if (NUM_SAMPLES > nSamplesInDrawn && xPosition >= xs[hiInd]) {
//             loInd ++;
//             hiInd ++;
//             return ys[loInd];
//         }
//         // else {
//         //     while (hiInd < xPosition) {
//         //         loInd ++;
//         //         hiInd ++;
//         //     }
//         // }
//         const fadeRatio = loX > 0 ? xPosition % loX : xPosition;  // the decimal position of xPosition between loX & hiX
//         const loVal = ys[loInd];
//         const hiVal = ys[hiInd];
//         const scaledHalfwayVal = (hiVal - loVal) * fadeRatio;
//         // if (Number.isNaN(loVal)) {
//         //     console.log('loVal is NaN at i: ', i, ' and loX: ', loX)
//         // }
//         // if (Number.isNaN(scaledHalfwayVal)) {
//         //     console.log('scaledHalfwayVal is NaN!')
//         // }
//         return loVal + scaledHalfwayVal;
//
//
//     })
//     return output;
// }