import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * Living nebula backdrop — soft colored clouds drifting on paper-white.
 * The intensity prop lets hero slides glow brighter than content slides.
 */
const BLOBS = [
  { c: '#6d4bff', size: 46, top: 8, left: 6 },
  { c: '#2f6bff', size: 40, top: 44, left: 52 },
  { c: '#e1409a', size: 38, top: 58, left: 14 },
  { c: '#21c7d6', size: 30, top: 10, left: 66 },
  { c: '#ff8a3d', size: 26, top: 70, left: 74 },
]

export default function Nebula({ intensity = 1 }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const blobs = gsap.utils.toArray('.nebula__blob')
      blobs.forEach((b, i) => {
        gsap.to(b, {
          x: () => gsap.utils.random(-160, 160),
          y: () => gsap.utils.random(-120, 120),
          scale: () => gsap.utils.random(0.85, 1.3),
          duration: () => gsap.utils.random(14, 22),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.6,
        })
      })
    },
    { scope: root },
  )

  return (
    <div className="nebula" ref={root} aria-hidden="true">
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className="nebula__blob"
          style={{
            width: `${b.size}vw`,
            height: `${b.size}vw`,
            top: `${b.top}%`,
            left: `${b.left}%`,
            background: `radial-gradient(circle at 35% 30%, ${b.c}, transparent 70%)`,
            opacity: 0.5 * intensity,
          }}
        />
      ))}
      <div className="nebula__grain" />
    </div>
  )
}
