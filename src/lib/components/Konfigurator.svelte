<script>
	// Svelte-Komponente "Konfigurator": 3D-Viewer (Zoom, Drehen, Perspektiven) + Konfigurationspanel.
	import { onMount } from 'svelte';
	import LoadingOverlay from './ui/LoadingOverlay.svelte';
	import ConfigPanel from './ui/ConfigPanel.svelte';
	import Icon from './ui/Icon.svelte';
	import { ui } from '$lib/state/config.svelte.js';
	import { audio, playMelody, stopMelody } from '$lib/state/audio.svelte.js';
	import { viewer } from '$lib/state/viewer.svelte.js';
	import { notify } from '$lib/state/toast.svelte.js';
	import { downloadBlob, timestamp } from '$lib/utils/files.js';
	import { webglSupport } from '$lib/utils/webgl.js';
	import { CAMERA_PRESETS, HOTSPOTS, BACKGROUNDS } from '$lib/config/options.js';

	let stage;
	let Viewer = $state(null);
	let webgl = $state(true);
	let fullscreen = $state(false);

	const bg = $derived(BACKGROUNDS.find((b) => b.id === ui.background) ?? BACKGROUNDS[0]);
	const active = $derived(HOTSPOTS.find((h) => h.id === viewer.activeHotspot) ?? null);

	function openHotspot(h) {
		viewer.activeHotspot = h.id;
		viewer.flyTo?.(h.view);
	}
	function stepHotspot(dir) {
		const list = HOTSPOTS.filter((h) => !h.requires || true);
		const i = Math.max(0, list.findIndex((h) => h.id === viewer.activeHotspot));
		openHotspot(list[(i + dir + list.length) % list.length]);
	}
	const toggleMelody = () => (audio.playing ? stopMelody() : playMelody());

	onMount(async () => {
		webgl = webglSupport().ok;
		if (!webgl) return;
		// three.js + Threlte erst im Browser nachladen (Code-Splitting, kein SSR)
		Viewer = (await import('./viewer/Viewer.svelte')).default;
	});

	async function screenshot() {
		try {
			const blob = await viewer.capture?.();
			if (blob) {
				downloadBlob(blob, `violine-${timestamp()}.png`);
				notify('Screenshot gespeichert');
			}
		} catch {
			notify('Screenshot nicht möglich');
		}
	}

	function toggleFullscreen() {
		if (document.fullscreenElement) document.exitFullscreen();
		else stage?.requestFullscreen?.();
	}
</script>

<svelte:document
	onfullscreenchange={() => (fullscreen = Boolean(document.fullscreenElement))}
	onkeydown={(e) => e.key === 'Escape' && (viewer.activeHotspot = null)}
/>

<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
	<!-- 3D-Bühne -->
	<div
		bind:this={stage}
		style:background={bg.css}
		class="relative h-[64vh] min-h-[440px] overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] lg:h-[min(82vh,840px)]"
	>
		{#if Viewer && webgl}
			<div class="absolute inset-0" aria-label="3D-Ansicht der Violine. Ziehen zum Drehen, Scrollen zum Zoomen.">
				<Viewer />
			</div>
		{/if}

		<LoadingOverlay {webgl} />

		{#if viewer.status === 'ready'}
			<!-- Info-Badge -->
			<div class="glass pointer-events-none absolute top-4 left-4 hidden rounded-full px-4 py-1.5 text-[0.7rem] tracking-wide text-cream-300 sm:block">
				WebGL · {viewer.stats.triangles.toLocaleString('de-AT')} Dreiecke · {viewer.stats.materials} Materialien · {viewer.stats.morphs} Morph Targets
			</div>

			<!-- Werkzeuge -->
			<div class="absolute top-4 right-4 flex gap-2">
				{#each [
					{ icon: audio.playing ? 'stop' : 'music', label: audio.playing ? 'Melodie stoppen' : 'Melodie abspielen', active: audio.playing, run: toggleMelody },
					{ icon: 'pin', label: 'Hotspots anzeigen', active: ui.hotspots, run: () => { ui.hotspots = !ui.hotspots; if (!ui.hotspots) viewer.activeHotspot = null; } },
					{ icon: 'rotate', label: 'Automatisch drehen', active: ui.autoRotate, run: () => (ui.autoRotate = !ui.autoRotate) },
					{ icon: 'wire', label: 'Drahtgitter-Ansicht', active: ui.wireframe, run: () => (ui.wireframe = !ui.wireframe) },
					{ icon: 'camera', label: 'Screenshot speichern', active: false, run: screenshot },
					{ icon: 'expand', label: fullscreen ? 'Vollbild beenden' : 'Vollbild', active: fullscreen, run: toggleFullscreen }
				] as t (t.icon)}
					<button
						onclick={t.run}
						aria-label={t.label}
						title={t.label}
						aria-pressed={t.active}
						class="glass grid size-10 place-items-center rounded-full transition hover:border-gold-500/50 hover:text-gold-300 {t.active
							? '!border-gold-500/70 text-gold-300'
							: 'text-cream-200'}"
					>
						<Icon name={t.icon} size={18} />
					</button>
				{/each}
			</div>

			<!-- Hotspots -->
			{#if ui.hotspots}
				{#each HOTSPOTS as h, i (h.id)}
					{@const p = viewer.hotspots[i]}
					{#if p?.visible}
						<button
							onclick={() => openHotspot(h)}
							aria-label={h.title}
							title={h.title}
							style:left="{p.x}px"
							style:top="{p.y}px"
							class="absolute z-10 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[0.7rem] font-semibold backdrop-blur-sm transition duration-200 hover:scale-125 {viewer.activeHotspot === h.id
								? 'border-gold-300 bg-gold-400 text-ink-950'
								: 'border-gold-400/80 bg-ink-900/70 text-gold-300'}"
						>
							{#if viewer.activeHotspot !== h.id}
								<span class="absolute inset-0 animate-ping rounded-full border border-gold-400/50"></span>
							{/if}
							{i + 1}
						</button>
					{/if}
				{/each}
			{/if}

			<!-- Hotspot-Karte -->
			{#if active && ui.hotspots}
				<div class="glass absolute bottom-24 left-4 z-20 w-[min(22rem,calc(100%-2rem))] rounded-2xl p-5" role="dialog" aria-label={active.title}>
					<div class="flex items-start justify-between gap-3">
						<div>
							<p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-400">Detail</p>
							<h3 class="font-display text-2xl leading-tight text-cream-100">{active.title}</h3>
						</div>
						<button class="rounded-full p-1.5 text-cream-400 transition hover:bg-white/10 hover:text-cream-100" aria-label="Schließen" onclick={() => (viewer.activeHotspot = null)}>
							<Icon name="close" size={16} />
						</button>
					</div>
					<p class="mt-2 text-sm leading-relaxed text-cream-300">{active.text}</p>
					<div class="mt-4 flex items-center justify-between">
						<span class="text-xs text-cream-500 tabular-nums">{HOTSPOTS.indexOf(active) + 1} / {HOTSPOTS.length}</span>
						<div class="flex gap-2">
							<button class="btn-ghost !p-2" aria-label="Vorheriges Detail" onclick={() => stepHotspot(-1)}><Icon name="prev" size={16} /></button>
							<button class="btn-ghost !p-2" aria-label="Nächstes Detail" onclick={() => stepHotspot(1)}><Icon name="next" size={16} /></button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Perspektiven -->
			<div class="absolute inset-x-0 bottom-4 flex flex-col items-center gap-3 px-3">
				<p class="pointer-events-none hidden text-[0.7rem] tracking-wide text-cream-500 md:block">
					Ziehen: drehen · Scrollen / Pinch: zoomen · Rechtsklick: verschieben
				</p>
				<div class="glass flex max-w-full gap-1 overflow-x-auto rounded-full p-1" role="group" aria-label="Perspektive">
					{#each CAMERA_PRESETS as p (p.id)}
						<button
							onclick={() => viewer.flyTo?.(p.id)}
							aria-pressed={viewer.camera === p.id}
							class="rounded-full px-4 py-2 text-sm whitespace-nowrap transition {viewer.camera === p.id
								? 'bg-white/12 font-semibold text-gold-300'
								: 'text-cream-300 hover:text-cream-100'}"
						>
							{p.label}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<!-- Konfiguration -->
	<ConfigPanel class="lg:h-[min(82vh,840px)]" />
</div>
