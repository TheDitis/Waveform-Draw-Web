export const octaveKeys = [...Array(12).keys()];
export const whiteKeys = [0, 2, 4, 5, 7, 9, 11];
export const blackKeys = [1, 3, 6, 8, 10];

enum NoteKind {
    White,
    Black,
}

const notesSplit = {
    [NoteKind.White]: [0, 2, 4, 5, 7, 9, 11],
    [NoteKind.Black]: [1, 3, 6, 8, 10],
}

enum BlackNoteKind {
    Sharp,
    Flat,
}

export const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
type BlackNoteNumber = 1 | 3 | 6 | 8 | 10;
export const flatNotes = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'] as const;
export const sharpNotes = ['C#', 'D#', 'F#', 'G#', 'A#'] as const;

export type WhiteNote = typeof whiteNotes[number];
export type FlatNote = typeof flatNotes[number];
export type SharpNote = typeof sharpNotes[number];
export type BlackNote =  FlatNote | SharpNote;
export type Note = WhiteNote | BlackNote;
export type NumberedNote = `${Note}${number}`;


export const flatSharpMap = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' } as const;
type FlatsToSharps = typeof flatSharpMap;
export const sharpFlatMap = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' } as const;
type SharpsToFlats = typeof sharpFlatMap;

export type SharpCounterpart<Flat extends FlatNote> = FlatsToSharps[Flat];
export type FlatCounterpart<Sharp extends SharpNote> = SharpsToFlats[Sharp];

export const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// type Octave = ['C', 'C#' | 'Db', 'D', 'D#' | 'Eb', 'E', 'F', 'F#' | 'Gb', 'G', 'G#' | 'Ab', 'A', 'A#' | 'Bb', 'B']
// const octaveWithSharps: Octave = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
// const octaveWithFlats: Octave = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
//
export const allNotes = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'
];
export const noteNumbersInOctave = notes.reduce((acc, note, i) => ({ ...acc, [note]: i }), {});


// export const notePitches: { [key: Note]: }