<script lang="ts">
	import DrawingSection from "./Components/DrawingSection/DrawingSection.svelte";
	import Keyboard from "./Components/Keyboard.svelte";
	import KeyEventHandler from "./Components/KeyEventHandler.svelte";
	let color = "#ff3e00";

</script>

<main style="--color: {color}">
	<DrawingSection/>
	<Keyboard/>
	<KeyEventHandler/>
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
		/*box-sizing: border-box;*/
		/*border: 2px solid black;*/
	}
</style>