<script lang="ts">
    export let title;
</script>

<div class="SettingsSection">
    <h3>{title}</h3>
    <hr/>
    <slot/>
</div>


<style>
    .SettingsSection {
        width: 100%;
        text-align: left;
    }

    .SettingsSection h3 {
        text-align: left;
        margin: 0;
    }
</style>