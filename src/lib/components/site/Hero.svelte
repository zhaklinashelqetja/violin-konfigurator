<script>
	import Icon from '../ui/Icon.svelte';

	const facts = [
		['70.000', 'Polygone, in Blender modelliert'],
		['2', 'Morph Targets verändern die Form'],
		['Live', 'WebGL-Rendering im Browser']
	];
</script>

<section class="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
	<picture>
		<source srcset="/renders/hero.webp" type="image/webp" />
		<img
			src="/renders/hero.jpg"
			alt="Violine auf dunklem, spiegelndem Untergrund, gerendert in Blender"
			class="absolute inset-0 -z-20 size-full object-cover object-[78%_center] lg:object-center"
			fetchpriority="high"
		/>
	</picture>
	<!-- Lesbarkeit links, Vignette, Übergang nach unten -->
	<div class="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent lg:via-ink-950/55 lg:to-transparent"></div>
	<div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_45%,transparent_35%,rgb(10_8_7/0.55)_100%)]"></div>
	<div class="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink-950 to-transparent"></div>

	<div class="mx-auto w-full max-w-[1500px] px-4 py-20 sm:px-6 lg:px-8">
		<div class="flex items-center gap-4">
			<span class="h-px w-12 bg-gold-500"></span>
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-gold-400">3D-Produktkonfigurator</p>
		</div>

		<h1 class="mt-7 max-w-2xl font-display text-5xl leading-[1.02] text-cream-100 sm:text-7xl xl:text-[5.6rem]">
			Deine Violine,<br />
			<span class="italic text-gold-300">ganz nach deinem Klang.</span>
		</h1>

		<p class="mt-8 max-w-md text-base leading-relaxed text-cream-300 sm:text-lg">
			Wähle Lack, Hölzer, Wirbel und Saiten, verändere Größe und Korpusform und betrachte das Instrument in Echtzeit
			von allen Seiten.
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-4">
			<a href="#konfigurator" class="btn-gold">Konfigurator starten <Icon name="arrow" size={18} /></a>
			<a href="#renderings" class="btn-ghost !px-6 !py-3">Renderings ansehen</a>
		</div>


	</div>
</section>
