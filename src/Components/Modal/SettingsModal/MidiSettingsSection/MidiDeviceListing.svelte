<script lang="ts">
    import midiStore from "../../../../stores/midiStore";

    export let device: MIDIInput;

    let isActive: boolean;
    $: isActive = midiStore.isInputActive(device?.id);
</script>


<div
    class="MidiDeviceListing"
    on:click={() => midiStore.toggleInput(device.id)}
    style="--color: {isActive ? '#FFFF00' : '#FFFFFF'}"
>
    <h5>{device.name}</h5>
</div>


<style>
    .MidiDeviceListing {
        width: 100%;
        background-color: var(--color);
    }
</style>