import type {BlackNote, FlatCounterpart, FlatNote, Note, SharpCounterpart, SharpNote, WhiteNote} from "./music";
import {flatNotes, flatSharpMap, noteNumbersInOctave, sharpFlatMap, sharpNotes, whiteNotes} from "./music";

export const isSharp = (note: Note): note is SharpNote =>
    (sharpNotes as ReadonlyArray<Note>).includes(note);
export const isFlat = (note: Note): note is FlatNote =>
    (flatNotes as ReadonlyArray<Note>).includes(note);
export const isBlack = (note: Note): note is BlackNote =>
    isFlat(note) || isSharp(note);
export const isWhite = (note: Note): note is WhiteNote =>
    (whiteNotes as ReadonlyArray<Note>).includes(note);


export const sharpToFlat = <Sharp extends SharpNote>(
    note: Sharp
): FlatCounterpart<Sharp> => sharpFlatMap[note];

export const flatToSharp = <Flat extends FlatNote>(
    note: Flat
): SharpCounterpart<Flat> => flatSharpMap[note];

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