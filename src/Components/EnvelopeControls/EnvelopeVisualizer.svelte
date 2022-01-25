<script lang="ts">
    import synth from "../../stores/synthStore";
    import {ENVELOPE_LIMITS} from "../../stores/envelopeStore";

    export let width = 600;
    export let height = 180;
    export let bgColor = '#1e1e1e';
    export let color = '#01dcc5';
    const {A, D, S, R} = synth.envelope;

    const releaseMax = width / 3;
    const adsMax = releaseMax * 2;
    const adFactor = adsMax / (ENVELOPE_LIMITS.A.hi + ENVELOPE_LIMITS.D.hi);
    const rFactor = releaseMax / ENVELOPE_LIMITS.R.hi;

    const guideColor = (i: number): string => i % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';

    const quarterHeight = height / 4;

    let adPath: string;  // path for attack+decay line
    let sPath: string;  // path for sustain line (dotted)
    let rPath: string;  // path for release line
    $: {
        const sustainY = height - ( $S * height );
        adPath = 'M ' + [0, height, $A * adFactor, 0, ($A + $D) * adFactor, sustainY].join(' ');
        sPath = 'M ' + [adsMax, sustainY, ($A + $D) * adFactor, sustainY].join(' ');  // points flipped so dots don't move
        rPath = 'M ' + [adsMax, sustainY, adsMax + $R * rFactor, height].join(' ');
    }
</script>

<svg viewBox={`0 0 ${width} ${height}`} {width} {height}>
    <rect x={0} y={0} {width} {height} fill="none" stroke={guideColor(0)}/>
<!--    <path d={path} stroke="white" stroke-width="2px" fill="none"/>-->
    <g class="drawnEnvelope">
        <path d={adPath} stroke={color} stroke-width={3} fill="none"/>
        <path d={sPath} stroke={color} stroke-width={3} fill="none" stroke-dasharray="5, 5"/>
        <path d={rPath} stroke={color} stroke-width={3} fill="none"/>
    </g>

    <!-- Y-axis guide lines  -->
    {#each Array(5).fill(0) as _, i}
        <line x1={0} y1={quarterHeight * i} x2={width} y2={quarterHeight * i} stroke-width={1} stroke={guideColor(i)} />
    {/each}
</svg>

<style>
    .drawnEnvelope {
        /*filter: blur(1px);*/
    }
</style>
