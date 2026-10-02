import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tilt, Magnetic, Wave } from './Fx.jsx'
import { LANGS, ui, pg } from './i18n.js'
import { localHelp, localScam, localName } from './kb.js'

const post = async (body) => {
  const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!r.ok) throw new Error('api'); return r.json()
}
export function useSpeech(lang) {
  const [speaking, setSpeaking] = useState(false), [voiceOk, setVoiceOk] = useState(true)
  const synth = typeof window !== 'undefined' && 'speechSynthesis' in window
  const find = () => synth && speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(lang))
  useEffect(() => {
    if (!synth) return setVoiceOk(false)
    const chk = () => setVoiceOk(!speechSynthesis.getVoices().length || !!find())
    chk(); speechSynthesis.addEventListener('voiceschanged', chk)
    return () => speechSynthesis.removeEventListener('voiceschanged', chk)
  }, [lang])
  const speak = (txt, done) => {
    if (!synth || !txt) return done && done()
    speechSynthesis.cancel()
    const v = find()
    if (lang !== 'en' && speechSynthesis.getVoices().length && !v) return done && done() // no voice installed: stay silent, text is shown
    const u = new SpeechSynthesisUtterance(txt); u.lang = LANGS[lang].bcp; u.rate = .9; if (v) u.voice = v
    let fired = false
    const fin = () => { if (fired) return; fired = true; setSpeaking(false); done && done() }
    u.onstart = () => setSpeaking(true); u.onend = u.onerror = fin
    if (done) setTimeout(fin, 12000)
    speechSynthesis.speak(u)
  }
  const listen = (onText, onState, onErr = () => {}) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return onErr(ui(lang).nomic)
    const r = new SR(); r.lang = LANGS[lang].bcp
    r.onstart = () => onState(true); r.onend = () => onState(false)
    r.onerror = (e) => {
      onState(false)
      const m = { 'not-allowed': 'Microphone is blocked. Click the 🔒 icon next to the address bar and allow Microphone, then try again.', 'service-not-allowed': 'Microphone is blocked. Allow Microphone in the browser address bar.',
        'no-speech': 'I did not hear anything. Tap the mic and speak again.', network: 'Voice needs internet. Check your connection, or type below.', 'audio-capture': 'No microphone found. Please connect one or type below.',
        'language-not-supported': `Voice input for ${LANGS[lang].label} is not supported in this browser. Please type below, or try Microsoft Edge / Chrome.` }
      onErr(m[e.error] || 'Voice error: ' + e.error + '. You can type below instead.')
    }
    r.onresult = (e) => onText(e.results[0][0].transcript)
    try { r.start() } catch { onErr('Microphone is busy. Wait a moment and tap again.') }
  }
  return { speak, listen, speaking, voiceOk }
}

export function Assistant({ lang, pending, log, big }) {
  const t = ui(lang), { speak, listen, speaking, voiceOk } = useSpeech(lang)
  const [text, setText] = useState(''), [listening, setL] = useState(false), [loading, setLoad] = useState(false)
  const [res, setRes] = useState(null), [idx, setIdx] = useState(0), [msg, setMsg] = useState('')
  const lastPending = useRef(null)

  const ask = async (q, mode = 'help') => {
    if (!q.trim()) return
    setLoad(true); const t0 = performance.now(); let out
    const local = localHelp(q, lang)
    if (mode === 'help' && local.steps.length) out = local // verified scheme data first: fast, accurate, works offline
    else { try { out = await post({ message: q, lang, mode, scheme: res?.name || res?.reply }) } catch { out = mode === 'simple' && res ? res : local } }
    if (!out.steps?.length) out = local.steps.length ? local : { reply: t.unknown, steps: [], url: 'https://web.umang.gov.in' }
    setLoad(false); setRes(out); setIdx(0)
    log({ type: 'query', lang, scheme: out.scheme, ms: Math.round(performance.now() - t0), live: !!out.live })
    speak([out.reply, out.steps[0]].filter(Boolean).join('. '))
  }
  useEffect(() => { if (pending && pending.t !== lastPending.current) { lastPending.current = pending.t; setText(pending.q); ask(pending.q) } }, [pending])
  useEffect(() => { setRes(null); setIdx(0) }, [lang])

  const next = () => { if (!res) return; const n = idx + 1; if (n >= res.steps.length) { speak(t.done); return } setIdx(n); speak(res.steps[n]) }
  const orbClass = 'mic ' + (listening ? 'live' : '')
  return (
    <div className={'two ' + (big ? 'big' : '')}>
      <Tilt className="pad center">
        <h3 className="hello">{t.hello} 👋</h3>
        <motion.button className={orbClass} whileTap={{ scale: .92 }} aria-label={t.tap}
          onClick={() => { setMsg(''); speak(t.greet, () => listen((s) => { setText(s); ask(s) }, setL, setMsg)) }}>
          <span className="ring" /><span className="ring r2" />🎤
        </motion.button>
        <p className="muted">{listening ? t.listening : loading ? t.thinking : t.tap}</p>
        <Wave active={listening || speaking || loading} />
        <div className="inrow">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask(text)} placeholder={t.ph} />
          <Magnetic className="go" onClick={() => ask(text)} aria-label="send">→</Magnetic>
        </div>
        <div className="chips">{t.try.map((c) => <button key={c} className="chip" onClick={() => { setText(c); /otp|ओटीपी|ஓடிபி|ఓటీపీ|ওটিপি/i.test(c) ? (setRes({ reply: t.safe.MEDIUM, steps: [], url: '' }), speak(t.safe.MEDIUM), log({ type: 'scam', lang })) : ask(c) }}>{c}</button>)}</div>
        {msg && <p className="warn">⚠️ {msg}</p>}
        {!voiceOk && <p className="warn">🔇 No {LANGS[lang].label} voice on this device, so answers show as text. For natural Hindi / Tamil / Telugu / Bengali voices on Windows, use Microsoft Edge (or install the language voice in Settings → Time &amp; Language → Speech).</p>}
      </Tilt>

      <Tilt className="pad">
        <AnimatePresence mode="wait">
          {!res ? <motion.p key="e" className="muted lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{t.none}</motion.p> : (
            <motion.div key={res.reply + idx0(res)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {res.scheme && <div className="tag">{res.name || localName(res.scheme, lang)}</div>}
              <p className="lead">{res.reply}</p>
              <div className="steps">{res.steps.map((s, i) => (
                <motion.div key={i} className={'step ' + (i === idx ? 'act' : i < idx ? 'done' : '')} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .1 }}>
                  <b>{i < idx ? '✓' : String(i + 1).padStart(2, '0')}</b><span>{s}</span></motion.div>))}</div>
              {res.steps.length > 0 && <>
                <div className="bar"><motion.i animate={{ width: ((idx + 1) / res.steps.length) * 100 + '%' }} /></div>
                <small className="muted">{t.step} {idx + 1} {t.of} {res.steps.length}</small>
                <div className="row">
                  <Magnetic className="pri" onClick={next}>{t.next} →</Magnetic>
                  <Magnetic onClick={() => speak(res.steps[idx])}>🔊 {t.again}</Magnetic>
                  <Magnetic onClick={() => ask(text || res.reply, 'simple')}>❓ {t.simple}</Magnetic>
                </div></>}
              {res.url && <a className="link" href={res.url.startsWith('http') ? res.url : 'https://' + res.url} target="_blank" rel="noreferrer">↗ {t.open}</a>}
              {res.sources?.length > 0 && <div className="src">{res.sources.map((s) => <a key={s.uri} href={s.uri} target="_blank" rel="noreferrer">{s.title}</a>)}</div>}
            </motion.div>)}
        </AnimatePresence>
      </Tilt>
    </div>
  )
}
const idx0 = (r) => r.steps?.[0] || ''

export function Safety({ lang, log }) {
  const t = ui(lang), P = pg(lang), { speak } = useSpeech(lang)
  const [msg, setMsg] = useState(''), [out, setOut] = useState(null), [busy, setBusy] = useState(false)
  const check = async () => {
    if (!msg.trim()) return; setBusy(true); let r
    try { r = await post({ message: msg, lang, mode: 'scam' }) } catch { r = null }
    const risk = r?.risk || localScam(msg)
    const o = { risk, why: r?.steps?.length ? r.steps : [t.safe[risk]] }
    setOut(o); setBusy(false); log({ type: 'scam', lang, risk }); speak(o.why.join('. '))
  }
  return (
    <Tilt className="pad wide">
      <div className="tag">🛡️ {P.sf[0]}</div>
      <textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={P.sf[1]} />
      <Magnetic className="pri" onClick={check}>{busy ? '…' : P.sf[2]}</Magnetic>
      <AnimatePresence>{out && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={'risk ' + out.risk.toLowerCase()}>
          <h4>{out.risk} RISK</h4>{out.why.map((w, i) => <p key={i}>• {w}</p>)}
        </motion.div>)}</AnimatePresence>
    </Tilt>
  )
}
