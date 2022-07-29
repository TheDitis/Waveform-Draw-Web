<script>
    import SettingsSection from "../SettingsSection.svelte";
    import midiStore from "../../../../stores/midiStore";
    import MidiDeviceListing from "./MidiDeviceListing.svelte";

    $: inputs = $midiStore.availableInputs;
</script>

<SettingsSection title="MIDI">
    <h4>Inputs:</h4>
    {#if inputs.length}
        {#each inputs as device (device.id)}
            <MidiDeviceListing {device}/>
        {/each}
    {:else}
        <p>No devices connected</p>
    {/if}
</SettingsSection>