<script>
    import {waveformStore} from "../stores/waveformStore"

    const path = waveformStore.svgPath
</script>


<path d={$path} stroke="yellow" stroke-width={3} fill="none"/>
