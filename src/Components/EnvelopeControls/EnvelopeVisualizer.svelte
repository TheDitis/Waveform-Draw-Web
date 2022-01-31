<script lang="ts">
    import synth from "../../stores/synthStore";
    import {type ADSRKey, ENVELOPE_LIMITS} from "../../stores/envelopeStore";
    import {clamp} from "../../utils/utils";

    export let width = 600;
    export let height = 180;
    export let bgColor = '#1e1e1e';
    export let color = '#01dcc5';
    const {A, D, S, R, Peak} = synth.envelope;

    let svgRef: SVGElement;

    const releaseMax = width / 3;
    const adsMax = releaseMax * 2;
    const adFactor = adsMax / (ENVELOPE_LIMITS.A.hi + ENVELOPE_LIMITS.D.hi);
    const rFactor = releaseMax / ENVELOPE_LIMITS.R.hi;

    const guideColor = (i: number): string => i % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';
    const calcY = (val: number) => height - ( val * height );

    const quarterHeight = height / 4;

    let adPath: string;  // path for attack+decay line
    let sPath: string;  // path for sustain line (dotted)
    let rPath: string;  // path for release line
    $: {
        const sustainY = calcY($S);
        adPath = 'M ' + [0, height, $A * adFactor, 0, ($A + $D) * adFactor, sustainY].join(' ');
        sPath = 'M ' + [adsMax, sustainY, ($A + $D) * adFactor, sustainY].join(' ');  // points flipped so dots don't move
        rPath = 'M ' + [adsMax, sustainY, adsMax + $R * rFactor, height].join(' ');
    }

    $: additionFactor = {
        A: 0,
        D: $A * adFactor,
        R: adsMax,
        S: 0,
    }

    const posToValue = (pos: number, control: ADSRKey): number => {
        if (['A', 'D', 'R'].includes(control)) {
            const limits = ENVELOPE_LIMITS[control];
            const multFactor = ((width / 3) / (limits.hi))
            return Math.round(
                clamp(pos - additionFactor[control], 0, width / 3) / multFactor
            );
        } else {
            console.log((height - pos) / height)
            return  (height - pos) / height;
        }
    }

    const handleDragStart = (control: ADSRKey) => () => {
        const isY = ['S', 'P'].includes(control);
        const updateValue = (moveEvent: MouseEvent) => {
            synth.envelope[control].set(
                posToValue(
                    isY ? moveEvent.offsetY : moveEvent.offsetX,
                    control
                )
            );
        }
        svgRef.addEventListener('mousemove', updateValue);
        window.addEventListener('mouseup', () => {
            svgRef.removeEventListener('mousemove', updateValue);
        })
    }
</script>

<svg viewBox={`0 0 ${width + 25} ${height + 25}`} width={width + 25} height={height + 25} bind:this={svgRef} >
    <!-- Y-axis guide lines  -->
    {#each Array(5).fill(0) as _, i}
        <line x1={0} y1={quarterHeight * i} x2={width} y2={quarterHeight * i} stroke-width={1} stroke={guideColor(i)} />
    {/each}

    <rect x={0} y={0} {width} {height} fill="none" stroke={guideColor(0)}/>
    <g class="drawnEnvelope">
        <path d={adPath} stroke={color} stroke-width={3} fill="none"/>
        <path d={sPath} stroke={color} stroke-width={3} fill="none" stroke-dasharray="5, 5"/>
        <path d={rPath} stroke={color} stroke-width={3} fill="none"/>
    </g>

    <g class="attackHandle" on:mousedown={handleDragStart('A')} opacity={0.4}>
        <line x1={$A * adFactor} y1={0} x2={$A * adFactor} y2={height + 5} stroke="white" stroke-width={3} />
        <line x1={$A * adFactor} y1={height + 13} x2={$A * adFactor} y2={height + 13} stroke="white" stroke-width={16} stroke-linecap="round" />
    </g>

    <g class="decayHandle" on:mousedown={handleDragStart('D')} opacity={0.4}>
        <line x1={$A * adFactor + $D * adFactor} y1={0} x2={$A * adFactor + $D * adFactor} y2={height + 5} stroke="white" stroke-width={3} />
        <line x1={$A * adFactor + $D * adFactor} y1={height + 13} x2={$A * adFactor + $D * adFactor} y2={height + 13} stroke="white" stroke-width={16} stroke-linecap="round" />
    </g>

    <g class="releaseHandle" on:mousedown={handleDragStart('R')} opacity={0.4}>
        <line x1={adsMax + $R * rFactor} y1={0} x2={adsMax + $R * rFactor} y2={height + 5} stroke="white" stroke-width={3} />
        <line x1={adsMax + $R * rFactor} y1={height + 13} x2={adsMax + $R * rFactor} y2={height + 13} stroke="white" stroke-width={16} stroke-linecap="round" />
    </g>

    <g class="sustainHandle" on:mousedown={handleDragStart('S')} opacity={0.4}>
        <line x1={0} y1={calcY($S)} x2={width + 5} y2={calcY($S)} stroke="white" stroke-width={3} />
        <line x1={width + 13} y1={calcY($S)} x2={width + 13} y2={calcY($S)} stroke="white" stroke-width={16} stroke-linecap="round" />
    </g>
</svg>

