import _ from "lodash";
import type {Point} from "../stores/waveformStore";


/** Fills in points to the waveform that weren't specifically drawn
 * Example: clicking once in the top left and once in the bottom right creates
 * a saw wave, but points will only have the two clicked points (and the
 * starting & ending 0s). This will add samples in-between for each x value
 * to make it a valid waveform
 * @param {Point[]} pts - array of drawn points
 * @param {number} nSamplesOut - number of samples in the resulting waveform
 * @returns {number[]} - newly generated waveform
 */
export const drawnPointsToWaveform = (pts: Point[], nSamplesOut: number): number[] => {
    // Make an empty array the size of the desired output file
    let wav = Array(nSamplesOut).fill(0);
    const [xs, ys] = _.unzip(pts);
    const nSamplesIn = xs[xs.length - 1];

    // indices of points, one for the point at x below xPos, and one for the x above
    let loInd = 0;
    let hiInd = 1;
    return wav.map((_, i) => {
        const xPosition = i * nSamplesIn / nSamplesOut;  // analogous (decimal) x position of i in samples array
        let loX = xs[loInd]; // nearest x less than or equal to xPosition
        let hiX = xs[hiInd]; // nearest x above xPosition
        // while xPosition is above hiX, increment hi & low and reassign loX & hiX
        while (xPosition >= hiX) {
            loInd++;
            hiInd++;
            loX = xs[loInd];
            hiX = xs[hiInd];
        }
        // where from 0-1 xPosition is between loX & hiX
        const fadeRatio = (xPosition - loX) / (hiX - loX);
        const loVal = ys[loInd];
        const hiVal = ys[hiInd];
        // hypothetical y-value difference between loVal & hiVal given fadeRatio
        const scaledHalfwayVal = (hiVal - loVal) * fadeRatio;
        return loVal + scaledHalfwayVal;
    })
}
