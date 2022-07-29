import { writable } from "svelte/store";

/**-----------------------------------------------------------------------------
 * MODAL
 *----------------------------------------------------------------------------*/
export enum ModalKind {
    ImageUpload,
    Settings,
}

interface ModalProps {
    [ModalKind.ImageUpload]: {},
    [ModalKind.Settings]: {},
}

interface ModalState<T extends ModalKind> {
    name: T;
    props: ModalProps[T]
}

export const modalStore = writable<ModalState<ModalKind>>(null);

export const setModal = <T extends ModalKind>(name: T | null, props?: ModalProps[T]) => {
    modalStore.set(name !== null ? { name, props } : null)
}