<script>
	// Die drei Blender-Renderings (Cycles) aus der Abgabe.
	const shots = [
		{ file: '1-gesamtansicht', title: 'Gesamtansicht', text: 'Studiolicht mit Key-, Fill- und Rim-Light.', span: 'md:col-span-2 md:row-span-2' },
		{ file: '2-detailansicht', title: 'Detailansicht', text: 'Steg mit Ausschnitten, Feinstimmer und Saitenhalter.', span: '' },
		{ file: '3-schnecke-warmes-licht', title: 'Alternative Perspektive', text: 'Schnecke und Wirbelkasten im warmen Seitenlicht.', span: '' }
	];
</script>

<div class="grid gap-4 md:grid-cols-3 md:grid-rows-2">
	{#each shots as s (s.file)}
		<figure class="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800 {s.span}">
			<picture>
				<source srcset="/renders/{s.file}.webp" type="image/webp" />
				<img
					src="/renders/{s.file}.jpg"
					alt="Blender-Rendering: {s.title} der Violine"
					loading="lazy"
					decoding="async"
					width="1600"
					height="1000"
					class="size-full min-h-56 object-cover transition duration-700 group-hover:scale-[1.04]"
				/>
			</picture>
			<figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-16">
				<p class="font-display text-2xl text-cream-100">{s.title}</p>
				<p class="text-sm text-cream-300">{s.text}</p>
			</figcaption>
		</figure>
	{/each}
</div>
