<script lang="ts">
    import { keyboardStore } from "../stores/keyboardStore";
    import { DownloadIcon, ImageIcon, SettingsIcon } from "svelte-feather-icons";
    import { ModalKind, setModal } from "../stores/uiStore";
    import synthStore from "../stores/synthStore";

    const waveformIsValid = synthStore.waveform.isValid
</script>

<div class="Keyboard">
    <svg
        style="margin:0"
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

    {#if $waveformIsValid}
        <a href="" id="download_link">
            <button>
                <DownloadIcon/>
            </button>
        </a>
    {:else}
        <a>
            <button disabled>
                <DownloadIcon/>
            </button>
        </a>
    {/if}

    <a>
        <button on:click={() => {setModal(ModalKind.ImageUpload)}}>
            <ImageIcon/>
        </button>
    </a>

    <a>
        <button on:click={() => {setModal(ModalKind.Settings)}}>
            <SettingsIcon/>
        </button>
    </a>

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