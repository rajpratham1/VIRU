# VIRU Web App

This repo can run as a single web app using the root `client` and `server` folders.

## Local development

From the repo root:

```bash
npm run dev:local
```

This starts:

- Frontend on `http://localhost:5173`
- Backend on `http://localhost:5000`

The Vite dev server proxies `/api` requests to the backend automatically.

## Production-style local run

Build both apps:

```bash
npm run build:web
```

Start the web app:

```bash
npm run start:web
```

The backend serves the built React app and the API from the same origin on `http://localhost:5000`.

## Environment variables

Frontend:

- `VITE_API_URL`: Optional explicit API base URL. Leave empty to use same-origin `/api`.
- `VITE_DEV_API_URL`: Dev proxy target. Defaults to `http://localhost:5000`.

Backend:

- `PORT`: Server port. Default `5000`.
- `AI_MODEL_URL`: Ollama or compatible API endpoint.
- `DATABASE_URL`: Prisma database URL.
- `WORKSPACE_ROOT`: Base folder VIRU can operate on.

## Notes

- `landing-page/` is separate and not required for the app itself.
- For hosted deployment, make sure the backend can access `client/dist`.
