<script>
	let { options, value, onselect, label = '', extra } = $props();

	const bg = (o) => o.swatch ?? `linear-gradient(135deg, ${o.top}, ${o.back})`;
</script>

<div role="radiogroup" aria-label={label} class="flex flex-wrap gap-3">
	{#each options as o (o.id)}
		{@const active = value === o.id}
		<button
			type="button"
			role="radio"
			aria-checked={active}
			aria-label={o.label}
			title={o.label}
			onclick={() => onselect(o.id)}
			class="relative size-10 rounded-full transition duration-200 hover:scale-110 active:scale-95 {active
				? 'ring-2 ring-gold-400 ring-offset-[3px] ring-offset-ink-900'
				: 'ring-1 ring-white/15'}"
			style:background={bg(o)}
		>
			<span class="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/25 via-transparent to-black/30"></span>
		</button>
	{/each}
	{@render extra?.()}
</div>
