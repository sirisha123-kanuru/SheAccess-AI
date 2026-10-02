# SheAccess AI

Voice-first AI guide that helps a woman with no English and no tech background reach one government scheme in her own language.
React + Vite + Framer Motion + Three.js (R3F) + Recharts, with a Gemini backend (Google Search grounding).

## Run locally
```bash
npm install
cp .env.example .env      # add your GEMINI_API_KEY (https://aistudio.google.com/apikey)
npm run dev               # open http://localhost:5173
```
Works with NO key too: the built-in offline knowledge base (3 schemes in English, Hindi, Tamil) answers instead.

## Deploy on Vercel (easiest)
1. Push this folder to GitHub.
2. vercel.com → New Project → import the repo (framework: Vite is auto-detected).
3. Settings → Environment Variables → add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`).
4. Deploy. `/api/chat` runs as a serverless function automatically.

## Deploy on Render / Railway / any Node host
Build: `npm install && npm run build`   Start: `npm start`   Env: `GEMINI_API_KEY`

## Notes
- Voice uses the browser Web Speech API (best in Chrome/Edge on Android and desktop).
- Add more schemes in `src/kb.js`. Change the AI behaviour in `api/chat.js`.
- Dashboard numbers are simulated demo data plus your live session.
