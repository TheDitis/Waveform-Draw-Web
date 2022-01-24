<script>
    import synth from "../../stores/synthStore";
    export let color = '#00d0ff';
    const path = synth.waveform.svgPath
</script>


<path d={$path} stroke={color} stroke-width={5} fill="none"/>


<style>
    path {
        filter: blur(2px);
    }
</style>