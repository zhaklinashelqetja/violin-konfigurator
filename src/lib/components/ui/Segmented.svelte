<script>
	let { options, value, onselect, label = '' } = $props();
</script>

<div
	role="radiogroup"
	aria-label={label}
	class="grid rounded-full border border-white/10 bg-black/25 p-1"
	style:grid-template-columns="repeat({options.length}, minmax(0, 1fr))"
>
	{#each options as o (o.id)}
		{@const active = value === o.id}
		<button
			type="button"
			role="radio"
			aria-checked={active}
			onclick={() => onselect(o.id)}
			class="rounded-full px-3 py-2 text-sm transition duration-200 {active
				? 'bg-gradient-to-b from-gold-400 to-gold-600 font-semibold text-ink-950 shadow'
				: 'text-cream-300 hover:text-cream-100'}"
		>
			{o.label}
		</button>
	{/each}
</div>
