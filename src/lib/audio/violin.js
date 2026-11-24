// Violin-Synthesizer mit der Web Audio API – kein Audiofile nötig.
// Klang: zwei leicht verstimmte Sägezahn-Oszillatoren (Streichanregung), Vibrato mit verzögertem Einsatz,
// Tiefpass + Körperresonanzen (Peaking-Filter) und ein generierter Raumhall.

export const OPEN_STRINGS = [
	{ id: 'G', midi: 55, name: 'G3' },
	{ id: 'D', midi: 62, name: 'D4' },
	{ id: 'A', midi: 69, name: 'A4' },
	{ id: 'E', midi: 76, name: 'E5' }
];

export const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

/** Auf welcher Saite wird ein Ton gespielt? (höchste Leersaite, die nicht über dem Ton liegt) */
export function stringForMidi(midi) {
	return midi >= 76 ? 'E' : midi >= 69 ? 'A' : midi >= 62 ? 'D' : 'G';
}

/** „Ode an die Freude“ (L. v. Beethoven, gemeinfrei) in D-Dur. [MIDI-Ton, Schläge] */
export const ODE_AN_DIE_FREUDE = (() => {
	const line1 = [[66, 1], [66, 1], [67, 1], [69, 1], [69, 1], [67, 1], [66, 1], [64, 1], [62, 1], [62, 1], [64, 1], [66, 1], [66, 1.5], [64, 0.5], [64, 2]];
	const line2 = [[66, 1], [66, 1], [67, 1], [69, 1], [69, 1], [67, 1], [66, 1], [64, 1], [62, 1], [62, 1], [64, 1], [66, 1], [64, 1.5], [62, 0.5], [62, 2]];
	const line3 = [[64, 1], [64, 1], [66, 1], [62, 1], [64, 1], [66, 0.5], [67, 0.5], [66, 1], [62, 1], [64, 1], [66, 0.5], [67, 0.5], [66, 1], [64, 1], [62, 1], [64, 1], [57, 2]];
	return [...line1, ...line2, ...line3, ...line2];
})();

function makeImpulse(ctx, seconds = 1.9, decay = 2.6) {
	const len = Math.floor(ctx.sampleRate * seconds);
	const buf = ctx.createBuffer(2, len, ctx.sampleRate);
	for (let c = 0; c < 2; c++) {
		const d = buf.getChannelData(c);
		for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
	}
	return buf;
}

export class ViolinSynth {
	ctx = null;
	out = null; // Master-Gain
	dry = null;
	wet = null;
	buses = new Set();
	timers = [];

	ensure() {
		if (!this.ctx) {
			const AC = window.AudioContext || window.webkitAudioContext;
			if (!AC) throw new Error('Web Audio wird nicht unterstützt');
			this.ctx = new AC();
			this.out = this.ctx.createGain();
			this.out.gain.value = 0.7;
			const comp = this.ctx.createDynamicsCompressor();
			this.dry = this.ctx.createGain();
			this.wet = this.ctx.createGain();
			this.wet.gain.value = 0.35;
			const verb = this.ctx.createConvolver();
			verb.buffer = makeImpulse(this.ctx);
			this.out.connect(this.dry).connect(comp);
			this.out.connect(verb).connect(this.wet).connect(comp);
			comp.connect(this.ctx.destination);
		}
		if (this.ctx.state === 'suspended') this.ctx.resume();
		return this.ctx;
	}

	setVolume(v) {
		if (this.out) this.out.gain.setTargetAtTime(v, this.ctx.currentTime, 0.03);
	}
	setReverb(on) {
		if (this.wet) this.wet.gain.setTargetAtTime(on ? 0.35 : 0, this.ctx.currentTime, 0.05);
	}

	newBus() {
		const bus = this.ctx.createGain();
		bus.connect(this.out);
		this.buses.add(bus);
		return bus;
	}

	/** Ein einzelner gestrichener Ton. `at` = Startzeit im AudioContext. */
	voice(bus, midi, at, dur) {
		const ctx = this.ctx;
		const f = hz(midi);
		const end = at + dur;
		const mix = ctx.createGain();
		mix.gain.value = 0.16;

		const oscs = [0, 8].map((cents) => {
			const o = ctx.createOscillator();
			o.type = 'sawtooth';
			o.frequency.value = f;
			o.detune.value = cents - 4;
			o.connect(mix);
			return o;
		});

		// Vibrato: setzt erst nach ca. 0,25 s ein, wie bei einem echten Geiger
		const lfo = ctx.createOscillator();
		lfo.frequency.value = 5.3;
		const depth = ctx.createGain();
		depth.gain.setValueAtTime(0, at);
		depth.gain.linearRampToValueAtTime(f * 0.0055, at + Math.min(0.5, dur));
		lfo.connect(depth);
		oscs.forEach((o) => depth.connect(o.frequency));

		const lp = ctx.createBiquadFilter();
		lp.type = 'lowpass';
		lp.frequency.value = Math.min(5200, Math.max(1800, f * 6));
		lp.Q.value = 0.6;
		const body1 = ctx.createBiquadFilter(); // Hauptresonanz des Korpus
		body1.type = 'peaking'; body1.frequency.value = 280; body1.gain.value = 5; body1.Q.value = 1.2;
		const body2 = ctx.createBiquadFilter(); // Brillanz
		body2.type = 'peaking'; body2.frequency.value = 2600; body2.gain.value = 4; body2.Q.value = 0.9;

		const env = ctx.createGain();
		env.gain.setValueAtTime(0.0001, at);
		env.gain.exponentialRampToValueAtTime(1, at + 0.07); // Bogenansatz
		env.gain.setTargetAtTime(0.8, at + 0.09, 0.15);
		env.gain.setTargetAtTime(0.0001, end - 0.03, 0.08); // Abstrich

		mix.connect(lp).connect(body1).connect(body2).connect(env).connect(bus);
		[...oscs, lfo].forEach((n) => { n.start(at); n.stop(end + 0.5); });
	}

	/** Einzelton, z. B. beim Anspielen einer Leersaite. */
	pluck(midi, dur = 1.4) {
		const ctx = this.ensure();
		const bus = this.newBus();
		this.voice(bus, midi, ctx.currentTime + 0.02, dur);
		setTimeout(() => this.dropBus(bus), (dur + 0.8) * 1000);
	}

	/**
	 * Spielt eine Melodie. Die Töne werden exakt auf der Audio-Uhr geplant,
	 * onNote(index, midi) wird für die Oberfläche (Saitenleuchten, Fortschritt) zeitgleich aufgerufen.
	 */
	play(seq, bpm, { onNote, onEnd } = {}) {
		const ctx = this.ensure();
		this.stop();
		const bus = this.newBus();
		const beat = 60 / bpm;
		let t = ctx.currentTime + 0.12;
		const t0 = t;
		seq.forEach(([midi, beats], i) => {
			const dur = beats * beat;
			this.voice(bus, midi, t, dur * 0.98);
			this.timers.push(setTimeout(() => onNote?.(i, midi), (t - ctx.currentTime) * 1000));
			t += dur;
		});
		this.timers.push(setTimeout(() => onEnd?.(), (t - ctx.currentTime) * 1000 + 250));
		return t - t0;
	}

	stop() {
		this.timers.forEach(clearTimeout);
		this.timers = [];
		for (const bus of this.buses) this.dropBus(bus, 0.08);
	}

	dropBus(bus, fade = 0.02) {
		if (!this.buses.has(bus)) return;
		this.buses.delete(bus);
		bus.gain.setTargetAtTime(0, this.ctx.currentTime, fade);
		setTimeout(() => bus.disconnect(), 400);
	}
}
