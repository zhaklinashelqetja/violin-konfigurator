<script>
	import '../app.css';
	import Toast from '$lib/components/ui/Toast.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Atelier Violino – 3D-Violinen-Konfigurator</title>
	<meta
		name="description"
		content="Gestalte deine Violine in 3D: Lack, Hölzer, Wirbel, Saiten, Größe und Korpusform – in Echtzeit mit WebGL, modelliert in Blender."
	/>
	<meta property="og:title" content="Atelier Violino – 3D-Violinen-Konfigurator" />
	<meta property="og:description" content="Interaktiver 3D-Konfigurator für eine Violine (Blender, Three.js, Threlte)." />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/renders/1-gesamtansicht.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{@render children()}
<Toast />
