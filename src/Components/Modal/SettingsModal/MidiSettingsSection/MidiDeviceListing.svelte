<script lang="ts">
    import midiStore from "../../../../stores/midiStore";

    export let device: MIDIInput;

    let isActive: boolean;
    $: isActive = midiStore.isInputActive(device?.id);
</script>


<div
    class="MidiDeviceListing"
    on:click={() => midiStore.toggleInput(device.id)}
    class:selected={isActive}
    class:unselected={!isActive}
>
    <input class="checkbox" type="checkbox" checked={isActive}/>
    <h5>{device.name}</h5>
</div>


<style>
    .MidiDeviceListing {
        width: 100%;
        /*background-color: var(--color);*/
        /*padding: 10px;*/
        margin: 5px;
        box-sizing: border-box;
        height: 40px;
        display: flex;
        align-items: center;
        border: 2px solid rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    .selected {
        background-color: rgba(0, 255, 0, 0.3);
        border-color: rgb(4, 231, 4);
    }
    .unselected {
        opacity: 0.5;
    }
    .checkbox {
        float: left;
        vertical-align: center;
        margin: 0 20px;
    }

    input[type="checkbox"] {
        /* ...existing styles */
        display: grid;
        place-content: center;
        border: 2px solid white;
        border-radius: 35%;
    }

    input[type="checkbox"]::before {
        content: "";
        width: 0.65em;
        height: 0.65em;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em rgba(0, 255, 0, 1);
        border: 5px solid white;
        border-radius: 35%;
    }

    input[type="checkbox"]:checked::before {
        transform: scale(1);
        border-radius: 35%;
    }
</style>