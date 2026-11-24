// Kleine, fehlertolerante Wrapper um localStorage.
// localStorage kann fehlen oder werfen (privater Modus, blockierte Cookies) – die App läuft dann einfach ohne.

import { browser } from '$app/environment';

export function readJSON(key, fallback = null) {
	if (!browser) return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

export function writeJSON(key, value) {
	if (!browser) return false;
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch {
		return false;
	}
}

export function removeKey(key) {
	if (!browser) return;
	try {
		localStorage.removeItem(key);
	} catch {
		/* ignorieren */
	}
}
