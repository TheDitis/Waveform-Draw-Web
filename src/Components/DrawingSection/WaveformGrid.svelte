<script lang="ts">
    export let w: number;
    export let h: number;
    export let color: string = 'rgba(255, 255, 255)';
    export let nVertical: number = 40;
    export let nHorizontal: number = 40;

    $: verticals = Array(nVertical).fill(0).map((_, i) => w / nVertical * i);
    $: console.log(verticals)
    $: horizontals = Array(nHorizontal).fill(0).map((_, i) => w / nHorizontal * i)
</script>


<!-- VERTICAL LINES -->

<line x1={w / 2} y1={0} x2={w / 2} y2={h} stroke={color} stroke-width={2} opacity={0.4}/>
{#each verticals as x}
    <line x1={x} y1={h} x2={x} y2={0} stroke={color} stroke-width={1} opacity={0.1}/>
{/each}

<!-- HORIZONTAL LINES -->
<line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke={color} stroke-width={2} opacity={0.4}/>
{#each horizontals as y}
    <line x1={0} y1={y} x2={w} y2={y} stroke={color} stroke-width={1} opacity={0.1}/>
{/each}