<script>
	let { title, value = '', badge = '', children } = $props();
</script>

<section class="border-b border-white/[0.06] py-5 last:border-0">
	<header class="mb-3 flex items-baseline justify-between gap-3">
		<h3 class="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cream-400">
			{title}
			{#if badge}
				<span class="rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-[0.6rem] tracking-wider text-gold-300 normal-case">
					{badge}
				</span>
			{/if}
		</h3>
		{#if value}
			<span class="truncate text-sm text-cream-100">{value}</span>
		{/if}
	</header>
	{@render children()}
</section>
