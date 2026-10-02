// Works as a Vercel serverless function AND inside server.js (Express).
const LN = { en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', bn: 'Bengali' }

export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY
  if (req.method === 'GET') return res.status(200).json({ ok: true, gemini: !!key })
  if (!key) return res.status(503).json({ error: 'GEMINI_API_KEY not set' })
  try {
    const { message = '', lang = 'en', mode = 'help', scheme = '' } = req.body || {}
    const L = LN[lang] || 'English'
    const base = `You are "Sakhi", a kind elder sister helping a woman who has never used the internet and cannot read English. Reply ONLY in simple spoken ${L}. No English words, no jargon, very short sentences. Use Google Search to verify details from OFFICIAL Indian government sources (UMANG, india.gov.in, official scheme portals). Never ask for Aadhaar numbers, OTPs, bank details or passwords.`
    const fmt = {
      help: `Format exactly: line 1 = one short sentence naming the best scheme or service for her need. Then 3 to 5 lines, each starting with "- ", one simple action each (documents to take, where to go, what to say). Last line: "URL: " followed by the official website.`,
      simple: `She did not understand. Explain the same scheme again in even simpler words, as if talking to a child. Same format: line 1 sentence, then 3 to 5 lines starting with "- ", last line "URL: ".`,
      scam: `Check whether this message is a scam. Line 1 exactly "RISK: HIGH" or "RISK: MEDIUM" or "RISK: LOW". Then 2 to 3 lines starting with "- " giving simple reasons and what to do. Never tell her to click links.`
    }[mode] || ''
    const text = mode === 'simple' ? `Scheme: ${scheme}. Her words: ${message}` : message
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: base + ' ' + fmt }] },
        contents: [{ role: 'user', parts: [{ text }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1200, ...(model.includes('2.5') ? { thinkingConfig: { thinkingBudget: 0 } } : {}) }
      })
    })
    const j = await r.json()
    if (!r.ok) return res.status(502).json({ error: j.error?.message || 'Gemini error' })
    const out = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim()
    const lines = out.split('\n').map((s) => s.replace(/\*\*/g, '').replace(/^#+\s*/, '').trim()).filter(Boolean)
    const isStep = (l) => /^([-*•]|\d+[.)])\s+/.test(l)
    let steps = lines.filter(isStep).map((l) => l.replace(/^([-*•]|\d+[.)])\s+/, ''))
    const url = (lines.find((l) => /^URL:/i.test(l)) || '').replace(/^URL:\s*/i, '')
    const risk = ((lines.find((l) => /^RISK:/i.test(l)) || '').match(/HIGH|MEDIUM|LOW/i) || [])[0]
    const reply = lines.find((l) => !isStep(l) && !/^(URL|RISK):/i.test(l)) || ''
    if (!steps.length && mode !== 'scam') steps = lines.filter((l) => l !== reply && !/^(URL|RISK):/i.test(l))
    const sources = (j.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .map((c) => c.web).filter(Boolean).slice(0, 3).map((w) => ({ title: w.title, uri: w.uri }))
    res.status(200).json({ reply, steps, url, risk: risk && risk.toUpperCase(), sources, live: true })
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) })
  }
}
