<script>
	
	const features = [
		['Morph Targets', 'Größe 4/4 → 3/4 und Korpusbreite verändern die echte Geometrie.'],
		['Ausstattung', 'Kinnhalter und Feinstimmer ein- und ausblenden.'],
		['Teilen per Link', 'Die komplette Konfiguration steckt im URL-Parameter.']
	];
</script>


<ul class="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
	{#each features as [title, text] (title)}
		<li class="border-t border-white/10 pt-4">
			<h4 class="text-sm font-semibold tracking-wide text-gold-300">{title}</h4>
			<p class="mt-1 text-sm text-cream-400">{text}</p>
		</li>
	{/each}
</ul>
