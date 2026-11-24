<script>
	import { fade } from 'svelte/transition';
	import { viewer } from '$lib/state/viewer.svelte.js';

	let { webgl = true } = $props();

	const percent = $derived(Math.round(Math.max(0, viewer.progress) * 100));
	const indeterminate = $derived(viewer.progress < 0);
	const visible = $derived(!webgl || viewer.status !== 'ready');
</script>

{#if visible}
	<div
		out:fade={{ duration: 500 }}
		class="stage-bg absolute inset-0 z-20 grid place-items-center"
		role="status"
		aria-live="polite"
	>
		<div class="flex w-64 flex-col items-center gap-6 text-center">
			{#if !webgl}
				<p class="font-display text-2xl text-cream-100">WebGL wird nicht unterstützt</p>
				<p class="text-sm text-cream-400">
					Bitte aktiviere die Hardwarebeschleunigung oder verwende einen aktuellen Browser (Chrome, Firefox, Safari, Edge).
				</p>
			{:else if viewer.status === 'error'}
				<p class="font-display text-2xl text-cream-100">Modell konnte nicht geladen werden</p>
				<p class="text-xs text-cream-500">{viewer.error}</p>
				<button class="btn-ghost" onclick={() => location.reload()}>Erneut versuchen</button>
			{:else}
				<svg viewBox="0 0 64 64" class="size-20 animate-float text-gold-500" aria-hidden="true">
					<path
						fill="currentColor"
						d="M32 6c-3 0-5 2-5 5 0 2 1 3 1 5-5 2-8 6-8 11 0 3 1 5 3 7-3 2-5 5-5 9 0 7 6 11 14 11s14-4 14-11c0-4-2-7-5-9 2-2 3-4 3-7 0-5-3-9-8-11 0-2 1-3 1-5 0-3-2-5-5-5z"
					/>
					<path d="M28 31c1 3 1 6 0 9M36 31c-1 3-1 6 0 9" stroke="#120f0d" stroke-width="2" stroke-linecap="round" fill="none" />
				</svg>
				<div class="w-full">
					<div class="mb-3 flex items-baseline justify-between text-sm">
						<span class="font-display text-xl text-cream-100">{viewer.progress >= 1 ? 'Wird aufbereitet' : 'Violine wird geladen'}</span>
						<span class="text-cream-400 tabular-nums">{indeterminate ? '…' : percent + ' %'}</span>
					</div>
					<div
						class="h-1 overflow-hidden rounded-full bg-ink-600"
						role="progressbar"
						aria-valuemin="0"
						aria-valuemax="100"
						aria-valuenow={indeterminate ? undefined : percent}
					>
						<div
							class="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300 transition-[width] duration-300 {indeterminate
								? 'w-1/3 animate-pulse'
								: ''}"
							style:width={indeterminate ? undefined : percent + '%'}
						></div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
