import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Background, Cursor, Magnetic, Reveal, Tilt, Wave } from './Fx.jsx'
import { Assistant, Safety, useSpeech } from './Assistant.jsx'
import Dashboard from './Dashboard.jsx'
import { LANGS, ui, pg } from './i18n.js'
import { SCHEMES } from './kb.js'
const Scene = lazy(() => import('./Scene.jsx'))

const HUES = { hero: 320, ask: 290, journey: 265, safety: 165, impact: 215 }
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function App() {
  const [lang, setLang] = useState(() => { const l = (navigator.language || 'en').slice(0, 2); return LANGS[l] ? l : 'en' }), [big, setBig] = useState(false), [pending, setPending] = useState(null)
  const [gemini, setGemini] = useState(false)
  const [stats, setStats] = useState({ queries: 0, scams: 0, ms: 0, byLang: {}, bySchemeName: {} })
  const { speak } = useSpeech(lang)
  const { scrollYProgress, scrollY } = useScroll(), prog = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const heroY = useTransform(scrollY, [0, 600], [0, -90]), sceneY = useTransform(scrollY, [0, 600], [0, 70])

  useEffect(() => { fetch('/api/chat').then((r) => r.json()).then((j) => setGemini(!!j.gemini)).catch(() => {}) }, [])
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && document.documentElement.style.setProperty('--hue', HUES[e.target.id])), { threshold: .45 })
    Object.keys(HUES).forEach((id) => { const el = document.getElementById(id); el && io.observe(el) }); return () => io.disconnect()
  }, [])
  const log = (e) => setStats((s) => ({
    ...s, queries: s.queries + (e.type === 'query' ? 1 : 0), scams: s.scams + (e.type === 'scam' ? 1 : 0), ms: e.ms || s.ms,
    byLang: e.type === 'query' ? { ...s.byLang, [e.lang]: (s.byLang[e.lang] || 0) + 1 } : s.byLang,
    bySchemeName: e.scheme ? { ...s.bySchemeName, [{ scholar: 'Scholarship', health: 'Health', skill: 'Skills' }[e.scheme]]: 1 + (s.bySchemeName[{ scholar: 'Scholarship', health: 'Health', skill: 'Skills' }[e.scheme]] || 0) } : s.bySchemeName
  }))
  const ask = (q) => { setPending({ q, t: Date.now() }); go('ask') }

  const p = pg(lang)
  if (new URLSearchParams(location.search).has('simple')) return (
    <div className="xl simple"><Background /><Cursor />
      <div className="langs">{Object.entries(LANGS).map(([k, v]) => <button key={k} className={'lbtn ' + (k === lang ? 'on' : '')} onClick={() => { setLang(k); speak(ui(k).greet) }}>{v.label}</button>)}</div>
      <Assistant lang={lang} pending={pending} log={log} big />
    </div>)
  return (
    <div className={big ? 'xl' : ''}>
      <Background /><Cursor /><motion.div className="progress" style={{ scaleX: prog }} />
      <nav className="nav">
        <b className="logo">✦ SheAccess <span>AI</span></b>
        <div className="links">{['ask', 'journey', 'safety', 'impact'].map((s) => <a key={s} onClick={() => go(s)}>{p.nav[['ask', 'journey', 'safety', 'impact'].indexOf(s)]}</a>)}</div>
        <select value={lang} onChange={(e) => { setLang(e.target.value); speak(ui(e.target.value).greet) }} aria-label="Language">
          {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>🌐 {v.label}</option>)}</select>
        <button className="a11y" data-tip={p.big} onClick={() => setBig(!big)} aria-label="Large text">Aa</button>
      </nav>

      <section id="hero" className="hero">
        <motion.div className="hcopy" style={{ y: heroY }}>
          <Reveal><span className="eyebrow">{p.eyebrow}</span></Reveal>
          <Reveal delay={.1}><h1>{p.h1[0]} <span className="grad">{p.h1[1]}</span></h1></Reveal>
          <Reveal delay={.2}><p className="sub">{p.sub}</p></Reveal>
          <Reveal delay={.3}><div className="row">
            <Magnetic className="pri big" onClick={() => go('ask')}>{p.cta[0]}</Magnetic>
            <Magnetic onClick={() => go('impact')}>{p.cta[1]}</Magnetic></div><a className="link" href="?simple=1">Open Simple Mode (for first-time users) →</a></Reveal>
          <Reveal delay={.4}><div className="facts"><div><b>48%</b><small>{p.facts[0]}</small></div><div><b>0</b><small>{p.facts[1]}</small></div><div><b>5</b><small>{p.facts[2]}</small></div></div></Reveal>
        </motion.div>
        <motion.div className="scene" style={{ y: sceneY }}>
          <Suspense fallback={null}><Scene /></Suspense>
          <div className="float f1" data-tip="Powered by Gemini">✨ Gemini</div><div className="float f2">🔊 Voice-first</div><div className="float f3">🛡️ Scam-safe</div>
          <Wave active />
        </motion.div>
      </section>

      <section id="ask"><Reveal><span className="eyebrow">{p.s[0][0]}</span><h2>{p.s[0][1]} <span className="grad">{p.s[0][2]}</span></h2></Reveal>
        <Reveal delay={.1}><Assistant lang={lang} pending={pending} log={log} big={big} /></Reveal></section>

      <section id="journey"><Reveal><span className="eyebrow">{p.s[1][0]}</span><h2>{p.s[1][1]} <span className="grad">{p.s[1][2]}</span></h2></Reveal>
        <div className="grid3">{SCHEMES.map((s, i) => (
          <Reveal key={s.id} delay={i * .12}><Tilt className="pad scheme" onClick={() => ask({ scholar: 'scholarship', health: 'health hospital', skill: 'job skill training' }[s.id] + (lang === 'hi' ? '' : ''))}>
            <div className="ico">{s.icon}</div><h3>{s.name[lang] || s.name.en}</h3><p className="muted">{s.intro[lang] || s.intro.en}</p>
            <div className="peek"><small>{p.docs}</small>{(s.docs[lang] || s.docs.en).map((d) => <span key={d} className="chip sm">{d}</span>)}</div>
            <span className="link">{p.start}</span></Tilt></Reveal>))}</div></section>

      <section id="safety"><Reveal><span className="eyebrow">{p.s[2][0]}</span><h2>{p.s[2][1]} <span className="grad">{p.s[2][2]}</span></h2></Reveal>
        <Reveal delay={.1}><Safety lang={lang} log={log} /></Reveal></section>

      <section id="impact"><Reveal><span className="eyebrow">04 / IMPACT</span><h2>Intelligence, <span className="grad">visible.</span></h2></Reveal>
        <Dashboard stats={stats} gemini={gemini} /></section>

      <footer><b>✦ SheAccess AI</b><span>Hackathon prototype · Guidance only · Always verify on official .gov.in sites · React · Express · Google Gemini</span></footer>
    </div>
  )
}
