import { Children, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useReveal } from './hooks/useReveal'

/* Shared shell: paints the Swiss frame and runs the staggered entrance. */
function Slide({ children }) {
  const scope = useReveal()
  const items = Children.toArray(children)
  const headIdx = items.findIndex(
    (child) =>
      typeof child === 'object' &&
      child !== null &&
      'props' in child &&
      typeof child.props?.className === 'string' &&
      child.props.className.includes('slide-head'),
  )
  const hasHead = headIdx >= 0
  const head = hasHead ? items[headIdx] : null
  const body = hasHead ? items.filter((_, i) => i !== headIdx) : items

  return (
    <div className="slide">
      <div className={`slide__inner${hasHead ? ' has-head' : ''}`} ref={scope}>
        {head}
        <div className="slide__body">{body}</div>
      </div>
    </div>
  )
}

/* ── Animated hero demo: AYO's hover-highlight in action ─── */
function HeroDemo() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const hl = ref.current.querySelector('.demo__hl')
      const cursor = ref.current.querySelector('.demo__cursor')
      hl.classList.add('is-adjustable')

      gsap.set('.demo__hl', { opacity: 0, scale: 0.94, transformOrigin: '50% 50%' })
      gsap.set('.demo__pill', { opacity: 0, y: 8 })
      gsap.set('.demo__answer', { opacity: 0, y: 16 })
      gsap.set(cursor, { opacity: 0 })

      if (reduce) {
        gsap.set(['.demo__hl', '.demo__pill', '.demo__answer'], {
          opacity: 1,
          scale: 1,
          y: 0,
        })
        gsap.set(cursor, { opacity: 1 })
        return
      }

      // One-time, smooth entrance — no janky loops.
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to('.demo__hl', { opacity: 1, scale: 1, duration: 0.55 })
        .to(cursor, { opacity: 1, duration: 0.35 }, '-=0.25')
        .to('.demo__pill', { opacity: 1, y: 0, duration: 0.4 }, '-=0.15')
        .to('.demo__answer', { opacity: 1, y: 0, duration: 0.5 }, '+=0.45')

      // Continuous, perfectly smooth circular orbit around the box centre.
      const orbit = { a: -Math.PI / 2 }
      const R = 30
      gsap.to(orbit, {
        a: orbit.a + Math.PI * 2,
        duration: 5,
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          gsap.set(cursor, {
            x: Math.cos(orbit.a) * R,
            y: Math.sin(orbit.a) * R,
          })
        },
      })
    },
    { scope: ref },
  )

  const bars = [38, 52, 44, 63, 78, 96]

  return (
    <div className="mock demo" ref={ref}>
      <div className="mock__bar">
        <i />
        <i />
        <i />
        <span className="demo__url">analytics · q3 dashboard</span>
      </div>
      <div className="mock__body">
        <div className="demo__line" style={{ width: '34%' }} />
        <div className="demo__line demo__line--sm" style={{ width: '22%' }} />
        <div className="demo__chart">
          {bars.map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>

        <div className="demo__hl" style={{ left: '6%', top: '40%', width: '64%', height: '46%' }} />

        <div className="mock__pill demo__pill" style={{ right: '6%', top: '10%' }}>
          <span className="brand__dot" />
          What does this chart mean?
        </div>

        <div className="demo__answer">
          <span className="brand__dot" />
          <p>
            Revenue is up <b>24%</b> this quarter — the jump is mostly new signups
            in week 6.
          </p>
        </div>

        <svg className="demo__cursor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 2l7 18 2.5-7.5L20 10z"
            fill="#0b0b10"
            stroke="#fff"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

/* Smooth cardinal-spline path through a set of points. */
function smoothPath(pts) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const t = 0.18
    const c1x = p1.x + (p2.x - p0.x) * t
    const c1y = p1.y + (p2.y - p0.y) * t
    const c2x = p2.x - (p3.x - p1.x) * t
    const c2y = p2.y - (p3.y - p1.y) * t
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

/* ── Animated projection curve (slide 08) ─────────────────── */
function GrowthChart() {
  const ref = useRef(null)
  // Monthly projected MRR ($k) — deliberately non-linear: learn, then scale.
  const data = [2, 3, 8, 11, 16, 24, 30, 36, 42, 49, 56, 63]
  const milestones = [
    [0, 'M1'],
    [2, 'M3'],
    [5, 'M6'],
    [8, 'M9'],
    [11, 'M12'],
  ]
  const W = 600
  const H = 188
  const padT = 16
  const padB = 22
  const maxY = 72
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - padB - (v / maxY) * (H - padT - padB),
  }))
  const linePath = smoothPath(pts)
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const line = ref.current.querySelector('.gc__line')
      const area = ref.current.querySelector('.gc__area')
      const dots = ref.current.querySelectorAll('.gc__dot')
      const numEl = ref.current.querySelector('.gc__num')

      if (reduce) {
        numEl.textContent = '$63K'
        return
      }

      const len = line.getTotalLength()
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(area, { opacity: 0 })
      gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' })

      gsap
        .timeline({ defaults: { ease: 'power2.out' }, delay: 0.2 })
        .to(line, { strokeDashoffset: 0, duration: 1.5 })
        .to(area, { opacity: 1, duration: 0.8 }, '-=1.05')
        .to(dots, { scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }, '-=0.7')

      const obj = { v: 0 }
      gsap.to(obj, {
        v: 63,
        duration: 1.6,
        ease: 'power2.out',
        delay: 0.2,
        onUpdate: () => {
          numEl.textContent = '$' + Math.round(obj.v) + 'K'
        },
      })
    },
    { scope: ref },
  )

  return (
    <div className="gc" ref={ref}>
      <div className="gc__head">
        <div>
          <span className="gc__num">$0K</span>
          <span className="gc__cap">Month 12 · $55–70k range</span>
        </div>
        <span className="tag">Illustrative</span>
      </div>
      <div className="gc__plot">
        <svg
          className="gc__svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="gcLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6d4bff" />
              <stop offset="55%" stopColor="#2f6bff" />
              <stop offset="100%" stopColor="#e1409a" />
            </linearGradient>
            <linearGradient id="gcArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(109,75,255,0.26)" />
              <stop offset="100%" stopColor="rgba(109,75,255,0)" />
            </linearGradient>
          </defs>
          <path className="gc__area" d={areaPath} fill="url(#gcArea)" />
          <path
            className="gc__line"
            d={linePath}
            fill="none"
            stroke="url(#gcLine)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {milestones.map(([mi], k) => (
          <span
            key={k}
            className="gc__dot"
            style={{
              left: `${(pts[mi].x / W) * 100}%`,
              top: `${(pts[mi].y / H) * 100}%`,
            }}
          />
        ))}
      </div>
      <div className="gc__axis">
        {milestones.map(([mi, label], k) => {
          const pct = (pts[mi].x / W) * 100
          const transform =
            k === 0
              ? 'none'
              : k === milestones.length - 1
                ? 'translateX(-100%)'
                : 'translateX(-50%)'
          return (
            <span key={label} style={{ left: `${pct}%`, transform }}>
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ── Animated donut chart (slide 10) ──────────────────────── */
function PieChart({ segments }) {
  const ref = useRef(null)
  const R = 64
  const C = 2 * Math.PI * R
  let acc = 0
  const arcs = segments.map((s) => {
    const start = acc
    acc += s.pct
    return { ...s, len: (s.pct / 100) * C, offset: -(start / 100) * C }
  })

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const circles = ref.current.querySelectorAll('.pie__seg')
      if (reduce) return
      circles.forEach((c, i) => {
        const len = parseFloat(c.dataset.len)
        gsap.fromTo(
          c,
          { strokeDasharray: `0 ${C}` },
          {
            strokeDasharray: `${len} ${C - len}`,
            duration: 0.7,
            ease: 'power2.out',
            delay: 0.25 + i * 0.16,
          },
        )
      })
    },
    { scope: ref },
  )

  return (
    <div className="pie" ref={ref}>
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <g transform="rotate(-90 80 80)">
          {arcs.map((a, i) => (
            <circle
              key={i}
              className="pie__seg"
              data-len={a.len}
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke={a.color}
              strokeWidth="22"
              strokeDasharray={`${a.len} ${C - a.len}`}
              strokeDashoffset={a.offset}
            />
          ))}
        </g>
      </svg>
      <div className="pie__center">
        <span className="pie__total">$100K</span>
        <span className="pie__sub">12-mo runway</span>
      </div>
    </div>
  )
}

/* ── Rotating quote (slide 11) ────────────────────────────── */
function RotatingQuote({ items }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const lines = gsap.utils.toArray(ref.current.children)

      // First line is visible from the very first paint (CSS handles the rest),
      // so there is never a stacked/overlapping flash. We animate only opacity
      // and transform here — blur is intentionally avoided because animating it
      // on large text is the main cause of stutter.
      gsap.set(lines, { opacity: 0, y: 16 })
      gsap.set(lines[0], { opacity: 1, y: 0 })

      if (reduce || lines.length < 2) return

      const tl = gsap.timeline({ repeat: -1 })
      lines.forEach((line, i) => {
        const next = lines[(i + 1) % lines.length]
        tl.to({}, { duration: 2.6 })
          .to(line, { opacity: 0, y: -16, duration: 0.45, ease: 'power2.in' })
          .fromTo(
            next,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              immediateRender: false,
            },
            '>-0.1',
          )
      })

      // fromTo defaults to immediateRender — the last step targets lines[0]
      // and would hide the first quote until its turn in the loop.
      gsap.set(lines[0], { opacity: 1, y: 0 })
    },
    { scope: ref },
  )

  return (
    <div className="rotq" ref={ref}>
      {items.map((node, i) => (
        <blockquote className="quote" key={i}>
          {node}
        </blockquote>
      ))}
    </div>
  )
}

function Head({ no, title }) {
  return (
    <div className="slide-head r">
      <span className="section-no">{no}</span>
      <span className="title">{title}</span>
    </div>
  )
}

/* ── 01 · Opening ───────────────────────────────────────── */
function Opening() {
  return (
    <Slide>
      <div className="cols-2">
        <div className="stack gap-md">
          <span className="kicker r">Privacy-first AI copilot for Windows</span>
          <h1 className="display r">
            The desktop,
            <br />
            finally <span className="grad">AI-native</span>.
          </h1>
          <p className="lead r">
            AI today still asks you to explain your computer. AYO changes that —
            point at anything on your screen and ask. No screenshots. No
            copy-paste. No long explanations.
          </p>
          <p className="lead lead--accent r">
            We believe this is the start of an{' '}
            <span className="grad">AI-native desktop</span>.
          </p>
          <div className="row r">
            <span className="tag">Pre-Seed · 2026</span>
            <span className="eyebrow">heyayo.com</span>
          </div>
        </div>

        <div className="r">
          <HeroDemo />
        </div>
      </div>
    </Slide>
  )
}

/* ── 02 · Why AYO Is Different ──────────────────────────── */
const DIFFERENTIATORS = [
  ['Local wake word', 'Say “AYO” from anywhere'],
  ['Screen understanding', 'Understands what’s on the desktop'],
  ['Cursor awareness', 'Knows what the user is pointing at'],
  ['Silent mode', 'Works without voice'],
  ['Memory', 'Remembers useful context'],
  ['Proactive help', 'Can assist before the user asks'],
  ['Desktop actions', 'Can help users act, not just chat'],
]
function WhyDifferent() {
  return (
    <Slide>
      <Head no="02 / 16" title="Why AYO Is Different" />
      <div className="cols-2">
        <div className="stack gap-md">
          <h2 className="headline r">
            AYO is not a chatbot with a{' '}
            <span className="grad">desktop icon</span>.
          </h2>
          <p className="lead r">
            It is an ambient AI layer for the computer — combining the
            capabilities most tools ship one at a time:
          </p>
          <div className="callout r">
            AYO doesn’t wait for users to explain their computer.{' '}
            <b>It understands the workspace around them.</b>
          </div>
        </div>
        <div
          className="card-grid r"
          style={{ gridTemplateColumns: 'repeat(2, 1fr)', alignSelf: 'start' }}
        >
          {DIFFERENTIATORS.map(([title, desc], i) => (
            <div
              className="card"
              key={title}
              style={
                i === DIFFERENTIATORS.length - 1
                  ? { gridColumn: '1 / -1' }
                  : undefined
              }
            >
              <span className="card__no">{String(i + 1).padStart(2, '0')}</span>
              <span className="card__title">{title}</span>
              <span className="card__desc">{desc}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="note r" style={{ marginTop: '16px' }}>
        One of the first desktop AI copilots with a local wake word, screen
        context, cursor awareness, memory, and proactive assistance in one
        product.
      </p>
    </Slide>
  )
}

/* ── 03 · The Landscape ─────────────────────────────────── */
/* 0 = none · 1 = partial · AYO column is always full */
const COMPETITORS = ['ChatGPT', 'Copilot', 'Gemini', 'Grammarly']
const MATRIX = [
  ['Custom wake word — fully local', [0, 0, 0, 0]],
  ['Ambient screen watching', [0, 1, 0, 0]],
  ['Hover-to-ask on any app', [0, 0, 0, 1]],
  ['Deictic “this” resolution', [0, 0, 0, 0]],
  ['Long-term personal memory', [1, 0, 1, 0]],
  ['Proactive — speaks first', [0, 0, 0, 0]],
]

function Mark({ state }) {
  if (state === 1) {
    return (
      <svg className="cmp__icon" viewBox="0 0 20 20" role="img" aria-label="Partial">
        <circle cx="10" cy="10" r="8.5" fill="none" stroke="#e8923a" strokeWidth="1.6" />
        <path d="M10 1.5 A8.5 8.5 0 0 1 10 18.5 Z" fill="#e8923a" />
      </svg>
    )
  }
  if (state === 2) {
    return (
      <svg className="cmp__icon" viewBox="0 0 20 20" role="img" aria-label="Yes">
        <circle cx="10" cy="10" r="9" fill="#1f9d57" />
        <path
          d="M6 10.5l2.5 2.5L14.5 7"
          fill="none"
          stroke="#fff"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return <span className="cmp__dash" aria-label="No">—</span>
}

function Landscape() {
  return (
    <Slide>
      <Head no="03 / 16" title="The Landscape" />
      <h2 className="headline r" style={{ maxWidth: '26ch', marginBottom: '4px' }}>
        Rivals do pieces of this.{' '}
        <span className="grad">AYO ships it as one layer.</span>
      </h2>
      <div
        className="cmp r"
        role="table"
        aria-label="AYO versus desktop AI tools"
      >
        <div className="cmp__cell cmp__cell--head" role="columnheader">
          Capability
        </div>
        {COMPETITORS.map((c) => (
          <div className="cmp__cell cmp__cell--head cmp__cell--mark" key={c} role="columnheader">
            {c}
          </div>
        ))}
        <div className="cmp__cell cmp__cell--head cmp__cell--mark cmp__cell--ayohead" role="columnheader">
          <span className="brand__dot" />
          AYO
        </div>

        {MATRIX.map(([cap, states]) => (
          <div className="cmp__row" role="row" key={cap}>
            <div className="cmp__cell cmp__cell--cap" role="cell">
              {cap}
            </div>
            {states.map((s, i) => (
              <div className="cmp__cell cmp__cell--mark" role="cell" key={i}>
                <Mark state={s} />
              </div>
            ))}
            <div className="cmp__cell cmp__cell--mark cmp__cell--ayo" role="cell">
              <Mark state={2} />
            </div>
          </div>
        ))}
      </div>
      <p className="note r" style={{ marginTop: '14px' }}>
        Partial = exists but limited or app-specific. Trimmed to the clearest
        gaps — full 12-dimension comparison and technical breakdown live in the
        appendix.
      </p>
    </Slide>
  )
}

/* ── 04 · The Problem ───────────────────────────────────── */
function Problem() {
  return (
    <Slide>
      <Head no="04 / 16" title="The Problem" />
      <div className="cols-2">
        <h2 className="headline r">
          AI is powerful — but it still lives <span className="grad">outside</span>{' '}
          the real workflow.
        </h2>
        <div className="stack gap-md">
          <p className="lead r">
            Most tools wait for the user to bring context into a chatbox. But the
            context is already on the screen.
          </p>
          <p className="body r">
            Users should not have to explain what they are looking at. The
            computer should understand the workspace.
          </p>
        </div>
      </div>
    </Slide>
  )
}

/* ── 03 · The Product ───────────────────────────────────── */
const SURFACES = [
  'Websites',
  'PDFs',
  'Dashboards',
  'Code',
  'Images',
  'Emails',
  'Posts',
  'Documents',
  'Apps',
]
function Product() {
  return (
    <Slide>
      <Head no="05 / 16" title="The Product" />
      <div className="cols-2">
        <div className="stack gap-md">
          <h2 className="statement r">
            AYO lives on top of the desktop.
          </h2>
          <p className="lead r">
            Use it by voice or silently. Point at anything and ask — AYO helps you
            understand, summarize, translate, check, remember, and act, directly
            from your desktop.
          </p>
          <div className="chips r">
            {['Understand', 'Summarize', 'Translate', 'Check', 'Remember', 'Act'].map(
              (v) => (
                <span className="chip" key={v}>
                  {v}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="card-grid r" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {SURFACES.map((s, i) => (
            <div className="card" key={s}>
              <span className="card__no">{String(i + 1).padStart(2, '0')}</span>
              <span className="card__title">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  )
}

/* ── Layered "AI layer on the desktop" visual (slide 04) ─── */
function WhyNowVisual() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const slabs = gsap.utils.toArray(ref.current.querySelectorAll('.wn__slab'))
      gsap.set(slabs, { opacity: 0, y: 30, scale: 0.96 })

      if (reduce) {
        gsap.set(slabs, { opacity: 1, y: 0, scale: 1 })
        return
      }

      // staggered build-up of the stack
      gsap
        .timeline({ delay: 0.2 })
        .to(slabs, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.14,
        })
        .from(
          '.wn__connectors',
          { opacity: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.3',
        )

      // gentle parallax float — each layer at its own phase
      gsap.to('.wn__slab--top', { y: '-=12', duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1 })
      gsap.to('.wn__slab--mid', { y: '-=8', duration: 3.6, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.3 })
      gsap.to('.wn__slab--base', { y: '-=5', duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.6 })

      // pulsing glow
      gsap.to('.wn__glow', { opacity: 0.9, scale: 1.12, duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true })

      // scan light sweeping across the AYO layer
      gsap.fromTo(
        '.wn__scan',
        { xPercent: -120, opacity: 0 },
        { xPercent: 220, opacity: 1, duration: 2.4, ease: 'power1.inOut', repeat: -1, repeatDelay: 1.6 },
      )

      // energy flowing down the connectors
      gsap.to('.wn__flow', {
        strokeDashoffset: -24,
        duration: 1.1,
        ease: 'none',
        repeat: -1,
      })

      // floating particles
      gsap.to('.wn__spark', {
        y: '-=14',
        opacity: 0.9,
        duration: 2.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.4, from: 'random' },
      })
    },
    { scope: ref },
  )

  return (
    <div className="wn" ref={ref}>
      <div className="wn__glow" />

      {/* glowing connectors that link the layers */}
      <svg className="wn__connectors" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="wnFlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d4bff" />
            <stop offset="100%" stopColor="#e1409a" />
          </linearGradient>
        </defs>
        <path className="wn__connector" d="M64 20 L49 53" stroke="rgba(109,75,255,0.25)" strokeWidth="0.7" fill="none" />
        <path className="wn__connector" d="M49 53 L35 82" stroke="rgba(109,75,255,0.25)" strokeWidth="0.7" fill="none" />
        <path className="wn__flow" d="M64 20 L49 53 L35 82" stroke="url(#wnFlow)" strokeWidth="0.9" fill="none" strokeDasharray="3 9" strokeLinecap="round" />
      </svg>

      <span className="wn__spark" style={{ top: '12%', left: '22%' }} />
      <span className="wn__spark" style={{ top: '48%', left: '82%' }} />
      <span className="wn__spark" style={{ top: '70%', left: '60%' }} />

      {/* base — Windows desktop */}
      <div className="wn__slab wn__slab--base">
        <span className="wn__tag">Windows desktop</span>
        <div className="wn__win">
          <span /><span /><span />
        </div>
        <div className="wn__taskbar" />
      </div>

      {/* mid — apps & content */}
      <div className="wn__slab wn__slab--mid">
        <span className="wn__tag">Your apps &amp; content</span>
        <div className="wn__blocks">
          <i /><i /><i />
        </div>
      </div>

      {/* top — AYO AI layer */}
      <div className="wn__slab wn__slab--top">
        <span className="wn__sheen" />
        <span className="wn__scan" />
        <span className="wn__tag wn__tag--ayo">
          <span className="brand__dot" />
          AYO · AI layer
        </span>
        <div className="wn__hl">
          <span className="wn__pill">Point. Ask. Act.</span>
        </div>
      </div>
    </div>
  )
}

/* ── 04 · Why Now ───────────────────────────────────────── */
function WhyNow() {
  return (
    <Slide>
      <Head no="06 / 16" title="Why Now" />
      <div className="cols-2">
        <div className="stack gap-md">
          <h2 className="headline r">
            The next step is not another AI tab. It is an AI{' '}
            <span className="grad">layer</span> that works where users already are.
          </h2>
          <p className="lead r">
            AI is moving from chatboxes into real workflows. The layer that wins is
            the one that meets people on their desktop.
          </p>
          <p className="body r">
            Windows is still one of the biggest productivity environments in the
            world — yet it lacks a truly native AI companion for everyday
            workflows. <b style={{ color: 'var(--ink)' }}>AYO is built for that gap.</b>
          </p>
        </div>
        <div className="r">
          <WhyNowVisual />
        </div>
      </div>
    </Slide>
  )
}

/* ── The friction journey (slide 05) ──────────────────────── */
const JOURNEY = [
  ['01', 'Saw it on mobile'],
  ['02', 'Couldn’t use it yet'],
  ['03', 'Joined the waitlist'],
  ['04', 'Returned on PC'],
  ['05', 'Downloaded AYO'],
  ['06', 'Some paid'],
]
function JourneyFlow() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const nodes = gsap.utils.toArray(ref.current.querySelectorAll('.flow__node'))
      const labels = gsap.utils.toArray(ref.current.querySelectorAll('.flow__label'))
      gsap.set(nodes, { scale: 0 })
      gsap.set(labels, { opacity: 0, y: 14 })

      if (reduce) {
        gsap.set(nodes, { scale: 1 })
        gsap.set(labels, { opacity: 1, y: 0 })
        return
      }

      gsap
        .timeline({ delay: 0.3 })
        .from('.flow__rail-fill', { scaleX: 0, transformOrigin: 'left', duration: 1.0, ease: 'power2.out' })
        .to(nodes, { scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.12 }, '-=0.75')
        .to(labels, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }, '<')

      gsap.to('.flow__rail-flow', {
        backgroundPositionX: '-=20',
        duration: 0.85,
        ease: 'none',
        repeat: -1,
      })
      gsap.fromTo(
        '.flow__ring',
        { scale: 0.85, opacity: 0.5 },
        { scale: 1.7, opacity: 0, duration: 1.7, ease: 'power1.out', repeat: -1, delay: 1.6 },
      )
    },
    { scope: ref },
  )

  return (
    <div className="flow" ref={ref}>
      <div className="flow__rail">
        <div className="flow__rail-fill" />
        <div className="flow__rail-flow" />
      </div>
      <div className="flow__steps">
        {JOURNEY.map(([no, label], i) => {
          const paid = i === JOURNEY.length - 1
          return (
            <div className="flow__step" key={no}>
              <span className={`flow__node${paid ? ' flow__node--paid' : ''}`}>
                {no}
                {paid && <span className="flow__ring" />}
              </span>
              <span className={`flow__label${paid ? ' flow__label--paid' : ''}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── 05 · Early Signal ──────────────────────────────────── */
function EarlySignal() {
  return (
    <Slide>
      <Head no="07 / 16" title="Early Signal" />
      <div className="cols-2" style={{ alignItems: 'start' }}>
        <h2 className="headline r" style={{ fontSize: 'clamp(26px, 3.4vw, 50px)' }}>
          People saw a desktop AI product on mobile, couldn’t use it —{' '}
          <span className="grad">and still came back</span> to download it.
        </h2>
        <div className="signal-facts r">
          <div>
            <b className="grad">100+</b>
            <span>Joined the waitlist</span>
          </div>
          <div>
            <b>First</b>
            <span>Paying customers</span>
          </div>
          <div>
            <b>~0</b>
            <span>Followers at launch · brand-new page</span>
          </div>
        </div>
      </div>

      <JourneyFlow />

      <p className="note r" style={{ marginTop: '4px' }}>
        Most users discovered AYO on mobile — even though it’s a Windows desktop
        product. The signal wasn’t scale; it was <b style={{ color: 'var(--ink)', fontStyle: 'normal' }}>intent</b>.
        People understood the idea, remembered it, and acted despite the friction.
      </p>
    </Slide>
  )
}

/* ── 06 · What We Learned ───────────────────────────────── */
function Learned() {
  return (
    <Slide>
      <Head no="08 / 16" title="What We Learned" />
      <div className="cols-2">
        <h2 className="headline r">
          AYO is a <span className="grad">visual</span> product.
        </h2>
        <div className="lines r" style={{ alignSelf: 'center', width: '100%' }}>
          <div className="line-item">
            <span className="line-item__no">A</span>
            <div>
              <div className="line-item__text">Paid ads create reach</div>
            </div>
          </div>
          <div className="line-item">
            <span className="line-item__no">B</span>
            <div>
              <div className="line-item__text">Creators create trust</div>
            </div>
          </div>
          <div className="line-item">
            <span className="line-item__no">C</span>
            <div>
              <div className="line-item__text">Organic compounds awareness</div>
            </div>
          </div>
        </div>
      </div>
      <p className="body r" style={{ marginTop: '26px' }}>
        People understand AYO fastest when they see it working on a real desktop —
        which makes creator-led distribution especially powerful. The opportunity
        is turning AYO from something people notice into something they repeatedly
        use.
      </p>
    </Slide>
  )
}

/* ── 07 · Growth Strategy ───────────────────────────────── */
const CHANNELS = [
  ['01', 'Instagram paid ads', 'Short-form product demos to create awareness and retarget interested users.'],
  ['02', 'YouTube desktop ads', 'Higher-intent traffic — users are already on desktop and can install immediately.'],
  ['03', 'Creator & influencer demos', 'Creators show AYO in real workflows, making it easier to understand and trust.'],
  ['04', 'Organic blast radius', 'If AYO looks impressive enough, users, tech pages, and creators share it unpaid.'],
]
function Growth() {
  return (
    <Slide>
      <Head no="09 / 16" title="Growth Strategy" />
      <div className="card-grid r" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {CHANNELS.map(([no, title, desc]) => (
          <div className="card" key={no}>
            <span className="card__no">{no}</span>
            <span className="card__title">{title}</span>
            <span className="card__desc">{desc}</span>
          </div>
        ))}
      </div>
      <div className="loop r">
        <span className="loop__step grad">Paid reach starts the fire</span>
        <span className="loop__arrow">→</span>
        <span className="loop__step">Creators build trust</span>
        <span className="loop__arrow">→</span>
        <span className="loop__step">Organic keeps it spreading</span>
      </div>
    </Slide>
  )
}

/* ── 08 · Growth Model ──────────────────────────────────── */
const PHASES = [
  ['Month 1', '$1–3k', 'Early conversion test'],
  ['Month 3', '$6–10k', 'Better funnel + first creator tests'],
  ['Month 6', '$18–30k', 'Winning channels start scaling'],
  ['Month 9', '$35–50k', 'Organic + creator loop compounds'],
  ['Month 12', '$55–70k', 'Breakout case if distribution works'],
]
function Model() {
  return (
    <Slide>
      <Head no="10 / 16" title="12-Month Growth Model" />
      <div className="cols-2">
        <div className="stack gap-sm">
          <h2 className="statement r">
            We don’t believe AYO grows{' '}
            <span className="grad">linearly</span>. We learn, optimize, then scale.
          </h2>
          <p className="body r">
            The first months are about learning — testing creators, fixing trust
            friction, improving onboarding, and finding the message that converts.
            If those learnings work, the curve turns non-linear.
          </p>
          <div className="callout r">
            We believe AYO can break out{' '}
            <b>earlier than a normal SaaS product</b> — it’s visual, demoable,
            creator-friendly, and built in a market moving extremely fast.
          </div>
        </div>
        <div className="r">
          <GrowthChart />
        </div>
      </div>

      <div className="mile r">
        {PHASES.map(([month, mrr, logic], i) => (
          <div className="mile__card" key={month}>
            <span className="mile__month">{month}</span>
            <span className={`mile__mrr${i === PHASES.length - 1 ? ' grad' : ''}`}>
              {mrr}
            </span>
            <span className="mile__logic">{logic}</span>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ── 09 · The Raise ─────────────────────────────────────── */
const LADDER = [
  ['$2–5k', 'Early payment validation', false],
  ['$10k', 'Strong early signal', false],
  ['$20k', 'Real traction — not yet breakout', false],
  ['$50k', 'Strong pre-seed / seed-level momentum', false],
  ['$70k+', 'Breakout early revenue path', true],
  ['$100k+', 'Serious seed / Series A conversation territory', true],
]
function Raise() {
  return (
    <Slide>
      <Head no="11 / 16" title="The Raise" />
      <div className="cols-2">
        <div className="stack gap-md">
          <span className="kicker r">AYO’s pre-seed launch · round open</span>
          <div className="raise-fig r">
            <span className="raise-fig__num grad">$100K</span>
            <span className="raise-fig__cap">Pre-seed target · 12-month runway</span>
          </div>
          <div className="raise-meta r">
            <div>
              <b>$0</b>
              <span>Raised so far · round open</span>
            </div>
            <div>
              <b>YC SAFE</b>
              <span>Structure</span>
            </div>
          </div>
          <p className="body r" style={{ maxWidth: '48ch' }}>
            We know startup returns usually take years — and we’re not building a
            slow, linear SaaS business. AYO is a visual AI product with creator-led
            distribution potential.{' '}
            <b style={{ color: 'var(--ink)' }}>
              Our conservative model shows survival; our growth model shows the
              company we’re actually trying to build.
            </b>
          </p>
        </div>

        <div className="stack gap-sm">
          <span className="eyebrow r">What the numbers mean</span>
          <div className="ladder r">
            {LADDER.map(([mrr, mean, hot]) => (
              <div className={`ladder__row${hot ? ' is-hot' : ''}`} key={mrr}>
                <span className={`ladder__mrr${hot ? ' grad' : ''}`}>{mrr}</span>
                <span className="ladder__mean">{mean}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* ── 10 · Use of Funds ──────────────────────────────────── */
const FUNDS = [
  ['Marketing & distribution', 'Paid ads, YouTube campaigns, creator partnerships, organic content, retargeting, launches.', 65, 'var(--violet)'],
  ['Product development', 'We are CS students who build AYO ourselves, so engineering spend stays lean.', 20, 'var(--blue)'],
  ['Infrastructure', 'APIs, cloud, storage, monitoring, analytics, and support systems.', 6, 'var(--cyan)'],
  ['Legal & compliance', 'Company setup, SAFE docs, privacy, code signing, investor legal.', 5, 'var(--magenta)'],
  ['Operations & buffer', 'Tools, subscriptions, test devices, short-term runway protection.', 4, '#ff8a3d'],
]
function Funds() {
  const segments = FUNDS.map(([label, , pct, color]) => ({ label, pct, color }))
  return (
    <Slide>
      <Head no="12 / 16" title="Use of Funds" />
      <div className="cols-2" style={{ gridTemplateColumns: '0.8fr 1.2fr' }}>
        <div className="r" style={{ justifySelf: 'center' }}>
          <PieChart segments={segments} />
        </div>
        <div className="lines r">
          {FUNDS.map(([title, desc, pct, color]) => (
            <div className="line-item" key={title} style={{ gridTemplateColumns: '60px 1fr' }}>
              <span className="line-item__no" style={{ color }}>
                {pct}%
              </span>
              <div>
                <div className="line-item__text" style={{ fontSize: 'clamp(15px, 1.4vw, 21px)' }}>
                  {title}
                </div>
                <div className="line-item__sub">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="note r" style={{ marginTop: '16px' }}>
        Because we build the product ourselves, most of the capital goes straight
        into distribution. Indicative allocation.
      </p>
    </Slide>
  )
}

/* ── 11 · Why AYO Can Spread ────────────────────────────── */
const CONTEXTS = ['Work', 'University', 'Meetings', 'Public spaces', 'Quiet environments', 'Focus sessions']
const REACTIONS = [
  <>“Wait — I can point at <span className="grad">anything</span> and ask?”</>,
  <>“It can <span className="grad">see and understand</span> everything I was working on.”</>,
  <>“It knows what I was doing <span className="grad">2 hours ago</span> — good, I forgot.”</>,
]
function Spread() {
  return (
    <Slide>
      <Head no="13 / 16" title="Why AYO Can Spread" />
      <div className="cols-2">
        <div className="r">
          <RotatingQuote items={REACTIONS} />
        </div>
        <div className="stack gap-md">
          <p className="lead r">
            AYO has a strong demo loop — when people see it, they understand it. It
            works by voice today, and a <b style={{ color: 'var(--ink)' }}>silent
            mode is in development</b>, built to feel as smooth and efficient as
            voice commands — practical anywhere:
          </p>
          <div className="chips r">
            {CONTEXTS.map((c) => (
              <span className="chip" key={c}>
                {c}
              </span>
            ))}
          </div>
          <p className="body r">
            Suited for creator demos, tech reviews, productivity videos, and
            student, developer, and founder workflows. The product is not just
            useful — it is showable.
          </p>
        </div>
      </div>
    </Slide>
  )
}

/* ── 12 · Future Plans ──────────────────────────────────── */
const FUTURE = [
  ['01', 'Mobile companion', 'Use your phone to trigger actions on your computer — open something, prepare a file, summarize activity, continue a task remotely.'],
  ['02', 'Personal cloud context', 'Connect your own cloud storage so AYO can access approved files and context across devices — with you in control.'],
  ['03', 'Mac & Linux support', 'Expand beyond Windows to support MacBooks and Linux users.'],
  ['04', 'Agent-to-agent', 'Coordinate actions between AI systems — the desktop layer that talks to other agents and tools.'],
]
function Future() {
  return (
    <Slide>
      <Head no="14 / 16" title="Future Plans" />
      <div className="card-grid r" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {FUTURE.map(([no, title, desc]) => (
          <div className="card" key={no}>
            <span className="card__no">{no}</span>
            <span className="card__title">{title}</span>
            <span className="card__desc">{desc}</span>
          </div>
        ))}
      </div>
      <p className="statement r" style={{ marginTop: '30px', maxWidth: '40ch' }}>
        AYO becomes the user’s AI <span className="grad">operating layer</span> across
        devices, files, apps, and agents.
      </p>
    </Slide>
  )
}

/* ── 15 · The Team ──────────────────────────────────────── */
const TEAM = [
  [
    '01',
    'Omar — Founder & CEO',
    'Sets the vision and direction for AYO. Leads on product strategy, fundraising, and the partnerships that move the company forward, keeping the team pointed at what matters most.',
  ],
  [
    '02',
    'Ayman — Co-Founder & COO/CFO',
    'Runs operations and finances. Turns the vision into a working plan: budgets, growth, and the day-to-day machinery that keeps AYO shipping and sustainable.',
  ],
  [
    '03',
    'Yazan — Co-Founder & CTO',
    "Architects AYO's desktop platform and leads engineering, building the on device, privacy-first foundation the product is known for.",
  ],
  [
    '04',
    'Marketing & Development Team — Ahmad, Qusay & Qais',
    "The hands assisting and spreading AYO. From engineering features to getting the product in front of the people who'll love it, this team keeps development and growth moving in parallel.",
  ],
]
function Team() {
  return (
    <Slide>
      <Head no="15 / 16" title="The Team" />
      <div className="card-grid r" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {TEAM.map(([no, title, desc]) => (
          <div className="card" key={no}>
            <span className="card__no">{no}</span>
            <span className="card__title">{title}</span>
            <span className="card__desc">{desc}</span>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ── 16 · Closing ───────────────────────────────────────── */
const LINKS = [
  ['Website', 'heyayo.com', 'https://heyayo.com/'],
  ['Instagram', '@ayosystems', 'https://www.instagram.com/ayosystems'],
  ['YouTube', '@AyoSystems', 'https://www.youtube.com/@AyoSystems'],
  ['X', '@AYO_systems', 'https://x.com/AYO_systems'],
]
function Closing() {
  return (
    <Slide>
      <span className="kicker kicker--clear-brand r">Closing</span>
      <h2 className="headline r" style={{ margin: '18px 0 8px', maxWidth: '20ch' }}>
        AYO makes the computer feel like it finally{' '}
        <span className="grad">understands</span> what you are doing.
      </h2>
      <p className="lead r" style={{ marginBottom: '8px' }}>
        Not another chatbot — an AI layer for the desktop. The first push showed
        people notice it. The next stage proves they use it, trust it, and pay
        for it.
      </p>
      <div className="links r">
        {LINKS.map(([label, handle, href]) => (
          <a className="link-row" href={href} target="_blank" rel="noreferrer" key={label}>
            <span className="link-row__label">
              <span className="brand__dot" />
              {label}
            </span>
            <span className="link-row__url">
              {handle} <span aria-hidden>↗</span>
            </span>
          </a>
        ))}
      </div>
    </Slide>
  )
}

export const SLIDES = [
  { id: 'opening', title: 'Opening', Component: Opening },
  { id: 'different', title: 'Why AYO Is Different', Component: WhyDifferent },
  { id: 'landscape', title: 'The Landscape', Component: Landscape },
  { id: 'problem', title: 'The Problem', Component: Problem },
  { id: 'product', title: 'The Product', Component: Product },
  { id: 'why-now', title: 'Why Now', Component: WhyNow },
  { id: 'signal', title: 'Early Signal', Component: EarlySignal },
  { id: 'learned', title: 'What We Learned', Component: Learned },
  { id: 'growth', title: 'Growth Strategy', Component: Growth },
  { id: 'model', title: 'Growth Model', Component: Model },
  { id: 'raise', title: 'The Raise', Component: Raise },
  { id: 'funds', title: 'Use of Funds', Component: Funds },
  { id: 'spread', title: 'Why AYO Spreads', Component: Spread },
  { id: 'future', title: 'Future Plans', Component: Future },
  { id: 'team', title: 'The Team', Component: Team },
  { id: 'closing', title: 'Closing', Component: Closing },
]
