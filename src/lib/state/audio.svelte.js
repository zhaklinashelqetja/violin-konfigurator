// Audio-Zustand für die Oberfläche. Der Synthesizer wird erst bei der ersten Interaktion geladen
// (Code-Splitting + Browser-Regel: Audio darf erst nach Klick starten).

import { browser } from '$app/environment';
import { readJSON, writeJSON } from '$lib/utils/storage.js';

const KEY = 'violino:audio:v1';
const saved = readJSON(KEY, {}) ?? {};

export const audio = $state({
	playing: false,
	index: -1,
	total: 0,
	bpm: Math.min(140, Math.max(60, Number(saved.bpm) || 92)),
	volume: Math.min(1, Math.max(0, Number(saved.volume ?? 0.7))),
	reverb: saved.reverb ?? true,
	error: ''
});

/** Leuchten/Vibrieren der Saiten (0–1), pro Frame in der 3D-Szene abgebaut. Bewusst kein $state. */
export const pulse = { G: 0, D: 0, A: 0, E: 0 };

let synth = null;
let lib = null;

async function load() {
	if (!lib) lib = await import('$lib/audio/violin.js');
	if (!synth) synth = new lib.ViolinSynth();
	synth.ensure();
	synth.setVolume(audio.volume);
	synth.setReverb(audio.reverb);
	return synth;
}

if (browser) {
	$effect.root(() => {
		$effect(() => writeJSON(KEY, { bpm: audio.bpm, volume: audio.volume, reverb: audio.reverb }));
		$effect(() => synth?.setVolume(audio.volume));
		$effect(() => synth?.setReverb(audio.reverb));
	});
}

export async function playMelody() {
	try {
		const s = await load();
		const seq = lib.ODE_AN_DIE_FREUDE;
		audio.total = seq.length;
		audio.index = -1;
		audio.playing = true;
		audio.error = '';
		s.play(seq, audio.bpm, {
			onNote: (i, midi) => {
				audio.index = i;
				pulse[lib.stringForMidi(midi)] = 1;
			},
			onEnd: () => {
				audio.playing = false;
				audio.index = -1;
			}
		});
	} catch (e) {
		audio.playing = false;
		audio.error = e?.message ?? 'Audio nicht verfügbar';
	}
}

export function stopMelody() {
	synth?.stop();
	audio.playing = false;
	audio.index = -1;
}

export async function playString(id) {
	try {
		const s = await load();
		const str = lib.OPEN_STRINGS.find((x) => x.id === id);
		if (!str) return;
		s.pluck(str.midi);
		pulse[id] = 1;
	} catch (e) {
		audio.error = e?.message ?? 'Audio nicht verfügbar';
	}
}
