<script>
	let { checked, onchange, label, hint = '' } = $props();
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	onclick={() => onchange(!checked)}
	class="flex w-full items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-left transition hover:border-gold-500/40"
>
	<span>
		<span class="block text-sm font-medium text-cream-100">{label}</span>
		{#if hint}<span class="block text-xs text-cream-400">{hint}</span>{/if}
	</span>
	<span
		class="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 {checked ? 'bg-gold-500' : 'bg-ink-600'}"
	>
		<span
			class="absolute top-0.5 left-0.5 size-5 rounded-full bg-cream-100 shadow transition-transform duration-200 {checked
				? 'translate-x-5'
				: ''}"
		></span>
	</span>
</button>
