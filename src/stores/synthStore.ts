import type {NumberedNote} from "../music/music";
import type {Writable} from "svelte/store";
import {writable} from "svelte/store";
import {createWaveform} from "./waveformStore";
import {drawnWaveformToAudioBuffer} from "../utils/audioUtils";
import {get} from "svelte/store";

const audioCtx = new window.AudioContext();
const mainGainNode = audioCtx.createGain();
mainGainNode.connect(audioCtx.destination);

// TODO: [ ] ADSR
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
     * @param {boolean} [start=true] - starts playing by default
     */
    constructor(buffer: AudioBuffer, note: NumberedNote, start: boolean = true) {
        this.note = note;
        this.gain = audioCtx.createGain();
        this.gain.connect(mainGainNode);
        this.node = audioCtx.createBufferSource();
        this.node.connect(this.gain);
        this.node.buffer = buffer;
        this.node.loop = true;
        if (start) {
            this.node.start();
        }
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
        this.node.start();
    }

    start() { this.node.start() }
    stop() {
        this.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.01)
        setTimeout(() => {
            this.node.stop();
            this.node.disconnect();
        }, 10)
    }
}

export type AudioNodesObject = Partial<{ [key in NumberedNote]: WaveformOscillatorNode }>;

const createSynthStore = () => {
    // Object of actively playing audio nodes by note
    const audioNodes: Writable<AudioNodesObject> = writable({});

    const waveform = createWaveform(audioNodes);

    /** Adjust the output gain based on the number of nodes to avoid clipping
     * @param {number} numNodes - number of playing audio nodes
     * @param {number} change - change in number of nodes, only matters - vs +
     */
    const updateVolume = (numNodes: number, change: number) => {
        const rampTime = change > 0 ? 0.02 : 0.05
        if (numNodes === 0) {
            console.log(numNodes);
            mainGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + rampTime);
        }
        else if (numNodes === 1 && change > 0) {
            mainGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            mainGainNode.gain.linearRampToValueAtTime(0.75, audioCtx.currentTime + rampTime);
        } else {
            numNodes = Math.max(numNodes, 1);
            mainGainNode.gain.linearRampToValueAtTime(0.75 / (numNodes ** 0.6), audioCtx.currentTime + rampTime);
        }
    }

    /** Start playing the waveform at the pitch of the given note
     * @param {NumberedNote} note - note to play frequency of
     */
    const play = (note: NumberedNote) => {
        const buffer = drawnWaveformToAudioBuffer(note, waveform.points);
        const audioNode = new WaveformOscillatorNode(buffer, note);
        audioNodes.update((current) => {
            updateVolume(Object.keys(current).length + 1, +1);
            return ({...current, [note]: audioNode})
        });
    }

    /** Stop playing the given note if it is playing
     * @param {NumberedNote} note - note to stop playing
     */
    const stop = (note: NumberedNote) => {
        if (note in get(audioNodes)) {
            audioNodes.update((current) => {
                updateVolume(Object.keys(current).length - 1, -1);
                current[note].stop();
                delete current[note];
                return current;
            });
        }
    }

    return {
        waveform,
        play,
        stop,
    }
}

const synth = createSynthStore();
export default synth;
