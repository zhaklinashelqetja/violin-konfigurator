<script>
	// Kamera, OrbitControls (Zoom, Drehen, Verschieben), Kamerafahrten und Screenshot.
	import { onMount } from 'svelte';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { NeutralToneMapping, Vector3 } from 'three';
	import Stage from './Stage.svelte';
	import Violin from './Violin.svelte';
	import { ui, config } from '$lib/state/config.svelte.js';
	import { viewer } from '$lib/state/viewer.svelte.js';
	import { CAMERA_PRESETS, HOTSPOTS, BACKGROUNDS } from '$lib/config/options.js';

	const { renderer, scene, camera, size } = useThrelte();

	const start = CAMERA_PRESETS[0];
	let cam = $state();
	let controls = $state();
	let flight = null;
	const fp = new Vector3();
	const ft = new Vector3();

	// Auf kleinen / hochformatigen Bildschirmen weiter zurück
	const distanceBoost = $derived($size.width / $size.height < 1 ? 1.45 : 1);

	function flyTo(id) {
		const p = CAMERA_PRESETS.find((c) => c.id === id);
		if (!p) return;
		const t = new Vector3(...p.target);
		const dir = new Vector3(...p.position).sub(t).multiplyScalar(distanceBoost);
		flight = { pos: t.clone().add(dir), target: t };
		viewer.camera = id;
	}

	// Hotspots: 3D-Position -> Bildschirmposition (nur Änderungen schreiben, damit Svelte kaum neu rendert)
	viewer.hotspots = HOTSPOTS.map((h) => ({ id: h.id, x: 0, y: 0, visible: false }));
	const hv = new Vector3();
	const hn = new Vector3();
	const hc = new Vector3();

	function updateHotspots() {
		if (!cam || viewer.status !== 'ready') return;
		const w = $size.width;
		const h = $size.height;
		cam.updateMatrixWorld();
		HOTSPOTS.forEach((def, i) => {
			const out = viewer.hotspots[i];
			hv.set(...def.pos);
			hc.copy(cam.position).sub(hv).normalize();
			hn.set(...def.normal).normalize();
			const facing = hn.dot(hc) > 0.12;
			const enabled = !def.requires || config[def.requires];
			hv.project(cam);
			const on = enabled && facing && hv.z < 1 && Math.abs(hv.x) < 1.05 && Math.abs(hv.y) < 1.05;
			const x = Math.round((hv.x * 0.5 + 0.5) * w * 2) / 2;
			const y = Math.round((-hv.y * 0.5 + 0.5) * h * 2) / 2;
			if (out.visible !== on) out.visible = on;
			if (out.x !== x) out.x = x;
			if (out.y !== y) out.y = y;
		});
	}

	useTask((delta) => {
		updateHotspots();
		if (!flight || !cam || !controls) return;
		const k = 1 - Math.exp(-delta * 4.5);
		fp.copy(flight.pos);
		ft.copy(flight.target);
		cam.position.lerp(fp, k);
		controls.target.lerp(ft, k);
		controls.update();
		if (cam.position.distanceTo(fp) < 0.003 && controls.target.distanceTo(ft) < 0.003) flight = null;
	});

	$effect(() => {
		if (!controls) return;
		const stop = () => (flight = null);
		controls.addEventListener('start', stop);
		return () => controls.removeEventListener('start', stop);
	});

	onMount(() => {
		renderer.toneMapping = NeutralToneMapping;
		renderer.toneMappingExposure = 1.05;
		viewer.activeHotspot = null;

		viewer.flyTo = flyTo;
		// Screenshot als Blob: Szene rendern, auf dunklen Hintergrund setzen, PNG erzeugen
		viewer.capture = () =>
			new Promise((resolve, reject) => {
				const src = renderer.domElement;
				renderer.render(scene, camera.current);
				const out = document.createElement('canvas');
				out.width = src.width;
				out.height = src.height;
				const ctx = out.getContext('2d');
				const g = ctx.createRadialGradient(out.width / 2, out.height * 0.45, 20, out.width / 2, out.height / 2, out.width * 0.75);
				const bg = BACKGROUNDS.find((b) => b.id === ui.background) ?? BACKGROUNDS[0];
				g.addColorStop(0, bg.shot[0]);
				g.addColorStop(1, bg.shot[1]);
				ctx.fillStyle = g;
				ctx.fillRect(0, 0, out.width, out.height);
				ctx.drawImage(src, 0, 0);
				out.toBlob((b) => (b ? resolve(b) : reject(new Error('Screenshot fehlgeschlagen'))), 'image/png');
			});
		return () => {
			viewer.flyTo = null;
			viewer.capture = null;
		};
	});
</script>

<T.PerspectiveCamera
	makeDefault
	bind:ref={cam}
	fov={30}
	near={0.02}
	far={12}
	position={start.position}
>
	<OrbitControls
		bind:ref={controls}
		target={start.target}
		enableDamping
		dampingFactor={0.07}
		enablePan
		zoomToCursor
		zoomSpeed={0.8}
		rotateSpeed={0.7}
		minDistance={0.1}
		maxDistance={1.8}
		autoRotate={ui.autoRotate}
		autoRotateSpeed={1.6}
	/>
</T.PerspectiveCamera>

<Stage />
<Violin />
