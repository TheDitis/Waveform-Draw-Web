<script lang="ts">
    export let w: number;
    export let h: number;
    export let color: string = 'rgba(255, 255, 255)';
    export let nVertical: number = 20;
    export let nHorizontal: number = 30;

    const createLogarithmicHorizontals = (nHorizontal: number, h: number) => {
        const halfH = h / 2;
        const nPerSide = Math.floor(nHorizontal / 2) + 1;
        const logScaleLine = (i) => h / nPerSide * Math.log2(i);
        const scalar = halfH / logScaleLine(nPerSide - 1);
        const topHalf = Array(nPerSide - 1).fill(0)
            .map((_, i) => logScaleLine(i + 1) * scalar);
        const bottomHalf = topHalf.map((val) => -val + h);
        return topHalf.concat(bottomHalf);
    }

    $: verticals = Array(nVertical).fill(0).map((_, i) => w / nVertical * i);
    $: horizontals = createLogarithmicHorizontals(nHorizontal, h || 0);
</script>


<!-- VERTICAL LINES -->
<line x1={w / 2} y1={0} x2={w / 2} y2={h} stroke={color} stroke-width={2} opacity={0.2}/>
{#each verticals as x}
    <line x1={x} y1={h} x2={x} y2={0} stroke={color} stroke-width={1} opacity={0.1}/>
{/each}

<!-- HORIZONTAL LINES -->
<line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke={color} stroke-width={2} opacity={0.2}/>
{#each horizontals as y}
    <line x1={0} y1={y} x2={w} y2={y} stroke={color} stroke-width={1} opacity={0.1}/>
{/each}