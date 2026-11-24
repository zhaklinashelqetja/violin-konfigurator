<script>
	// Studio-Bühne: Image-Based Lighting (RoomEnvironment, keine externe HDR-Datei nötig),
	// Key/Rim-Licht und weicher Kontaktschatten unter dem Instrument.
	import { onMount } from 'svelte';
	import { T, useThrelte } from '@threlte/core';
	import { ContactShadows } from '@threlte/extras';
	import { PMREMGenerator } from 'three';
	import { ui } from '$lib/state/config.svelte.js';
	import { BACKGROUNDS } from '$lib/config/options.js';
	import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

	const { scene, renderer } = useThrelte();
	const bg = $derived(BACKGROUNDS.find((b) => b.id === ui.background) ?? BACKGROUNDS[0]);

	$effect(() => {
		scene.environmentIntensity = bg.env;
	});

	onMount(() => {
		const pmrem = new PMREMGenerator(renderer);
		const env = new RoomEnvironment();
		const rt = pmrem.fromScene(env, 0.04);
		scene.environment = rt.texture;
		scene.environmentIntensity = bg.env;
		return () => {
			scene.environment = null;
			rt.dispose();
			pmrem.dispose();
			env.dispose?.();
		};
	});
</script>

<!-- Key light: warm, von vorne links oben -->
<T.DirectionalLight position={[-0.6, 1.0, 0.5]} intensity={2.2} color="#ffe9cf" />
<!-- Fill: kühl, von rechts -->
<T.DirectionalLight position={[0.9, 0.4, 0.2]} intensity={0.6} color="#cfe0ff" />
<!-- Rim: von hinten, lässt die Kanten leuchten -->
<T.DirectionalLight position={[0.2, 0.7, -1.2]} intensity={1.6} color="#ffd9a8" />

<ContactShadows
	position={[0, -0.0165, -0.27]}
	scale={1.5}
	blur={2.4}
	far={0.12}
	opacity={bg.shadow}
	resolution={1024}
	color="#000000"
/>
