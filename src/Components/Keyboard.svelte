<script lang="ts">
    // @ts-ignore
    import {
        getPoints
    } from 'svg-piano';
    import {waveform} from "../stores/waveformStore";
    import {keyboardStore} from "../stores/keyboardStore";
    import type {Key} from "../types/keyboardTypes";

    const play = (key: Key) => {
        keyboardStore.play(key.notes[0]);
        waveform.play(key.notes[0]);
    }

    const stop = (key: Key) => {
        keyboardStore.stop(key.notes[0]);
        waveform.stop(key.notes[0]);
    }

</script>

<div class="Keyboard">
    <svg
        style="margin:0"
        width={keyboardStore.dimensions[0]}
    >
        {#each $keyboardStore as key, index}
            <polygon
                on:click={() => key.isPlaying ? stop(key) : play(key)}
                points={
                    getPoints(key)
                        .map(p => p.join(','))
                        .join(' ')
                }
                fill={key.fill}
                stroke={key.stroke}
                stroke-width={key.strokeWidth}
            />
        {/each}
    </svg>

    <a href="" id="download_link">DOWNLOAD</a>
</div>

<style>
    .Keyboard {
        width: 100vw;
    }

    .Keyboard svg {
        width: 100%;
    }
</style>