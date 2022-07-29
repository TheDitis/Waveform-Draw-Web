<script lang="ts">
    import { modalStore, ModalKind, setModal } from "../../stores/uiStore";
    import ImageUploadModal from "./ImageUploadModal/ImageUploadModal.svelte";
    import SettingsModal from "./SettingsModal/SettingsModal.svelte";
    import { SvelteComponent } from "svelte";

    const modalComponents: Record<ModalKind, SvelteComponent> = {
        [ModalKind.ImageUpload]: ImageUploadModal,
        [ModalKind.Settings]: SettingsModal,
    };
</script>

{#if $modalStore !== null}
    <div
        class="modalScrim"
        on:click|self={() => {
            console.log('closing');
            setModal(null)
        }}
    >
        <div class="Modal">
            <svelte:component
                this={modalComponents[$modalStore.name]}
                {...$modalStore.props}
            />
        </div>
    </div>
{/if}

<style>
    .modalScrim {
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.8);
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .Modal {
        min-width: 50px;
        min-height: 50px;
        max-width: 90vw;
        max-height: 90vh;
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        border-radius: 30px;
    }
</style>