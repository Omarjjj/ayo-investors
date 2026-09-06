import { Children, Fragment, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useReveal } from './hooks/useReveal'
import { useFit } from './hooks/useFit'

/* Slide order drives the numbering shown in every slide head, so adding or
   removing a slide never leaves a stale "NN / NN" behind. */
const ORDER = [
  'opening',
  'gap',
  'friction',
  'experience',
  'trust',
  'traction',
  'model',
  'moat',
  'validation',
  'team',
  'round',
  'closing',
]

const pad = (n) => String(n).padStart(2, '0')

/* Shared shell: paints the Swiss frame, runs the staggered entrance, and
   scales the slide down if it would otherwise overflow the screen. */
function Slide({ children }) {
  const scope = useReveal()
  const fit = useFit()
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
    <div className="slide" ref={fit}>
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

/* The spoken hand-off into the next slide, so the deck and the script tell
   the same story. */
function Bridge({ children }) {
  return <p className="bridge r">{children}</p>
}

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* =========================================================
   Animated hero: AYO hears the request, reads the screen,
   does the work, and stops for approval.
   ========================================================= */
const HERO_STEPS = ['Opening File Explorer', 'Found 14 invoices', 'Renaming and moving']

function HeroDemo() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const cursor = ref.current.querySelector('.hero__cursor')
      const steps = gsap.utils.toArray(ref.current.querySelectorAll('.hero__step'))
      const all = ['.hero__ask', '.hero__scan', '.hero__plan', '.hero__approve', cursor]

      gsap.set('.hero__ask', { opacity: 0, y: 10 })
      gsap.set('.hero__scan', { opacity: 0, scale: 0.95, transformOrigin: '50% 50%' })
      gsap.set('.hero__plan', { opacity: 0, y: 12 })
      gsap.set(steps, { opacity: 0.25 })
      gsap.set('.hero__step i', { scale: 0, transformOrigin: '50% 50%' })
      gsap.set('.hero__approve', { opacity: 0, y: 8 })
      gsap.set(cursor, { opacity: 0, x: 0, y: 0 })

      if (reduced()) {
        gsap.set(all, { opacity: 1, scale: 1, y: 0 })
        gsap.set(steps, { opacity: 1 })
        gsap.set('.hero__step i', { scale: 1 })
        return
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out' }, repeat: -1, repeatDelay: 2.2 })
        .to('.hero__ask', { opacity: 1, y: 0, duration: 0.45 })
        .to('.hero__scan', { opacity: 1, scale: 1, duration: 0.5 }, '+=0.2')
        .to(cursor, { opacity: 1, duration: 0.3 }, '<')
        .to(cursor, { x: 96, y: 58, duration: 0.8, ease: 'power2.inOut' })
        .to('.hero__plan', { opacity: 1, y: 0, duration: 0.4 }, '-=0.45')
        .to(steps, { opacity: 1, duration: 0.3, stagger: 0.42 }, '-=0.1')
        .to(
          '.hero__step i',
          { scale: 1, duration: 0.3, ease: 'back.out(2.6)', stagger: 0.42 },
          '<+=0.12',
        )
        .to('.hero__approve', { opacity: 1, y: 0, duration: 0.4 }, '+=0.15')
        .to({}, { duration: 1.4 })

      /* The listening ring never stops: AYO is always on. */
      gsap.to('.hero__pulse', {
        scale: 2.1,
        opacity: 0,
        duration: 1.9,
        ease: 'power2.out',
        repeat: -1,
      })
    },
    { scope: ref },
  )

  return (
    <div className="mock hero" ref={ref}>
      <div className="mock__bar">
        <i />
        <i />
        <i />
        <span className="hero__os">Windows</span>
        <span className="hero__badge">
          <span className="brand__dot" />
          <span className="hero__pulse" />
          Listening
        </span>
      </div>

      <div className="mock__body">
        <div className="hero__work">
          <div className="hero__win">
            <span className="hero__win-tag">Downloads</span>
            <span className="hero__win-title">Invoices, unsorted</span>
            <div className="hero__line" style={{ width: '76%' }} />
            <div className="hero__line hero__line--sm" style={{ width: '54%' }} />
            <span className="hero__scan" />
          </div>

          <div className="hero__win">
            <span className="hero__win-tag">Finance</span>
            <span className="hero__win-title">Q3 folder</span>
            <div className="hero__files">
              {['PDF', 'PDF', 'XLSX'].map((f, i) => (
                <span key={i}>{f}</span>
              ))}
            </div>
          </div>

          <svg className="hero__cursor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3 2l7 18 2.5-7.5L20 10z"
              fill="#0b0b10"
              stroke="#fff"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="hero__ask">
          <span className="hero__ask-tag">You</span>
          “Hey AYO, file last month’s invoices.”
        </div>

        <div className="hero__plan">
          <span className="hero__plan-tag">
            <span className="brand__dot" />
            AYO is doing it
          </span>
          <div className="hero__steps">
            {HERO_STEPS.map((s) => (
              <span className="hero__step" key={s}>
                <i />
                {s}
              </span>
            ))}
          </div>
          <div className="hero__approve">
            <span>Move 14 files into Finance?</span>
            <b>Approve</b>
            <em>Not now</em>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   01 Opening
   ========================================================= */
function Opening() {
  return (
    <Slide>
      <div className="cols-2">
        <div className="stack gap-md">
          <span className="kicker r">Pre-Seed · September 2026</span>
          <h1 className="display r">
            Someone
            <br />
            incredibly smart,
            <br />
            <span className="grad">beside you</span>.
          </h1>
          <p className="lead lead--accent r">
            Always available. One call away. It can do the work.
          </p>
          <p className="lead r">
            Point at anything on your screen and AYO handles it. It opens the
            apps, finds the files, clicks and types, and asks first before
            anything important.
          </p>
          <div className="row r">
            <span className="tag">The always available agent for Windows</span>
            <span className="eyebrow">heyayo.com</span>
          </div>
        </div>

        <div className="r">
          <HeroDemo />
        </div>
      </div>

      <Bridge>If agents are this capable, why are they still so hard to build?</Bridge>
    </Slide>
  )
}

/* =========================================================
   02 The gap
   ========================================================= */
const GAP_STATS = [
  ['2.2B', 'AI agents active by 2030'],
  ['3 weeks', 'To build one workflow agent'],
  ['1.4B', 'Windows users being skipped'],
]
const MISMATCH = [
  ['Where agents are built', 'Mac first, developer first'],
  ['Where the users are', '1.4B Windows devices'],
  ['Where the budgets are', '450M+ Microsoft 365 seats'],
]
function Gap() {
  return (
    <Slide>
      <Head id="gap" title="The Gap" />
      <h2 className="headline r" style={{ maxWidth: '24ch', marginBottom: 'clamp(20px, 3.4vh, 40px)' }}>
        Billions of agents are coming. Almost none are built for{' '}
        <span className="grad">Windows</span>.
      </h2>

      <div className="stat-row r">
        {GAP_STATS.map(([num, label]) => (
          <div className="stat" key={num}>
            <span className="stat__num grad">{num}</span>
            <span className="stat__label">{label}</span>
          </div>
        ))}
      </div>

      <div className="divider r" />

      <div className="pairs r">
        <span className="pairs__tag">The mismatch</span>
        {MISMATCH.map(([name, what]) => (
          <div className="pairs__row" key={name}>
            <b>{name}</b>
            <span>{what}</span>
          </div>
        ))}
      </div>

      <Bridge>So why is one agent still this slow to build?</Bridge>

      <p className="note r" style={{ marginTop: '10px' }}>
        IDC via Statista, 2026. Microsoft FY26 Q2. Build time is AYO internal data.
      </p>
    </Slide>
  )
}

/* =========================================================
   03 The friction
   ========================================================= */
const REQS = ['MCP', 'Auth', 'Permissions', 'Approvals', 'Testing']
const APPS = [
  ['Google Workspace', 'work'],
  ['Slack', 'work'],
  ['Microsoft 365', 'work'],
  ['Design tools', 'work'],
  ['Internal software, no API', 'blocked'],
]
function IntegrationMatrix() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const marks = gsap.utils.toArray(ref.current.querySelectorAll('.cmp__mark'))
      if (reduced()) return
      gsap.from(marks, {
        scale: 0,
        opacity: 0,
        transformOrigin: '50% 50%',
        duration: 0.3,
        ease: 'back.out(2)',
        stagger: 0.018,
        delay: 0.2,
      })
    },
    { scope: ref },
  )

  return (
    <div className="cmp" ref={ref}>
      <div className="cmp__row">
        <span className="cmp__cell cmp__cell--head">Every app you connect</span>
        {REQS.map((r) => (
          <span className="cmp__cell cmp__cell--head cmp__cell--mark" key={r}>
            {r}
          </span>
        ))}
      </div>
      {APPS.map(([app, kind]) => (
        <div className="cmp__row" key={app}>
          <span
            className={`cmp__cell cmp__cell--cap${kind === 'blocked' ? ' cmp__cell--off' : ''}`}
          >
            {app}
          </span>
          {REQS.map((r) => (
            <span
              className={`cmp__cell cmp__cell--mark${kind === 'blocked' ? ' cmp__cell--off' : ''}`}
              key={r}
            >
              {kind === 'blocked' ? (
                <b className="cmp__mark cmp__none">n / a</b>
              ) : (
                <i className="cmp__mark cmp__work" />
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
const COMPOUNDS = [
  ['Slower to build', 'Every app restarts the same five steps'],
  ['Harder to orchestrate', 'More surfaces, more failure paths'],
  ['More fragile', 'One API change breaks the workflow'],
]
function Friction() {
  return (
    <Slide>
      <Head id="friction" title="Why It Is Hard" />
      <h2 className="headline r" style={{ maxWidth: '24ch', marginBottom: '6px' }}>
        Agents are built{' '}
        <span className="grad">one integration at a time</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(14px, 2.4vh, 26px)', maxWidth: '68ch' }}>
        Every app needs its own connector, authentication, permissions, approvals
        and testing.
      </p>

      <div className="r">
        <IntegrationMatrix />
      </div>

      <div
        className="cols-2"
        style={{ alignItems: 'stretch', marginTop: 'clamp(14px, 2.4vh, 26px)' }}
      >
        <div className="r">
          <Panel accent tag="What it cost us" title="10 days waiting. Zero lines of code.">
            <p className="panel__foot">
              Google Workspace approval alone, before development even started.
              That is one app.
            </p>
          </Panel>
        </div>
        <div className="r">
          <Panel tag="And it compounds">
            <ul className="mini">
              {COMPOUNDS.map(([t, d]) => (
                <li key={t}>
                  <b>{t}</b>
                  <em>{d}</em>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Bridge>
        So how does one assistant operate everything without integrating with
        anything?
      </Bridge>
    </Slide>
  )
}

/* =========================================================
   04 Product experience: the three ways to reach AYO
   ========================================================= */
const MODES = [
  [
    'voice',
    'Wake word',
    'Say “Hey AYO” from anywhere.',
    'Hands-free help without leaving what you are doing, even while working or gaming.',
  ],
  [
    'silent',
    'Silent mode',
    'Press a shortcut and type privately.',
    'Instant access for the moments when speaking is not practical.',
  ],
  [
    'space',
    'AYO workspace',
    'Open AYO’s home base.',
    'Conversations, tasks, reminders, activity and preferences in one place.',
  ],
]

/* A small live sketch of each entry point, so the modes read as product
   rather than as three paragraphs. */
function ModeViz({ kind }) {
  if (kind === 'voice') {
    return (
      <div className="viz">
        <span className="viz__pill">
          <span className="brand__dot" />
          Hey AYO
        </span>
        <span className="viz__bars">
          {Array.from({ length: 7 }).map((_, i) => (
            <i key={i} />
          ))}
        </span>
      </div>
    )
  }

  if (kind === 'silent') {
    return (
      <div className="viz">
        <span className="viz__keys">
          <kbd>Ctrl</kbd>
          <kbd>Space</kbd>
        </span>
        <span className="viz__field">
          summarize this page
          <i className="viz__caret" />
        </span>
      </div>
    )
  }

  return (
    <div className="viz">
      <span className="viz__rail">
        {['tasks', 'notes', 'activity'].map((r) => (
          <i key={r} />
        ))}
      </span>
      <span className="viz__panel">
        <i style={{ width: '72%' }} />
        <i style={{ width: '46%' }} />
        <i style={{ width: '58%' }} />
      </span>
    </div>
  )
}

function Experience() {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (reduced()) return

      gsap.to(ref.current.querySelectorAll('.viz__bars i'), {
        scaleY: () => gsap.utils.random(0.45, 2.4),
        duration: 0.42,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.07, from: 'center' },
      })

      gsap.to(ref.current.querySelectorAll('.viz__caret'), {
        opacity: 0,
        duration: 0.55,
        ease: 'steps(1)',
        repeat: -1,
        yoyo: true,
      })
    },
    { scope: ref },
  )

  return (
    <Slide>
      <Head id="experience" title="Product Experience" />
      <h2 className="headline r" style={{ maxWidth: '25ch', marginBottom: '6px' }}>
        Your Windows agent.{' '}
        <span className="grad">Always one call away</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(14px, 2.6vh, 30px)', maxWidth: '66ch' }}>
        Most AI assistants wait inside another window. AYO stays available across
        Windows and operates it directly, with no per app integration.
      </p>

      <div className="modes r" ref={ref}>
        {MODES.map(([kind, tag, title, desc]) => (
          <div className="mode" key={tag}>
            <ModeViz kind={kind} />
            <span className="mode__tag">{tag}</span>
            <span className="mode__title">{title}</span>
            <span className="mode__desc">{desc}</span>
          </div>
        ))}
      </div>

      <p className="statement r" style={{ marginTop: 'clamp(16px, 3vh, 32px)', maxWidth: '44ch' }}>
        Speak. Type silently. Or open the workspace.{' '}
        <span className="grad">Same agent, wherever you are.</span>
      </p>

      <Bridge>
        But if AYO can see the screen and operate the whole PC, how does the user
        stay in control?
      </Bridge>
    </Slide>
  )
}

/* =========================================================
   05 Trust and control
   ========================================================= */
const GUARANTEES = [
  [
    'Private by design',
    'Relevant screen context is processed only when needed, not continuously recorded.',
    'Memory and preferences stay local whenever possible.',
    'var(--cyan)',
  ],
  [
    'Permissioned actions',
    'AYO operates only within the access and permissions the user gives it.',
    'Sending, sharing, deleting or purchasing always require approval.',
    'var(--violet)',
  ],
  [
    'Deterministic safety',
    'Safety rules are enforced in code, not left to the model’s judgement.',
    'Sensitive, forbidden or out of scope actions are blocked.',
    'var(--magenta)',
  ],
]
const CHAIN = [
  ['The model', 'proposes', false],
  ['AYO’s safety layer', 'decides', true],
  ['The user stays', 'in control', false],
]
function SafetyChain() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const steps = gsap.utils.toArray(ref.current.querySelectorAll('.chain__step'))
      const arrows = gsap.utils.toArray(ref.current.querySelectorAll('.chain__arrow'))
      if (reduced()) return
      gsap
        .timeline({ delay: 0.2 })
        .from(steps, { opacity: 0, y: 12, duration: 0.4, ease: 'power3.out', stagger: 0.16 })
        .from(arrows, { opacity: 0, duration: 0.3, stagger: 0.16 }, '-=0.5')
    },
    { scope: ref },
  )

  return (
    <div className="chain" ref={ref}>
      {CHAIN.map(([label, verb, core], i) => (
        <Fragment key={verb}>
          {i > 0 && <span className="chain__arrow" />}
          <span className={`chain__step${core ? ' chain__step--core' : ''}`}>
            {label} <b>{verb}</b>
          </span>
        </Fragment>
      ))}
    </div>
  )
}
function TrustControl() {
  return (
    <Slide>
      <Head id="trust" title="Trust and Control" />
      <h2 className="headline r" style={{ maxWidth: '24ch', marginBottom: '6px' }}>
        AYO can act. <span className="grad">You stay in control</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(14px, 2.6vh, 30px)', maxWidth: '62ch' }}>
        Privacy, permissions and safety are built into every action.
      </p>

      <div className="rules r">
        {GUARANTEES.map(([tag, lead, sub, tone]) => (
          <div className="rule" key={tag} style={{ '--tone': tone }}>
            <span className="rule__tag">{tag}</span>
            <p className="rule__lead">{lead}</p>
            <p className="rule__sub">{sub}</p>
          </div>
        ))}
      </div>

      <div className="r" style={{ marginTop: 'clamp(16px, 3vh, 32px)' }}>
        <SafetyChain />
      </div>

      <Bridge>Not a concept. The MVP is already in users hands.</Bridge>
    </Slide>
  )
}

/* =========================================================
   06 Traction
   ========================================================= */
const TRACTION_FUNNEL = [
  ['Reach', '180,000+', 'social impressions', 'From user testing only', 100],
  ['Intent', '1,250+', 'on the waitlist', 'Waiting for access', 76],
  ['Use', '100+', 'have tried AYO', 'Real sessions, real machines', 54],
  ['Pay', '4', 'paid subscriptions', 'First willingness to pay', 34],
]
function TractionFunnel() {
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
      {TRACTION_FUNNEL.map(([label, value, math, desc, w], i) => (
        <div
          className={`funnel__tier${
            i === TRACTION_FUNNEL.length - 1 ? ' funnel__tier--accent' : ''
          }`}
          key={label}
          style={{ width: `${w}%` }}
        >
          <span className="funnel__label">{label}</span>
          <span className="funnel__value">{value}</span>
          <span className="funnel__math">{math}</span>
          <span className="funnel__desc">{desc}</span>
        </div>
      ))}
    </div>
  )
}
function Traction() {
  return (
    <Slide>
      <Head id="traction" title="Early Demand" />
      <h2 className="headline r" style={{ maxWidth: '24ch', marginBottom: 'clamp(16px, 2.6vh, 30px)' }}>
        A small test launch already produced{' '}
        <span className="grad">real demand</span>.
      </h2>

      <div className="cols-2" style={{ gap: 'clamp(24px, 3.5vw, 60px)', alignItems: 'center' }}>
        <div className="r">
          <TractionFunnel />
        </div>
        <div className="stack gap-sm">
          <div className="round-total r">
            <b className="grad">$15K</b>
            <span>Angel commitment secured</span>
          </div>
          <div className="callout r">
            We have the interest and the first payments.{' '}
            <b>Now we scale it.</b>
          </div>
        </div>
      </div>

      <Bridge>Here is who pays for AYO, and in what order.</Bridge>

      <p className="note r" style={{ marginTop: '10px' }}>
        AYO management data, September 2026. Early signal, not product market fit.
      </p>
    </Slide>
  )
}

/* =========================================================
   07 Business model
   ========================================================= */
/* Credits and margins are the exact lines from the unit economics model. */
const TIERS = [
  {
    name: 'Free',
    price: '$0',
    desc: 'Try AYO every day',
    credits: '600',
    creditNote: '20 credits per day',
    margin: '-$0.47',
    marginLabel: 'Margin / user',
    cost: true,
  },
  {
    name: 'Plus',
    price: '$14.99',
    desc: 'The primary paid plan',
    credits: '5,000',
    creditNote: 'Credits per month',
    margin: '74.7%',
    marginLabel: 'Gross margin',
    accent: true,
  },
  {
    name: 'Pro',
    price: '$30',
    desc: 'Heavy, all day use',
    credits: '16,000',
    creditNote: 'Credits per month',
    margin: '64.5%',
    marginLabel: 'Gross margin',
  },
]
const PHASES = [
  [
    'Now',
    'Direct to consumer',
    [
      'Students, creators, developers, gamers, knowledge workers',
      'Product demos, creators and referrals',
      'Prove people use it, pay for it, and stay',
    ],
    true,
  ],
  [
    'Later',
    'Business and developers',
    [
      'Team plans and managed company workflows',
      'Enterprise controls and administration',
      'Tools to build custom Windows agents',
    ],
    false,
  ],
]
function BusinessModel() {
  return (
    <Slide>
      <Head id="model" title="Business Model" />
      <h2 className="headline r" style={{ maxWidth: '24ch', marginBottom: '6px' }}>
        B2C first. <span className="grad">B2B later.</span>
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(14px, 2.4vh, 26px)', maxWidth: '66ch' }}>
        Win the individual user first. That is where habit and pricing power are
        created.
      </p>

      <div className="tiers r" style={{ '--n': TIERS.length }}>
        {TIERS.map((t) => (
          <div className={`tier${t.accent ? ' tier--accent' : ''}`} key={t.name}>
            <span className="tier__name">{t.name}</span>
            <span className="tier__price">{t.price}</span>
            <span className="tier__per">/ month</span>
            <span className="tier__desc">{t.desc}</span>
            <div className="tier__meta">
              <div className="tier__metric">
                <span>{t.creditNote}</span>
                <b>{t.credits}</b>
              </div>
              <div
                className={`tier__metric tier__metric--margin${
                  t.cost ? ' tier__metric--cost' : ''
                }`}
              >
                <span>{t.marginLabel}</span>
                <b>{t.margin}</b>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="phases r"
        style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 'clamp(12px, 2vh, 22px)' }}
      >
        {PHASES.map(([when, name, items, now]) => (
          <div className={`phase${now ? ' phase--now' : ''}`} key={name}>
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

      <Bridge>So what makes AYO hard to replace?</Bridge>

      <p className="note r" style={{ marginTop: '10px' }}>
        Margins are net of API cost after cache savings, support, infrastructure,
        onboarding and payment fees. Source: AYO unit economics model.
      </p>
    </Slide>
  )
}

/* =========================================================
   08 The moat
   ========================================================= */
const MOAT = [
  ['Always available', 'Reached from anywhere, without leaving the task or rebuilding context.'],
  ['Private and controlled', 'The user decides what AYO sees. Important actions need approval.'],
  ['Smarter over time', 'Not tied to one model. Better models make AYO better.'],
  ['Feels personal', 'Remembers how you work and adapts its voice and personality.'],
]
function Moat() {
  return (
    <Slide>
      <Head id="moat" title="Why It Is Hard to Replace" />
      <h2 className="headline r" style={{ maxWidth: '22ch', marginBottom: '6px' }}>
        Not another AI window to <span className="grad">open</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(14px, 2.4vh, 26px)', maxWidth: '66ch' }}>
        Always in the background. Reachable by voice, cursor or silent typing,
        even mid game.
      </p>

      <div className="card-grid r" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {MOAT.map(([title, desc], i) => (
          <div className="card" key={title}>
            <span className="card__no">{pad(i + 1)}</span>
            <span className="card__title">{title}</span>
            <span className="card__desc">{desc}</span>
          </div>
        ))}
      </div>

      <p className="statement r" style={{ marginTop: 'clamp(16px, 3vh, 32px)', maxWidth: '42ch' }}>
        The moat is not the model. It is trust, context, habit and a{' '}
        <span className="grad">personal relationship</span>.
      </p>

      <Bridge>Which is what the next five months are built to prove.</Bridge>
    </Slide>
  )
}

/* =========================================================
   09 Validation plan
   ========================================================= */
const CAPITAL = [
  ['$15K', 'Angel, already committed', 'capital__seg--angel'],
  ['$60K', 'Original Ibtikar plan, still the core', 'capital__seg--core'],
  ['$40K', 'Additional ask', 'capital__seg--uplift'],
]
const MONTHS = [
  ['M1', 'Harden', 'Execution reliability'],
  ['M2', 'Launch', 'Tracked acquisition'],
  ['M3', 'Convert', 'First paid cohort'],
  ['M4', 'Scale', '1,000 paid users'],
  ['M5', 'Decide', 'Retention evidence'],
]
const PROOF = [
  ['$45', 'Paid CAC or below'],
  ['35%', 'Trial to paid'],
  ['1,000', 'Paid users by M4'],
  ['M5', 'Renewal evidence'],
]
function CapitalBar() {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from(ref.current.querySelectorAll('.capital__bar > span'), {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.2,
      })
    },
    { scope: ref },
  )

  return (
    <div className="capital" ref={ref}>
      <div className="capital__bar">
        <span className="capital__seg--angel" style={{ width: '13%' }} />
        <span className="capital__seg--core" style={{ width: '52%' }} />
        <span className="capital__seg--uplift" style={{ width: '35%' }} />
      </div>
      <div className="capital__legend">
        {CAPITAL.map(([amount, what, cls]) => (
          <div className="capital__row" key={amount}>
            <i className={cls} />
            <b>{amount}</b>
            <span>{what}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
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
        {MONTHS.map(([m, phase, item], i) => (
          <div className={`tl__col${i === MONTHS.length - 1 ? ' tl__col--last' : ''}`} key={m}>
            <span className="tl__m">{m}</span>
            <span className="tl__phase">{phase}</span>
            <span className="tl__item">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
function Validation() {
  return (
    <Slide>
      <Head id="validation" title="The Ask" />
      <h2 className="headline r" style={{ maxWidth: '25ch', marginBottom: '6px' }}>
        Five months to prove what{' '}
        <span className="grad">deserves to scale</span>.
      </h2>
      <p className="lead r" style={{ maxWidth: '68ch' }}>
        We are seeking $100,000 from Ibtikar. With the angel commitment, that is
        $115,000 of validation capital.
      </p>

      <div className="r">
        <Timeline />
      </div>

      <div className="cols-2" style={{ gap: 'clamp(24px, 3.5vw, 60px)', alignItems: 'start' }}>
        <div className="stack gap-sm">
          <div className="round-total round-total--sm r">
            <b>$115K</b>
            <span>Total validation capital</span>
          </div>
          <div className="r">
            <CapitalBar />
          </div>
        </div>

        <div className="stack gap-sm">
          <span className="pairs__tag r">What we aim to prove</span>
          <div className="stat-strip r" style={{ '--n': 2 }}>
            {PROOF.map(([num, label]) => (
              <div className="stat-strip__item" key={label}>
                <b>{num}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Bridge>Prove those numbers and AYO is ready for the next stage.</Bridge>
    </Slide>
  )
}

/* =========================================================
   10 Team
   ========================================================= */
const TEAM = [
  ['OJ', 'Omar Jaber', 'Cofounder, CEO', 'Product and vision'],
  ['AA', 'Ayman Arafat', 'Cofounder, COO', 'Operations and finance'],
  ['YA', 'Yazan Aydi', 'Cofounder, CTO', 'Architecture and engineering'],
  ['Q', 'Qusay', 'Product engineering', 'Builds the product surface'],
  ['Q', 'Qais', 'Growth', 'Acquisition and content'],
]
const ADVISORS = [
  ['CEO of Middleframe', 'Strategic product and company building guidance'],
  ['Orange Corners', 'Continued mentorship with Mo Salah'],
]
function Team() {
  return (
    <Slide>
      <Head id="team" title="Team" />
      <h2 className="headline r" style={{ maxWidth: '25ch', marginBottom: '6px' }}>
        A lean, founder led team that has already{' '}
        <span className="grad">shipped</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(16px, 2.8vh, 32px)', maxWidth: '68ch' }}>
        From idea to a working product used by more than 100 people, the first
        paid subscribers and the first angel commitment.
      </p>

      <div className="people r">
        {TEAM.map(([initials, name, role, what]) => (
          <div className="person" key={name}>
            <span className="person__av">{initials}</span>
            <span className="person__name">{name}</span>
            <span className="person__role">{role}</span>
            <span className="person__what">{what}</span>
          </div>
        ))}
      </div>

      <div className="pairs r" style={{ marginTop: 'clamp(14px, 2.6vh, 28px)' }}>
        <span className="pairs__tag">Guidance</span>
        {ADVISORS.map(([name, what]) => (
          <div className="pairs__row" key={name}>
            <b>{name}</b>
            <span>{what}</span>
          </div>
        ))}
      </div>

      <Bridge>Now we are raising the capital to prove it at scale.</Bridge>
    </Slide>
  )
}

/* =========================================================
   11 The round
   ========================================================= */
const USE_OF_FUNDS = [
  ['Product and engineering', 45, '#6d4bff'],
  ['Distribution and growth', 30, '#2f6bff'],
  ['Arabic and GCC expansion', 15, '#ff8a3d'],
  ['Security, legal and operations', 10, '#21c7d6'],
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
        <div className="round-bar__talks" style={{ width: '20%' }} />
      </div>
      <div className="round-bar__legend">
        <span>
          <b>$15K</b> committed
        </span>
        <span>
          <b>$100K</b> validation ask
        </span>
        <span>
          <b>$385K</b> after the evidence
        </span>
      </div>
    </div>
  )
}
function TheRound() {
  return (
    <Slide>
      <Head id="round" title="The Round" />
      <h2 className="headline r" style={{ maxWidth: '26ch', marginBottom: '6px' }}>
        A pre-seed round built around <span className="grad">evidence</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(14px, 2.4vh, 26px)', maxWidth: '68ch' }}>
        $500,000 target, extendable to $1,000,000 based on investor demand and
        validation progress.
      </p>

      <div className="cols-2" style={{ alignItems: 'start' }}>
        <div className="stack gap-sm">
          <div className="round-total r">
            <b>$500K</b>
            <span>Pre-seed target</span>
          </div>
          <div className="r">
            <RoundBar />
          </div>
          <div className="callout r">
            Fund a clear validation phase, review the evidence with us, then{' '}
            <b>scale what proves itself</b>.
          </div>
        </div>

        <div className="stack gap-sm">
          <span className="pairs__tag r">Where the rest goes</span>
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
        </div>
      </div>

      <p className="statement r" style={{ marginTop: 'clamp(14px, 2.6vh, 28px)', maxWidth: '44ch' }}>
        AI agents cannot be built one fragile integration at a time. That layer is{' '}
        <span className="grad">AYO</span>.
      </p>
    </Slide>
  )
}

/* =========================================================
   12 Thank you
   ========================================================= */
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
          <span className="kicker r">Prepared for Ibtikar</span>
          <h1 className="display r">
            Thank <span className="grad">you</span>.
          </h1>
          <p className="lead r">
            Fund the validation phase, review the evidence, then scale the layer
            that proves itself.
          </p>
          <div className="row r">
            <span className="tag">Pre-Seed · September 2026</span>
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
  { id: 'gap', title: 'The Gap', Component: Gap },
  { id: 'friction', title: 'Why It Is Hard', Component: Friction },
  { id: 'experience', title: 'Product Experience', Component: Experience },
  { id: 'trust', title: 'Trust and Control', Component: TrustControl },
  { id: 'traction', title: 'Early Demand', Component: Traction },
  { id: 'model', title: 'Business Model', Component: BusinessModel },
  { id: 'moat', title: 'Why It Is Hard to Replace', Component: Moat },
  { id: 'validation', title: 'The Ask', Component: Validation },
  { id: 'team', title: 'Team', Component: Team },
  { id: 'round', title: 'The Round', Component: TheRound },
  { id: 'closing', title: 'Thank You', Component: Closing },
]
