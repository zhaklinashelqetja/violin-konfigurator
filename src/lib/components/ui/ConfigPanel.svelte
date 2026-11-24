<script>
	import Section from './Section.svelte';
	import Swatches from './Swatches.svelte';
	import Segmented from './Segmented.svelte';
	import Slider from './Slider.svelte';
	import Switch from './Switch.svelte';
	import Icon from './Icon.svelte';
	import { config, ui, slots, resetConfig, saveSlot, loadSlot, deleteSlot, setConfig, shareLink, applyPreset } from '$lib/state/config.svelte.js';
	import { viewer } from '$lib/state/viewer.svelte.js';
	import { notify } from '$lib/state/toast.svelte.js';
	import { downloadBlob, downloadJSON, readJSONFile, timestamp } from '$lib/utils/files.js';
	import { audio, playMelody, stopMelody, playString } from '$lib/state/audio.svelte.js';
	import {
		VARNISHES, FINISHES, FITTINGS, PEGS, STRINGS, TUNERS, TOP_WOODS, BACK_WOODS, BACKGROUNDS, PRESETS, WOOD_BASE,
		resolveAll, calcPrice, bodyLengthMm, bodyWidthMm
	} from '$lib/config/options.js';

	let { class: cls = '' } = $props();

	const tabs = [
		{ id: 'look', label: 'Design' },
		{ id: 'build', label: 'Bauweise' },
		{ id: 'sound', label: 'Klang' },
		{ id: 'save', label: 'Speichern' }
	];

	const woodSwatch = (w) => `url(${WOOD_BASE}${w.thumb}.jpg) center / cover`;
	const topWoods = TOP_WOODS.map((w) => ({ ...w, swatch: woodSwatch(w) }));
	const backWoods = BACK_WOODS.map((w) => ({ ...w, swatch: woodSwatch(w) }));
	const backgrounds = BACKGROUNDS.map((b) => ({ ...b, swatch: b.css }));
	const presetActive = (p) => Object.entries(p.config).every(([k, v]) => config[k] === v);
	const strings = [
		{ id: 'G', note: 'G3' },
		{ id: 'D', note: 'D4' },
		{ id: 'A', note: 'A4' },
		{ id: 'E', note: 'E5' }
	];

	const r = $derived(resolveAll(config));
	const price = $derived(calcPrice(config));
	const euro = (n) => n.toLocaleString('de-AT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

	let slotName = $state('');
	let fileInput = $state();

	async function screenshot() {
		try {
			const blob = await viewer.capture?.();
			if (!blob) return notify('Szene ist noch nicht bereit');
			downloadBlob(blob, `violine-${timestamp()}.png`);
			notify('Screenshot gespeichert');
		} catch (e) {
			notify('Screenshot nicht möglich');
		}
	}

	async function copyLink() {
		const url = shareLink();
		try {
			await navigator.clipboard.writeText(url);
			notify('Link in die Zwischenablage kopiert');
		} catch {
			prompt('Link kopieren:', url);
		}
	}

	async function importFile(e) {
		const file = e.currentTarget.files?.[0];
		e.currentTarget.value = '';
		if (!file) return;
		try {
			const data = await readJSONFile(file);
			setConfig(data.config ?? data);
			notify('Konfiguration importiert');
		} catch {
			notify('Ungültige Datei');
		}
	}

	function doSave() {
		saveSlot(slotName);
		slotName = '';
		notify('Konfiguration gespeichert');
	}

	const fmtDate = (t) => new Date(t).toLocaleString('de-AT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
</script>

<aside class="glass flex min-h-0 flex-col overflow-hidden rounded-3xl {cls}" aria-label="Konfiguration">
	<!-- Kopf -->
	<div class="px-6 pt-6">
		<p class="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-400">Atelier Violino</p>
		<h2 class="font-display text-3xl leading-tight text-cream-100">Deine Violine</h2>
		<div role="tablist" class="mt-5 grid grid-cols-4 rounded-full border border-white/10 bg-black/25 p-1">
			{#each tabs as t (t.id)}
				<button
					role="tab"
					aria-selected={ui.panelTab === t.id}
					onclick={() => (ui.panelTab = t.id)}
					class="rounded-full py-2 text-[0.8rem] transition {ui.panelTab === t.id
						? 'bg-white/10 font-semibold text-cream-100'
						: 'text-cream-400 hover:text-cream-200'}"
				>
					{t.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Inhalt -->
	<div class="panel-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-4">
		{#if ui.panelTab === 'look'}
			<Section title="Fertige Designs">
				<div class="grid grid-cols-2 gap-2">
					{#each PRESETS as p (p.id)}
						<button
							onclick={() => { applyPreset(p); notify('Design „' + p.label + '“ angewendet'); }}
							class="flex items-center gap-3 rounded-xl border p-2.5 text-left transition hover:border-gold-500/50 {presetActive(p)
								? 'border-gold-500/70 bg-gold-500/10'
								: 'border-white/[0.07] bg-white/[0.03]'}"
						>
							<span class="size-9 shrink-0 rounded-full ring-1 ring-white/15" style:background={p.swatch}></span>
							<span class="min-w-0">
								<span class="block text-sm font-medium text-cream-100">{p.label}</span>
								<span class="block truncate text-[0.68rem] text-cream-500">{p.note}</span>
							</span>
						</button>
					{/each}
				</div>
			</Section>

			<Section title="Lackfarbe" value={r.varnish.label}>
				<Swatches
					label="Lackfarbe"
					options={VARNISHES}
					value={config.varnish}
					onselect={(id) => (config.varnish = id)}
				>
					{#snippet extra()}
						<label
							title="Eigene Farbe"
							class="relative size-10 cursor-pointer overflow-hidden rounded-full transition hover:scale-110 {config.varnish === 'custom'
								? 'ring-2 ring-gold-400 ring-offset-[3px] ring-offset-ink-900'
								: 'ring-1 ring-white/15'}"
							style:background="conic-gradient(from 0deg, #f66, #fc6, #6f6, #6cf, #96f, #f6c, #f66)"
						>
							<input
								type="color"
								class="absolute inset-0 size-full cursor-pointer opacity-0"
								aria-label="Eigene Lackfarbe wählen"
								bind:value={config.customColor}
								oninput={() => (config.varnish = 'custom')}
							/>
						</label>
					{/snippet}
				</Swatches>
			</Section>

			<Section title="Lackoberfläche" value={r.finish.label}>
				<Segmented label="Lackoberfläche" options={FINISHES} value={config.finish} onselect={(id) => (config.finish = id)} />
			</Section>

			<Section title="Holzart Decke" badge="Textur" value={r.topWood.label}>
				<Swatches label="Holzart Decke" options={topWoods} value={config.topWood} onselect={(id) => (config.topWood = id)} />
			</Section>

			<Section title="Holzart Boden & Hals" badge="Textur" value={r.backWood.label}>
				<Swatches label="Holzart Boden" options={backWoods} value={config.backWood} onselect={(id) => (config.backWood = id)} />
			</Section>

			<Section title="Griffbrett & Garnitur" value={r.fittings.label}>
				<Swatches label="Holz Garnitur" options={FITTINGS} value={config.fittings} onselect={(id) => (config.fittings = id)} />
			</Section>

			<Section title="Wirbel" value={r.pegs.label}>
				<Swatches label="Wirbel" options={PEGS} value={config.pegs} onselect={(id) => (config.pegs = id)} />
			</Section>

			<Section title="Saiten" value={r.strings.label}>
				<Swatches label="Saiten" options={STRINGS} value={config.strings} onselect={(id) => (config.strings = id)} />
			</Section>

			<Section title="Hintergrund" value={(backgrounds.find((b) => b.id === ui.background) ?? backgrounds[0]).label}>
				<Swatches label="Hintergrund" options={backgrounds} value={ui.background} onselect={(id) => (ui.background = id)} />
			</Section>
		{:else if ui.panelTab === 'build'}
			<Section title="Größe" badge="Morph Target" value="{bodyLengthMm(config)} mm Korpus">
				<Slider
					label="Korpusgröße"
					value={config.size}
					oninput={(v) => (config.size = v)}
					left="4/4"
					right="3/4"
					readout={config.size < 0.02 ? 'Volle Größe' : config.size > 0.98 ? '3/4' : Math.round(config.size * 100) + ' %'}
				/>
			</Section>

			<Section title="Korpusbreite" badge="Morph Target" value="{bodyWidthMm(config)} mm Unterbug">
				<Slider
					label="Korpusbreite"
					value={config.width}
					oninput={(v) => (config.width = v)}
					left="Schlank"
					right="Breit"
					readout={'+' + Math.round(config.width * 7) + ' %'}
				/>
			</Section>

			<Section title="Ausstattung">
				<div class="space-y-3">
					<Switch
						label="Kinnhalter"
						hint="Ebenholz-Kinnhalter mit Klammer"
						checked={config.chinrest}
						onchange={(v) => (config.chinrest = v)}
					/>
					<div>
						<p class="mb-2 text-sm text-cream-300">Feinstimmer</p>
						<Segmented label="Feinstimmer" options={TUNERS} value={config.tuners} onselect={(id) => (config.tuners = id)} />
					</div>
				</div>
			</Section>
		{:else if ui.panelTab === 'sound'}
			<Section title="Melodie" badge="Web Audio">
				<p class="mb-3 text-sm text-cream-300">„Ode an die Freude“ (Beethoven), live im Browser als Violine synthetisiert. Die gespielten Saiten leuchten und schwingen im 3D-Modell.</p>
				<button class="btn-gold w-full" onclick={() => (audio.playing ? stopMelody() : playMelody())}>
					<Icon name={audio.playing ? 'stop' : 'play'} size={16} />
					{audio.playing ? 'Stoppen' : 'Melodie abspielen'}
				</button>
				<div class="mt-3 h-1 overflow-hidden rounded-full bg-ink-600" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={audio.total ? Math.round(((audio.index + 1) / audio.total) * 100) : 0}>
					<div class="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300 transition-[width] duration-200" style:width="{audio.playing && audio.total ? ((audio.index + 1) / audio.total) * 100 : 0}%"></div>
				</div>
				{#if audio.error}<p class="mt-2 text-xs text-red-300">{audio.error}</p>{/if}
			</Section>

			<Section title="Saiten anspielen">
				<div class="grid grid-cols-4 gap-2">
					{#each strings as st (st.id)}
						<button class="btn-ghost flex-col !gap-0 !py-3" onclick={() => playString(st.id)} aria-label="Saite {st.id} anspielen">
							<span class="font-display text-2xl text-gold-300">{st.id}</span>
							<span class="text-[0.65rem] text-cream-500">{st.note}</span>
						</button>
					{/each}
				</div>
			</Section>

			<Section title="Tempo" value="{audio.bpm} BPM">
				<Slider label="Tempo" min={60} max={140} step={1} value={audio.bpm} oninput={(v) => (audio.bpm = v)} left="Langsam" right="Schnell" />
				<p class="mt-2 text-xs text-cream-500">Wirkt beim nächsten Start der Melodie.</p>
			</Section>

			<Section title="Lautstärke & Raum">
				<div class="space-y-3">
					<Slider label="Lautstärke" value={audio.volume} oninput={(v) => (audio.volume = v)} left="Leise" right="Laut" readout={Math.round(audio.volume * 100) + ' %'} />
					<Switch label="Raumhall" hint="Konzertsaal-Nachhall" checked={audio.reverb} onchange={(v) => (audio.reverb = v)} />
				</div>
			</Section>
		{:else}
			<Section title="Aktuelle Konfiguration speichern">
				<form class="flex gap-2" onsubmit={(e) => { e.preventDefault(); doSave(); }}>
					<input
						bind:value={slotName}
						maxlength="32"
						placeholder="Name (optional)"
						class="min-w-0 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-cream-100 placeholder:text-cream-500 focus:border-gold-500/60 focus:outline-none"
					/>
					<button class="btn-gold !px-4 !py-2" type="submit"><Icon name="save" size={16} /> Speichern</button>
				</form>

				{#if slots.items.length}
					<ul class="mt-4 space-y-2">
						{#each slots.items as s (s.id)}
							<li class="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2 pl-4">
								<button class="min-w-0 flex-1 text-left" onclick={() => { loadSlot(s.id); notify('„' + s.name + '“ geladen'); }}>
									<span class="block truncate text-sm font-medium text-cream-100">{s.name}</span>
									<span class="text-xs text-cream-500">{fmtDate(s.savedAt)}</span>
								</button>
								<button class="rounded-full p-2 text-cream-400 transition hover:bg-white/10 hover:text-red-300" aria-label="{s.name} löschen" onclick={() => deleteSlot(s.id)}>
									<Icon name="trash" size={16} />
								</button>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-3 text-xs text-cream-500">Noch nichts gespeichert. Konfigurationen bleiben in diesem Browser (localStorage) erhalten.</p>
				{/if}
			</Section>

			<Section title="Teilen & Exportieren">
				<div class="grid grid-cols-2 gap-2">
					<button class="btn-ghost" onclick={copyLink}><Icon name="share" size={16} /> Link kopieren</button>
					<button class="btn-ghost" onclick={screenshot}><Icon name="camera" size={16} /> Screenshot</button>
					<button
						class="btn-ghost"
						onclick={() => { downloadJSON({ app: 'violino-konfigurator', version: 1, config: $state.snapshot(config) }, `violine-${timestamp()}.json`); notify('JSON exportiert'); }}
					>
						<Icon name="download" size={16} /> JSON export
					</button>
					<button class="btn-ghost" onclick={() => fileInput.click()}><Icon name="upload" size={16} /> JSON import</button>
					<input bind:this={fileInput} type="file" accept="application/json,.json" class="hidden" onchange={importFile} />
				</div>
			</Section>

			<Section title="Zurücksetzen">
				<button class="btn-ghost w-full" onclick={() => { resetConfig(); notify('Standard wiederhergestellt'); }}>
					<Icon name="reset" size={16} /> Auf Standard zurücksetzen
				</button>
			</Section>
		{/if}
	</div>

	<!-- Zusammenfassung -->
	<footer class="border-t border-white/[0.08] bg-black/25 px-6 py-4">
		<dl class="mb-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-cream-400">
			<dt>Lack</dt><dd class="truncate text-right text-cream-200">{r.varnish.label} · {r.finish.label}</dd>
			<dt>Garnitur</dt><dd class="truncate text-right text-cream-200">{r.fittings.label}</dd>
			<dt>Wirbel / Saiten</dt><dd class="truncate text-right text-cream-200">{r.pegs.label} · {r.strings.label}</dd>
			<dt>Maße</dt><dd class="truncate text-right text-cream-200">{bodyLengthMm(config)} × {bodyWidthMm(config)} mm</dd>
		</dl>
		<div class="flex items-end justify-between">
			<div>
				<p class="text-[0.65rem] uppercase tracking-[0.18em] text-cream-500">Beispielpreis (Demo)</p>
				<p class="font-display text-3xl leading-none text-gold-300 tabular-nums">{euro(price)}</p>
			</div>
			<button class="btn-gold" onclick={() => { ui.panelTab = 'save'; notify('Tipp: Konfiguration unter „Speichern“ sichern'); }}>
				Anfragen <Icon name="arrow" size={16} />
			</button>
		</div>
	</footer>
</aside>
