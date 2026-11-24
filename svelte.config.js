import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Vercel erkennt SvelteKit automatisch; der Adapter erzeugt das passende Build-Output
		adapter: adapter()
	}
};

export default config;
