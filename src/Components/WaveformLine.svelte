<script>
    import {waveformStore} from "../stores/waveformStore"
    export let color = '#00d0ff';
    const path = waveformStore.svgPath
</script>


<path d={$path} stroke={color} stroke-width={3} fill="none"/>
