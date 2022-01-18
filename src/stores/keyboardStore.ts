// @ts-ignore
import {
    renderKeys,
    totalDimensions,
    defaultOptions,
    getPoints
} from 'svg-piano';
import type {NumberedNote} from "../music/music";
import {derived, get, readable, writable} from "svelte/store";
import type {Readable, Writable} from "svelte/store";
import type {BaseKey, Key} from "../types/keyboardTypes";
import {waveformStore} from "./waveformStore";

let options = {
    scaleX: 2,
    strokeWidth: 2
};
options = defaultOptions(options)

/**
 * Store that represents the piano keyboard
 * Handles:
 *  - playing & stopping of notes
 *  - keeping track of the status & color of notes
 *  - holds keyboard data structure used to render svg keyboard
 * @returns {{
 *      play: (note: NumberedNote) => void,
 *      isPlaying: (note: NumberedNote) => boolean,
 *      stop: (note: NumberedNote) => void,
 *      subscribe: (this:void, run: Subscriber<Key[]>, invalidate?: Invalidator<Key[]>) => Unsubscriber,
 *      keys: Readable<BaseKey[]>,
 *      toggleNote: (note: NumberedNote) => void,
 *      svgPoints: (key: (BaseKey | Key)) => string, dimensions: any,
 *      getOctave: () => number,
 *      octaveUp: () => void,
 *      octaveDown: () => void,
 *  }}
 */
const createKeyboardStore = () => {
    /** base key array from svg-piano library */
    const keys: Readable<BaseKey[]> = readable(renderKeys());
    /** dimensions of the keyboard representation */
    const dimensions = totalDimensions(options).map(
        v => Math.round(v) + options.strokeWidth * 2
    );
    const keyboardOctave: Writable<number> = writable(1);
    /** array of notes that are currently playing */
    const notesPlaying: Writable<NumberedNote[]> = writable([]);
    /** MAIN
     * Representation of the keyboard, updated when notesPlaying changes
     * @type {Readable<Key[]>} - svelte store representing array of Key objects
     */
    const keyboard: Readable<Key[]> = derived(
        [keys, notesPlaying],
        ([$keys, $notesPlaying]) => $keys.map((key) => {
            const isPlaying = $notesPlaying.includes(key.notes[0]);
            return {
                ...key,
                isPlaying,
                fill: isPlaying
                    ? '#9973ff'
                    : key.notes.length === 2  && key.notes[0].split('').includes('b')
                        ? '#39383D'
                        : '#F2F2EF'
            } as Key
        })
    )

    /** Play a given note
     * @param {NumberedNote} note - note to start playing
     */
    const play = (note: NumberedNote) => {
        notesPlaying.update(
            (playing) => [...playing, note]
        );
        waveformStore.play(note);
    }

    /** Stop playing a given note
     * @param {NumberedNote} note - note to stop playing
     */
    const stop = (note: NumberedNote) => {
        notesPlaying.update((playing) => (
            playing.filter((curNote) => note !== curNote)
        ));
        waveformStore.stop(note);
    }

    /** Whether the given note is playing
     * @param {NumberedNote} note - note to check playing-status of
     * @returns {boolean} - whether 'note' is playing
     */
    const isPlaying = (note: NumberedNote) => get(notesPlaying).includes(note);

    /** Toggle the playing-status of a note (play if stopped, stop if playing)
     * @param note - note to play or stop
     */
    const toggleNote = (note: NumberedNote) => {
        if (isPlaying(note)) {
            stop(note);
        } else {
            play(note);
        }
    }

    /** SVG points for a given key
     * @param {NumberedNote} key
     * @returns {string}
     */
    const svgPoints = (key: BaseKey | Key): string => (
        getPoints(key)
            .map(p => p.join(','))
            .join(' ')
    );

    /** Increase the octave the computer plays by 1 */
    const octaveUp = () => keyboardOctave.update((oct) => Math.min(oct + 1, 8));
    /** Decrease the octave the computer plays by 1 */
    const octaveDown = () => keyboardOctave.update((oct) => Math.max(oct - 1, 0));

    return {
        subscribe: keyboard.subscribe,
        keys,
        play,
        stop,
        isPlaying,
        dimensions,
        toggleNote,
        svgPoints,
        getOctave: () => get(keyboardOctave),
        octaveUp,
        octaveDown,
    }
}

export const keyboardStore = createKeyboardStore();