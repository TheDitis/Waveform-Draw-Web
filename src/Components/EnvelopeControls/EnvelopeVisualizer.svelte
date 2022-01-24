<script lang="ts">
    import synth from "../../stores/synthStore";
    import type {Point} from "../../stores/waveformStore";

    export let width = 600;
    export let height = 180;
    export let bgColor = '#1e1e1e';
    const {A, D, S, R} = synth.envelope;

    const guideColor = (i: number): string => i % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';

    const quarterHeight = height / 4;

    // calculate svg path of the envelope
    let path: string;
    $: {
        const sustainY = height - ( $S * height );
        let points: Point[] = [ [0, height], [$A / 10, 0], [$D / 10, sustainY], [200, sustainY], [$R / 10, height], [width, height] ];
        path = points.reduce((acc, pt, i) => acc.concat([
            i === 0 ? pt[0] : pt[0] + acc[acc.length - 2],
            pt[1]
        ]), ['M'] as any[]).join(' ');
    }
</script>

<svg viewBox={`0 0 ${width} ${height}`} {width} {height}>
    <rect x={0} y={0} {width} {height} fill="none" stroke={guideColor(0)}/>
    <path d={path} stroke="white" stroke-width="2px" fill="none"/>

    <!-- Y-axis guide lines  -->
    {#each Array(5).fill(0) as _, i}
        <line x1={0} y1={quarterHeight * i} x2={width} y2={quarterHeight * i} stroke-width={1} stroke={guideColor(i)} />
    {/each}
</svg>

<style>
    path {

    }
</style>