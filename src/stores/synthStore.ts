import type {NumberedNote} from "../music/music";
import type {Writable} from "svelte/store";
import {writable} from "svelte/store";
import {createWaveform} from "./waveformStore";
import {get} from "svelte/store";
import {createEnvelope} from "./envelopeStore";

const audioCtx = new window.AudioContext();
const mainGainNode = audioCtx.createGain();
mainGainNode.gain.value = 0.2;
mainGainNode.connect(audioCtx.destination);

// TODO: [x] ADSR
// TODO: [ ] ADSR UI
// TODO: [ ] Filter
// TODO: [ ] Select default waveforms (sine, saw, square)
// TODO: [ ] Fade between multiple waveforms
// TODO: [ ] Upload image (connect OpenCV python script endpoint)

/** AudioNode wrapper with gain node & several hel */
export class WaveformOscillatorNode {
    /** actual AudioBufferSourceNode object */
    node: AudioBufferSourceNode;
    /** web-audio GainNode object for this oscillator */
    gain: GainNode;
    /** the note that this oscillator is tuned to */
    note: NumberedNote;

    /** Create a new WaveformOscillatorNode
     * @param {AudioBuffer} buffer - actual audio data to load into the node
     * @param {NumberedNote} note - note this oscillator is playing
     */
    constructor(buffer: AudioBuffer, note: NumberedNote) {
        this.note = note;
        this.gain = audioCtx.createGain();
        this.gain.connect(mainGainNode);
        this.node = audioCtx.createBufferSource();
        this.node.connect(this.gain);
        this.node.buffer = buffer;
        this.node.loop = true;
    }

    /** Assign a new buffer to this node
     * @param {AudioBuffer} buffer - new audio data this node should play
     */
    set buffer(buffer: AudioBuffer) {
        this.node.stop();
        this.node.disconnect(this.gain);
        this.node = audioCtx.createBufferSource();
        this.node.buffer = buffer;
        this.node.loop = true;
        this.node.connect(this.gain);
    }

    /** Start playing with amplitude envelope
     * @param {number} attack - attack time in milliseconds (time to peak)
     * @param {number} decay - decay time in ms (time from peak to sustain)
     * @param {number} sustain - sustain volume leve (between 0-1)
     * @param {number} peak - volume of envelope peak
     */
    start(attack: number, decay: number, sustain: number, peak: number) {
        this.gain.gain.value = 0;
        this.node.start();
        this.rampGain(peak, attack);
        setTimeout(() => this.rampGain(sustain, decay), attack);
    }

    /** Stop playing with amplitude envelope
     * @param {number} release - release time in milliseconds
     */
    stop(release: number) {
        this.gain.gain.cancelScheduledValues(0);
        this.rampGain(0, release);
        setTimeout(() => {
            this.node.stop();
            this.node.disconnect(this.gain);
        }, release + 5)
    }

    /** Start playing without any envelope */
    hardStart() {
        this.node.start();
    }

    /** Stop without any envelope or disconnecting */
    hardStop() {
        this.node.stop();
    }

    /** Wrapper for gain.linearRampToValueAtTime but without time conversion clutter
     * @param value - volume target to wrap to
     * @param duration - ramp time in milliseconds
     */
    rampGain(value, duration) {
        this.gain.gain.linearRampToValueAtTime(value, audioCtx.currentTime + (duration / 1000))
    }
}

export type AudioNodesObject = Partial<{ [key in NumberedNote]: WaveformOscillatorNode }>;

const createSynthStore = () => {
    // Object of actively playing audio nodes by note
    const audioNodes: Writable<AudioNodesObject> = writable({});

    const waveform = createWaveform(audioNodes);
    const envelope = createEnvelope();


    /** Start playing the waveform at the pitch of the given note
     * @param {NumberedNote} note - note to play frequency of
     */
    const play = (note: NumberedNote) => {
        const buffer = waveform.toAudioBuffer(note);
        const audioNode = new WaveformOscillatorNode(buffer, note);
        audioNode.start(envelope.a, envelope.d, envelope.s, envelope.p)
        audioNodes.update((current) => ({
            ...current,
            [note]: audioNode
        }));
    }

    /** Stop playing the given note if it is playing
     * @param {NumberedNote} note - note to stop playing
     */
    const stop = (note: NumberedNote) => {
        if (note in get(audioNodes)) {
            audioNodes.update((current) => {
                current[note].stop(envelope.r);
                delete current[note];
                return current;
            });
        }
    }

    return {
        waveform,
        envelope,
        play,
        stop,
    }
}

const synth = createSynthStore();
export default synth;
