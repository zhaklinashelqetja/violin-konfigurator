// Brücke zwischen 3D-Szene (Threlte) und HTML-Oberfläche.
// Die Szene registriert hier ihre Funktionen, die UI ruft sie auf.

export const viewer = $state({
	status: 'loading', // 'loading' | 'ready' | 'error'
	progress: 0, // 0–1, bei unbekannter Größe -1
	error: '',
	camera: 'overview',
	/** Bildschirmpositionen der Hotspots, von der Szene pro Frame aktualisiert */
	hotspots: [],
	activeHotspot: null,
	stats: { meshes: 0, triangles: 0, materials: 0, morphs: 0 },
	/** wird von der Szene gesetzt */
	flyTo: null,
	capture: null
});

export function resetViewer() {
	viewer.status = 'loading';
	viewer.progress = 0;
	viewer.error = '';
}
