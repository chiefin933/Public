# BookItNow — Fresh Scaffold# Public (BookItNow demo)



This repository was reset and initialized with a minimal scaffold.This repository contains a small front-end demo landing page for "BookItNow" and a tiny Node/Express backend for storing demo bookings.



Files:Front-end: `index.html`, `styles.css`

- `index.html` — simple landing pageBackend: `server.js`, `bookings.json` (filesystem persistence)

- `styles.css` — basic styling

- `server.js` — minimal Express server stubQuick start (backend):

- `package.json` — start script

1. Install dependencies:

To run the server locally:

```bash

```bashcd /home/johnte/Public

cd /home/johnte/Publicnpm install

npm install```

npm start

```2. Start the server:



To serve the front-end static files while developing:```bash

npm start

```bash# or: node server.js

# from the project root```

python3 -m http.server 8080

# then open http://localhost:8080The server listens on http://localhost:3000 and exposes:

```- GET  /api/bookings

- POST /api/bookings

A backup of the previous project was created at `/home/johnte/Public-backup-20251029-070946.tar.gz`.

To test the frontend reliably (so browser fetches work), serve the static files as well (for example with Python's built-in server):

```bash
# from the Public folder
python3 -m http.server 8080
# then open http://localhost:8080 in your browser
```

The front-end booking form will attempt to POST to `/api/bookings`. If the backend is not reachable, the UI falls back to storing bookings in `localStorage` so the demo still works offline.

Notes:
- This is a demo only. `bookings.json` is a simple file used for local persistence — not for production use.
- To reset stored bookings, stop the server and edit or remove `bookings.json`.
