/** Prüft, ob der Browser WebGL (bevorzugt WebGL2) bereitstellt. */
export function webglSupport() {
	try {
		const canvas = document.createElement('canvas');
		const gl2 = canvas.getContext('webgl2');
		if (gl2) return { ok: true, version: 2 };
		const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		return gl ? { ok: true, version: 1 } : { ok: false, version: 0 };
	} catch {
		return { ok: false, version: 0 };
	}
}
