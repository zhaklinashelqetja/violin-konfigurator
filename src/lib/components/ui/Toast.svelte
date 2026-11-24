<script>
	import { fly } from 'svelte/transition';
	import { toast } from '$lib/state/toast.svelte.js';
</script>

<div class="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" aria-live="polite" role="status">
	{#key toast.id}
		{#if toast.message}
			<div
				transition:fly={{ y: 16, duration: 220 }}
				class="glass rounded-full px-5 py-2.5 text-sm font-medium text-cream-100 shadow-2xl"
			>
				{toast.message}
			</div>
		{/if}
	{/key}
</div>
