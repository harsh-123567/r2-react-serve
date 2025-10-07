/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		let key = decodeURIComponent(url.pathname.slice(1));
		if (key === '') key = 'index.html';

		let object = await env.STATIC_BUCKET.get(key);
		if (!object) object = await env.STATIC_BUCKET.get('index.html');
		if (!object) return new Response('Not Found', { status: 404 });

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);
		return new Response(object.body, { headers });
	},
};
