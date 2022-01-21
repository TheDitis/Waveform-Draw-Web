<script>
    import synth from "../stores/synthStore";
    export let color = '#00d0ff';
    const path = synth.waveform.svgPath
</script>


<path d={$path} stroke={color} stroke-width={3} fill="none"/>
