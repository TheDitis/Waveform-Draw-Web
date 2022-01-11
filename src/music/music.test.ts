import {
    enforceAllFlats,
    flatToSharp,
    isBlack,
    isFlat,
    isSharp,
    isWhite,
    noteToNumberInOctave,
    sharpToFlat
} from "./musicUtils";


describe('test for music.ts', () => {
    describe('isSharp, isFlat, isWhite & isBlack', () => {
        it('should say C# is sharp & black but not flat or white', () => {
            expect(isSharp('C#')).toBe(true);
            expect(isBlack('C#')).toBe(true);
            expect(isFlat('C#')).toBe(false);
            expect(isWhite('C#')).toBe(false);
        });
        it('should say C is white but and not black, flat, or sharp', () => {
            expect(isWhite('C')).toBe(true);
            expect(isBlack('C')).toBe(false);
            expect(isSharp('C')).toBe(false);
            expect(isFlat('C')).toBe(false);
        });
        it('should say Gb is flat & black but not sharp or white', () => {
            expect(isFlat('Gb')).toBe(true);
            expect(isBlack('Gb')).toBe(true);
            expect(isSharp('Gb')).toBe(false);
            expect(isWhite('Gb')).toBe(false);
        });
    });
    describe('sharpToFlat & flatToSharp', () => {
        it('should get Ab from G# from sharpToFlat', () => {
            expect(sharpToFlat('G#')).toBe('Ab');
        });
        it('should get D# from Eb from flatToSharp', () => {
            expect(flatToSharp('Eb')).toBe('D#');
        });
    });
    describe('noteToNumberInOctave', () => {
        it('should get 0 for C', () => {
            expect(noteToNumberInOctave('C')).toEqual(0);
        });
        it('should get 11 for B', () => {
            expect(noteToNumberInOctave('B')).toEqual(11)
        });
        it('should get 3 for Eb', () => {
            expect(noteToNumberInOctave('Eb')).toEqual(3);
        });
        it('should get 3 for D#', () => {
            expect(noteToNumberInOctave('D#')).toEqual(3);
        });
    });
    describe('enforceAllFlats', () => {
        it('should get [Ab, Db, B, Gb] from [Ab, C#, B, F#]', () => {
            expect(
                enforceAllFlats(['Ab', 'C#', 'B', 'F#'])
            ).toEqual(['Ab', 'Db', 'B', 'Gb']);
        });
    })
});
