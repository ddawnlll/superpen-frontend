# SuperPen Frontend

## Environment variables

Copy `.env.example` to `.env.local` for local development.

```bash
cp .env.example .env.local
```

Local defaults:

```env
NEXT_PUBLIC_SUPERPEN_API_BASE_URL=http://127.0.0.1:8787
SUPERPEN_API_BASE_URL=http://127.0.0.1:8787
SUPERPEN_API_USERNAME=admin
SUPERPEN_API_PASSWORD=change-me
```

## Netlify deployment

Set these environment variables in Netlify before building:

```env
NEXT_PUBLIC_SUPERPEN_API_BASE_URL=https://candid-fairy-ad0116.netlify.app
SUPERPEN_API_BASE_URL=https://candid-fairy-ad0116.netlify.app
SUPERPEN_API_USERNAME=admin
SUPERPEN_API_PASSWORD=change-me
```

You can also start from `.env.netlify.example`.

- `NEXT_PUBLIC_SUPERPEN_API_BASE_URL` is used by client-side code.
- `SUPERPEN_API_BASE_URL` is used by server-side code and route handlers.
- The app trims trailing slashes automatically, so either `https://...app` or `https://...app/` works.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.
