import type {BlackNote, FlatModifier, Note, NoteModifier, SharpModifier, WhiteNote} from "./music";

// const adjacentNotesUp = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 0 } as const;
const adjacentNotesUp = { 'C': 'D', 'D': 'E', 'E': 'F', 'F': 'G', 'G': 'A', 'A': 'B', 'B': 'C' } as const;
type AdjacentNotesUp = typeof adjacentNotesUp;
// const adjacentNotesDown = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 } as const;
const adjacentNotesDown = { 'C': 'B', 'D': 'C', 'E': 'D', 'F': 'E', 'G': 'F', 'A': 'G', 'B': 'A' } as const;
type AdjacentNotesDown = typeof adjacentNotesDown;

// const noteNameNumbers = {
//     C: 0,
//     D: 1,
//     E: 2,
//     F: 3,
//     G: 4,
//     A: 5,
//     B: 6,
// } as const;
// type NoteNameNumbers = typeof noteNameNumbers;
// const noteNumberNames: Record<NoteNumber, WhiteNote> = { // Record<NoteModifier, WhiteNote> = {
//     0: 'C',
//     1: 'D',
//     2: 'E',
//     3: 'F',
//     4: 'G',
//     5: 'A',
//     6: 'B',
// } as const;
// type NoteNumberNames = typeof noteNumberNames;

// type NoteNameNumber<N extends WhiteNote> = NoteNameNumbers[N];
// type NoteNumberName<N extends NoteNumber> = NoteNumberNames[N];

export type BaseNote<T extends Note> = T extends `${infer N}${NoteModifier}` ? N : T;
// The # or b modifier for black note
export type ModifierOf<N extends BlackNote> = N extends `${BaseNote<N>}#`
    ? SharpModifier
    : FlatModifier

export type NextNoteUp<N extends WhiteNote> = AdjacentNotesUp[N];
export type NextNoteDown<N extends WhiteNote> = AdjacentNotesDown[N];




// // type NextNoteNumber<N extends NoteNumber> = N extends number & 6 ? 0 : (N + 1);
// // type NextNoteDown<T extends WhiteNote> = NoteNumberName<NoteNameNumber<T + 1>> // NoteNumberNames[typeof noteNameNumbers[T]]
// export type NextNoteNumberUp<N extends WhiteNote | NoteNumber> = N extends NoteNumber
//     ? AdjacentNotesUp[N]
//     : N extends WhiteNote ? NextNoteNumberUp<NoteNameNumber<N>> : N;
// export type NextNoteNumberDown<N extends WhiteNote | NoteNumber> = N extends NoteNumber
//     ? AdjacentNotesDown[N]
//     : N extends WhiteNote ? NextNoteNameDown<NoteNameNumber<N>> : N;
// // type NextNoteNumberDown<N extends NoteNumber> = AdjacentNotesDown[N];
//
// export type NextNoteNameUp<T extends WhiteNote> = NoteNumberName<NextNoteNumberUp<T>>
// export type NextNoteNameDown<T extends WhiteNote> = NoteNumberName<NextNoteNumberDown<T>>
//
//
// const noteNameNumberA: NoteNameNumber<'A'> = 5;
// const nextNoteNumber: AdjacentNotesUp[typeof noteNameNumberA] = 6;
// const B: NextNoteNameUp<'A'> = 'B'
