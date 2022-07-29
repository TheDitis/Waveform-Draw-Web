<script lang="ts">

import MidiSettingsSection from "./MidiSettingsSection/MidiSettingsSection.svelte";
</script>

<div class="SettingsModal">
    <h2>Settings</h2>
    <div class="contentSection">
        <MidiSettingsSection/>
    </div>
</div>


<style>
    .SettingsModal {
        min-width: 400px;
    }
</style>