import {roundDown} from "../utils";

describe('utils', () => {
    describe('round', () => {
        it('should return 12.2 when given 12.2000000001', () => {
            expect(roundDown(12.2000000001)).toEqual(12.2);
        });
        it('should return 12 when given 12.0000000001', () => {
            expect(roundDown(12.0000000001, )).toEqual(12);
        });
        it('should return 12.2000000001 when given 12.2000000001 and maxDecimal of 10', () => {
            expect(roundDown(12.2000000001, 10)).toEqual(12.2000000001);
        });
    });
});