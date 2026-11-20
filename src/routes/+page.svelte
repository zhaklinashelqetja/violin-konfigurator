<script>
	import Header from '$lib/components/site/Header.svelte';
	import Hero from '$lib/components/site/Hero.svelte';
	import Gallery from '$lib/components/site/Gallery.svelte';
	import TechStack from '$lib/components/site/TechStack.svelte';
	import Footer from '$lib/components/site/Footer.svelte';
	import Konfigurator from '$lib/components/Konfigurator.svelte';
</script>

<Header />

<main>
	<Hero />

	<section id="konfigurator" class="mx-auto max-w-[1500px] scroll-mt-20 px-4 pb-24 sm:px-6 lg:px-8">
		<Konfigurator />
	</section>

	<section id="renderings" class="mx-auto max-w-[1500px] scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
		<p class="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-gold-400">Aus Blender</p>
		<h2 class="mt-3 mb-10 max-w-2xl font-display text-4xl text-cream-100 sm:text-5xl">Drei Blicke auf das Modell</h2>
		<Gallery />
	</section>

	<section id="technik" class="mx-auto max-w-[1500px] scroll-mt-20 px-4 pb-28 sm:px-6 lg:px-8">
		<p class="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-gold-400">Hinter den Kulissen</p>
		<h2 class="mt-3 mb-10 max-w-2xl font-display text-4xl text-cream-100 sm:text-5xl">Von Blender in den Browser</h2>
		<TechStack />
	</section>
</main>

<Footer />
