<script>
    import {waveform} from "../stores/waveformStore"

    const path = waveform.svgPath
</script>


<path d={$path} stroke="yellow" stroke-width={3} fill="none"/>
