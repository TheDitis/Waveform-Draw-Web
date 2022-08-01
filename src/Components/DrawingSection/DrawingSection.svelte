<script lang="ts">
    import {onMount} from "svelte";
    import WaveformLine from "./WaveformLine.svelte";
    import synth from "../../stores/synthStore";
    import WaveformGrid from "./WaveformGrid.svelte";

    let canvas;
    let h, w;

    onMount(() => {
        if (canvas) {
            const midpoint = Math.round(canvas.clientHeight / 2)
            synth.waveform.set([[0, midpoint], [canvas.clientWidth, midpoint]]);
            synth.waveform.drawingHeight.set(canvas.clientHeight);
            synth.waveform.drawingWidth.set(canvas.clientWidth);
        }
    })

    const onMouseDown = (e: MouseEvent) => {
        synth.waveform.addPoint([e.offsetX, e.offsetY]);
        synth.waveform.startDraw();
        const endDraw = () => {
            synth.waveform.endDraw();
            window.removeEventListener('mouseup', endDraw)
        }
        window.addEventListener('mouseup', endDraw);
    }

    const onMove = (e: MouseEvent) => {
        if (synth.waveform.isDrawing) {
            synth.waveform.addPoint([e.offsetX, e.offsetY])
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
        on:mousemove={onMove}
    >
        {#if w && h}
            <WaveformLine />
            <WaveformGrid {w} {h}/>
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
    }
</style>