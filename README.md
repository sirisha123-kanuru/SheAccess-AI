# ✦ SheAccess AI

**Her voice. Her language. Her next step.**

A voice-first AI guide that helps a first-time woman user, with no English and no tech background, reach a government scheme on her own, in her own language.

Built for the **"The Invisible Woman"** challenge at **PromptWars × HackArena** (Google for Developers, Build with AI).

🔗 **Live demo:** _add your Vercel link_
🎥 **Demo video:** _add your link_

---

## The problem

In India, 48% of girls in rural areas have never used the internet. Of those who have, most were guided by a male family member. Millions of women are locked out of digital systems, not by capability, but by design.

**Challenge:** build an AI tool that lets a woman with no English, no tech background and no one to ask independently reach one essential government service through voice or simple text in her own language, with zero prior digital knowledge.

## The solution

She taps one big mic and speaks. SheAccess AI understands her, finds the right scheme, and speaks the answer back one simple step at a time: what the scheme is, which documents to carry, and where to go.

### Features

- 🎤 **Voice in, voice out:** speech recognition and spoken answers, no typing or reading needed
- 🌐 **5 languages:** Hindi, Tamil, Telugu, Bengali and English, with the whole interface translated
- 🪜 **One step at a time:** Next step, Repeat, and "Explain simply" buttons with a progress bar
- 📚 **Verified scheme data:** National Scholarship Portal, Ayushman Bharat (PM-JAY) and Skill India (PMKVY), working even offline
- ✨ **Gemini + Google Search grounding:** handles other needs (pension, ration card, etc.) from official sources
- 🛡️ **Sakhi Safety Check:** paste a suspicious SMS or WhatsApp message and get a spoken HIGH / MEDIUM / LOW scam warning
- 👵 **Simple Mode** (`/?simple=1`): only big language buttons and one huge mic, for first-time users
- 🔠 **Large-text** accessibility toggle
- 📊 **Impact dashboard:** live charts, animated counters, AI insight cards and system status

### How a woman actually reaches it

A tool cannot start from zero, so the realistic setup is a one-time hand-over by an ASHA worker, anganwadi, self-help group or Common Service Centre (CSC): a phone with the link on its home screen, or a QR code on a poster. After that she needs only her voice.

## How it works

```
Voice → Web Speech API → text → keyword scoring → verified scheme data
                                      ↓ (no match)
                        Express / Vercel API → Gemini + Google Search
                                      ↓
        Steps on screen (React) + spoken aloud (Speech Synthesis)
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Framer Motion, Three.js (React Three Fiber), Recharts, CSS3, HTML5 Canvas |
| Voice | Web Speech API (SpeechRecognition and SpeechSynthesis) |
| Backend | Node.js, Express, Vercel Serverless Function |
| AI | Google Gemini API with Google Search grounding |
| Data | Built-in multilingual knowledge base, keyword scoring |
| Deploy | Vercel + GitHub |

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
```

Open `.env` and add your key (get one at https://aistudio.google.com/apikey):

```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

```bash
npm run dev
```

Open http://localhost:5173 in **Microsoft Edge or Chrome** and allow the microphone.
Simple Mode: http://localhost:5173/?simple=1

Check Gemini is connected: http://localhost:8787/api/chat should show `"gemini":true`.

> Works without a key too. The built-in knowledge base answers the three core schemes in all five languages.

## Deploy on Vercel

1. Push this folder to GitHub.
2. On vercel.com choose **Add New → Project** and import the repo (Vite is detected automatically).
3. Add the environment variable `GEMINI_API_KEY`.
4. Click **Deploy**. `/api/chat` runs as a serverless function automatically.

Other Node hosts (Render, Railway): build `npm install && npm run build`, start `npm start`.

## Project structure

```
api/chat.js        Gemini endpoint (Vercel function and Express)
server.js          Local / Node-host server
src/App.jsx        Page layout and sections
src/Assistant.jsx  Voice, steps, scam checker
src/Dashboard.jsx  Charts, counters, status
src/Fx.jsx         Particle background, cursor, tilt cards, magnetic buttons
src/Scene.jsx      3D hero scene
src/kb.js          Scheme data and matching (add new schemes here)
src/kb_extra.js    Telugu and Bengali scheme data
src/i18n.js        Interface text in 5 languages
```

## Troubleshooting

| Problem | Fix |
|---|---|
| Port 8787 already in use | Close the old terminal, or run `taskkill /F /IM node.exe` |
| Hindi / Tamil / Telugu / Bengali voice is silent | The device lacks that voice. Use **Edge**, or install it in Windows Settings → Time & Language → Speech. Text still shows. |
| Microphone does nothing | Allow the mic in the address bar and use Edge or Chrome over `https` |
| Gemini shows "Offline mode" | Check `GEMINI_API_KEY`, then restart the server (or redeploy on Vercel) |

## Security

Never commit your API key. Keep it only in `.env` (ignored by Git) or in Vercel environment variables. `.env.example` must contain a placeholder only.

## Limitations

- Prototype built in a hackathon: guidance only. Always verify on official `.gov.in` sites.
- Dashboard numbers are simulated demo data plus the current session.
- Voice quality depends on the browser and the voices installed on the device.
- Scheme details can change. Check the official portal before applying.

## Roadmap

- WhatsApp voice-note bot and missed-call phone line for basic phones
- More schemes and more languages (Marathi, Gujarati, Kannada, Malayalam)
- Nearest CSC / health centre finder
- Offline-first installable app (PWA)

## SDG alignment

Goal 5 (5.1, 5.b) Gender Equality · Goal 4 (4.3, 4.4) Quality Education · Goal 10 (10.2) Reduced Inequalities

---

Built with ❤️ for every woman who shouldn't need someone else to ask.
