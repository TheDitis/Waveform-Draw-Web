<script lang="ts">
    import synth from "../../stores/synthStore";
    import {ENVELOPE_LIMITS} from "../../stores/envelopeStore";
    import EnvelopeVisualizer from "./EnvelopeVisualizer.svelte";
    import SynthParameter from "./SynthParameter.svelte";

    const { A, D, S, R } = synth.envelope;

    export let width = 400;
</script>

<div class="EnvelopeControls" style="--envelopeWidth: {width}px">
    <EnvelopeVisualizer {width}/>

    <div class="knobSection">
        <SynthParameter label="Attack" bind:value={$A} step={10} strokeWidth={8} size={60} min={ENVELOPE_LIMITS.A.lo}
                        max={ENVELOPE_LIMITS.A.hi} primaryColor="#E844C3" secondaryColor="#E7B6DC" textColor="#E844C3"/>
        <SynthParameter label="Decay" bind:value={$D} step={10} strokeWidth={8} size={60} min={ENVELOPE_LIMITS.D.lo}
                        max={ENVELOPE_LIMITS.D.hi}
                        primaryColor="#E844C3" secondaryColor="#E7B6DC" textColor="#E844C3"/>
        <SynthParameter label="Sustain" bind:value={$S} step={0.01} strokeWidth={8} size={60} min={ENVELOPE_LIMITS.S.lo}
                        max={ENVELOPE_LIMITS.S.hi}
                        primaryColor="#E844C3" secondaryColor="#E7B6DC" textColor="#E844C3"/>
        <SynthParameter label="Release" bind:value={$R} step={10} strokeWidth={8} size={60} min={ENVELOPE_LIMITS.R.lo}
                        max={ENVELOPE_LIMITS.R.hi}
                        primaryColor="#E844C3" secondaryColor="#E7B6DC" textColor="#E844C3"/>
    </div>
</div>

<style>
    .EnvelopeControls {
        padding: 10px;
        width: var(--envelopeWidth);
    }
    .knobSection {
        padding: 10px 0;
        display: flex;
    }
</style>