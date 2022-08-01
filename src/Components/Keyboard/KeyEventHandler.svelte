<script lang="ts">
    import { keyboardStore } from "../../stores/keyboardStore";
    import type { NumberedNote } from "../../music/music";

    // Keep track of which NumberedNotes were fired by which Note key, in case octave changes mid-press
    let keysHeld: Partial<Record<NoteKey, NumberedNote>> = {};

    type NoteKey = keyof typeof keyToNoteMap;
    //  Which note name to play for which computer keyboard key
    const keyToNoteMap = {
        a: 'C', w: 'Db', s: 'D', e: 'Eb', d: 'E', f: 'F', t: 'Gb', g: 'G', y: 'Ab', h: 'A', u: 'Bb', j: 'B', // normal octave
        k: 'C', o: 'Db', l: 'D', p: 'Eb', ';': 'E' // octave up
    }
    // these keys should play one octave higher than the rest
    const octaveUpNoteKeys = ['k', 'o', 'l', 'p', ';'];

    // the two octave up & down functions, referenced by their triggering key
    const octaveControls = {
        z: keyboardStore.octaveDown,
        x: keyboardStore.octaveUp,
    }

    /** Handles playing notes and changing the octave of those notes
     * @param {KeyboardEvent} e - keydown event
     */
    const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.metaKey || e.shiftKey || e.ctrlKey || e.repeat) return;
        const key = e.key.toLowerCase();
        if (key in octaveControls) {
            return octaveControls[key]();
        }
        if (key in keyToNoteMap) {
            let oct = keyboardStore.getOctave();
            if (octaveUpNoteKeys.includes(key) && oct < 8) oct += 1;
            const note = `${keyToNoteMap[key]}${oct}` as NumberedNote;
            keyboardStore.play(note);
            keysHeld[key] = note;
        }
    }

    /** Stop playing a note if it is being played
     * @param {KeyboardEvent} e - keyup event
     */
    const handleKeyUp = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        if (key in keyToNoteMap) {
            if (key in keysHeld) {
                keyboardStore.stop(keysHeld[key]);
                console.log('here')
            } else {
                let oct = keyboardStore.getOctave();
                if (octaveUpNoteKeys.includes(key) && oct < 8) oct += 1;
                keyboardStore.stop(`${keyToNoteMap[key]}${oct}` as NumberedNote);
            }
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />