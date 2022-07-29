import type { Readable } from "svelte/store";
import { derived, get, writable } from "svelte/store";
import { keyboardStore } from "./keyboardStore";
import type { Note, NumberedNote, OctaveNumber } from "../music/music";
import { noteNumberToNoteMap } from "../music/music";

/** Convert noteNumber from midi message to NumberedNote to play
 * @param {number} noteNum - number of note from midi message
 * @returns {NumberedNote} - note string that 'noteNum' corresponds to
 */
const noteNumberToNote = (noteNum: number): NumberedNote => {
    const baseNote = noteNumberToNoteMap[noteNum % 12] as Note;
    const octaveNum = Math.floor(noteNum / 12) as OctaveNumber;
    return `${baseNote}${octaveNum}` as NumberedNote;
}

/** Map midi message type numbers to readable strings */
const messageTypeMap = {
    128: 'noteoff',
    144: 'noteon',
}

/** Handle midi message from selected input
 * @param {MIDIMessageEvent} event - MIDI message received from device
 */
const handleNote = (event: MIDIMessageEvent) => {
    const [type, noteNum, _velocity] = event.data;
    const note = noteNumberToNote(noteNum);
    switch (messageTypeMap[type]) {
        case 'noteon':
            if (!keyboardStore.isPlaying(note)) {
                keyboardStore.play(note);
            }
            break;
        case 'noteoff':
            if (keyboardStore.isPlaying(note)) {
                keyboardStore.stop(note);
            }
            break;
        default:
            console.log('unhandled message type: ', type);
            return
    }
}

/** Convert MIDIInputMap to array of inputs
 * @param {MIDIInputMap | null} midiInputs - MIDIInputMap from MIDIAccess
 * @returns {MIDIInput[]} - inputs contained in 'midiInputs' in an array
 */
const _listAvailableInputs = (midiInputs: MIDIInputMap | null): MIDIInput[] => {
    const output: MIDIInput[] = [];
    if (midiInputs) {
        midiInputs.forEach((i) => output.push(i))
    }
    return output;
}

/** Save active midi input ids to localStorage
 * @param {string[]} selectedInputIds - ids of inputs that should be active next
 *      launch
 */
const saveActiveInputs = (selectedInputIds: string[]) => {
    window.localStorage.setItem('activeMidiInputs', JSON.stringify(selectedInputIds));
}

/** Get active midi inputs saved in localStorage
 * @returns {string[] | null} - array of active inputs if present, null otherwise
 */
const getSavedActiveInputs = (): string[] | null => {
    const saved = window.localStorage.getItem('activeMidiInputs');
    if (!saved) {
        return null;
    }
    return JSON.parse(saved);
}

/** Create MIDI-Related Stores and manipulation functions
 * @return
 *      subscribe - svelte store subscriber function
 *      initialize - function that initializes midiAccess and loads settings
 *      toggleInput - function to toggle inputs on and off
 *      isInputActive - function that indicates whether an input is active
 */
const createMidiStore = () => {
    /** Store for base MIDIAccess instance */
    const midiAccessStore = writable<MIDIAccess | null>(null)

    /** Store of MIDI Inputs derived from midiAccessStore */
    const midiInputs = derived<Readable<MIDIAccess | null>, MIDIInputMap | null>(
        midiAccessStore,
        ($midiAccess: MIDIAccess | null) => {
            if ($midiAccess) {
                const availableInputs = _listAvailableInputs($midiAccess.inputs);
                if (availableInputs.length) {
                    return $midiAccess.inputs
                }
            }
            return null;
        }
    )

    /** Store for the ID of the MIDI input selected */
    const activeInputIDs = writable<string[]>([]);
    /** Store for the MIDI input instance tied to selectedInputID */
    const selectedInputs: Readable<MIDIInput[]> = derived(
        [midiInputs, activeInputIDs],
        ([$inputs, $activeInputIDs], set) => {
            if ($inputs) {
                $inputs.forEach((input) => {
                    const allSelected = [];
                    // if this input is active, add midi-event handler to it
                    if ($activeInputIDs.includes(input.id)) {
                        input.onmidimessage = handleNote;
                        allSelected.push(input);
                    }
                    // if this input isn't active, clear any midi-event handler
                    else {
                        input.onmidimessage = null;
                    }
                    set(allSelected);
                })
            }
            set(null);
        }
    );

    /**--------------------------------------------
     *  FUNCTIONS
     *-------------------------------------------*/

    /** Initializes MIDIAccess and midi-related stores
     * Runs on mount of App.svelte
     */
    const initialize = async () => {
        const midiAccess = await window.navigator.requestMIDIAccess();
        midiAccessStore.set(midiAccess)
        // refresh any time inputs change (device plugged/unplugged)
        midiAccess.onstatechange = async (event: Event) => {
            if ('inputs' in event.currentTarget) {
                midiAccessStore.set(event.currentTarget as MIDIAccess);
            }
        }
        // get cached active inputs and set them if present
        const inputs = getSavedActiveInputs();
        if (inputs) {
            activeInputIDs.set(inputs);
        }
    }

    /** Make input device active or inactive (plays notes or not)
     * @param {string} inputId - id of input to change the status of
     */
    const toggleInput = (inputId: string): void => (
        activeInputIDs.update(inputIds => {
            let output: string[];
            output = inputIds.includes(inputId)
                ? inputIds.filter((id) => id !== inputId)
                : [...inputIds, inputId];
            saveActiveInputs(output);
            return output;
        })
    )

    /** Tells you whether an input is active
     * @param {string} inputId - id of input to check activity status of
     * @returns {boolean} - true if the input is active, false otherwise
     */
    const isInputActive = (inputId: string): boolean =>
        get(activeInputIDs).includes(inputId)


    /** Root store with all important midi-related data needed in the UI */
    const store = derived(
        [midiInputs, selectedInputs],
        ([$midiInputs, $selectedInputs]) => ({
            inputs: $midiInputs,
            selectedInput: $selectedInputs,
            availableInputs: _listAvailableInputs($midiInputs),
        })
    )

    return {
        subscribe: store.subscribe,
        initialize,
        toggleInput,
        isInputActive,
    }
}

export default createMidiStore();