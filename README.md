## r2-react-serve

A minimal Cloudflare Worker that serves static files stored in an R2 bucket. The worker looks up the request path in the configured R2 bucket (binding: `STATIC_BUCKET`), falls back to `index.html` when a key is missing, and returns object HTTP metadata (including an `etag`).

This repository includes convenience scripts for local development, testing with Vitest (Cloudflare test runner), and deploying via Wrangler.

## Contents

- `src/index.js` - Worker entrypoint. Reads objects from R2 and returns them.
- `wrangler.jsonc` - Wrangler configuration (R2 bucket binding example).
- `package.json` - npm scripts: `dev`, `start`, `deploy`, `test`.
- `test/` - Vitest tests that exercise the worker using Cloudflare's test harness.

## Prerequisites

- Node.js (16+ recommended) and npm
- A Cloudflare account with an R2 bucket
- Wrangler CLI (installed globally or as a devDependency). This project already lists `wrangler` in `devDependencies`.

If you don't have Wrangler installed globally, you can run it through npm scripts (e.g. `npm run dev` uses the local `wrangler` binary).

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Configure your R2 binding in `wrangler.jsonc`:

- Replace the placeholder `bucket_name` and `preview_bucket_name` with your actual R2 bucket name.
- Make sure `binding` is `STATIC_BUCKET` or change the binding name to match the one used in `src/index.js`.

Example snippet in `wrangler.jsonc`:

```jsonc
"r2_buckets": [
  {
    "binding": "STATIC_BUCKET",
    "bucket_name": "your-r2-bucket",
    "preview_bucket_name": "your-r2-bucket"
  }
]
```

3. (Optional) Configure Wrangler credentials / account settings. Wrangler typically requires `account_id` in `wrangler.toml` or environment variables and `wrangler login` to authenticate.

## Development

Start a local Worker preview (this will proxy requests and allow local testing against your preview R2 bucket):

```bash
npm run dev
```

Open http://localhost:8787/ in a browser (or the URL shown by Wrangler). Requesting `/` will serve `index.html` from the R2 bucket by default.

## Tests

Run the project's tests (Vitest + Cloudflare test harness):

```bash
npm test
```

Tests live in `test/` and use Cloudflare's test helpers to exercise `src/index.js` in both unit and integration styles.

## Deploy

Publish the Worker using Wrangler:

```bash
npm run deploy
```

Make sure your Wrangler config has the correct account/route settings and that the R2 bucket binding in `wrangler.jsonc` matches a real bucket you own.

## How it works (short)

- The worker extracts the request path (URL pathname). If the path is empty it uses `index.html`.
- It attempts to `get()` that key from the configured R2 bucket binding `STATIC_BUCKET`.
- If the object is missing it falls back to `index.html` and returns 404 if neither is found.
- The worker forwards object HTTP metadata (content-type, cache-control, etc.) and sets `etag` from `object.httpEtag`.

## Troubleshooting

- 404 responses: Verify your R2 bucket contains `index.html` and that `wrangler.jsonc` points to the correct `bucket_name`.
- Authentication/deploy errors: run `wrangler login` and ensure `account_id` is configured per Wrangler docs.
- Local preview R2 vs production: preview buckets can be different. Ensure `preview_bucket_name` is set if you want the same content in preview.

## Contributing

Small project; open a PR or issue. Keep changes focused and add/update tests in `test/`.

## License

MIT — see LICENSE (none provided in this repo; add one if you need an explicit license).
