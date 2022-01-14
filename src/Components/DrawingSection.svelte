<script lang="ts">
    import {onMount} from "svelte";
    import WaveformLine from "./WaveformLine.svelte";
    import {waveform} from "../stores";

    let canvas;
    let h, w;

    onMount(() => {
        if (canvas) {
            const midpoint = Math.round(canvas.clientHeight / 2)
            waveform.set([[0, midpoint], [canvas.clientWidth, midpoint]])
        }
    })

    const onMouseDown = (e: MouseEvent) => {
        waveform.addPoint([e.offsetX, e.offsetY]);
        waveform.startDraw();
    }

    const onMouseUp = (e: MouseEvent) => {
        waveform.endDraw();
    }

    const onMove = (e: MouseEvent) => {
        if (waveform.isDrawing) {
            waveform.addPoint([e.offsetX, e.offsetY])
        }
    }

    $: viewbox = h && w ? `0 0 ${canvas.clientWidth} ${canvas.clientHeight}` : null

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
        <WaveformLine/>
    </svg>
</div>


<style>
    .DrawingSection {
        width: 100vw;
        height: 70vh;
        border: 5px solid var(--color);
        box-sizing: border-box;
    }
    .canvas {
        width: 100%;
        height: 100%;
    }
</style>