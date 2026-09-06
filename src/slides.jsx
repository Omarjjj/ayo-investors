import { Children, Fragment, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useReveal } from './hooks/useReveal'
import { useFit } from './hooks/useFit'
import omarPhoto from './assets/omarHS.png'
import aymanPhoto from './assets/AymanHS.jpg'
import yazanPhoto from './assets/YazanHS.png'
import qusayPhoto from './assets/QusayHs.png'
import qaisPhoto from './assets/QaisHs.png'

/* Slide order drives the numbering shown in every slide head, so adding or
   removing a slide never leaves a stale "NN / NN" behind. Slides that are
   parked rather than deleted live in ARCHIVED_SLIDES at the bottom of this
   file; adding one back means putting its id here and its entry in SLIDES. */
const ORDER = [
  'opportunity',
  'competition',
  'experience',
  'video',
  'traction',
  'model',
  'gtm',
  'team',
  'ask',
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
  const idx = ORDER.indexOf(id)
  return (
    <div className="slide-head r">
      {idx >= 0 && (
        <span className="section-no">
          {pad(idx + 1)} / {pad(ORDER.length)}
        </span>
      )}
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

/* A closing line set off by a nebula dash. Used only where a slide needs to
   land a verdict, not to narrate the way into the next slide. */
function Bridge({ children }) {
  return <p className="bridge r">{children}</p>
}

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* =========================================================
   01 The opportunity
   ========================================================= */
const OPPORTUNITY_STATS = [
  ['2.2B', 'AI agents active by 2030'],
  ['3 weeks', 'To build one workflow agent'],
  ['5 steps', 'Repeated for every single app'],
]
const MISMATCH = [
  ['Where agents are built', 'Mac first, developer first'],
  ['Where the work happens', 'Desktop apps, local files, internal tools'],
  ['Where the budgets are', '450M+ Microsoft 365 seats'],
]
function Opportunity() {
  return (
    <Slide>
      <Head id="opportunity" title="The Opportunity" />
      <h2
        className="headline r"
        style={{ maxWidth: '25ch', marginBottom: 'clamp(20px, 3.4vh, 40px)' }}
      >
        Billions of agents are coming. Almost none can{' '}
        <span className="grad">actually do the work</span>.
      </h2>

      <div className="stat-row r">
        {OPPORTUNITY_STATS.map(([num, label]) => (
          <div className="stat" key={num}>
            <span className="stat__num grad">{num}</span>
            <span className="stat__label">{label}</span>
          </div>
        ))}
      </div>

      <div className="divider r" />

      <div className="pairs pairs--lg r">
        <span className="pairs__tag">The mismatch</span>
        {MISMATCH.map(([name, what]) => (
          <div className="pairs__row" key={name}>
            <b>{name}</b>
            <span>{what}</span>
          </div>
        ))}
      </div>

      <p
        className="note note--flush r"
        style={{ marginTop: 'clamp(14px, 2.6vh, 28px)' }}
      >
        IDC via Statista, 2026. Microsoft FY26 Q2. Build time and per app setup
        are AYO internal data.
      </p>
    </Slide>
  )
}

/* =========================================================
   02 Competition
   ========================================================= */
const RIVAL_CAPS = [
  'Operates your PC',
  'No per app setup',
  'Always reachable',
  'Approval built in',
  'Arabic native',
]
const RIVALS = [
  ['ChatGPT desktop', ['no', 'yes', 'no', 'no', 'part']],
  ['Microsoft Copilot', ['part', 'no', 'part', 'part', 'part']],
  ['Claude computer use', ['part', 'yes', 'no', 'part', 'part']],
  ['Browser agents', ['no', 'yes', 'no', 'part', 'part']],
  ['AYO', ['yes', 'yes', 'yes', 'yes', 'yes']],
]

function Mark({ state }) {
  if (state === 'yes') return <i className="cmp__mark cmp__work" />
  if (state === 'part') return <i className="cmp__mark cmp__part" />
  return <b className="cmp__mark cmp__none">—</b>
}

function RivalMatrix() {
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
    <div className="cmp cmp--lg" ref={ref}>
      <div className="cmp__row">
        <span className="cmp__cell cmp__cell--head">Who else is in the room</span>
        {RIVAL_CAPS.map((c) => (
          <span className="cmp__cell cmp__cell--head cmp__cell--mark" key={c}>
            {c}
          </span>
        ))}
      </div>
      {RIVALS.map(([name, states]) => {
        const ours = name === 'AYO'
        return (
          <div className="cmp__row" key={name}>
            <span
              className={`cmp__cell cmp__cell--cap${ours ? ' cmp__cell--ayo' : ''}`}
            >
              {name}
            </span>
            {states.map((state, i) => (
              <span
                className={`cmp__cell cmp__cell--mark${ours ? ' cmp__cell--ayo' : ''}`}
                key={RIVAL_CAPS[i]}
              >
                <Mark state={state} />
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function Competition() {
  return (
    <Slide>
      <Head id="competition" title="Competition" />
      <h2
        className="headline r"
        style={{ maxWidth: '36ch', marginBottom: 'clamp(14px, 2.4vh, 28px)' }}
      >
        Everyone is shipping a chat window. We are shipping the{' '}
        <span className="grad">hands</span>.
      </h2>

      <div className="r">
        <RivalMatrix />
      </div>

      <div className="cmp-legend r">
        <span>
          <i className="cmp__work" /> Does it
        </span>
        <span>
          <i className="cmp__part" /> Partly, or inside its own window
        </span>
        <span>
          <b className="cmp__none">—</b> Does not
        </span>
      </div>

      <p
        className="statement r"
        style={{ marginTop: 'clamp(14px, 2.6vh, 30px)', maxWidth: '40ch' }}
      >
        The winner is not the best answer. It is the one that{' '}
        <span className="grad">finishes the job</span>.
      </p>
    </Slide>
  )
}

/* =========================================================
   03 Product experience: the three ways to reach AYO
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
        Your agent. <span className="grad">Always one call away</span>.
      </h2>
      <p
        className="lead r"
        style={{ marginBottom: 'clamp(14px, 2.6vh, 30px)', maxWidth: '66ch' }}
      >
        Most AI assistants wait inside another window. AYO stays available across
        everything you already use and operates it directly, with no per app
        integration.
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

      <p
        className="statement r"
        style={{ marginTop: 'clamp(16px, 3vh, 32px)', maxWidth: '44ch' }}
      >
        Speak. Type silently. Or open the workspace.{' '}
        <span className="grad">Same agent, wherever you are.</span>
      </p>
    </Slide>
  )
}

/* =========================================================
   04 See it work
   ========================================================= */
function SeeItWork() {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (reduced()) return
      gsap.to(ref.current.querySelectorAll('.film__ring'), {
        scale: 1.9,
        opacity: 0,
        duration: 2.1,
        ease: 'power2.out',
        repeat: -1,
      })
    },
    { scope: ref },
  )

  return (
    <Slide>
      <Head id="video" title="See It Work" />
      <h2
        className="headline r"
        style={{ maxWidth: '32ch', marginBottom: 'clamp(12px, 2vh, 22px)' }}
      >
        Ninety seconds of AYO <span className="grad">doing real work</span>.
      </h2>

      <div className="film r" ref={ref}>
        {/* Swap the placeholder for the real cut when the file lands:
            import demo from './assets/demo.mp4'
            <video className="film__video" src={demo} controls playsInline /> */}
        <div className="film__frame">
          <div className="film__bar">
            <i />
            <i />
            <i />
            <span className="film__file">ayo-demo.mp4</span>
          </div>
          <div className="film__stage">
            <span className="film__play" aria-hidden="true">
              <span className="film__ring" />
            </span>
            <span className="film__label">Product demo</span>
            <span className="film__hint">Live walkthrough plays here</span>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* =========================================================
   05 Early demand
   ========================================================= */
const TRACTION_FUNNEL = [
  ['Reach', '180,000+', 'social impressions', 'From user testing only', 100],
  ['Intent', '1,250+', 'on the waitlist', 'Waiting for access', 76],
  ['Use', '100+', 'have tried AYO', 'Real sessions, real machines', 54],
  ['Pay', '4', 'paid subscriptions', 'First willingness to pay', 34],
]
const CHATGPT_PULL = [
  ['73+', 'Sent by ChatGPT'],
  ['3', 'Converted to paid'],
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
      <h2 className="headline r" style={{ maxWidth: '25ch', marginBottom: '6px' }}>
        Every number here came from{' '}
        <span className="grad">organic reach</span>.
      </h2>
      <p
        className="lead r"
        style={{ marginBottom: 'clamp(14px, 2.6vh, 30px)', maxWidth: '66ch' }}
      >
        A small test launch, no paid acquisition, and the reach is still
        compounding week over week.
      </p>

      <div
        className="cols-2"
        style={{ gap: 'clamp(24px, 3.5vw, 60px)', alignItems: 'stretch' }}
      >
        <div className="r">
          <TractionFunnel />
        </div>

        <div className="r">
          <Panel accent tag="Organic, unpaid" title="ChatGPT is recommending AYO by name.">
            <div className="stat-strip stat-strip--sm" style={{ '--n': 2 }}>
              {CHATGPT_PULL.map(([num, label]) => (
                <div className="stat-strip__item" key={label}>
                  <b className="grad">{num}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p className="panel__foot">
              People asked an AI what could do this, and it pointed them at us.
              We did not pay for a single one of those visits.
            </p>
          </Panel>
        </div>
      </div>

      <p className="note note--flush r" style={{ marginTop: 'clamp(14px, 2.6vh, 28px)' }}>
        AYO management data, September 2026. Early signal, not product market fit.
      </p>
    </Slide>
  )
}

/* =========================================================
   06 Business model
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
      <p
        className="lead r"
        style={{ marginBottom: 'clamp(14px, 2.4vh, 26px)', maxWidth: '66ch' }}
      >
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

      <p className="note note--flush r" style={{ marginTop: 'clamp(12px, 2.2vh, 24px)' }}>
        Margins are net of API cost after cache savings, support, infrastructure,
        onboarding and payment fees. Source: AYO unit economics model.
      </p>
    </Slide>
  )
}

/* =========================================================
   07 Go to market
   ========================================================= */
const NICHES = [
  ['Students', 'Deadlines, research and endless file admin.'],
  ['Gamers', 'Help that arrives without leaving the game.'],
  ['Focus and ADHD', 'The assistant that starts the task for you.'],
]
const CHANNELS = [
  [
    'Large YouTube creator campaigns',
    'Immediate reach into tech-savvy audiences, and the creator’s trust transfers to the product.',
  ],
  ['UGC and niche creators', 'Cheaper, repeatable, one credible voice per niche.'],
  [
    'Apple-style motion graphics',
    'Professional demonstration that makes AYO look established and safe to install.',
  ],
  ['Our own short form', 'Skits, demos and informational content on our channels.'],
  ['Build in public', 'The build itself becomes the content, and the audience arrives early.'],
]
const GTM_PROOF = [
  ['180K+', 'Organic impressions already'],
  ['73+', 'Sent by ChatGPT, unpaid'],
  ['$45', 'Paid CAC target to prove'],
]
function GoToMarket() {
  return (
    <Slide>
      <Head id="gtm" title="Go To Market" />
      <h2
        className="headline r"
        style={{ maxWidth: '36ch', marginBottom: 'clamp(14px, 2.4vh, 28px)' }}
      >
        AYO is a visual product. It has to be{' '}
        <span className="grad">seen being used</span>.
      </h2>

      <div className="cols-2" style={{ alignItems: 'stretch' }}>
        <div className="r">
          <Panel tag="Who we go after" title="Windows users, three niches">
            <ul className="mini">
              {NICHES.map(([who, why]) => (
                <li key={who}>
                  <b>{who}</b>
                  <em>{why}</em>
                </li>
              ))}
            </ul>
            <p className="panel__foot">
              Each niche gets its own landing page, so the first thing a visitor
              sees is their own use case, demonstrated.
            </p>
          </Panel>
        </div>

        <div className="r">
          <Panel accent tag="How we reach them" title="Creator led, in this order">
            <ul className="mini mini--num">
              {CHANNELS.map(([what, why]) => (
                <li key={what}>
                  <b>{what}</b>
                  <em>{why}</em>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div
        className="stat-strip r"
        style={{ '--n': 3, marginTop: 'clamp(14px, 2.6vh, 30px)' }}
      >
        {GTM_PROOF.map(([num, label]) => (
          <div className="stat-strip__item" key={label}>
            <b>{num}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* =========================================================
   08 Team
   ========================================================= */
const FOUNDERS = [
  {
    photo: omarPhoto,
    name: 'Omar Jaber',
    role: 'Cofounder & CEO',
    wins: [
      ['14', 'First business', 'A digital gaming business that generated more than $3,000 in revenue.'],
      [
        '16',
        'Apps, games and an audience',
        '17,000+ YouTube subscribers and 100,000 views. An AbuRob game watched by 2M+ people and downloaded 10,000+ times.',
      ],
      [
        'University',
        'National recognition',
        'An AI platform that helped Tawjihi graduates choose a university. TV interview, university spotlight, and recognition from the President of the country.',
      ],
    ],
  },
  {
    photo: aymanPhoto,
    name: 'Ayman Arafat',
    role: 'Cofounder & COO',
    wins: [
      [
        'Built',
        'A printing business, scaled',
        'Took a t-shirt printing business from 200 to 20,000 ILS in under a year.',
      ],
      ['Runs', 'Operations and finance', 'Pricing, unit economics and day to day execution.'],
    ],
  },
  {
    photo: yazanPhoto,
    name: 'Yazan Aydi',
    role: 'Cofounder & CTO',
    wins: [
      [
        'Built',
        'A live booking platform',
        'Designed and shipped a platform for reserving football fields, end to end.',
      ],
      [
        'Runs',
        'Architecture and engineering',
        'The agent runtime, the safety layer and desktop control.',
      ],
    ],
  },
]
const CREW = [
  [qusayPhoto, 'Qusay', 'Product engineering', 'Builds the product surface'],
  [qaisPhoto, 'Qais', 'Growth', 'Acquisition and content'],
]
const ADVISORS = [
  ['Mohammad Nobani, CEO of Middleframe', 'Strategic product and company building guidance'],
  ['Orange Corners', 'Continued mentorship with Mo Salah'],
]
function Team() {
  return (
    <Slide>
      <Head id="team" title="Team" />
      <h2
        className="headline r"
        style={{ maxWidth: '38ch', marginBottom: 'clamp(14px, 2.4vh, 28px)' }}
      >
        Founders who were <span className="grad">already shipping</span> before
        this.
      </h2>

      <div className="founders r">
        {FOUNDERS.map(({ photo, name, role, wins }) => (
          <div className="founder" key={name}>
            <div className="founder__head">
              <img className="founder__photo" src={photo} alt={name} loading="lazy" />
              <div className="founder__id">
                <span className="founder__name">{name}</span>
                <span className="founder__role">{role}</span>
              </div>
            </div>
            <div className="founder__wins">
              {wins.map(([when, title, desc]) => (
                <div className="founder__win" key={title}>
                  <span className="founder__when">{when}</span>
                  <span className="founder__what">{title}</span>
                  <span className="founder__desc">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="cols-2"
        style={{
          gap: 'clamp(20px, 3vw, 48px)',
          alignItems: 'start',
          marginTop: 'clamp(14px, 2.6vh, 28px)',
        }}
      >
        <div className="people r" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {CREW.map(([photo, name, role, what]) => (
            <div className="person" key={name}>
              <img className="person__av person__av--img" src={photo} alt={name} loading="lazy" />
              <span className="person__name">{name}</span>
              <span className="person__role">{role}</span>
              <span className="person__what">{what}</span>
            </div>
          ))}
        </div>

        <div className="pairs r">
          <span className="pairs__tag">Guidance</span>
          {ADVISORS.map(([name, what]) => (
            <div className="pairs__row" key={name}>
              <b>{name}</b>
              <span>{what}</span>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  )
}

/* =========================================================
   09 The ask
   ========================================================= */
const MONTHS = [
  ['M1', 'Harden', 'Execution reliability'],
  ['M2', 'Launch', 'Tracked acquisition'],
  ['M3', 'Convert', 'First paid cohort'],
  ['M4', 'Scale', 'Grow paid users'],
  ['M5', 'Decide', 'Retention evidence'],
]
const PROOF = [
  ['$45', 'Paid CAC or below'],
  ['35%', 'Trial to paid'],
  ['1,000', 'Paid users'],
  ['M5', 'Renewal evidence'],
]
const FULL_TICKET = [
  'Scale user acquisition fast',
  'Ship multilingual support',
  'Expand to Mac and Linux',
  'Open the first B2B pilots',
]
function Timeline({ chips }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const cols = gsap.utils.toArray(ref.current.querySelectorAll('.tl__col'))
      if (reduced()) return
      const tl = gsap.timeline({ delay: 0.2 })
      if (!chips) {
        tl.from('.tl__rail', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 0.85,
          ease: 'power2.out',
        })
      }
      tl.from(cols, { opacity: 0, y: 14, duration: 0.4, stagger: 0.1 }, chips ? 0 : '-=0.6')
    },
    { scope: ref },
  )

  return (
    <div className={`tl${chips ? ' tl--chips' : ''}`} ref={ref}>
      {!chips && <div className="tl__rail" />}
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
function TheAsk() {
  return (
    <Slide>
      <Head id="ask" title="The Ask" />
      <h2 className="headline r" style={{ maxWidth: '24ch', marginBottom: '6px' }}>
        Raising <span className="grad">$500K</span>, with a smaller way in.
      </h2>
      <p
        className="lead r"
        style={{ marginBottom: 'clamp(14px, 2.4vh, 26px)', maxWidth: '72ch' }}
      >
        We are raising a $500K pre-seed to cover the next 18 months and scale
        quickly. For investors not ready for a full ticket, we built a $75K,
        five-month validation plan.
      </p>

      <div className="ask">
        <div className="ask__panel ask__panel--full r">
          <span className="ask__tag">Full ticket</span>
          <h3 className="ask__title">Scale quickly</h3>
          <div className="ask__figure">
            <b className="grad">$500K</b>
            <span>Pre-seed · 18 months</span>
          </div>
          <ul className="mini mini--tight">
            {FULL_TICKET.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="ask__foot">Extendable to $1M based on investor demand.</p>
        </div>

        <div className="ask__panel r">
          <span className="ask__tag">Smaller first step</span>
          <h3 className="ask__title">Validate in five months</h3>
          <div className="ask__figure">
            <b>$75K</b>
            <span>$15K angel committed · $30K in negotiation</span>
          </div>
          <div className="stat-strip stat-strip--sm" style={{ '--n': 4 }}>
            {PROOF.map(([num, label]) => (
              <div className="stat-strip__item" key={label}>
                <b>{num}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="ask__foot">
            Slower progress, but enough to prove the data before a full ticket.
          </p>
        </div>
      </div>

      <div className="r">
        <Timeline chips />
      </div>

      <Bridge>Prove those numbers and AYO is ready to scale.</Bridge>
    </Slide>
  )
}

/* =========================================================
   10 Thank you
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
  { id: 'opportunity', title: 'The Opportunity', Component: Opportunity },
  { id: 'competition', title: 'Competition', Component: Competition },
  { id: 'experience', title: 'Product Experience', Component: Experience },
  { id: 'video', title: 'See It Work', Component: SeeItWork },
  { id: 'traction', title: 'Early Demand', Component: Traction },
  { id: 'model', title: 'Business Model', Component: BusinessModel },
  { id: 'gtm', title: 'Go To Market', Component: GoToMarket },
  { id: 'team', title: 'Team', Component: Team },
  { id: 'ask', title: 'The Ask', Component: TheAsk },
  { id: 'closing', title: 'Thank You', Component: Closing },
]

/* =========================================================
   ARCHIVED

   Kept out of the live deck but intact and ready to return.
   To bring one back: add its id to ORDER above and move its
   entry from ARCHIVED_SLIDES into SLIDES.
   ========================================================= */

/* ---- Archived: animated hero for the opening slide ---- */
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

/* ---- Archived: opening slide ---- */
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
    </Slide>
  )
}

/* ---- Archived: why building agents is hard ---- */
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
        Agents are built <span className="grad">one integration at a time</span>.
      </h2>
      <p className="lead r" style={{ marginBottom: 'clamp(14px, 2.4vh, 26px)', maxWidth: '68ch' }}>
        Every app needs its own connector, authentication, permissions, approvals
        and testing.
      </p>

      <div className="r">
        <IntegrationMatrix />
      </div>

      <div className="cols-2" style={{ alignItems: 'stretch', marginTop: 'clamp(14px, 2.4vh, 26px)' }}>
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
    </Slide>
  )
}

/* ---- Archived: trust and control ---- */
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
    </Slide>
  )
}

/* ---- Archived: why AYO is hard to replace ---- */
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
    </Slide>
  )
}

/* ---- Archived: the $115K validation plan ---- */
const CAPITAL = [
  ['$15K', 'Angel, already committed', 'capital__seg--angel'],
  ['$60K', 'Original Ibtikar plan, still the core', 'capital__seg--core'],
  ['$40K', 'Additional ask', 'capital__seg--uplift'],
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
function Validation() {
  return (
    <Slide>
      <Head id="validation" title="The Ask" />
      <h2 className="headline r" style={{ maxWidth: '25ch', marginBottom: '6px' }}>
        Five months to prove what <span className="grad">deserves to scale</span>.
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
    </Slide>
  )
}

/* ---- Archived: the round and use of funds ---- */
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

export const ARCHIVED_SLIDES = [
  { id: 'opening', title: 'Opening', Component: Opening },
  { id: 'friction', title: 'Why It Is Hard', Component: Friction },
  { id: 'trust', title: 'Trust and Control', Component: TrustControl },
  { id: 'moat', title: 'Why It Is Hard to Replace', Component: Moat },
  { id: 'validation', title: 'Validation Plan', Component: Validation },
  { id: 'round', title: 'The Round', Component: TheRound },
]
