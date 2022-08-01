<script lang="ts">
	import DrawingSection from "./Components/DrawingSection/DrawingSection.svelte";
	import Keyboard from "./Components/Keyboard/Keyboard.svelte";
	import KeyEventHandler from "./Components/Keyboard/KeyEventHandler.svelte";
	import Modal from "./Components/Modal/Modal.svelte";
	import { onMount } from "svelte";
	import midiStore from "./stores/midiStore";
	import EffectsAndShapingSection from "./Components/EffectsAndShaping/EffectsAndShapingSection.svelte";

	let color = "#00ffff";

	onMount(async () => {
		await midiStore.initialize();
	})
</script>

<main style="--color: {color}">
	<DrawingSection/>
	<Keyboard/>
	<EffectsAndShapingSection/>
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