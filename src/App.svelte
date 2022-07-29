<script lang="ts">
	import DrawingSection from "./Components/DrawingSection/DrawingSection.svelte";
	import Keyboard from "./Components/Keyboard.svelte";
	import KeyEventHandler from "./Components/KeyEventHandler.svelte";
	import EnvelopeControls from "./Components/EnvelopeControls/EnvelopeControls.svelte";
	import Modal from "./Components/Modal/Modal.svelte";
	import { onMount } from "svelte";
	let color = "#00ffff";
	import midiStore from "./stores/midiStore";

	// TODO: Stop audio refresh when mouse lifted outside of window

	onMount(async () => {
		await midiStore.initialize();
	})
</script>

<main style="--color: {color}">
	<DrawingSection/>
	<Keyboard/>
	<EnvelopeControls/>
	<KeyEventHandler/>
	<Modal/>
</main>

<style>
	main {
		background: #262626;
		text-align: center;
		width: 100%;
		height: 100%;
		top: -50px;
		padding: 0;
		margin: 0;
	}
</style>