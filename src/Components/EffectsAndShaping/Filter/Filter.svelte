<script lang="ts">
    import SynthParameter from "../../General/SynthParameter.svelte";
    import synthStore from "../../../stores/synthStore";
    import { FILTER_LIMITS } from "../../../stores/filterStore";
    import FilterVisualizer from "./FilterVisualizer.svelte";

    const { filter } = synthStore;
    const { cutoff: cutoffStore, resonance: resonanceStore } = filter;
    const { cutoff, resonance, type: filterType } = $filter;

    export let width = 400;
    let primaryColor = '#01dcc5';
    const secondaryColor = primaryColor + '44'
</script>


<div class="Filter" style="--filterWidth: {width}px">
    <h3 style="color: {primaryColor}">Filter</h3>
    <FilterVisualizer {width} />

    <div class="knobSection">
        <SynthParameter label="Cutoff" bind:value={$cutoffStore} min={FILTER_LIMITS.cutoff.lo} max={FILTER_LIMITS.cutoff.hi} step={1} {primaryColor} {secondaryColor}/>
        <SynthParameter label="Q" bind:value={$resonanceStore} min={FILTER_LIMITS.resonance.lo} max={FILTER_LIMITS.resonance.hi} step={0.01} {primaryColor} {secondaryColor}/>
    </div>
</div>


<style>
    .Filter {
        padding: 10px;
        margin: 0 20px;
        width: var(--filterWidth);
    }
    h3 {
        text-align: left;
        margin-left: 10px;
        font-weight: 400;;
    }
    .knobSection {
        display: flex;
        margin-top: -15px;
    }
</style>