<script lang="ts">
	import DrawingSection from "./Components/DrawingSection.svelte";
	import Keyboard from "./Components/Keyboard.svelte";
	let color = "#ff3e00";

</script>

<main style="--color: {color}">
	<DrawingSection/>
	<Keyboard/>
</main>

<style>
	main {
		background: #262626;
		text-align: center;
		width: 100%;
		height: 100%;
		postion: absolute;
		top: -50;
		padding: 0;
		margin: 0;
		/*box-sizing: border-box;*/
		/*border: 2px solid black;*/
	}

	h1 {
		color: var(--color);
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
</style>