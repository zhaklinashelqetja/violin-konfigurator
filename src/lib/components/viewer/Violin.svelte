<script>
	// Lädt violin.glb (mit Fortschritt) und wendet die Konfiguration auf Materialien,
	// Sichtbarkeiten und Morph Targets an. Änderungen laufen weich (Lerp pro Frame).
	import { onMount } from 'svelte';
	import { T, useTask } from '@threlte/core';
	import { Color, Mesh, TextureLoader, SRGBColorSpace, RepeatWrapping } from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { config, ui } from '$lib/state/config.svelte.js';
	import { viewer } from '$lib/state/viewer.svelte.js';
	import { pulse } from '$lib/state/audio.svelte.js';
	import { MODEL_URL, WOOD_BASE, TOP_WOODS, BACK_WOODS, resolveAll } from '$lib/config/options.js';

	let { url = MODEL_URL } = $props();

	let model = $state.raw(null);
	/** @type {Record<string, import('three').MeshPhysicalMaterial>} */
	let mats = {};
	let morphMeshes = [];
	let chinRest = null;
	let tuners = {};
	const cur = { size: 0, width: 0 };
	let stringNodes = {};
	let clock = 0;
	const texLoader = new TextureLoader();
	const texCache = {}; // Holzart-Id -> Texture
	const origMaps = {}; // Material -> Textur aus der GLB-Datei
	const wanted = {}; // Material -> zuletzt gewünschte Holzart (gegen Race Conditions beim Laden)
	const tmp = new Color();

	const target = $derived.by(() => {
		const r = resolveAll(config);
		return {
			top: new Color(r.varnish.top),
			back: new Color(r.varnish.back),
			finish: r.finish,
			fit: new Color(r.fittings.color),
			fittings: r.fittings,
			peg: new Color(r.pegs.color),
			pegs: r.pegs,
			strings: r.strings,
			tuners: r.tuners
		};
	});

	const baseName = (n) => n.replace(/\.\d+$/, '');

	function setup(root) {
		const materials = new Set();
		let triangles = 0;
		let meshes = 0;
		root.traverse((o) => {
			if (o.name?.startsWith('FineTuner_')) tuners[Number(o.name.split('_')[1])] = o;
			if (o.name === 'ChinRest') chinRest = o;
			if (/^String_[GDAE]$/.test(o.name)) stringNodes[o.name.slice(-1)] = o;
			if (!(o instanceof Mesh)) return;
			meshes++;
			o.frustumCulled = false; // Morph Targets verändern die Bounding Box
			triangles += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3;
			const list = Array.isArray(o.material) ? o.material : [o.material];
			for (const m of list) {
				mats[baseName(m.name)] = m;
				materials.add(m);
			}
			if (o.morphTargetDictionary) morphMeshes.push(o);
		});
		viewer.stats = {
			meshes,
			triangles: Math.round(triangles),
			materials: materials.size,
			morphs: Object.keys(morphMeshes.find((m) => m.morphTargetDictionary?.Body_Wider !== undefined)?.morphTargetDictionary ?? {}).length
		};
		return materials;
	}

	/** Holzart wechseln: andere Textur laden (gecacht) und auf das Material legen. */
	function applyWood(matKey, list, id) {
		const m = mats[matKey];
		const wood = list.find((w) => w.id === id) ?? list[0];
		if (!m) return;
		origMaps[matKey] ??= m.map;
		wanted[matKey] = wood.id;
		const set = (tex) => {
			if (wanted[matKey] !== wood.id) return;
			m.map = tex;
			m.needsUpdate = true;
		};
		if (!wood.tex) return set(origMaps[matKey]);
		if (texCache[wood.tex]) return set(texCache[wood.tex]);
		texLoader.load(WOOD_BASE + wood.tex + '.jpg', (t) => {
			t.colorSpace = SRGBColorSpace;
			t.flipY = false; // glTF-Konvention
			t.wrapS = t.wrapT = RepeatWrapping;
			t.anisotropy = 8;
			texCache[wood.tex] = t;
			set(t);
		});
	}

	function approach(obj, key, goal, k) {
		if (obj && key in obj) obj[key] += (goal - obj[key]) * k;
	}

	function applyDiscrete(t) {
		if (chinRest) chinRest.visible = config.chinrest;
		for (const [i, node] of Object.entries(tuners)) node.visible = t.tuners.visible.includes(Number(i));
		const s = t.strings;
		for (const n of ['G', 'D', 'A', 'E']) {
			const m = mats['String_' + n];
			if (!m) continue;
			m.color.set(s.colors[n]);
			m.metalness = s.metalness;
			m.roughness = s.roughness;
		}
	}

	function step(k, snap = false) {
		const t = target;
		const kk = snap ? 1 : k;
		mats.Varnish_Top?.color.lerp(t.top, kk);
		mats.Varnish_Maple?.color.lerp(t.back, kk);
		mats.Ebony?.color.lerp(t.fit, kk);
		mats.Pegs?.color.lerp(t.peg, kk);
		for (const key of ['Varnish_Top', 'Varnish_Maple']) {
			approach(mats[key], 'clearcoat', t.finish.clearcoat, kk);
			approach(mats[key], 'roughness', t.finish.roughness, kk);
		}
		approach(mats.Ebony, 'roughness', t.fittings.roughness, kk);
		approach(mats.Ebony, 'clearcoat', t.fittings.clearcoat, kk);
		approach(mats.Pegs, 'metalness', t.pegs.metalness, kk);
		approach(mats.Pegs, 'roughness', t.pegs.roughness, kk);

		cur.size += (config.size - cur.size) * kk;
		cur.width += (config.width - cur.width) * kk;
		for (const m of morphMeshes) {
			const d = m.morphTargetDictionary;
			if (d.Size_3_4 !== undefined) m.morphTargetInfluences[d.Size_3_4] = cur.size;
			if (d.Body_Wider !== undefined) m.morphTargetInfluences[d.Body_Wider] = cur.width;
		}
	}

	useTask((delta) => {
		if (!model) return;
		step(1 - Math.exp(-delta * 10));

		// Saiten leuchten und vibrieren, solange ein Ton erklingt
		clock += delta;
		for (const id of ['G', 'D', 'A', 'E']) {
			const node = stringNodes[id];
			const m = mats['String_' + id];
			if (!node || !m) continue;
			const p = pulse[id];
			if (p > 0) {
				pulse[id] = Math.max(0, p - delta * 1.1);
				m.emissive.set('#ffa94d');
				m.emissiveIntensity = p * 1.4;
				node.position.y = Math.sin(clock * 160) * 0.0008 * p;
			} else if (m.emissiveIntensity !== 0) {
				m.emissiveIntensity = 0;
				node.position.y = 0;
			}
		}
	});

	$effect(() => {
		const id = config.topWood;
		if (model) applyWood('Varnish_Top', TOP_WOODS, id);
	});
	$effect(() => {
		const id = config.backWood;
		if (model) applyWood('Varnish_Maple', BACK_WOODS, id);
	});

	// diskrete Optionen sofort anwenden
	$effect(() => {
		if (model) applyDiscrete(target);
	});

	// Drahtgitter-Ansicht
	$effect(() => {
		const w = ui.wireframe;
		if (!model) return;
		model.traverse((o) => {
			if (o instanceof Mesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => (m.wireframe = w));
		});
	});

	onMount(() => {
		let disposed = false;
		new GLTFLoader()
			.loadAsync(url, (e) => {
				viewer.progress = e.lengthComputable && e.total > 0 ? e.loaded / e.total : -1;
			})
			.then((gltf) => {
				if (disposed) return;
				setup(gltf.scene);
				step(1, true);
				applyDiscrete(target);
				model = gltf.scene;
				viewer.progress = 1;
				viewer.status = 'ready';
			})
			.catch((err) => {
				console.error('[Violin] Laden fehlgeschlagen', err);
				viewer.status = 'error';
				viewer.error = err?.message ?? 'Unbekannter Fehler';
			});

		return () => {
			disposed = true;
			model?.traverse((o) => {
				if (o instanceof Mesh) {
					o.geometry.dispose();
					(Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
						m.map?.dispose();
						m.dispose();
					});
				}
			});
		};
	});
</script>

{#if model}
	<T is={model} />
{/if}
