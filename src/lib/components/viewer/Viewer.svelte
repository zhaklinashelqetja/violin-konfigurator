<script>
	// Threlte-Canvas mit transparentem WebGL-Renderer (der Hintergrund kommt per CSS).
	import { Canvas } from '@threlte/core';
	import { WebGLRenderer } from 'three';
	import Scene from './Scene.svelte';

	const createRenderer = (canvas) =>
		new WebGLRenderer({
			canvas,
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
</script>

<Canvas {createRenderer} dpr={Math.min(globalThis.devicePixelRatio ?? 1, 2)} shadows={false}>
	<Scene />
</Canvas>
