import { Children, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useReveal } from './hooks/useReveal'

/* Slide order drives the numbering shown in every slide head, so adding or
   removing a slide never leaves a stale "NN / NN" behind. */
const ORDER = [
  'opening',
  'problem',
  'product',
  'how',
  'experience',
  'why-now',
  'market',
  'traction',
  'model',
  'positioning',
  'gtm',
  'validation',
  'roadmap',
  'team',
  'round',
  'appendix',
  'closing',
]

const pad = (n) => String(n).padStart(2, '0')

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

function Head({ id, title }) {
  const no = ORDER.indexOf(id) + 1
  return (
    <div className="slide-head r">
      <span className="section-no">
        {pad(no)} / {pad(ORDER.length)}
      </span>
      <span className="title">{title}</span>
    </div>
  )
}

function Panel({ tag, title, children, accent }) {
  return (
    <div className={`panel${accent ? ' panel--accent' : ''}`}>
      {tag && <span className="panel__tag">{tag}</span>}
      {title && <h3 className="panel__title">{title}</h3>}
      {children}
    </div>
  )
}

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Animated hero: AYO reading the user's workspace ─────── */
function HeroDemo() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const cursor = ref.current.querySelector('.demo__cursor')

      gsap.set('.demo__hl', { opacity: 0, scale: 0.94, transformOrigin: '50% 50%' })
      gsap.set('.demo__pill', { opacity: 0, y: 8 })
      gsap.set('.demo__answer', { opacity: 0, y: 14 })
      gsap.set('.demo__mode', { opacity: 0, y: 8 })
      gsap.set(cursor, { opacity: 0 })

      if (reduced()) {
        gsap.set(['.demo__hl', '.demo__pill', '.demo__answer', '.demo__mode', cursor], {
          opacity: 1,
          scale: 1,
          y: 0,
        })
        return
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to('.demo__hl', { opacity: 1, scale: 1, duration: 0.55 })
        .to(cursor, { opacity: 1, duration: 0.35 }, '-=0.25')
        .to('.demo__pill', { opacity: 1, y: 0, duration: 0.4 }, '-=0.15')
        .to('.demo__answer', { opacity: 1, y: 0, duration: 0.5 }, '+=0.4')
        .to('.demo__mode', { opacity: 1, y: 0, duration: 0.35, stagger: 0.07 }, '-=0.25')

      /* Continuous, perfectly smooth circular orbit around the box centre. */
      const orbit = { a: -Math.PI / 2 }
      const R = 26
      gsap.to(orbit, {
        a: orbit.a + Math.PI * 2,
        duration: 5,
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          gsap.set(cursor, { x: Math.cos(orbit.a) * R, y: Math.sin(orbit.a) * R })
        },
      })
    },
    { scope: ref },
  )

  return (
    <div className="mock demo" ref={ref}>
      <div className="mock__bar">
        <i />
        <i />
        <i />
        <span className="demo__url">workspace</span>
      </div>
      <div className="mock__body">
        <div className="demo__stack">
          <div className="demo__win">
            <span className="demo__win-tag">Moodle</span>
            <span className="demo__win-title">Week 4 research materials</span>
            <div className="demo__line" style={{ width: '78%' }} />
            <div className="demo__line demo__line--sm" style={{ width: '52%' }} />
          </div>

          <div className="demo__win">
            <span className="demo__win-tag">Files</span>
            <span className="demo__win-title">3 documents ready</span>
            <div className="demo__files">
              {['PDF', 'DOCX', 'XLSX'].map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </div>

          <div className="demo__hl" />

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

        <div className="mock__pill demo__pill">
          <span className="brand__dot" />
          “Turn this into a 7-slide presentation.”
        </div>

        <div className="demo__answer">
          <span className="brand__dot" />
          <p>
            Drafting <b>7 slides</b> from the Week 4 material — approve to create
            the file.
          </p>
        </div>

        <div className="demo__modes">
          {['Hey AYO', 'Hover', 'Silent', 'Act'].map((m) => (
            <span className="demo__mode" key={m}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Reusable numbered rail (how it works · go-to-market) ── */
function FlowRail({ steps }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const nodes = gsap.utils.toArray(ref.current.querySelectorAll('.flow__node'))
      const labels = gsap.utils.toArray(ref.current.querySelectorAll('.flow__text'))
      gsap.set(nodes, { scale: 0 })
      gsap.set(labels, { opacity: 0, y: 12 })

      if (reduced()) {
        gsap.set(nodes, { scale: 1 })
        gsap.set(labels, { opacity: 1, y: 0 })
        return
      }

      gsap
        .timeline({ delay: 0.25 })
        .from('.flow__rail-fill', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 0.9,
          ease: 'power2.out',
        })
        .to(nodes, { scale: 1, duration: 0.38, ease: 'back.out(2)', stagger: 0.1 }, '-=0.65')
        .to(labels, { opacity: 1, y: 0, duration: 0.38, stagger: 0.1 }, '<')

      gsap.to('.flow__rail-flow', {
        backgroundPositionX: '-=20',
        duration: 0.85,
        ease: 'none',
        repeat: -1,
      })
    },
    { scope: ref },
  )

  return (
    <div className="flow" ref={ref}>
      <div className="flow__rail">
        <div className="flow__rail-fill" />
        <div className="flow__rail-flow" />
      </div>
      <div className="flow__steps" style={{ '--n': steps.length }}>
        {steps.map(([no, label, sub], i) => (
          <div className="flow__step" key={no}>
            <span
              className={`flow__node${i === steps.length - 1 ? ' flow__node--paid' : ''}`}
            >
              {no}
            </span>
            <span className="flow__text">
              <b className="flow__label">{label}</b>
              {sub && <em className="flow__sub">{sub}</em>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 01 · Opening ───────────────────────────────────────── */
function Opening() {
  return (
    <Slide>
      <div className="cols-2">
        <div className="stack gap-md">
          <span className="kicker r">Pre-Seed · August 2026</span>
          <h1 className="display r">
            Changing how
            <br />
            people use
            <br />
            <span className="grad">their PCs</span>.
          </h1>
          <p className="lead lead--accent r">
            Call it. Point at it. Type silently. Let it act.
          </p>
          <p className="lead r">
            AYO makes AI available inside the user’s existing workflow — through
            voice, cursor, context and user-approved action.
          </p>
          <div className="row r">
            <span className="tag">Prepared for Sadu Capital</span>
            <span className="eyebrow">AYO Systems · heyayo.com</span>
          </div>
        </div>

        <div className="r">
          <HeroDemo />
          <p className="note note--flush" style={{ marginTop: '14px' }}>
            Illustrative product experience.
          </p>
        </div>
      </div>
    </Slide>
  )
}

/* ── 02 · Problem ───────────────────────────────────────── */
const LOOP = [
  'Notice a problem',
  'Open an AI tool',
  'Rebuild the context',
  'Copy the answer',
  'Switch back and apply',
]
const WITH_AYO = [
  ['Point or call', 'Wake word, hover or silent prompt'],
  ['AYO understands', 'Screen, file and workspace context'],
  ['AYO helps or acts', 'Answer, create or execute with approval'],
]
function Problem() {
  return (
    <Slide>
      <Head id="problem" title="The Problem" />
      <h2 className="headline r" style={{ maxWidth: '24ch', marginBottom: '6px' }}>
        AI is powerful. The interface is still{' '}
        <span className="grad">work</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(18px, 3vh, 32px)', maxWidth: '68ch' }}>
        Users leave their task to access intelligence, rebuild context, then
        manually move the answer back.
      </p>

      <div className="cols-2" style={{ alignItems: 'stretch' }}>
        <div className="r">
          <Panel tag="Today" title="The copy–switch–prompt loop">
            <ol className="mini mini--num">
              {LOOP.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="panel__foot">
              Every switch costs attention — and every manual handoff limits what
              AI can do.
            </p>
          </Panel>
        </div>
        <div className="r">
          <Panel accent tag="With AYO" title="Intelligence arrives inside the task">
            <ol className="mini mini--num">
              {WITH_AYO.map(([t, d]) => (
                <li key={t}>
                  <b>{t}</b>
                  <em>{d}</em>
                </li>
              ))}
            </ol>
            <p className="panel__foot">
              The next interface is not another window. It is an always-available
              layer.
            </p>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}

/* ── 03 · Product ───────────────────────────────────────── */
const REACHES = [
  ['“Hey AYO”', 'Wake word', 'Hands-free help without leaving the keyboard, document or game.'],
  ['Cursor context', 'Hover to ask', 'Point at what matters; ask without manually copying or explaining it.'],
  ['Type, don’t speak', 'Silent mode', 'A discreet command layer for classrooms, offices and public spaces.'],
  ['Help → action', 'Proactive + agentic', 'AYO can suggest the next step and execute only after user approval.'],
]
function Product() {
  return (
    <Slide>
      <Head id="product" title="The Product" />
      <h2 className="headline r" style={{ maxWidth: '26ch', marginBottom: '6px' }}>
        One assistant. <span className="grad">Four natural ways</span> to reach it.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(16px, 3vh, 30px)', maxWidth: '64ch' }}>
        AYO adapts to the moment instead of forcing every task into a chat box.
      </p>

      <div className="radial r">
        {REACHES.slice(0, 2).map(([tag, title, desc]) => (
          <div className="radial__card" key={title}>
            <span className="radial__tag">{tag}</span>
            <span className="card__title">{title}</span>
            <span className="card__desc">{desc}</span>
          </div>
        ))}
        <div className="radial__core">
          <span className="brand__dot" />
          <b>AYO</b>
          <em>context-aware AI companion</em>
        </div>
        {REACHES.slice(2).map(([tag, title, desc]) => (
          <div className="radial__card" key={title}>
            <span className="radial__tag">{tag}</span>
            <span className="card__title">{title}</span>
            <span className="card__desc">{desc}</span>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ── 04 · How it works ──────────────────────────────────── */
const PIPELINE = [
  ['1', 'Reach', 'Voice · hover · silent prompt'],
  ['2', 'See', 'Screen · files · email · app context'],
  ['3', 'Reason', 'Route to the right model or tool'],
  ['4', 'Act', 'Draft · create · click · type · organize'],
  ['5', 'Remember', 'Workspace · notes · reminders · preferences'],
]
const GUARANTEES = [
  ['User approval', 'before consequential actions'],
  ['Privacy controls', 'for screen and data access'],
  ['Local-first memory', 'where practical'],
  ['Model flexibility', 'avoids single-provider lock-in'],
]
function HowItWorks() {
  return (
    <Slide>
      <Head id="how" title="How It Works" />
      <h2 className="headline r" style={{ maxWidth: '24ch', marginBottom: '6px' }}>
        From screen context to <span className="grad">trusted action</span>.
      </h2>
      <p className="lead r" style={{ maxWidth: '68ch' }}>
        A model-flexible orchestration layer turns user intent into contextual
        help — while the user stays in control.
      </p>

      <FlowRail steps={PIPELINE} />

      <div className="card-grid r" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {GUARANTEES.map(([title, desc]) => (
          <div className="card" key={title}>
            <span className="card__title">{title}</span>
            <span className="card__desc">{desc}</span>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ── 05 · Experience ────────────────────────────────────── */
const EXPERIENCE = [
  ['Learn', 'Understand what is on screen', 'Explain a Moodle page, summarize a PDF, build a study plan or turn course material into slides.'],
  ['Create', 'Move from script to media', 'Draft, storyboard and route a video request to target creative-generation tools.'],
  ['Build', 'Turn an idea into software', 'Translate intent into a site or app workflow through target development integrations.'],
  ['Work', 'Act across daily applications', 'Understand email and documents, draft responses, extract decisions and complete approved steps.'],
  ['Organize', 'Keep context across the day', 'Files, notes, reminders, workspace memory and personal preferences stay connected.'],
  ['Play', 'A quiet companion for gaming', 'Wake word or hotkey help, minimal HUD, short contextual answers and no forced app switching.'],
]
function Experience() {
  return (
    <Slide>
      <Head id="experience" title="Experience" />
      <h2 className="headline r" style={{ maxWidth: '26ch', marginBottom: '6px' }}>
        AYO turns everyday PC moments into <span className="grad">outcomes</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(16px, 3vh, 28px)', maxWidth: '70ch' }}>
        The product begins with high-frequency consumer and prosumer workflows,
        then deepens across the whole day.
      </p>

      <div className="card-grid r" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {EXPERIENCE.map(([tag, title, desc]) => (
          <div className="card" key={tag}>
            <span className="card__no">{tag.toUpperCase()}</span>
            <span className="card__title">{title}</span>
            <span className="card__desc">{desc}</span>
          </div>
        ))}
      </div>

      <p className="note r" style={{ marginTop: '16px' }}>
        Roadmap examples reference target integrations and ecosystem partners
        under evaluation — not signed commercial partnerships.
      </p>
    </Slide>
  )
}

/* ── 06 · Why now ───────────────────────────────────────── */
const NOW_STATS = [
  ['1.4B+', 'Monthly active Windows 10/11 devices'],
  ['55%', 'Of the 2026 PC market forecast to be AI PCs'],
  ['270M+', 'Worldwide PC shipments in 2025'],
]
const VALIDATION = [
  ['Microsoft', 'Vision + computer-using agents'],
  ['OpenAI', 'Desktop context + computer use'],
  ['Raycast', 'AI across the operating system'],
  ['Cluely', 'Real-time contextual overlay'],
]
function WhyNow() {
  return (
    <Slide>
      <Head id="why-now" title="Why Now" />
      <h2 className="headline r" style={{ maxWidth: '24ch', marginBottom: '6px' }}>
        The PC is becoming an <span className="grad">AI-native surface</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(18px, 3vh, 34px)', maxWidth: '70ch' }}>
        Hardware, operating systems and AI agents are converging; the interaction
        layer is still open.
      </p>

      <div className="stat-row r">
        {NOW_STATS.map(([num, label]) => (
          <div className="stat" key={num}>
            <span className="stat__num grad">{num}</span>
            <span className="stat__label">{label}</span>
          </div>
        ))}
      </div>

      <div className="divider r" />

      <div className="pairs r">
        <span className="pairs__tag">Category validation</span>
        {VALIDATION.map(([name, what]) => (
          <div className="pairs__row" key={name}>
            <b>{name}</b>
            <span>{what}</span>
          </div>
        ))}
      </div>

      <p className="note r" style={{ marginTop: '14px' }}>
        AYO is built for the transition: an independent, model-flexible companion
        that can win on interaction, localization and workflow depth. Sources:
        Microsoft Annual Reports; Gartner AI PC forecast (2025); Gartner PC
        shipments (2026).
      </p>
    </Slide>
  )
}

/* ── 07 · Market ────────────────────────────────────────── */
const FUNNEL = [
  ['TAM', '$168B', '1.4B Windows devices × $120 / year', 'Global Windows software spend opportunity', 100],
  ['SAM', '$12B', '100M high-intent users × $120 / year', 'Students, creators, developers, gamers and knowledge workers', 82],
  ['SOM', '$525M ARR', '2.5M paid users × $17.49 × 12', 'Five-year management objective; ~4.4% of the estimated SAM', 64],
]
function Funnel() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const tiers = gsap.utils.toArray(ref.current.querySelectorAll('.funnel__tier'))
      if (reduced()) return
      gsap.from(tiers, {
        scaleX: 0.4,
        opacity: 0,
        transformOrigin: 'left center',
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.14,
        delay: 0.2,
      })
    },
    { scope: ref },
  )

  return (
    <div className="funnel" ref={ref}>
      {FUNNEL.map(([label, value, math, desc, w]) => (
        <div className="funnel__tier" key={label} style={{ width: `${w}%` }}>
          <span className="funnel__label">{label}</span>
          <span className="funnel__value">{value}</span>
          <span className="funnel__math">{math}</span>
          <span className="funnel__desc">{desc}</span>
        </div>
      ))}
    </div>
  )
}
function Market() {
  return (
    <Slide>
      <Head id="market" title="Market" />
      <h2 className="headline r" style={{ maxWidth: '26ch', marginBottom: '6px' }}>
        A massive installed base; a{' '}
        <span className="grad">focused path</span> into it.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(16px, 3vh, 30px)', maxWidth: '70ch' }}>
        Bottom-up sizing converts the Windows universe into a practical paid-user
        objective.
      </p>

      <div className="r">
        <Funnel />
      </div>

      <p className="note r" style={{ marginTop: '16px' }}>
        Sizing is intentionally bottom-up. It is a planning framework — not a
        third-party market forecast. Windows installed base: Microsoft. SAM and
        SOM are AYO management estimates.
      </p>
    </Slide>
  )
}

/* ── 08 · Traction ──────────────────────────────────────── */
const TRACTION = [
  ['1,130+', 'People on the waitlist'],
  ['71+', 'Active users'],
  ['180K+', 'Organic views / impressions'],
  ['15', 'Customer interviews'],
  ['2', 'Early paid subscriptions'],
]
const FINANCING = [
  ['$15K angel SAFE', 'Committed'],
  ['$60K Ibtikar five-month plan', 'In discussion; terms being agreed'],
  ['$75K initial validation capital', '15% of the $500K round'],
]
function Traction() {
  return (
    <Slide>
      <Head id="traction" title="Traction" />
      <h2 className="headline r" style={{ maxWidth: '26ch', marginBottom: '6px' }}>
        Early demand — and a five-month plan to{' '}
        <span className="grad">prove retention</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(18px, 3vh, 32px)', maxWidth: '70ch' }}>
        AYO has market signal, early willingness to pay and a focused evidence
        program.
      </p>

      <div className="stat-strip r" style={{ '--n': TRACTION.length }}>
        {TRACTION.map(([num, label]) => (
          <div className="stat-strip__item" key={label}>
            <b>{num}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="pairs r" style={{ marginTop: 'clamp(18px, 3vh, 32px)' }}>
        <span className="pairs__tag">Financing status</span>
        {FINANCING.map(([what, state]) => (
          <div className="pairs__row" key={what}>
            <b>{what}</b>
            <span>{state}</span>
          </div>
        ))}
      </div>

      <p className="note r" style={{ marginTop: '14px' }}>
        This is evidence of momentum — not a claim of product–market fit. The next
        five months are designed to test conversion, CAC and retention. Source:
        AYO management data and current financing documents, August 2026.
      </p>
    </Slide>
  )
}

/* ── 09 · Business model ────────────────────────────────── */
const TIERS = [
  ['Free', '$0', '/ month', 'Try the companion'],
  ['Explorer', '$5', '/ month', 'Light monthly use'],
  ['Plus', '$14.99', '/ month', 'Primary paid plan'],
  ['Pro', '$30', '/ month', 'High-intensity users'],
]
const LADDER = [
  ['Land', 'Free + Explorer'],
  ['Monetize', 'Plus'],
  ['Deepen', 'Pro'],
]
function BusinessModel() {
  return (
    <Slide>
      <Head id="model" title="Business Model" />
      <h2 className="headline r" style={{ maxWidth: '28ch', marginBottom: '6px' }}>
        Consumer simplicity;{' '}
        <span className="grad">software margins</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(16px, 3vh, 28px)', maxWidth: '72ch' }}>
        Freemium drives reach. Paid plans monetize intensity. Recurring
        subscriptions compound as usage deepens.
      </p>

      <div className="tiers r" style={{ '--n': TIERS.length }}>
        {TIERS.map(([name, price, per, desc]) => (
          <div className={`tier${name === 'Plus' ? ' tier--accent' : ''}`} key={name}>
            <span className="tier__name">{name}</span>
            {price && <span className="tier__price">{price}</span>}
            <span className="tier__per">{per}</span>
            <span className="tier__desc">{desc}</span>
          </div>
        ))}
      </div>

      <div className="model-foot r">
        <div className="model-foot__arpu">
          <b className="grad">$17.49</b>
          <span>Blended paid ARPU</span>
        </div>
        <div className="ladder">
          {LADDER.map(([step, what]) => (
            <div className="ladder__step" key={step}>
              <b>{step}</b>
              <span>{what}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="note r" style={{ marginTop: '14px' }}>
        Recurring subscriptions + usage economics; future marketplace /
        integration revenue is optional upside, not in the base case. Pricing and
        blended ARPU: AYO management assumptions, August 2026.
      </p>
    </Slide>
  )
}

/* ── 10 · Positioning ───────────────────────────────────── */
const MAP_POINTS = [
  ['Manual copy–paste', 19, 87, 'manual'],
  ['ChatGPT Desktop', 26, 64],
  ['Cluely', 30, 28],
  ['Raycast', 54, 44],
  ['Microsoft Copilot', 60, 68],
  ['AYO', 82, 16, 'ayo'],
]
const AYO_EDGES = [
  ['Wake word', 'Hands-free'],
  ['Hover', 'Point at context'],
  ['Silent', 'Discreet command'],
  ['Proactive', 'Next-step help'],
  ['Localized', 'Arabic / GCC roadmap'],
]
function PositionMap() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const pts = gsap.utils.toArray(ref.current.querySelectorAll('.map__pt'))
      if (reduced()) return
      gsap.from(pts, {
        scale: 0,
        opacity: 0,
        transformOrigin: '50% 50%',
        duration: 0.45,
        ease: 'back.out(2)',
        stagger: 0.09,
        delay: 0.25,
      })
    },
    { scope: ref },
  )

  return (
    <div className="map" ref={ref}>
      <span className="map__axis map__axis--y-top">Always-present + contextual</span>
      <span className="map__axis map__axis--y-bot">App / session specific</span>
      <span className="map__axis map__axis--x-left">Answers</span>
      <span className="map__axis map__axis--x-right">Action across apps</span>
      <div className="map__plot">
        <span className="map__gridline map__gridline--v" />
        <span className="map__gridline map__gridline--h" />
        {MAP_POINTS.map(([name, x, y, kind]) => (
          <span
            className={`map__pt${kind ? ` map__pt--${kind}` : ''}`}
            key={name}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <i />
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
function Positioning() {
  return (
    <Slide>
      <Head id="positioning" title="Positioning" />
      <h2 className="headline r" style={{ maxWidth: '26ch', marginBottom: '6px' }}>
        AYO competes on the{' '}
        <span className="grad">interaction layer</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(14px, 2.4vh, 24px)', maxWidth: '72ch' }}>
        The category is crowded at the model and app layer; AYO’s advantage is how
        intelligence is reached and used.
      </p>

      <div className="cols-2" style={{ alignItems: 'center' }}>
        <div className="r">
          <PositionMap />
        </div>
        <div className="stack gap-sm">
          <p className="lead lead--accent r" style={{ maxWidth: '30ch' }}>
            Voice + hover + silent + proactive, in one layer.
          </p>
          <div className="lines lines--tight r" style={{ width: '100%' }}>
            {AYO_EDGES.map(([title, sub], i) => (
              <div className="line-item" key={title}>
                <span className="line-item__no">{pad(i + 1)}</span>
                <div>
                  <div className="line-item__text">{title}</div>
                  <div className="line-item__sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="note r" style={{ marginTop: '14px' }}>
        Illustrative positioning based on public product pages, accessed August
        2026.
      </p>
    </Slide>
  )
}

/* ── 11 · Go-to-market ──────────────────────────────────── */
const GTM_STEPS = [
  ['1', 'Show', 'Creator demos + product storytelling'],
  ['2', 'Activate', 'Waitlist + tracked landing pages'],
  ['3', 'Trial', '14-day Plus trial; card required'],
  ['4', 'Convert', 'Paid cohort by source and persona'],
  ['5', 'Retain', 'Renewal, churn and daily engagement'],
]
const ENGINE = [
  'Major YouTube creator integrations',
  'Professional product demos',
  'UGC + niche creators',
  'Paid amplification',
  'Referral loops + Arabic/GCC content',
]
const GATES = [
  ['≤ $45', 'All-in paid CAC target'],
  ['35%', 'Trial-to-paid target'],
  ['≥ 1,000', 'Paid users by M4 target'],
]
function GoToMarket() {
  return (
    <Slide>
      <Head id="gtm" title="Go-to-Market" />
      <h2 className="headline r" style={{ maxWidth: '28ch', marginBottom: '6px' }}>
        Demonstration first. Cohort evidence second.{' '}
        <span className="grad">Scale third.</span>
      </h2>
      <p className="lead r" style={{ maxWidth: '72ch' }}>
        AYO is experienced visually, so creator-led proof is the acquisition
        wedge — and retention is the gate.
      </p>

      <FlowRail steps={GTM_STEPS} />

      <div className="cols-2" style={{ alignItems: 'stretch' }}>
        <div className="r">
          <Panel tag="Acquisition engine">
            <ul className="mini">
              {ENGINE.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </Panel>
        </div>
        <div className="r">
          <Panel accent tag="Scale gates">
            <div className="gates">
              {GATES.map(([num, label]) => (
                <div className="gates__item" key={label}>
                  <b>{num}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <p className="note r" style={{ marginTop: '14px' }}>
        Targets and assumptions: AYO five-month financial model v2.4.
      </p>
    </Slide>
  )
}

/* ── 12 · Validation plan ───────────────────────────────── */
const MONTHS = [
  ['M1', 'Ready', ['Product hardening', 'Billing + attribution', 'Code signing']],
  ['M2', 'Launch', ['Creator campaign', '14-day Plus trial', 'Tracked cohorts']],
  ['M3', 'Convert', ['Paid cohort', 'CAC + MRR report', 'Usage depth']],
  ['M4', 'Renew', ['First renewal', 'Churn evidence', 'Referral signal']],
  ['M5', 'Decide', ['Consolidated CAC', 'Retention + churn', 'Scale decision']],
]
const OUTPUTS = [
  ['$20.4K', 'M5 ending MRR'],
  ['1,168', 'M5 paid users'],
  ['74.5%', 'M5 gross margin'],
  ['+$0.9K', 'M5 monthly EBITDA'],
]
function Timeline() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const cols = gsap.utils.toArray(ref.current.querySelectorAll('.tl__col'))
      if (reduced()) return
      gsap
        .timeline({ delay: 0.2 })
        .from('.tl__rail', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 0.85,
          ease: 'power2.out',
        })
        .from(cols, { opacity: 0, y: 14, duration: 0.4, stagger: 0.1 }, '-=0.6')
    },
    { scope: ref },
  )

  return (
    <div className="tl" ref={ref}>
      <div className="tl__rail" />
      <div className="tl__cols">
        {MONTHS.map(([m, phase, items], i) => (
          <div className={`tl__col${i === MONTHS.length - 1 ? ' tl__col--last' : ''}`} key={m}>
            <span className="tl__m">{m}</span>
            <span className="tl__phase">{phase}</span>
            <ul className="mini mini--tight">
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
function ValidationPlan() {
  return (
    <Slide>
      <Head id="validation" title="Validation Plan" />
      <h2 className="headline r" style={{ maxWidth: '28ch', marginBottom: '6px' }}>
        Five months turn product belief into{' '}
        <span className="grad">investment evidence</span>.
      </h2>
      <p className="lead r" style={{ maxWidth: '72ch' }}>
        The $75K phase is designed to answer one question: should AYO scale
        acquisition and expansion?
      </p>

      <div className="r">
        <Timeline />
      </div>

      <div className="stat-strip r">
        {OUTPUTS.map(([num, label]) => (
          <div className="stat-strip__item" key={label}>
            <b>{num}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <p className="note r" style={{ marginTop: '14px' }}>
        Base-case planning outputs — not guarantees. Live cohort evidence replaces
        assumptions as it arrives. Source: AYO five-month validation &amp;
        12-month planning model v2.4.
      </p>
    </Slide>
  )
}

/* ── 13 · Roadmap ───────────────────────────────────────── */
const PHASES = [
  [
    'Now → M5',
    'Prove',
    [
      'Windows reliability + trust',
      'Wake word, hover and silent mode',
      'Gaming mode + minimal contextual HUD',
      'Activation, paid conversion and retention',
      'Measurable creator acquisition',
    ],
  ],
  [
    'M6 → M12',
    'Expand',
    [
      'Arabic + multilingual experience',
      'Mobile companion + cross-device continuity',
      'Saudi/GCC creator and campus growth',
      'Deeper app and workflow integrations',
    ],
  ],
  [
    'M12 → M18',
    'Platform',
    [
      'Agent-to-agent coordination across tools',
      'Tool-routing and integration marketplace',
      'Mac/Linux readiness based on demand',
    ],
  ],
]
const TARGETS = ['Higgsfield / video', 'Manus / presentations', 'Replit / apps & sites', 'Productivity + knowledge tools']
function Roadmap() {
  return (
    <Slide>
      <Head id="roadmap" title="Roadmap" />
      <h2 className="headline r" style={{ maxWidth: '30ch', marginBottom: '6px' }}>
        Validate the wedge. Expand the surfaces.{' '}
        <span className="grad">Become the layer.</span>
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(16px, 3vh, 28px)', maxWidth: '74ch' }}>
        Consumer proof creates the right to enter Arabic/GCC, mobile continuity,
        gaming and deeper integrations.
      </p>

      <div className="phases r">
        {PHASES.map(([when, name, items], i) => (
          <div className={`phase${i === 0 ? ' phase--now' : ''}`} key={name}>
            <span className="phase__when">{when}</span>
            <span className="phase__name">{name}</span>
            <ul className="mini">
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="targets r">
        <span className="targets__tag">Target workflow integrations</span>
        <div className="chips">
          {TARGETS.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <p className="note r" style={{ marginTop: '12px' }}>
        Target integrations are exploratory roadmap items; no partnership is
        implied.
      </p>
    </Slide>
  )
}

/* ── 14 · Team ──────────────────────────────────────────── */
const TEAM = [
  ['OJ', 'Omar Jaber', 'CEO · Product & vision'],
  ['AA', 'Ayman Arafat', 'COO / CFO · Operations'],
  ['YA', 'Yazan Aydi', 'CTO · Architecture'],
  ['Q', 'Qusay', 'Product engineering'],
  ['Q', 'Qais', 'Growth & marketing'],
]
const ADVISORS = [
  ['Middleframe CEO', 'Strategic product, positioning and company-building guidance'],
  ['Orange Corners', 'Continued tailored mentoring and ecosystem support'],
]
function Team() {
  return (
    <Slide>
      <Head id="team" title="Team" />
      <h2 className="headline r" style={{ maxWidth: '28ch', marginBottom: '6px' }}>
        Founder-led execution with a deliberately{' '}
        <span className="grad">lean core</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(18px, 3vh, 32px)', maxWidth: '74ch' }}>
        Product, operations, engineering and growth are owned internally; advisors
        shorten the learning curve.
      </p>

      <div className="people r">
        {TEAM.map(([initials, name, role]) => (
          <div className="person" key={name}>
            <span className="person__av">{initials}</span>
            <span className="person__name">{name}</span>
            <span className="person__role">{role}</span>
          </div>
        ))}
      </div>

      <div className="pairs r" style={{ marginTop: 'clamp(18px, 3vh, 32px)' }}>
        <span className="pairs__tag">Advisory backbone</span>
        {ADVISORS.map(([name, what]) => (
          <div className="pairs__row" key={name}>
            <b>{name}</b>
            <span>{what}</span>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ── 16 · The round ─────────────────────────────────────── */
const USE_OF_FUNDS = [
  ['Core product + engineering', 45, '#6d4bff'],
  ['Growth + distribution', 30, '#2f6bff'],
  ['Arabic + GCC + mobile', 15, '#ff8a3d'],
  ['Security, legal + operations', 10, '#21c7d6'],
]
function AllocBar() {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from(ref.current.querySelectorAll('span'), {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.09,
        delay: 0.25,
      })
    },
    { scope: ref },
  )

  return (
    <div className="alloc" ref={ref}>
      {USE_OF_FUNDS.map(([label, pct, color]) => (
        <span key={label} style={{ width: `${pct}%`, background: color }} />
      ))}
    </div>
  )
}
function RoundBar() {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from(ref.current.querySelectorAll('.round-bar__track > div'), {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.25,
      })
    },
    { scope: ref },
  )

  return (
    <div className="round-bar" ref={ref}>
      <div className="round-bar__track">
        <div className="round-bar__secured" style={{ width: '3%' }} />
        <div className="round-bar__talks" style={{ width: '12%' }} />
      </div>
      <div className="round-bar__legend">
        <span>
          <b>$15K</b> committed
        </span>
        <span>
          <b>$60K</b> in discussion
        </span>
        <span>
          <b>$425K</b> open
        </span>
      </div>
    </div>
  )
}
function TheRound() {
  return (
    <Slide>
      <Head id="round" title="The Round" />
      <h2 className="headline r" style={{ maxWidth: '28ch', marginBottom: '6px' }}>
        The first $75K proves AYO. The remaining{' '}
        <span className="grad">$425K scales it</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(14px, 2.4vh, 26px)', maxWidth: '74ch' }}>
        AYO is raising a $500K pre-seed round with deployment gated by evidence
        from the five-month plan.
      </p>

      <div className="cols-2" style={{ alignItems: 'start' }}>
        <div className="stack gap-sm">
          <div className="round-total r">
            <b>$500K</b>
            <span>Total pre-seed target</span>
          </div>
          <div className="r">
            <RoundBar />
          </div>
          <div className="pairs r">
            <div className="pairs__row">
              <b>$15K angel SAFE</b>
              <span>Committed</span>
            </div>
            <div className="pairs__row">
              <b>$60K Ibtikar plan</b>
              <span>In discussion; terms being agreed</span>
            </div>
          </div>
          <div className="callout r">
            Proposed role for Sadu: <b>lead or co-lead the balance</b>, with
            milestone-based deployment after M5 evidence.
          </div>
        </div>

        <div className="stack gap-sm">
          <span className="pairs__tag r">$425K use of funds</span>
          <div className="r">
            <AllocBar />
          </div>
          <div className="legend r">
            {USE_OF_FUNDS.map(([label, pct, color]) => (
              <div className="legend__row" key={label}>
                <i style={{ background: color }} />
                <span>{label}</span>
                <b>{pct}%</b>
              </div>
            ))}
          </div>
          <p className="body r">
            18-month scale plan · product-led growth → Arabic/GCC → mobile
            continuity.
          </p>
        </div>
      </div>

      <p className="statement r" style={{ marginTop: 'clamp(16px, 3vh, 30px)', maxWidth: '44ch' }}>
        Build the easiest way to use AI — then make it the{' '}
        <span className="grad">new way people use computers</span>.
      </p>

      <p className="note r" style={{ marginTop: '12px' }}>
        Financing status as of August 2026; future participation remains subject
        to diligence and approval.
      </p>
    </Slide>
  )
}

/* ── 17 · Appendix ──────────────────────────────────────── */
const SOURCES = [
  ['Microsoft Annual Report 2022', '1.4B+ active Windows 10/11 devices', 'https://www.microsoft.com/investor/reports/ar22/index.html'],
  ['Gartner, Aug. 2025', '143M AI PCs / 55% share forecast for 2026', 'https://www.gartner.com/en/newsroom/press-releases/2025-08-28-gartner-says-artificial-intelligence-pcs-will-represent-31-percent-of-worldwide-pc-market-by-the-end-of-2025'],
  ['Gartner, Jan. 2026', '270M+ worldwide PC shipments in 2025', 'https://www.gartner.com/en/newsroom/press-releases/2026-1-20-gartner-says-worldwide-pc-shipments-increased-9-point-3-percent-in-fourth-quarter-of-2025-and-9-point-1-percent-for-the-full-year'],
  ['Microsoft Copilot', 'Vision and computer-using agents', 'https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/06/12/copilot-vision-on-windows-with-highlights-is-now-available-in-the-u-s'],
  ['OpenAI', 'Desktop context and computer use', 'https://openai.com/index/chatgpt-for-your-most-ambitious-work'],
  ['Raycast', 'AI that works with the operating system', 'https://www.raycast.com/core-features/ai'],
  ['Cluely', 'Real-time, screen-aware meeting assistant', 'https://cluely.com'],
  ['Sadu Capital', 'Early-stage applied AI and scalable software focus', 'https://www.sadu.vc/the-most-active-vc-firms-in-mena'],
  ['Replit Agent', 'Natural-language app and website creation', 'https://replit.com/products/agent'],
  ['Manus Slides', 'AI-generated presentations', 'https://manus.im/docs/features/slides'],
  ['Higgsfield', 'AI video and image generation platform', 'https://higgsfield.ai/ai-video'],
  ['AYO internal', 'Traction, pricing, forecasts and financing status', null],
]
function Appendix() {
  return (
    <Slide>
      <Head id="appendix" title="Appendix" />
      <h2 className="headline r" style={{ maxWidth: '28ch', marginBottom: '6px' }}>
        Sources, definitions and{' '}
        <span className="grad">important notes</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(14px, 2.4vh, 24px)', maxWidth: '74ch' }}>
        External market and competitor claims use public primary sources. Internal
        metrics are management-reported.
      </p>

      <div className="sources r">
        {SOURCES.map(([name, what, href]) => {
          const Tag = href ? 'a' : 'div'
          const props = href ? { href, target: '_blank', rel: 'noreferrer' } : {}
          return (
            <Tag className="source" key={name} {...props}>
              <span className="source__name">{name}</span>
              <span className="source__what">{what}</span>
              <span className="source__url">
                {href ? `${new URL(href).hostname.replace('www.', '')} ↗` : 'Planning model v2.4, August 2026'}
              </span>
            </Tag>
          )
        })}
      </div>

      <p className="note r" style={{ marginTop: '14px' }}>
        Important: TAM/SAM/SOM, roadmap timing, forecasts and financing outcomes
        are planning estimates — not guarantees. Target integrations do not imply
        signed partnerships.
      </p>
    </Slide>
  )
}

/* ── 18 · Thank you ─────────────────────────────────────── */
const LINKS = [
  ['Website', 'heyayo.com', 'https://heyayo.com/'],
  ['Instagram', '@ayosystems', 'https://www.instagram.com/ayosystems'],
  ['YouTube', '@AyoSystems', 'https://www.youtube.com/@AyoSystems'],
  ['X', '@AYO_systems', 'https://x.com/AYO_systems'],
]
function Closing() {
  return (
    <Slide>
      <div className="cols-2">
        <div className="stack gap-md">
          <span className="kicker r">Prepared for Sadu Capital</span>
          <h1 className="display r">
            Thank <span className="grad">you</span>.
          </h1>
          <p className="lead r">
            The first $75K proves AYO. The next stage makes the AI interface for
            the PC the way people work every day.
          </p>
          <div className="row r">
            <span className="tag">Pre-Seed · August 2026</span>
            <span className="eyebrow">AYO Systems</span>
          </div>
        </div>

        <div className="links r">
          {LINKS.map(([label, handle, href]) => (
            <a
              className="link-row"
              href={href}
              target="_blank"
              rel="noreferrer"
              key={label}
            >
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
      </div>
    </Slide>
  )
}

export const SLIDES = [
  { id: 'opening', title: 'Opening', Component: Opening },
  { id: 'problem', title: 'The Problem', Component: Problem },
  { id: 'product', title: 'The Product', Component: Product },
  { id: 'how', title: 'How It Works', Component: HowItWorks },
  { id: 'experience', title: 'Experience', Component: Experience },
  { id: 'why-now', title: 'Why Now', Component: WhyNow },
  { id: 'market', title: 'Market', Component: Market },
  { id: 'traction', title: 'Traction', Component: Traction },
  { id: 'model', title: 'Business Model', Component: BusinessModel },
  { id: 'positioning', title: 'Positioning', Component: Positioning },
  { id: 'gtm', title: 'Go-to-Market', Component: GoToMarket },
  { id: 'validation', title: 'Validation Plan', Component: ValidationPlan },
  { id: 'roadmap', title: 'Roadmap', Component: Roadmap },
  { id: 'team', title: 'Team', Component: Team },
  { id: 'round', title: 'The Round', Component: TheRound },
  { id: 'appendix', title: 'Appendix', Component: Appendix },
  { id: 'closing', title: 'Thank You', Component: Closing },
]
