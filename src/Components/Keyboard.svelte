<script lang="ts">
    // @ts-ignore
    import {
        renderKeys,
        totalDimensions,
        defaultOptions,
        getPoints
    } from 'svg-piano';
    import {waveform} from "../stores";
    import type {BaseKey, Key} from "../types/keyboardTypes";
    import {addIsPlayingToAllKeys} from "../types/keyboardTypes";

    export let options = {
        scaleX: 2,
        strokeWidth: 2
    };
    options = defaultOptions(options)
    let keys: Key[] = addIsPlayingToAllKeys(renderKeys() as BaseKey[]);

    console.log('keys: ', keys)

    const dimensions = totalDimensions(options).map(
        v => Math.round(v) + options.strokeWidth * 2
    );

    function keyClicked(key, index) {
        if (key.isPlaying) {
            key.isPlaying = false;
            waveform.stop(key.notes[0]);
            key.fill = key.notes.length === 2  && key.notes[0].split('').includes('b') ? "#39383D" : "#F2F2EF";
        } else {
            key.isPlaying = true;
            waveform.play(key.notes[0]);
            key.fill = '#9973ff'
            console.log('playing ', key);
        }
        keys.splice(index, key);
        keys = keys;
    }
</script>

<div class="Keyboard">
    <a href="" id="download_link">DOWNLOAD</a>
    <svg
        style="margin:0"
        width={dimensions[0]}
    >
        {#each keys as key, index}
            <polygon
                on:click={() => keyClicked(key, index)}
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
</div>

<style>
    .Keyboard {
        width: 100vw;
    }

    .Keyboard svg {
        width: 100%;
    }
</style>