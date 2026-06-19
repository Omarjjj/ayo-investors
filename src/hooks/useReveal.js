import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * Staggered entrance for any slide. Animates every `.r` element inside the
 * scope from a soft upward fade. Honors prefers-reduced-motion.
 * Returns a ref to attach to the slide root.
 */
export function useReveal(deps = []) {
  const scope = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const items = gsap.utils.toArray(scope.current.querySelectorAll('.r'))
      if (!items.length) return

      if (reduce) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }

      gsap.set(items, { opacity: 0, y: 20 })
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.045,
        delay: 0.02,
        clearProps: 'willChange',
      })
    },
    { scope, dependencies: deps },
  )

  return scope
}
