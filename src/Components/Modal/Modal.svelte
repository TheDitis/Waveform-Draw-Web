<script lang="ts">
    import { modalStore, ModalKind, setModal } from "../../stores/uiStore";
    import ImageUploadModal from "./ImageUploadModal/ImageUploadModal.svelte";

    const modalComponents = {
        [ModalKind.ImageUpload]: ImageUploadModal
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
        height: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .Modal {
        min-width: 50px;
        min-height: 50px;
        background-color: white;
    }
</style>