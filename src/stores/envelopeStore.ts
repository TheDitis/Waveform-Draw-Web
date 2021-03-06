import type {Writable} from "svelte/store";
import {get, writable} from "svelte/store";

// Envelope Parameter keys
// A = Attack, D = Decay, S = Sustain, R = Release
export type ADSRKey = 'A' | 'D' | 'S' | 'R' | 'P';
// Object containing upper and lower limits
type ADSRItemLimits = { lo: number, hi: number }
// Upper and lower limits for each ADSR parameter
type ADSRLimitsObject = {
    [Key in ADSRKey]: ADSRItemLimits;
}

/** Upper & lower limits for each Envelope parameter
 * All values except Sustain & Peak (S & P) are in milliseconds, which should be
 * volume levels (0-1)
 * @type {ADSRLimitsObject}
 */
export const ENVELOPE_LIMITS: ADSRLimitsObject = {
    A: { lo: 0, hi: 2000 },
    D: { lo: 0, hi: 3000 },
    S: { lo: 0, hi: 1 },
    R: { lo: 0, hi: 3000 },
    P: { lo: 0, hi: 1 },
}

type EnvelopeValuesObject = {
    [Key in ADSRKey]: number
}

/** Default values for each envelope parameter
 * @type {EnvelopeValuesObject}
 */
const DEFAULTS: EnvelopeValuesObject = {
    A: 10,
    D: 1000,
    S: 0.5,
    R: 500,
    P: 0.9,
}

export const createEnvelope = () => {
    // Attack store
    const A: Writable<number> = writable(DEFAULTS.A);
    // Decay store
    const D: Writable<number> = writable(DEFAULTS.D);
    // Sustain store
    const S: Writable<number> = writable(DEFAULTS.S);
    // Release store
    const R: Writable<number> = writable(DEFAULTS.R);

    // Peak volume (attack climbs to, decay falls from)
    const P: Writable<number> = writable(0.9)

    return {
        A, D, S, R,
        P,
        get a() {
            return get(A);
        },
        get d() {
            return get(D);
        },
        get s() {
            return get(S);
        },
        get r() {
            return get(R);
        },
        get p() {
            return get(P);
        }
    }
}