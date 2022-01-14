import type {
    BlackNote,
    FlatCounterpart,
    FlatNote,
    Note, NoteModifier,
    NumberedNote, OctaveNumber,
    SharpCounterpart,
    SharpNote,
    WhiteNote
} from "./music";
import {
    baseNotePitches,
    flatNotes,
    noteNumbersInOctave,
    flatSharpMap,
    sharpFlatMap,
    sharpNotes,
    whiteNotes
} from "./music";
import type {BaseNote} from "./utilityTypes";

export const isSharp = (note: Note): note is SharpNote =>
    note.length > 1 && note[1] === '#';
    // (sharpNotes as ReadonlyArray<Note>).includes(note);
export const isFlat = (note: Note): note is FlatNote =>
    note.length > 1 && note[1] === 'b';
    // (flatNotes as ReadonlyArray<Note>).includes(note);
export const isBlack = (note: Note): note is BlackNote =>
    isFlat(note) || isSharp(note);
export const isWhite = (note: Note): note is WhiteNote =>
    note.length === 1
    // (whiteNotes as ReadonlyArray<Note>).includes(note);


export const flatToSharp = <Flat extends FlatNote>(
    note: Flat
): SharpCounterpart<Flat> => flatSharpMap[note];

export const sharpToFlat = <Sharp extends SharpNote>(
    note: Sharp
): FlatCounterpart<Sharp> => sharpFlatMap[note];

export const noteToNumberInOctave = (note: Note): number => (
    isSharp(note)
        ? noteNumbersInOctave[sharpToFlat(note)]
        : noteNumbersInOctave[note]
);

export const enforceAllFlats = (notes: Note[]): Note[] => (
    notes.map((note) =>
        isSharp(note) ? sharpToFlat(note) : note
    )
);

export const getNoteFrequency = <N extends WhiteNote, Oct extends OctaveNumber, M extends NoteModifier>(note: NumberedNote<N, Oct, M>): number => {
    const octave = Number(note.slice(note.length - 1)) as Oct;
    const noteName = note.slice(0, note.length - 1) as N;
    return baseNotePitches[noteName] * (2 ** octave);
}
