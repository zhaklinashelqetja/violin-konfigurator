<script>
	let { name, size = 20, class: cls = '' } = $props();

	const paths = {
		rotate: 'M21 12a9 9 0 0 0-15.5-6.2L3 8 M3 3v5h5 M3 12a9 9 0 0 0 15.5 6.2L21 16 M21 21v-5h-5',
		wire: 'M21 8 12 3 3 8v8l9 5 9-5V8z M3 8l9 5 9-5 M12 13v8',
		camera: 'M4 8h3l2-3h6l2 3h3v11H4z M12 9.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
		expand: 'M4 9V4h5 M20 9V4h-5 M4 15v5h5 M20 15v5h-5',
		reset: 'M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5',
		save: 'M6 3h12v18l-6-4-6 4z',
		share: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
		download: 'M12 3v12 M7 11l5 5 5-5 M4 21h16',
		upload: 'M12 17V5 M7 9l5-5 5 5 M4 21h16',
		trash: 'M4 7h16 M9 7V4h6v3 M6 7l1 14h10l1-14',
		check: 'M5 12l4 4 10-10',
		arrow: 'M5 12h14 M13 6l6 6-6 6',
		music: 'M9 18V5l12-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
		play: 'M7 4l13 8-13 8z',
		stop: 'M6 6h12v12H6z',
		pin: 'M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
		close: 'M6 6l12 12 M18 6L6 18',
		prev: 'M15 5l-7 7 7 7',
		next: 'M9 5l7 7-7 7'
	};
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.7"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={cls}
	aria-hidden="true"
>
	{#each paths[name].split(' M') as d, i (i)}
		<path d={i === 0 ? d : 'M' + d} />
	{/each}
</svg>
