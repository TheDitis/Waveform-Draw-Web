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

let options = {
    scaleX: 2,
    strokeWidth: 2
};
options = defaultOptions(options)

const createKeyboardStore = () => {

    const keys: Readable<BaseKey[]> = readable(renderKeys());
    const dimensions = totalDimensions(options).map(
        v => Math.round(v) + options.strokeWidth * 2
    );
    const notesPlaying: Writable<NumberedNote[]> = writable([]);
    const keyboard: Readable<Key[]> = derived(
        [keys, notesPlaying],
        ([$keys, $notesPlaying]) => $keys.map((key) => {
            console.log('updating keyboard')
            const isPlaying = $notesPlaying.includes(key.notes[0])
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

    const play = (note: NumberedNote) => {
        notesPlaying.update(
            (playing) => [...playing, note]
        );
    }

    const stop = (note: NumberedNote) => {
        notesPlaying.update((playing) => (
            playing.filter((curNote) => note !== curNote)
        ));
    }

    const isPlaying = (note: NumberedNote) => get(notesPlaying).includes(note);


    return {
        subscribe: keyboard.subscribe,
        keys,
        play,
        stop,
        isPlaying,
        dimensions,
    }
}

export const keyboardStore = createKeyboardStore();