<script>
	const links = [
		{ href: '#konfigurator', label: 'Konfigurator' },
		{ href: '#renderings', label: 'Renderings' },
		{ href: '#technik', label: 'Technik' }
	];
</script>

<header class="glass sticky top-0 z-40 border-x-0 border-t-0">
	<nav class="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Hauptnavigation">
		<a href="/" class="flex items-center gap-3">
			<img src="/favicon.svg" alt="" class="size-8" width="32" height="32" />
			<span class="font-display text-2xl tracking-wide text-cream-100">Atelier <span class="text-gold-400">Violino</span></span>
		</a>
		<ul class="hidden items-center gap-8 text-sm text-cream-300 sm:flex">
			{#each links as l (l.href)}
				<li><a href={l.href} class="transition hover:text-gold-300">{l.label}</a></li>
			{/each}
		</ul>
		<a href="#konfigurator" class="btn-gold !px-5 !py-2">Jetzt gestalten</a>
	</nav>
</header>
