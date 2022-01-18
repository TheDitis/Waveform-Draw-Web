/**
 * Given an array, return an array with each item in a nested array, along with
 * its right sibling. For example:
 * [0, 1, 2, 3] => [[0, 1], [1, 2], [2, 3]]
 * @param {T[]} arr
 * @returns {[T, T][]}
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