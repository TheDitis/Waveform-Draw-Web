<script lang="ts">
    import synthStore from "../../../stores/synthStore";
    // @ts-ignore
    import LogScale from 'log-scale';

    const { cutoff, resonance, node: filterNode } = synthStore.filter
    export let width = 600;
    export let height = 180;
    export let color = '#01dcc5';

    let svgRef: SVGElement;

    const X_SHIFT = 8; // amt of padding to add so handles don't get cut off

    const quarterHeight = height / 4
    const guideColor = (i: number): string => i % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';

    let path: string;
    $: {
        console.log($cutoff, $resonance)
        const nSamples = 1000;
        const freqSamples = new Float32Array(nSamples).map((_, i) => i * (20000 / nSamples));
        let magResponse = new Float32Array(nSamples);
        let _phaseResponse = new Float32Array(nSamples);
        filterNode.getFrequencyResponse(freqSamples, magResponse, _phaseResponse);
        // const logScale = new LogScale(0, width);
        let filterPoints = Array.from(magResponse).flatMap((respAtFreq, i) => {
            const logScaledFreq = freqSamples[i]; // logScale.linearToLogarithmic(freqSamples[i] / 20000);
            const scaledFreq = width * (logScaledFreq / 20000);
            if (i === 1) {
                console.log('first: ', scaledFreq);
            }
            if (i === magResponse.length - 1) {
                console.log('last: ', scaledFreq);
            }
            const scaledResponse = respAtFreq * height / 20;
            return [scaledFreq, (height - scaledResponse)];
        })
        path = 'M ' + filterPoints
    }
</script>

<svg viewBox={`0 0 ${width + 50} ${height + 50}`} width={width + 50} height={height + 50} bind:this={svgRef}>
    <g transform="translate({X_SHIFT})">
        <!-- Border outline -->
        <rect x={0} y={0} {width} {height} fill="none" stroke={guideColor(0)}/>

        <!-- clipping box area -->
        <clipPath id="clip-box">
            <rect x={0} y={0} {width} {height}/>
        </clipPath>

        <!-- Y-axis guide lines  -->
        {#each Array(5).fill(0) as _, i}
            <line x1={0} y1={quarterHeight * i} x2={width} y2={quarterHeight * i} stroke-width={1} stroke={guideColor(i)} />
        {/each}

        <!-- Actual filter graph line -->
        <g class="drawnFilterLine">
            <path d={path} stroke={color} stroke-width={3} fill="none" clip-path="url(#clip-box)"/>
        </g>
    </g>
</svg>