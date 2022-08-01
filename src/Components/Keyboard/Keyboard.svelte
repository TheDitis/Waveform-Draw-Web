<script lang="ts">
    import { keyboardStore } from "../../stores/keyboardStore";
    import KeyboardButtonsSection from "./KeyboardButtonsSection.svelte";
</script>

<div class="Keyboard">
    <svg
        width={keyboardStore.dimensions[0]}
    >
        {#each $keyboardStore as key, index}
            <polygon
                on:click={() => keyboardStore.toggleNote(key.notes[0])}
                points={keyboardStore.svgPoints(key)}
                fill={key.fill}
                stroke={key.stroke}
                stroke-width={key.strokeWidth}
            />
        {/each}
    </svg>

    <KeyboardButtonsSection/>
</div>

<style>
    .Keyboard {
        width: 100vw;
        display: flex;
    }

    .Keyboard svg {
        width: 100%;
    }
</style>