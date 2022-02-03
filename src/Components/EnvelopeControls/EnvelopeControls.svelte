<script lang="ts">
    import synth from "../../stores/synthStore";
    import {ENVELOPE_LIMITS} from "../../stores/envelopeStore";
    import EnvelopeVisualizer from "./EnvelopeVisualizer.svelte";
    import SynthParameter from "./SynthParameter.svelte";

    const { A, D, S, R } = synth.envelope;

    export let width = 400;
    export let primaryColor = '#01dcc5';
    const secondaryColor = primaryColor + '44'
</script>

<div class="EnvelopeControls" style="--envelopeWidth: {width}px">
    <EnvelopeVisualizer {width}/>

    <div class="knobSection">
        <SynthParameter label="Attack" bind:value={$A} min={ENVELOPE_LIMITS.A.lo} max={ENVELOPE_LIMITS.A.hi} {primaryColor} {secondaryColor}/>
        <SynthParameter label="Decay" bind:value={$D} min={ENVELOPE_LIMITS.D.lo} max={ENVELOPE_LIMITS.D.hi} {primaryColor} {secondaryColor}/>
        <SynthParameter label="Sustain" bind:value={$S} min={ENVELOPE_LIMITS.S.lo} max={ENVELOPE_LIMITS.S.hi} {primaryColor} {secondaryColor} step={0.01}/>
        <SynthParameter label="Release" bind:value={$R} min={ENVELOPE_LIMITS.R.lo} max={ENVELOPE_LIMITS.R.hi} {primaryColor} {secondaryColor}/>
    </div>
</div>

<style>
    .EnvelopeControls {
        padding: 10px;
        width: var(--envelopeWidth);
    }
    .knobSection {
        margin-top: -15px;
        margin-bottom: 50px;
        display: flex;
    }
</style>