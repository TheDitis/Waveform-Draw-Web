import { derived, get, writable } from "svelte/store";

type NumericFilterParam = 'cutoff' | 'resonance';

type FilterType = 'lowpass' | 'highpass';

type FilterItemLimits = { lo: number, hi: number };

type FilterLimitsObject = {
    [Key in NumericFilterParam]: FilterItemLimits
};

/** Upper & lower limits for each numeric Filter parameter
 * Cutoff is measured in hertz (hz) & resonance is between 0-1
 * @type {FilterLimitsObject}
 */
export const FILTER_LIMITS: FilterLimitsObject = {
    'cutoff': { lo: 10, hi: 20000 },
    'resonance': { lo: 0, hi: 30 },
}

interface FilterValues {
    cutoff: number,
    resonance: number,
    type: FilterType,
}

/** Default values for each filter parameter
 * @type {FilterValues}
 */
const DEFAULTS: FilterValues = {
    cutoff: 20_000,
    resonance: 0,
    type: 'lowpass',
}

export const createFilter = (audioCtx: AudioContext) => {
    // Cutoff store
    const cutoff = writable<number>(DEFAULTS.cutoff);
    // Resonance store
    const resonance = writable<number>(DEFAULTS.resonance);
    // Type store
    const type = writable<FilterType>(DEFAULTS.type);
    // Filter AudioNode store
    const node = writable<BiquadFilterNode>(audioCtx.createBiquadFilter());

    const store = derived(
        [cutoff, resonance, type],
        ([$cutoff, $resonance, $type]) => {
            const $node = get(node);
            $node.frequency.value = $cutoff;
            $node.Q.value = $resonance;
            $node.type = $type;
            node.set($node);
            return {
                cutoff: $cutoff,
                resonance: $resonance,
                type: $type,
            }
        }
    )

    return {
        subscribe: store.subscribe,
        cutoff,
        resonance,
        type,
        get node() {
            return get(node)
        }
    }
}