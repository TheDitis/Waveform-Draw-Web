<script lang="ts">
    import synth from "../../../stores/synthStore";
    import {ENVELOPE_LIMITS} from "../../../stores/envelopeStore";
    import EnvelopeVisualizer from "./EnvelopeVisualizer.svelte";
    import SynthParameter from "../../General/SynthParameter.svelte";

    const { A, D, S, R, P } = synth.envelope;

    export let width = 400;
    export let primaryColor = '#01dcc5';
    const secondaryColor = primaryColor + '44'
</script>

<div class="Envelope" style="--envelopeWidth: {width}px">
    <h3 style="color: {primaryColor}">Envelope</h3>

    <EnvelopeVisualizer {width}/>

    <div class="knobSection">
        <SynthParameter label="Attack" bind:value={$A} min={ENVELOPE_LIMITS.A.lo} max={ENVELOPE_LIMITS.A.hi} {primaryColor} {secondaryColor}/>
        <SynthParameter label="Decay" bind:value={$D} min={ENVELOPE_LIMITS.D.lo} max={ENVELOPE_LIMITS.D.hi} {primaryColor} {secondaryColor}/>
        <SynthParameter label="Sustain" bind:value={$S} min={ENVELOPE_LIMITS.S.lo} max={ENVELOPE_LIMITS.S.hi} {primaryColor} {secondaryColor} step={0.01}/>
        <SynthParameter label="Release" bind:value={$R} min={ENVELOPE_LIMITS.R.lo} max={ENVELOPE_LIMITS.R.hi} {primaryColor} {secondaryColor}/>
        <SynthParameter label="Peak" bind:value={$P} min={ENVELOPE_LIMITS.P.lo} max={ENVELOPE_LIMITS.P.hi} {primaryColor} {secondaryColor} step={0.01}/>
    </div>
</div>

<style>
    .Envelope {
        padding: 10px;
        margin: 0 20px;
        width: var(--envelopeWidth);
    }
    h3 {
        text-align: left;
        margin-left: 10px;
        font-weight: 400;;
    }
    .knobSection {
        margin-top: -15px;
        margin-bottom: 50px;
        display: flex;
    }
</style>