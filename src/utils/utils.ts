import _ from "lodash";

/**
 * Given an array, return an array with each item in a nested array, along with
 * its right sibling. For example:
 * [0, 1, 2, 3] => [[0, 1], [1, 2], [2, 3]]
 * @typedef T
 * @param {T[]} arr - input array of values
 * @returns {[T, T][]} - array of pair arrays, each value with its sibling
 */
export const chunkSiblings = <T>(arr: T[]): [T, T][] => (arr.reduce(
    (acc: T[][], val: T, i, array: T[]) => {
        if (i < array.length - 1) {
            const pair: [T, T] = [val, array[i + 1]]
            acc.push(pair)
        }
        return acc;
    },
    []
) as [T, T][]);

/**
 * Rounds off excess decimal places to a max of maxDecimal. Good for floating
 * point errors
 * @param {number} n - input number to round off
 * @param {number} maxDecimal - maximum number of decimal places to keep
 * @returns {number} - n with fewer decimal places
 */
export const roundDown = (n: number, maxDecimal: number = 2): number => {
    let nStr = n.toString();
    const dotInd = nStr.indexOf('.');
    if (!dotInd) return n;
    nStr = nStr.slice(0, Math.min(dotInd + maxDecimal, nStr.length) + 1);
    nStr = _.dropRightWhile(nStr.split(''), (char) => (
        char === '0' || char === '.'
    )).join('');
    return Number(nStr);
}