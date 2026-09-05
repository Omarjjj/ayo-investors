import { useEffect, useRef } from 'react'

/* Below this width the deck stops behaving like a projected slide and
   becomes a scrollable document instead (phones, narrow windows). */
const FIT_MIN_WIDTH = 901
const MIN_SCALE = 0.55

/**
 * Keeps a slide inside the viewport. A dense slide is measured at its natural
 * size and then scaled down just enough to fit the available height, so
 * presenting (and full screen especially) never scrolls or clips.
 * Returns a ref for the slide's scroll/clip container.
 */
export function useFit() {
  const outer = useRef(null)

  useEffect(() => {
    const el = outer.current
    const inner = el?.querySelector('.slide__inner')
    if (!el || !inner) return

    const apply = () => {
      inner.style.transform = ''

      if (window.innerWidth < FIT_MIN_WIDTH) return

      const cs = getComputedStyle(el)
      const avail =
        el.clientHeight -
        parseFloat(cs.paddingTop || 0) -
        parseFloat(cs.paddingBottom || 0)
      const needed = inner.scrollHeight
      if (!avail || !needed || needed <= avail + 1) return

      const scale = Math.max(MIN_SCALE, avail / needed)
      inner.style.transformOrigin = 'top center'
      inner.style.transform = `scale(${scale})`
    }

    apply()

    /* Re-measure on window resize, entering full screen, and whenever the
       content itself changes size (late fonts, images, layout shifts). */
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    ro.observe(inner)
    window.addEventListener('resize', apply)
    document.addEventListener('fullscreenchange', apply)
    const fonts = document.fonts
    fonts?.ready?.then(apply).catch(() => {})

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', apply)
      document.removeEventListener('fullscreenchange', apply)
    }
  }, [])

  return outer
}
