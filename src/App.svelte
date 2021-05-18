<script lang="ts">
	import DrawingSection from "./Components/DrawingSection.svelte";
	let color = "#ff3e00";

</script>

<main style="--color: {color}">
<!--	<h1>DRAW SOMETHING!</h1>-->
	<DrawingSection/>
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