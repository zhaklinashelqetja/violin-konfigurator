<script>
	const steps = [
		{ n: '01', title: 'Blender', text: 'Korpus mit gewölbter Decke und Boden, F-Löcher per Boolean, Schnecke als Spirale, Steg, Wirbel, Saiten. Alle Teile einzeln benannt, mit PBR-Materialien und Holztexturen.' },
		{ n: '02', title: 'glTF / GLB', text: 'Export mit Shape Keys als Morph Targets (Größe, Korpusbreite). Eine Datei, ca. 3,5 MB, Texturen als JPEG.' },
		{ n: '03', title: 'Threlte + three.js', text: 'Deklarative Szene in Svelte 5: Image-Based Lighting, Kontaktschatten, OrbitControls mit Zoom und Kamerafahrten.' }
	];

	const features = [
		['Morph Targets', 'Größe 4/4 → 3/4 und Korpusbreite verändern die echte Geometrie.'],
		['Ausstattung', 'Kinnhalter und Feinstimmer ein- und ausblenden.'],
		['Teilen per Link', 'Die komplette Konfiguration steckt im URL-Parameter.']
	];
</script>

<div class="grid gap-5 md:grid-cols-3">
	{#each steps as s (s.n)}
		<article class="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7">
			<p class="font-display text-5xl text-gold-500/70">{s.n}</p>
			<h3 class="mt-3 font-display text-3xl text-cream-100">{s.title}</h3>
			<p class="mt-3 text-sm leading-relaxed text-cream-300">{s.text}</p>
		</article>
	{/each}
</div>

<ul class="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
	{#each features as [title, text] (title)}
		<li class="border-t border-white/10 pt-4">
			<h4 class="text-sm font-semibold tracking-wide text-gold-300">{title}</h4>
			<p class="mt-1 text-sm text-cream-400">{text}</p>
		</li>
	{/each}
</ul>
