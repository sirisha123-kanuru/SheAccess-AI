import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { Tilt, Counter, Reveal } from './Fx.jsx'

const COLORS = ['#ec4899', '#a855f7', '#38bdf8', '#34d399', '#fbbf24']
const tick = (n) => Array.from({ length: n }, (_, i) => ({ t: i, v: 40 + Math.round(Math.sin(i / 3) * 14 + Math.random() * 16) }))

export default function Dashboard({ stats, gemini }) {
  const [series, setSeries] = useState(tick(24))
  useEffect(() => {
    const id = setInterval(() => setSeries((s) => [...s.slice(1), { t: s[s.length - 1].t + 1, v: 40 + Math.round(Math.random() * 40 + stats.queries * 3) }]), 2000)
    return () => clearInterval(id)
  }, [stats.queries])
  const langData = [['Hindi', 46], ['Tamil', 21], ['Telugu', 14], ['Bengali', 11], ['English', 8]].map(([name, v]) => ({ name, v: v + (stats.byLang[name.slice(0, 2).toLowerCase()] || 0) }))
  const schemeData = [['Scholarship', 38], ['Health', 31], ['Skills', 26], ['Safety', 19]].map(([name, v]) => ({ name, v: v + (stats.bySchemeName[name] || 0) }))
  const status = [['Voice engine', 'ok'], ['Gemini API', gemini ? 'ok' : 'warn'], ['Search grounding', gemini ? 'ok' : 'warn'], ['Offline fallback', 'ok']]
  return (
    <div className="dash">
      <div className="kpis">{[
        ['Questions answered', 12840 + stats.queries, ''], ['Languages', 5, ''], ['Scams caught', 904 + stats.scams, ''], ['Avg response', stats.ms || 1180, ' ms']
      ].map(([l, v, s], i) => <Reveal key={l} delay={i * .08}><Tilt className="pad kpi"><small>{l}</small><h3><Counter to={v} suffix={s} /></h3></Tilt></Reveal>)}</div>
      <div className="grid3">
        <Reveal className="span2"><Tilt className="pad"><div className="tag"><span className="dot ok" /> Live requests / min</div>
          <div className="chart"><ResponsiveContainer><AreaChart data={series}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ec4899" stopOpacity={.6} /><stop offset="100%" stopColor="#ec4899" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="t" hide /><YAxis hide domain={[0, 'dataMax+20']} /><Tooltip contentStyle={{ background: '#150a24', border: '1px solid #ec489955', borderRadius: 12 }} />
            <Area type="monotone" dataKey="v" stroke="#f472b6" strokeWidth={2} fill="url(#g)" isAnimationActive={false} /></AreaChart></ResponsiveContainer></div></Tilt></Reveal>
        <Reveal delay={.1}><Tilt className="pad"><div className="tag">Languages</div>
          <div className="chart"><ResponsiveContainer><PieChart><Pie data={langData} dataKey="v" innerRadius="55%" outerRadius="85%" paddingAngle={3} stroke="none">{langData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip contentStyle={{ background: '#150a24', border: 'none', borderRadius: 12 }} /></PieChart></ResponsiveContainer></div></Tilt></Reveal>
        <Reveal><Tilt className="pad"><div className="tag">Top needs</div>
          <div className="chart"><ResponsiveContainer><BarChart data={schemeData}><XAxis dataKey="name" tick={{ fill: '#a99bc4', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip cursor={false} contentStyle={{ background: '#150a24', border: 'none', borderRadius: 12 }} /><Bar dataKey="v" fill="#a855f7" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></Tilt></Reveal>
        <Reveal delay={.1}><Tilt className="pad"><div className="tag">AI analysis</div>
          {[['📈', 'Scholarship questions peak after 6 pm, when daughters are back from school.'], ['🌐', 'Hindi voice queries outnumber typed queries about 3 to 1.'], ['⚠️', 'OTP scam reports rising; Safety Check suggested more often.']].map(([e, s], i) => (
            <motion.p key={i} className="ai" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * .15 }}>{e} {s}</motion.p>))}</Tilt></Reveal>
        <Reveal delay={.2}><Tilt className="pad"><div className="tag">System status</div>
          {status.map(([n, s]) => <div key={n} className="stat"><span className={'dot ' + s} />{n}<em>{s === 'ok' ? 'Operational' : 'Offline mode'}</em></div>)}</Tilt></Reveal>
      </div>
      <p className="muted note">Demo metrics are simulated; the numbers marked live also include your own session.</p>
    </div>
  )
}
