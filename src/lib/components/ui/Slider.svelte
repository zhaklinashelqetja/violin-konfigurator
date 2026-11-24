<script>
	let { value, oninput, min = 0, max = 1, step = 0.01, left = '', right = '', label = '', readout = '' } = $props();

	const fill = $derived(((value - min) / (max - min)) * 100);
</script>

<div>
	<input
		type="range"
		class="slider w-full cursor-pointer"
		aria-label={label}
		{min}
		{max}
		{step}
		{value}
		style:--fill="{fill}%"
		oninput={(e) => oninput(Number(e.currentTarget.value))}
	/>
	<div class="mt-2 flex items-center justify-between text-xs text-cream-400">
		<span>{left}</span>
		{#if readout}<span class="rounded-md bg-white/5 px-2 py-0.5 font-medium text-cream-200 tabular-nums">{readout}</span>{/if}
		<span>{right}</span>
	</div>
</div>
