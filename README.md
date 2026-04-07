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
SUPERPEN_JWT_SECRET=superpen-dev-secret
SUPERPEN_JWT_ISSUER=superpen-release-server
```

## Netlify deployment

Set these environment variables in Netlify before building:

```env
NEXT_PUBLIC_SUPERPEN_API_BASE_URL=https://candid-fairy-ad0116.netlify.app
SUPERPEN_API_BASE_URL=https://candid-fairy-ad0116.netlify.app
SUPERPEN_API_USERNAME=admin
SUPERPEN_API_PASSWORD=change-me
SUPERPEN_JWT_SECRET=your-shared-jwt-secret
SUPERPEN_JWT_ISSUER=superpen-release-server
```

You can also start from `.env.netlify.example`.

- `NEXT_PUBLIC_SUPERPEN_API_BASE_URL` is used by client-side public requests.
- `SUPERPEN_API_BASE_URL` is used by server-side code and route handlers.
- `SUPERPEN_API_USERNAME` and `SUPERPEN_API_PASSWORD` stay server-side only and are used for internal proxy routes.
- `SUPERPEN_JWT_SECRET` and `SUPERPEN_JWT_ISSUER` must match the release server so Next.js middleware can validate the admin JWT before allowing `/admin` access.
- The admin panel now signs in through Next.js route handlers and stores the release-server JWT in an HTTP-only cookie instead of `localStorage`.
- The app trims trailing slashes automatically, so either `https://...app` or `https://...app/` works.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.
