<script>
    import synthStore from "../../stores/synthStore";
    import { DownloadIcon, ImageIcon, SettingsIcon, Trash2Icon } from "svelte-feather-icons";
    import { ModalKind, setModal } from "../../stores/uiStore";

    const waveformIsValid = synthStore.waveform.isValid
</script>


<div class="KeyboardButtonsSection">
    <a>
        <button on:click={synthStore.waveform.clear}>
            <Trash2Icon/>
        </button>
    </a>

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
    .KeyboardButtonsSection {
        width: 50px;
        float: right;
    }
    a {
        margin: 10px;
    }
</style>