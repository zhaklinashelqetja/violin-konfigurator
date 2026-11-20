# Atelier Violino – 3D-Konfigurator

Schulprojekt „3D-Konfigurator für ein Musikinstrument“: eine in Blender modellierte Violine, im Browser mit
SvelteKit, Threlte (three.js / WebGL) und Tailwind CSS konfigurierbar.

## Features
- Svelte-Komponente `Konfigurator` mit Zoom, Rotation und 5 Kamera-Perspektiven (animierte Kamerafahrt)
- Konfigurierbar: Lackfarbe (inkl. eigene Farbe), Lackoberfläche, Garnitur-Holz, Wirbel, Saiten,
  Kinnhalter, Feinstimmer
- **Geometrie ändert sich** über Morph Targets: Größe 4/4 → 3/4 und Korpusbreite
- Ladeanzeige mit Fortschritt, WebGL-Check, Wireframe, Vollbild, Auto-Rotation
- localStorage: Konfiguration, gespeicherte Varianten, UI-Zustand
- Blob: Screenshot (PNG) und JSON-Export/-Import, Teilen per Link
- Renderings (Blender) in einer Galerie
- **Hotspots** am Modell (Decke, F-Löcher, Steg, Kinnhalter, Wirbel, Schnecke, Boden) mit Infokarte, Kamerafahrt und Rundgang
- **Holzarten**: 3 für die Decke, 4 für Boden/Hals (echte Texturwechsel), 12 Lackfarben + eigene Farbe, 5 Garnitur-Hölzer
- **Hintergrund-Auswahl**: Studio, Galerie, Konzertsaal, Nachtblau, Waldgrün (wirkt auch auf Beleuchtung und Screenshot)
- **Fertige Designs** (Klassisch, Modern, Barock, Mitternacht) mit einem Klick
- **Klang**: Violine per Web Audio API synthetisiert, spielt „Ode an die Freude“, Leersaiten G-D-A-E anspielbar;
  die gespielten Saiten leuchten und schwingen im 3D-Modell

## Dateistruktur
```
├── Violine.blend                 Blender-Datei
├── static/
│   ├── models/violin.glb         exportiertes Modell
│   ├── models/wood/              Holztexturen (jpg)
│   └── renders/                  Hero + 3 Renderings (jpg + webp)
├── src/
│   ├── app.html, app.css         Tailwind-Theme, Basis-Styles
│   ├── routes/                   +layout.svelte, +page.svelte
│   └── lib/
│       ├── components/
│       │   ├── Konfigurator.svelte   <- die geforderte Komponente
│       │   ├── viewer/           Viewer, Scene, Stage, Violin (Threlte)
│       │   ├── ui/               ConfigPanel, LoadingOverlay, Swatches, Slider ...
│       │   └── site/             Header, Hero, Gallery, TechStack, Footer
│       ├── audio/violin.js       Violin-Synthesizer (Web Audio)
│       ├── config/options.js     alle Optionen, Hotspots, Designs, Preise
│       ├── state/                Svelte-5-Runes-State (config, viewer, audio, toast)
│       └── utils/                storage, files (Blob), webgl
├── svelte.config.js, vite.config.js, vercel.json
```

## Lokal starten
```bash
npm install
npm run dev
```

## GitHub
```bash
git init
git add .
git commit -m "3D-Konfigurator Violine"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/violino-konfigurator.git
git push -u origin main
```

## Vercel
1. Auf vercel.com einloggen → **Add New → Project** → GitHub-Repo auswählen.
2. Framework wird als SvelteKit erkannt, nichts ändern → **Deploy**.
3. Die URL ist dein Website-Link für die Abgabe.
