/* Throwaway probe: mounts each slide one at a time at the real deck
   dimensions and reports the scale `useFit` had to apply. A scale below 1
   means the slide overflows and gets shrunk away from the slide edges. */
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import './src/styles.css'
import { SLIDES } from './src/slides'

gsap.registerPlugin(useGSAP)

const host = document.getElementById('root')
const root = createRoot(host)

const results = []

for (const slide of SLIDES) {
  const Active = slide.Component
  flushSync(() => {
    root.render(
      <div className="app">
        <div className="deck">
          <div className="stage">
            <Active />
          </div>
        </div>
      </div>,
    )
  })

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

  const outer = host.querySelector('.slide')
  const inner = host.querySelector('.slide__inner')
  const cs = getComputedStyle(outer)
  const avail =
    outer.clientHeight -
    parseFloat(cs.paddingTop || 0) -
    parseFloat(cs.paddingBottom || 0)
  const needed = inner.scrollHeight
  const scale = needed > avail ? avail / needed : 1
  results.push(
    `${slide.id.padEnd(12)} needed=${String(Math.round(needed)).padStart(4)} avail=${String(
      Math.round(avail),
    ).padStart(4)} scale=${scale.toFixed(3)}${scale < 0.995 ? '  <-- DOWNSCALED' : ''}`,
  )
}

root.unmount()
const pre = document.createElement('pre')
pre.id = 'fit-results'
pre.textContent =
  `viewport ${window.innerWidth}x${window.innerHeight}\n` + results.join('\n')
document.body.appendChild(pre)
