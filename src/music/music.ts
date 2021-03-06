export const octaveKeys = [...Array(12).keys()];
export const whiteKeys = [0, 2, 4, 5, 7, 9, 11] as const;
export const blackKeys = [1, 3, 6, 8, 10] as const;

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

export type WhiteNoteNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type NoteNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export const octaveNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
export type OctaveNumber = typeof octaveNumbers[number];

export type SharpModifier = '#';
export type FlatModifier = 'b';
export type NoteModifier = SharpModifier | FlatModifier | '';
export type OppositeModifier<M extends NoteModifier> =
    M extends SharpModifier
        ? SharpModifier
        : FlatModifier

export const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;


// type NoteNameNumber<N extends WhiteNote> = NoteNameNumbers[N];
// type NoteNumberName<N extends NoteNumber> = NoteNumberNames[N];

// type NextNoteNumber<N extends NoteNumber> = N extends number & 6 ? 0 : (N + 1);
// type NextNoteDown<T extends WhiteNote> = NoteNumberName<NoteNameNumber<T + 1>> // NoteNumberNames[typeof noteNameNumbers[T]]

// type BlackNoteNumber = 1 | 3 | 6 | 8 | 10;
export const flatNotes = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'] as const;
export const sharpNotes = ['C#', 'D#', 'F#', 'G#', 'A#'] as const;

export type WhiteNote = typeof whiteNotes[number];
export type AlteredNote<Mod extends NoteModifier, N extends WhiteNote = WhiteNote> = `${N}${Mod}`;
export type FlatNote = AlteredNote<FlatModifier>; // `${WhiteNote}${FlatModifier}`;
export type SharpNote = AlteredNote<SharpModifier>; // `${WhiteNote}${SharpModifier}`;
export type BlackNote = FlatNote | SharpNote;
export type Note = BlackNote | WhiteNote;
export type NumberedNote<
    N extends WhiteNote = WhiteNote,
    Oct extends OctaveNumber = OctaveNumber,
    M extends NoteModifier = ''
> = `${N}${M}${Oct}`;

export const flatSharpMap = {
    'Cb': 'B', 'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
} as const;
type FlatsToSharps = typeof flatSharpMap;
export const sharpFlatMap = {
    'C#': 'Db', 'D#': 'Eb', 'E#': 'F', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb', 'B#': 'C'
} as const;
type SharpsToFlats = typeof sharpFlatMap;

export type SharpCounterpart<N extends FlatNote> = FlatsToSharps[N];
export type FlatCounterpart<N extends SharpNote> = SharpsToFlats[N]

export const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// type Octave = ['C', 'C#' | 'Db', 'D', 'D#' | 'Eb', 'E', 'F', 'F#' | 'Gb', 'G', 'G#' | 'Ab', 'A', 'A#' | 'Bb', 'B']
// const octaveWithSharps: Octave = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
// const octaveWithFlats: Octave = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const allNotes = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'
];
export const noteNumbersInOctave = notes.reduce((acc, note, i) => ({ ...acc, [note]: i }), {});

// the lowest audible frequency for each note in an octave
export const baseNotePitches = {
    'C': 16.35,
    'C#': 17.32,
    'Db': 17.32,
    'D': 18.35,
    'D#': 19.45,
    'Eb': 19.45,
    'E': 20.60,
    'F': 21.83,
    'F#': 23.12,
    'Gb': 23.12,
    'G': 24.50,
    'G#': 25.96,
    'Ab': 25.96,
    'A': 27.50,
    'A#': 29.14,
    'Bb': 29.14,
    'B': 30.87,
} as const;

export const noteNumberToNoteMap: Record<NoteNumber, Note> = {
    0: 'C',
    1: 'C#',
    2: 'D',
    3: 'D#',
    4: 'E',
    5: 'F',
    6: 'F#',
    7: 'G',
    8: 'G#',
    9: 'A',
    10: 'A#',
    11: 'B',
}
