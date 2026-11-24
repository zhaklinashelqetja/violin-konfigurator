// Zentraler, reaktiver Zustand (Svelte 5 Runes) mit automatischer Speicherung in localStorage.

import { browser } from '$app/environment';
import { DEFAULT_CONFIG, normalizeConfig } from '$lib/config/options.js';
import { readJSON, writeJSON, removeKey } from '$lib/utils/storage.js';
import { decodeConfig, encodeConfig } from '$lib/utils/files.js';

const KEY_CONFIG = 'violino:config:v1';
const KEY_SLOTS = 'violino:slots:v1';
const KEY_UI = 'violino:ui:v1';

/** Startkonfiguration: 1. Link-Parameter ?c=…, 2. localStorage, 3. Standard */
function initialConfig() {
	if (browser) {
		const shared = new URLSearchParams(location.search).get('c');
		if (shared) {
			const decoded = decodeConfig(shared);
			if (decoded) return normalizeConfig(decoded);
		}
	}
	return normalizeConfig(readJSON(KEY_CONFIG));
}

export const config = $state(initialConfig());

export const ui = $state({
	autoRotate: false,
	wireframe: false,
	hotspots: true,
	background: 'studio',
	panelTab: 'look',
	...(readJSON(KEY_UI) ?? {})
});

export const slots = $state({ items: readJSON(KEY_SLOTS, []) });

// Automatisch speichern (nur im Browser)
if (browser) {
	$effect.root(() => {
		$effect(() => {
			writeJSON(KEY_CONFIG, $state.snapshot(config));
		});
		$effect(() => {
			writeJSON(KEY_UI, { autoRotate: ui.autoRotate, panelTab: ui.panelTab, hotspots: ui.hotspots, background: ui.background });
		});
		$effect(() => {
			writeJSON(KEY_SLOTS, $state.snapshot(slots.items));
		});
	});
}

export function setConfig(next) {
	Object.assign(config, normalizeConfig(next));
}

export function applyPreset(preset) {
	setConfig({ ...$state.snapshot(config), ...preset.config });
}

export function resetConfig() {
	Object.assign(config, DEFAULT_CONFIG);
	removeKey(KEY_CONFIG);
}

export function saveSlot(name) {
	const label = name?.trim() || `Konfiguration ${slots.items.length + 1}`;
	slots.items = [
		{ id: crypto.randomUUID(), name: label, savedAt: Date.now(), config: $state.snapshot(config) },
		...slots.items
	].slice(0, 12);
}

export function loadSlot(id) {
	const s = slots.items.find((x) => x.id === id);
	if (s) setConfig(s.config);
}

export function deleteSlot(id) {
	slots.items = slots.items.filter((s) => s.id !== id);
}

export function shareLink() {
	const url = new URL(location.href);
	url.search = '';
	url.hash = 'konfigurator';
	url.searchParams.set('c', encodeConfig($state.snapshot(config)));
	return url.toString();
}
