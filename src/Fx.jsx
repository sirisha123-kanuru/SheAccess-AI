import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, animate } from 'framer-motion'

// Particle network + moving orbs + animated grid + grain + cursor spotlight
export function Background() {
  const ref = useRef()
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d'), root = document.documentElement.style
    let w, h, raf, m = { x: -999, y: -999 }
    const rs = () => { w = c.width = innerWidth; h = c.height = innerHeight }
    rs()
    const P = Array.from({ length: Math.min(90, (innerWidth / 14) | 0) }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }))
    const mv = (e) => { m = { x: e.clientX, y: e.clientY }; root.setProperty('--mx', e.clientX + 'px'); root.setProperty('--my', e.clientY + 'px') }
    const loop = () => {
      x.clearRect(0, 0, w, h)
      for (const p of P) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        const dx = m.x - p.x, dy = m.y - p.y
        if (Math.hypot(dx, dy) < 170) { p.x += dx * .012; p.y += dy * .012 }
        x.fillStyle = 'rgba(244,114,182,.8)'; x.beginPath(); x.arc(p.x, p.y, 1.6, 0, 6.3); x.fill()
      }
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y)
        if (d < 120) { x.strokeStyle = `rgba(168,85,247,${.28 * (1 - d / 120)})`; x.beginPath(); x.moveTo(P[i].x, P[i].y); x.lineTo(P[j].x, P[j].y); x.stroke() }
      }
      raf = requestAnimationFrame(loop)
    }
    loop(); addEventListener('resize', rs); addEventListener('mousemove', mv)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs); removeEventListener('mousemove', mv) }
  }, [])
  return (<>
    <div className="orbs"><i /><i /><i /></div><div className="grid" />
    <canvas ref={ref} className="net" /><div className="grain" /><div className="spot" />
  </>)
}

export function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 150, damping: 18 }), ry = useSpring(y, { stiffness: 150, damping: 18 })
  const [big, setBig] = useState(false)
  useEffect(() => {
    const mv = (e) => { x.set(e.clientX); y.set(e.clientY); setBig(!!e.target.closest('button,a,input,textarea,select,.card,.mic')) }
    addEventListener('mousemove', mv); return () => removeEventListener('mousemove', mv)
  }, [])
  return (<>
    <motion.div className="cur-dot" style={{ x, y }} />
    <motion.div className="cur-ring" style={{ x: rx, y: ry }} animate={{ scale: big ? 1.9 : 1, opacity: big ? .6 : 1 }} />
  </>)
}

// Glass card: 3D tilt, cursor spotlight, animated gradient border
export function Tilt({ children, className = '', ...p }) {
  const r = useRef()
  const mv = (e) => {
    const b = r.current.getBoundingClientRect(), px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height
    r.current.style.setProperty('--x', px * 100 + '%'); r.current.style.setProperty('--y', py * 100 + '%')
    r.current.style.transform = `perspective(900px) rotateX(${(.5 - py) * 8}deg) rotateY(${(px - .5) * 10}deg) scale(1.015)`
  }
  return <div ref={r} className={'card ' + className} onMouseMove={mv} onMouseLeave={() => (r.current.style.transform = '')} {...p}>{children}</div>
}

export function Magnetic({ children, className = '', ...p }) {
  const x = useMotionValue(0), y = useMotionValue(0), sx = useSpring(x, { stiffness: 220, damping: 15 }), sy = useSpring(y, { stiffness: 220, damping: 15 }), r = useRef()
  return (
    <motion.button ref={r} className={'btn ' + className} style={{ x: sx, y: sy }} whileTap={{ scale: .94 }}
      onMouseMove={(e) => { const b = r.current.getBoundingClientRect(); x.set((e.clientX - b.left - b.width / 2) * .35); y.set((e.clientY - b.top - b.height / 2) * .35) }}
      onMouseLeave={() => { x.set(0); y.set(0) }} {...p}>{children}</motion.button>
  )
}

export const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: .7, delay, ease: [.2, .8, .2, 1] }}>{children}</motion.div>
)

export function Counter({ to, suffix = '' }) {
  const [v, setV] = useState(0), from = useRef(0)
  useEffect(() => { const c = animate(from.current, to, { duration: 1.2, onUpdate: (n) => { from.current = n; setV(n) } }); return () => c.stop() }, [to])
  return <span>{Math.round(v).toLocaleString()}{suffix}</span>
}

export const Wave = ({ active }) => (
  <div className={'wave ' + (active ? 'on' : '')}>{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ animationDelay: i * 0.07 + 's' }} />)}</div>
)
