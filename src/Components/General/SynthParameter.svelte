<script lang="ts">
    import Knob from "./Knob.svelte";
    import {roundDown} from "../../utils/utils";

    export let label;
    export let value = 50;
    export let step = 1;
    export let strokeWidth = 8;
    export let size = 60;
    export let min = 0;
    export let max = 100;
    export let primaryColor = '#E844C3';
    export let secondaryColor = '#E7B6DC';
    export let textColor = primaryColor;
    export let unit = '';

    const valueDisplayFunction = (v: number): string => {
        return roundDown(v).toString() + unit;
    }
</script>

<div class="SynthParameter" style="--textColor: {textColor}">
    <Knob bind:value {step} {strokeWidth} {size} {min} {max} {primaryColor} {secondaryColor} {textColor} {valueDisplayFunction}/>
    <p>{label}</p>
</div>

<style>
    .SynthParameter {
        margin: 0 10px;
    }
    p {
        color: var(--textColor);
        line-height: 10px;
        margin: 5px;
        padding: 0;
    }
</style>