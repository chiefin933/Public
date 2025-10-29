# Public (BookItNow demo)

This repository contains a small front-end demo landing page for "BookItNow" and a tiny Node/Express backend for storing demo bookings.

Front-end: `index.html`, `styles.css`
Backend: `server.js`, `bookings.json` (filesystem persistence)

Quick start (backend):

1. Install dependencies:

```bash
cd /home/johnte/Public
npm install
```

2. Start the server:

```bash
npm start
# or: node server.js
```

The server listens on http://localhost:3000 and exposes:
- GET  /api/bookings
- POST /api/bookings

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
