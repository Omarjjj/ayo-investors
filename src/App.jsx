import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Nebula from './components/Nebula'
import { SLIDES } from './slides'

const TOTAL = SLIDES.length

export default function App() {
  const [index, setIndex] = useState(0)
  const appRef = useRef(null)
  const stageRef = useRef(null)
  const dirRef = useRef(1)
  const animating = useRef(false)
  const wheelLock = useRef(false)
  const touchY = useRef(0)

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const goTo = useCallback(
    (next) => {
      if (next < 0 || next >= TOTAL || next === index || animating.current) return
      dirRef.current = next > index ? 1 : -1
      if (reduce) {
        setIndex(next)
        return
      }
      animating.current = true
      gsap.to(stageRef.current, {
        opacity: 0,
        y: dirRef.current > 0 ? -28 : 28,
        duration: 0.26,
        ease: 'power2.in',
        onComplete: () => setIndex(next),
      })
    },
    [index, reduce],
  )

  const go = useCallback((dir) => goTo(index + dir), [goTo, index])

  /* When a slide is taller than the viewport (typical on phones) it becomes
     internally scrollable. In that case a swipe / wheel should scroll the
     content first, and only advance the deck once the user is already at the
     top (going back) or bottom (going forward) of that slide. On desktop the
     slide isn't scrollable, so this always reports "go ahead and navigate". */
  const scrollBlocksNav = useCallback((dir) => {
    const scroller = stageRef.current?.querySelector('.slide')
    if (!scroller) return false
    const overflowY = getComputedStyle(scroller).overflowY
    const scrollable =
      /(auto|scroll)/.test(overflowY) &&
      scroller.scrollHeight - scroller.clientHeight > 4
    if (!scrollable) return false
    const atTop = scroller.scrollTop <= 1
    const atBottom =
      scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1
    if (dir > 0) return !atBottom
    return !atTop
  }, [])

  /* Entrance of each newly mounted slide.
     The stage container snaps to visible instantly; the per-element
     `useReveal` stagger carries the actual entrance motion. Keeping these
     separate avoids double-animating the same content and removes the
     expensive blur that caused the stutter. */
  useGSAP(
    () => {
      gsap.set(stageRef.current, { opacity: 1, y: 0 })
      animating.current = false
    },
    { dependencies: [index], scope: appRef },
  )

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          go(1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          go(-1)
          break
        case 'Home':
          e.preventDefault()
          goTo(0)
          break
        case 'End':
          e.preventDefault()
          goTo(TOTAL - 1)
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, goTo])

  /* Wheel / trackpad navigation with cooldown */
  useEffect(() => {
    const onWheel = (e) => {
      if (wheelLock.current || animating.current) return
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(delta) < 24) return
      if (scrollBlocksNav(delta > 0 ? 1 : -1)) return
      wheelLock.current = true
      go(delta > 0 ? 1 : -1)
      setTimeout(() => {
        wheelLock.current = false
      }, 850)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [go, scrollBlocksNav])

  /* Touch swipe */
  useEffect(() => {
    const onStart = (e) => {
      touchY.current = e.touches[0].clientY
    }
    const onEnd = (e) => {
      const dy = touchY.current - e.changedTouches[0].clientY
      if (Math.abs(dy) <= 48) return
      const dir = dy > 0 ? 1 : -1
      if (scrollBlocksNav(dir)) return
      go(dir)
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [go, scrollBlocksNav])

  const Active = SLIDES[index].Component
  const isHero = index === 0 || index === TOTAL - 1
  const progress = (index + 1) / TOTAL

  return (
    <div className="app" ref={appRef}>
      <Nebula intensity={isHero ? 1.25 : 0.6} />

      <div className="grid-lines">
        <div className="grid-lines__inner">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>

      {/* progress rail */}
      <div className="rail">
        <div className="rail__fill" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* corner chrome */}
      <div className="chrome chrome--tl">
        <span className="brand">
          <span className="brand__dot" />
          <span className="brand__name">AYO</span>
        </span>
      </div>
      <div className="chrome chrome--tr chrome__num">
        <b>{String(index + 1).padStart(2, '0')}</b>&nbsp;/&nbsp;{String(TOTAL).padStart(2, '0')}
      </div>
      <div className="chrome chrome--bl">{SLIDES[index].title}</div>
      <div className="chrome chrome--br">Confidential · Sadu Capital</div>

      {/* nav dots */}
      <nav className="dots" aria-label="Slide navigation">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            className={i === index ? 'is-active' : ''}
            onClick={() => goTo(i)}
            aria-label={`Go to ${s.title}`}
            aria-current={i === index}
          />
        ))}
      </nav>

      {/* stage */}
      <div className="deck">
        <div className="stage" ref={stageRef} key={index}>
          <Active />
        </div>
      </div>

      <div className="nav-hint">
        <kbd>←</kbd>
        <kbd>→</kbd>
        <span>scroll or use arrow keys</span>
      </div>
    </div>
  )
}
