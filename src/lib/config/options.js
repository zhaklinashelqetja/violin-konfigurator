// Alle konfigurierbaren Optionen an einem Ort.
// Die Namen (Materialien, Objekte, Morph Targets) entsprechen exakt dem Blender-Modell / violin.glb.

export const MODEL_URL = '/models/violin.glb';

/** Lackfarben: `top` färbt die Fichtendecke, `back` Boden, Zargen, Hals und Schnecke (Riegelahorn). */
export const VARNISHES = [
	{ id: 'amber', label: 'Klassisch Amber', top: '#FFCB89', back: '#F1A868', price: 0 },
	{ id: 'honey', label: 'Honig', top: '#FFDDA0', back: '#F5C27A', price: 0 },
	{ id: 'natural', label: 'Natur', top: '#FFF0D6', back: '#F7DDB0', price: 0 },
	{ id: 'cherry', label: 'Kirschrot', top: '#D4553B', back: '#9E3320', price: 120 },
	{ id: 'walnut', label: 'Nussbraun', top: '#A06A3C', back: '#693A1B', price: 120 },
	{ id: 'antique', label: 'Antik-Schwarz', top: '#6B5A4E', back: '#2F2622', price: 240 },
	{ id: 'gold', label: 'Goldgelb', top: '#FFD166', back: '#EBA93A', price: 40 },
	{ id: 'mahogany', label: 'Mahagoni', top: '#B5532B', back: '#7A2F14', price: 120 },
	{ id: 'burgundy', label: 'Burgund', top: '#9A2B3C', back: '#5E1422', price: 160 },
	{ id: 'forest', label: 'Tannengrün', top: '#4F7A55', back: '#2B4A33', price: 200 },
	{ id: 'midnight', label: 'Mitternachtsblau', top: '#3D5C99', back: '#1E2F57', price: 200 },
	{ id: 'ivory', label: 'Elfenbein', top: '#FFF7E6', back: '#EFE0C2', price: 160 }
];

/** Holzart für Decke (Material "Varnish_Top"). `tex: null` = Textur aus der GLB-Datei. */
export const TOP_WOODS = [
	{ id: 'spruce', label: 'Fichte, feinjährig', tex: null, thumb: 'spruce_t', price: 0 },
	{ id: 'spruceWide', label: 'Fichte, grobjährig', tex: 'spruce_wide', thumb: 'spruce_wide_t', price: 0 },
	{ id: 'cedar', label: 'Zeder', tex: 'cedar', thumb: 'cedar_t', price: 90 }
];

/** Holzart für Boden, Zargen, Hals und Schnecke (Material "Varnish_Maple"). */
export const BACK_WOODS = [
	{ id: 'flame', label: 'Riegelahorn', tex: null, thumb: 'flame_t', price: 0 },
	{ id: 'plain', label: 'Ahorn, glatt', tex: 'maple_plain', thumb: 'maple_plain_t', price: 0 },
	{ id: 'birdseye', label: 'Vogelaugenahorn', tex: 'birdseye', thumb: 'birdseye_t', price: 150 },
	{ id: 'walnut', label: 'Nussbaum', tex: 'walnut', thumb: 'walnut_t', price: 110 }
];

export const WOOD_BASE = '/models/wood/';

/** Hintergründe der 3D-Bühne */
export const BACKGROUNDS = [
	{
		id: 'studio', label: 'Studio',
		css: 'radial-gradient(70% 60% at 50% 42%, #2c221b 0%, #17120f 55%, #0b0908 100%)',
		shot: ['#2a211b', '#0a0807'], env: 0.75, shadow: 0.55, light: false
	},
	{
		id: 'gallery', label: 'Galerie',
		css: 'radial-gradient(70% 65% at 50% 40%, #f4efe6 0%, #d9d1c3 60%, #b9afa0 100%)',
		shot: ['#f4efe6', '#b9afa0'], env: 1.0, shadow: 0.35, light: true
	},
	{
		id: 'concert', label: 'Konzertsaal',
		css: 'radial-gradient(70% 60% at 50% 40%, #6b1f2b 0%, #3a1018 55%, #14060a 100%)',
		shot: ['#5a1a25', '#14060a'], env: 0.7, shadow: 0.6, light: false
	},
	{
		id: 'night', label: 'Nachtblau',
		css: 'radial-gradient(70% 60% at 50% 40%, #1d2c4a 0%, #101a2f 55%, #060a14 100%)',
		shot: ['#1d2c4a', '#060a14'], env: 0.7, shadow: 0.6, light: false
	},
	{
		id: 'forest', label: 'Waldgrün',
		css: 'radial-gradient(70% 60% at 50% 40%, #27402f 0%, #14261b 55%, #08110b 100%)',
		shot: ['#27402f', '#08110b'], env: 0.7, shadow: 0.6, light: false
	}
];

/** Lackoberfläche */
export const FINISHES = [
	{ id: 'gloss', label: 'Hochglanz', clearcoat: 1.0, roughness: 0.22, price: 90 },
	{ id: 'satin', label: 'Seidenmatt', clearcoat: 0.35, roughness: 0.5, price: 0 },
	{ id: 'matt', label: 'Matt', clearcoat: 0.0, roughness: 0.78, price: 0 }
];

/** Griffbrett, Saitenhalter, Kinnhalter, Sattel, Untersattel – alle im Material "Ebony" */
export const FITTINGS = [
	{ id: 'ebony', label: 'Ebenholz', color: '#0e0d0c', roughness: 0.3, clearcoat: 0.3, price: 0, swatch: '#1a1715' },
	{ id: 'rosewood', label: 'Palisander', color: '#5a2c1c', roughness: 0.42, clearcoat: 0.1, price: 60, swatch: '#5a2c1c' },
	{ id: 'boxwood', label: 'Buchsbaum', color: '#d6a45e', roughness: 0.4, clearcoat: 0.1, price: 80, swatch: '#d6a45e' },
	{ id: 'walnut', label: 'Nussbaum', color: '#4a2f1d', roughness: 0.4, clearcoat: 0.15, price: 70, swatch: '#4a2f1d' },
	{ id: 'maple', label: 'Ahorn', color: '#e8c690', roughness: 0.4, clearcoat: 0.1, price: 50, swatch: '#e8c690' }
];

/** Wirbel – Material "Pegs" */
export const PEGS = [
	{ id: 'ebony', label: 'Ebenholz', color: '#0f0d0c', metalness: 0.0, roughness: 0.3, price: 0, swatch: '#1a1715' },
	{ id: 'rosewood', label: 'Palisander', color: '#5a2c1c', metalness: 0.0, roughness: 0.42, price: 40, swatch: '#5a2c1c' },
	{ id: 'boxwood', label: 'Buchsbaum', color: '#d6a45e', metalness: 0.0, roughness: 0.4, price: 50, swatch: '#d6a45e' },
	{ id: 'gold', label: 'Gold', color: '#d9a640', metalness: 1.0, roughness: 0.25, price: 140, swatch: '#d9a640' },
	{ id: 'silver', label: 'Silber', color: '#d4d6dc', metalness: 1.0, roughness: 0.2, price: 110, swatch: '#d4d6dc' },
	{ id: 'walnut', label: 'Nussbaum', color: '#4a2f1d', metalness: 0.0, roughness: 0.4, price: 45, swatch: '#4a2f1d' }
];

/** Saiten G – D – A – E */
export const STRINGS = [
	{
		id: 'classic', label: 'Klassisch', price: 0, swatch: '#c9c9cf',
		colors: { G: '#9a2a22', D: '#b9b9c0', A: '#d2d2d8', E: '#ececf0' }, metalness: 1.0, roughness: 0.25
	},
	{
		id: 'gold', label: 'Gold', price: 35, swatch: '#d9a640',
		colors: { G: '#d9a640', D: '#d9a640', A: '#d9a640', E: '#e8c06a' }, metalness: 1.0, roughness: 0.22
	},
	{
		id: 'black', label: 'Schwarz', price: 25, swatch: '#222226',
		colors: { G: '#1d1d20', D: '#1d1d20', A: '#1d1d20', E: '#2b2b30' }, metalness: 0.6, roughness: 0.4
	}
];

/** Feinstimmer: Index 1–4 entspricht G, D, A, E */
export const TUNERS = [
	{ id: 'none', label: 'Keine', visible: [], price: 0 },
	{ id: 'e', label: 'Nur E', visible: [4], price: 20 },
	{ id: 'all', label: 'Alle 4', visible: [1, 2, 3, 4], price: 55 }
];

/** Kameraperspektiven (three.js-Koordinaten: Y oben, Violine liegt entlang -Z) */
export const CAMERA_PRESETS = [
	{ id: 'overview', label: 'Gesamt', position: [0.53, 0.42, 0.17], target: [-0.016, -0.02, -0.225] },
	{ id: 'top', label: 'Decke', position: [0.0, 0.78, -0.24], target: [0, 0.0, -0.27] },
	{ id: 'bridge', label: 'Steg', position: [0.2, 0.2, 0.06], target: [0, 0.04, -0.15] },
	{ id: 'scroll', label: 'Schnecke', position: [0.2, 0.11, -0.69], target: [0, 0.03, -0.5] },
	{ id: 'back', label: 'Rückseite', position: [0.3, -0.55, -0.1], target: [0, 0.0, -0.27] }
];

export const BASE_PRICE = 890;

export const DEFAULT_CONFIG = {
	topWood: 'spruce',
	backWood: 'flame',
	varnish: 'amber', // id aus VARNISHES oder 'custom'
	customColor: '#c8793a',
	finish: 'gloss',
	fittings: 'ebony',
	pegs: 'ebony',
	strings: 'classic',
	tuners: 'all',
	chinrest: true,
	size: 0, // Morph Target "Size_3_4": 0 = 4/4, 1 = 3/4
	width: 0 // Morph Target "Body_Wider"
};

const byId = (list, id) => list.find((o) => o.id === id);
const clamp01 = (n) => Math.min(1, Math.max(0, Number.isFinite(+n) ? +n : 0));

/** Macht aus beliebigem (z. B. aus localStorage geladenem) Input eine gültige Konfiguration. */
export function normalizeConfig(input) {
	const c = { ...DEFAULT_CONFIG, ...(input && typeof input === 'object' ? input : {}) };
	if (!byId(TOP_WOODS, c.topWood)) c.topWood = DEFAULT_CONFIG.topWood;
	if (!byId(BACK_WOODS, c.backWood)) c.backWood = DEFAULT_CONFIG.backWood;
	if (c.varnish !== 'custom' && !byId(VARNISHES, c.varnish)) c.varnish = DEFAULT_CONFIG.varnish;
	if (!/^#[0-9a-f]{6}$/i.test(c.customColor)) c.customColor = DEFAULT_CONFIG.customColor;
	if (!byId(FINISHES, c.finish)) c.finish = DEFAULT_CONFIG.finish;
	if (!byId(FITTINGS, c.fittings)) c.fittings = DEFAULT_CONFIG.fittings;
	if (!byId(PEGS, c.pegs)) c.pegs = DEFAULT_CONFIG.pegs;
	if (!byId(STRINGS, c.strings)) c.strings = DEFAULT_CONFIG.strings;
	if (!byId(TUNERS, c.tuners)) c.tuners = DEFAULT_CONFIG.tuners;
	c.chinrest = Boolean(c.chinrest);
	c.size = clamp01(c.size);
	c.width = clamp01(c.width);
	return c;
}

/** Dunkelt eine Hex-Farbe ab (für die Rückseite bei eigener Lackfarbe). */
export function shade(hex, factor) {
	const n = parseInt(hex.slice(1), 16);
	const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
		Math.round(Math.min(255, Math.max(0, v * factor)))
	);
	return '#' + ch.map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function resolveVarnish(c) {
	if (c.varnish === 'custom') {
		return { id: 'custom', label: 'Eigene Farbe', top: c.customColor, back: shade(c.customColor, 0.82), price: 150 };
	}
	return byId(VARNISHES, c.varnish);
}

export function resolveAll(c) {
	return {
		varnish: resolveVarnish(c),
		topWood: byId(TOP_WOODS, c.topWood),
		backWood: byId(BACK_WOODS, c.backWood),
		finish: byId(FINISHES, c.finish),
		fittings: byId(FITTINGS, c.fittings),
		pegs: byId(PEGS, c.pegs),
		strings: byId(STRINGS, c.strings),
		tuners: byId(TUNERS, c.tuners)
	};
}

/** Beispielpreis (Demo, kein Angebot). */
export function calcPrice(c) {
	const r = resolveAll(c);
	let sum = BASE_PRICE;
	for (const key of ['varnish', 'topWood', 'backWood', 'finish', 'fittings', 'pegs', 'strings', 'tuners']) sum += r[key].price;
	if (c.chinrest) sum += 45;
	if (c.size > 0.5) sum -= 60;
	if (c.width > 0.05) sum += 70;
	return sum;
}

/** Körperlänge in mm (4/4 = 355 mm, Morph Target skaliert um 6,5 %). */
export const bodyLengthMm = (c) => Math.round(355 * (1 - 0.065 * c.size));
export const bodyWidthMm = (c) => Math.round(208 * (1 + 0.07 * c.width) * (1 - 0.065 * c.size));

/** Fertige Designs (setzen mehrere Optionen auf einmal). */
export const PRESETS = [
	{
		id: 'classic', label: 'Klassisch', note: 'Amber, Riegelahorn, Ebenholz',
		swatch: 'linear-gradient(135deg,#FFCB89,#F1A868)',
		config: { topWood: 'spruce', backWood: 'flame', varnish: 'amber', finish: 'gloss', fittings: 'ebony', pegs: 'ebony', strings: 'classic', tuners: 'all', chinrest: true }
	},
	{
		id: 'modern', label: 'Modern', note: 'Schwarz-Antik, Gold, schwarze Saiten',
		swatch: 'linear-gradient(135deg,#6B5A4E,#2F2622)',
		config: { topWood: 'spruceWide', backWood: 'plain', varnish: 'antique', finish: 'satin', fittings: 'ebony', pegs: 'gold', strings: 'black', tuners: 'e', chinrest: true }
	},
	{
		id: 'baroque', label: 'Barock', note: 'Mahagoni, Buchsbaum, ohne Kinnhalter',
		swatch: 'linear-gradient(135deg,#B5532B,#7A2F14)',
		config: { topWood: 'spruce', backWood: 'birdseye', varnish: 'mahogany', finish: 'satin', fittings: 'boxwood', pegs: 'boxwood', strings: 'gold', tuners: 'none', chinrest: false }
	},
	{
		id: 'ocean', label: 'Mitternacht', note: 'Blau, Silber, Hochglanz',
		swatch: 'linear-gradient(135deg,#3D5C99,#1E2F57)',
		config: { topWood: 'cedar', backWood: 'plain', varnish: 'midnight', finish: 'gloss', fittings: 'ebony', pegs: 'silver', strings: 'classic', tuners: 'all', chinrest: true }
	}
];

/**
 * Hotspots. `pos` = Position im Modell (three.js-Koordinaten), `normal` = Richtung, aus der der Punkt sichtbar ist,
 * `view` = Kamerapreset, der beim Klick angesteuert wird.
 */
export const HOTSPOTS = [
	{
		id: 'top', title: 'Decke aus Fichte', pos: [0.065, 0.04, -0.06], normal: [0, 1, 0], view: 'top',
		text: 'Die gewölbte Decke ist das „Klangblech“ der Geige. Feinjährige Fichte schwingt leicht und überträgt die Saitenschwingung als Klang in den Raum.'
	},
	{
		id: 'fhole', title: 'F-Löcher', pos: [0.046, 0.039, -0.146], normal: [0, 1, 0], view: 'bridge',
		text: 'Durch die F-Löcher kann die Decke frei schwingen und Luft aus dem Korpus entweichen. In Blender per Boolean-Modifier ausgeschnitten.'
	},
	{
		id: 'bridge', title: 'Steg', pos: [0, 0.084, -0.145], normal: [0, 0.7, 0.7], view: 'bridge',
		text: 'Der Steg trägt die Saiten und gibt ihre Schwingung an die Decke weiter. Seine Ausschnitte formen den Klang.'
	},
	{
		id: 'chinrest', title: 'Kinnhalter', pos: [-0.06, 0.06, -0.062], normal: [0, 1, 0], view: 'top', requires: 'chinrest',
		text: 'Ebenholz-Kinnhalter mit Klammer. Im Konfigurator kannst du ihn ein- und ausblenden.'
	},
	{
		id: 'pegs', title: 'Wirbel', pos: [0.022, 0.03, -0.503], normal: [1, 0.4, 0], view: 'scroll',
		text: 'Mit den Wirbeln stimmst du die Saiten. Holz oder Metall: Das Material kannst du im Design-Tab ändern.'
	},
	{
		id: 'scroll', title: 'Schnecke', pos: [0, 0.046, -0.545], normal: [0, 1, -0.3], view: 'scroll',
		text: 'Die Schnecke ist die handwerkliche Signatur des Geigenbauers. Hier als Spirale modelliert, aus Ahorn mit eigener Holztextur.'
	},
	{
		id: 'back', title: 'Boden & Zargen', pos: [0, -0.018, -0.2], normal: [0, -1, 0], view: 'back',
		text: 'Boden und Zargen bestehen aus Ahorn. Riegelahorn zeigt die typische Flammung, die sich im Licht bewegt.'
	}
];
