<script lang="ts">
    import {onMount} from "svelte";
    import WaveformLine from "../WaveformLine.svelte";
    import {waveformStore} from "../../stores/waveformStore";
    import WaveformGrid from "./WaveformGrid.svelte";

    let canvas;
    let h, w;

    onMount(() => {
        if (canvas) {
            const midpoint = Math.round(canvas.clientHeight / 2)
            waveformStore.set([[0, midpoint], [canvas.clientWidth, midpoint]])
        }
    })

    const onMouseDown = (e: MouseEvent) => {
        waveformStore.addPoint([e.offsetX, e.offsetY]);
        waveformStore.startDraw();
    }

    const onMouseUp = (_: MouseEvent) => {
        waveformStore.endDraw();
    }

    const onMove = (e: MouseEvent) => {
        if (waveformStore.isDrawing) {
            waveformStore.addPoint([e.offsetX, e.offsetY])
        }
    }

    $: viewbox = h && w && canvas ? `0 0 ${canvas.clientWidth} ${canvas.clientHeight}` : null

</script>


<div
    class="DrawingSection"
    bind:clientWidth={w}
    bind:clientHeight={h}
>
    <svg
        bind:this={canvas}
        class="canvas"
        viewBox={viewbox}
        on:mousedown={onMouseDown}
        on:mouseup={onMouseUp}
        on:mousemove={onMove}
    >
        {#if w && h}
            <WaveformGrid {w} {h}/>
            <WaveformLine />
        {/if}
    </svg>
</div>


<style>
    .DrawingSection {
        width: 100vw;
        height: 70vh;
        border: 2px solid var(--color);
        box-sizing: border-box;
    }
    .canvas {
        width: 100%;
        height: 100%;
        filter: blur(1px);
    }
</style>