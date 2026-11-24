// Datei-Downloads per Blob + Object-URL (kein Server nötig).

export function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	// URL erst nach dem Klick freigeben
	setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadJSON(data, filename) {
	downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), filename);
}

export const timestamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

/** Liest eine vom Nutzer gewählte JSON-Datei. */
export async function readJSONFile(file) {
	const text = await file.text();
	return JSON.parse(text);
}

/** Konfiguration ↔ URL-Parameter (für "Link teilen"). */
export function encodeConfig(config) {
	const json = JSON.stringify(config);
	return btoa(String.fromCharCode(...new TextEncoder().encode(json)));
}

export function decodeConfig(str) {
	try {
		const bytes = Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
		return JSON.parse(new TextDecoder().decode(bytes));
	} catch {
		return null;
	}
}
