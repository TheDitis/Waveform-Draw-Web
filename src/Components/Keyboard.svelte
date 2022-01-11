<script lang="ts">
    // @ts-ignore
    import {
        renderKeys,
        totalDimensions,
        defaultOptions,
        getPoints
    } from 'svg-piano';
    // import {waveform} from "../stores";

    export let options = {
        scaleX: 2,
        strokeWidth: 2
    };
    options = defaultOptions(options)
    let keys = renderKeys()

    const dimensions = totalDimensions(options).map(
        v => Math.round(v) + options.strokeWidth * 2
    );

    function keyClicked(key, index) {
        console.log('i: ', index)
        console.log("key: ", key)
        keys = keys.map((_key) => {
            const fill = key.fill === "purple"
                ? key.notes.length === 2  && key.notes[0].split('').includes('b') ? "#39383D" : "#F2F2EF"
                : "purple"
            return key === _key ? {...key, fill} : _key
        });

        // waveform.play("none")
    }
</script>

<div class="Keyboard">
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
        width: 100v;
    }

    .Keyboard svg {
        width: 100%;
    }
</style>