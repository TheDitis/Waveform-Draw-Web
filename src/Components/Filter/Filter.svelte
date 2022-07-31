<script lang="ts">
    import SynthParameter from "../General/SynthParameter.svelte";
    import synthStore from "../../stores/synthStore";
    import { FILTER_LIMITS } from "../../stores/filterStore";

    const { filter } = synthStore;
    const { cutoff: cutoffStore, resonance: resonanceStore } = filter;
    const { cutoff, resonance, type: filterType } = $filter;

    export let width = 400;
    let primaryColor = '#01dcc5';
    const secondaryColor = primaryColor + '44'
</script>


<div class="Filter">
    <SynthParameter label="Cutoff" bind:value={$cutoffStore} min={FILTER_LIMITS.cutoff.lo} max={FILTER_LIMITS.cutoff.hi} step={1} {primaryColor} {secondaryColor}/>
    <SynthParameter label="Q" bind:value={$resonanceStore} min={FILTER_LIMITS.resonance.lo} max={FILTER_LIMITS.resonance.hi} step={0.01} {primaryColor} {secondaryColor}/>
</div>


<style>
    .Filter {
        display: flex;
    }
</style>