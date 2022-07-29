<script lang="ts">
    import { SvelteComponent } from "svelte";

    export let icon: SvelteComponent;
</script>

<button class="IconButton" {...$$restProps}>
    <span class="buttonContent">
        <svelte:component this={icon}/>
        <span class="text"><slot/></span>
    </span>
</button>

<style>
    .IconButton {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        max-height: 50px;
    }
    .buttonContent {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .text {
        margin-left: 10px;
    }
</style>