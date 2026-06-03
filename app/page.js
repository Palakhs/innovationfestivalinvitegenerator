'use client'
import { useState } from 'react'

const C = {
  midnight: '#170430', purple: '#8427E2', lilac: '#CD92FF',
  blue: '#72C9F8', green: '#33FF94', grey2: '#919BA5',
  grey3: '#C8D2D7', grey4: '#E1EBEB', white: '#FFFFFF',
  darkGrey: '#232323'
}

const S = {
  body: { fontFamily: "'DM Sans','Century Gothic',sans-serif", background: C.midnight, color: C.white, minHeight: '100vh', overflowX: 'hidden' },
  wrap: { maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 },
  eyebrow: { fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.lilac, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 },
  h1: { fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 10 },
  h1span: { background: 'linear-gradient(90deg,#8427E2 40%,#CD92FF 75%,#72C9F8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  sub: { fontSize: 14, color: C.grey2, lineHeight: 1.6, fontWeight: 300, maxWidth: 500, marginBottom: 28 },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 14 },
  cardTitle: { fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.grey2, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 },
  label: { fontSize: 12, color: C.grey3, display: 'block', marginBottom: 6 },
  labelSub: { color: C.grey2, fontWeight: 300 },
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.white, outline: 'none', width: '100%', boxSizing: 'border-box' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 },
  mb12: { marginBottom: 12 },
  segRow: { display: 'flex', gap: 8, marginBottom: 20 },
  seg: (active, color='#8427E2') => ({
    flex: 1, padding: '10px 8px', border: active ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, cursor: 'pointer', textAlign: 'center', background: active ? `${color}22` : 'transparent',
    transition: 'all 0.15s'
  }),
  segIcon: { fontSize: 18, display: 'block', marginBottom: 3 },
  segText: (active, color='#CD92FF') => ({ fontSize: 12, color: active ? color : C.grey3, fontWeight: 500 }),
  segSub: { fontSize: 10, color: C.grey2, fontWeight: 300, marginTop: 1 },
  genBtn: (loading) => ({ width: '100%', padding: 13, background: loading ? '#5a1a9e' : C.purple, color: C.white, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif" }),
  outCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 12 },
  outHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  channelLabel: { fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.grey2, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 },
  dot: (col) => ({ width: 6, height: 6, borderRadius: '50%', background: col, display: 'inline-block' }),
  copyBtn: (copied) => ({ background: copied ? 'rgba(51,255,148,0.1)' : 'rgba(255,255,255,0.06)', border: copied ? '1px solid rgba(51,255,148,0.3)' : '1px solid rgba(255,255,255,0.1)', borderRadius: 999, color: copied ? C.green : C.grey3, fontSize: 11, padding: '4px 12px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }),
  subject: { fontSize: 11, color: C.grey2, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 10, fontWeight: 500 },
  msgText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontWeight: 300 },
  tipBox: { background: 'rgba(54,0,101,0.3)', border: '1px solid rgba(205,146,255,0.2)', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 10, marginBottom: 12 },
  tipText: { fontSize: 12, color: C.lilac, lineHeight: 1.6, fontWeight: 300 },
  resetRow: { display: 'flex', justifyContent: 'space-between' },
  resetBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, color: C.grey2, fontSize: 12, padding: '6px 16px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  regenBtn: { background: 'transparent', border: '1px solid rgba(132,39,226,0.4)', borderRadius: 999, color: C.lilac, fontSize: 12, padding: '6px 16px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  errBox: { background: 'rgba(224,0,114,0.1)', border: '1px solid rgba(224,0,114,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ff6eb4', marginTop: 10 },
  rules: { marginTop: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 22px' },
  ruleItem: { fontSize: 12, color: C.grey2, lineHeight: 1.55, fontWeight: 300, paddingLeft: 14, position: 'relative', marginBottom: 8 },
  footer: { marginTop: 36, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.15)', fontFamily: "'DM Mono',monospace" }
}

export default function Home() {
  const [form, setForm] = useState({ name: '', company: '', title: '', sender: '', context: '', warmth: 'warm', channel: 'linkedin', registration: 'unsure' })
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const pick = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function generate() {
    if (!form.name || !form.company) { setError('Please enter at least a name and company.'); return }
    setError(''); setOutput(null); setLoading(true)
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setOutput(data)
    } catch { setError('Could not connect. Please try again.') }
    finally { setLoading(false) }
  }

  function copy() {
    const text = output.channel === 'linkedin'
      ? output.message
      : `Subject: ${output.emailSubject}\n\n${output.emailBody}`
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function reset() { setOutput(null); setForm({ name: '', company: '', title: '', sender: '', context: '', warmth: 'warm', channel: 'linkedin', registration: 'unsure' }) }

  const Seg3 = ({ field, options }) => (
    <div style={S.segRow}>
      {options.map(([val, icon, label, sub, col]) => (
        <div key={val} onClick={() => pick(field, val)} style={S.seg(form[field] === val, col || '#8427E2')}>
          <span style={S.segIcon}>{icon}</span>
          <span style={S.segText(form[field] === val, col ? col : '#CD92FF')}>{label}</span>
          {sub && <div style={S.segSub}>{sub}</div>}
        </div>
      ))}
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        input::placeholder { color: rgba(255,255,255,0.2) }
        input:focus { border-color: rgba(132,39,226,0.6) !important; background: rgba(132,39,226,0.06) !important }
        * { box-sizing: border-box }
        @media (max-width:560px) { .g2 { grid-template-columns: 1fr !important } }
      `}</style>
      <div style={S.body}>
        <div style={{ position:'fixed', top:-120, right:-120, width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(132,39,226,0.15) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />

        <div style={S.wrap}>
          <div style={S.eyebrow}>IFS Copperleaf · Sales Tool · IF26</div>
          <h1 style={S.h1}>Outreach <span style={S.h1span}>generator.</span></h1>
          <p style={S.sub}>Fill in the details, pick your options, get a ready-to-send message. No marketing language.</p>

          {/* CONTACT */}
          <div style={S.card}>
            <div style={S.cardTitle}>Contact details</div>
            <div className="g2" style={S.grid2}>
              <div><label style={S.label}>First name</label><input style={S.input} value={form.name} onChange={set('name')} placeholder="Sarah" onKeyDown={e => e.key==='Enter'&&generate()} /></div>
              <div><label style={S.label}>Company</label><input style={S.input} value={form.company} onChange={set('company')} placeholder="Anglian Water" onKeyDown={e => e.key==='Enter'&&generate()} /></div>
            </div>
            <div className="g2" style={S.grid2}>
              <div><label style={S.label}>Job title</label><input style={S.input} value={form.title} onChange={set('title')} placeholder="Director of Capital Planning" onKeyDown={e => e.key==='Enter'&&generate()} /></div>
              <div><label style={S.label}>Your name</label><input style={S.input} value={form.sender} onChange={set('sender')} placeholder="Kieran" onKeyDown={e => e.key==='Enter'&&generate()} /></div>
            </div>
            <div style={S.mb12}>
              <label style={S.label}>One line of context <span style={S.labelSub}>(what do you know about them?)</span></label>
              <input style={S.input} value={form.context} onChange={set('context')} placeholder="We met at Utility Week, she mentioned AMP8 planning pressure" onKeyDown={e => e.key==='Enter'&&generate()} />
            </div>
          </div>

          {/* CHANNEL */}
          <div style={S.card}>
            <div style={S.cardTitle}>Channel</div>
            <Seg3 field="channel" options={[
              ['linkedin','💼','LinkedIn DM','Short, casual',undefined],
              ['email','📧','Email','With subject line',undefined]
            ]} />

            {/* REGISTRATION */}
            <div style={S.cardTitle}>Are they registered for the festival?</div>
            <Seg3 field="registration" options={[
              ['registered','✅','Already registered','Sprint invite only','#0F6E56'],
              ['unsure','❓','Not sure','Festival + sprint invite','#8427E2']
            ]} />

            {/* WARMTH */}
            <div style={S.cardTitle}>Relationship warmth</div>
            <Seg3 field="warmth" options={[
              ['hot','🔥','Hot','Active deal/renewal',undefined],
              ['warm','🤝','Warm','Spoken recently',undefined],
              ['cold','❄️','Cold','Gone quiet / new',undefined]
            ]} />

            <button style={S.genBtn(loading)} onClick={generate} disabled={loading}>
              {loading ? 'Generating...' : 'Generate message'}
            </button>
            {error && <div style={S.errBox}>{error}</div>}
          </div>

          {/* LOADING */}
          {loading && (
            <div style={{ textAlign:'center', padding:'32px 0' }}>
              <div style={{ width:32, height:32, border:'2px solid rgba(132,39,226,0.2)', borderTopColor:C.purple, borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
              <div style={{ fontSize:13, color:C.grey2, fontWeight:300 }}>Writing your message...</div>
            </div>
          )}

          {/* OUTPUT */}
          {output && (
            <div>
              <div style={S.outCard}>
                <div style={S.outHeader}>
                  <div style={S.channelLabel}>
                    <span style={S.dot(output.channel==='linkedin' ? '#0A66C2' : C.blue)} />
                    {output.channel === 'linkedin' ? 'LinkedIn DM' : 'Email'}
                  </div>
                  <button style={S.copyBtn(copied)} onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
                </div>
                {output.channel === 'email' && <div style={S.subject}>Subject: {output.emailSubject}</div>}
                <div style={S.msgText}>{output.channel === 'linkedin' ? output.message : output.emailBody}</div>
              </div>

              {output.tip && (
                <div style={S.tipBox}>
                  <span style={{ fontSize:15 }}>💡</span>
                  <div style={S.tipText}>{output.tip}</div>
                </div>
              )}

              <div style={S.resetRow}>
                <button style={S.resetBtn} onClick={reset}>← Start over</button>
                <button style={S.regenBtn} onClick={generate}>Regenerate ↺</button>
              </div>
            </div>
          )}

          {/* RULES */}
          <div style={S.rules}>
            <div style={S.cardTitle}>Three rules</div>
            {[
              ['Read before sending.', "The AI knows the sprint brief but you know the person. Tweak anything that doesn't sound like you."],
              ['Context field is everything.', '"Director of Capital Planning" gets a generic message. Add something specific and it gets personal.'],
              ['One follow-up maximum.', "If they don't reply, one nudge two weeks later. More than that becomes a campaign."]
            ].map(([b, r], i) => (
              <div key={i} style={S.ruleItem}>
                <span style={{ position:'absolute', left:0, top:6, width:4, height:4, borderRadius:'50%', background:C.purple, display:'inline-block' }} />
                <strong style={{ color:C.white, fontWeight:500 }}>{b}</strong> {r}
              </div>
            ))}
          </div>

          <div style={S.footer}>IFS Copperleaf · Internal Use Only · IF26 2026</div>
        </div>
      </div>
    </>
  )
}
