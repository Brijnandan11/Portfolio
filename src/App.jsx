import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ContentProvider } from './content.jsx'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import EyesBuddy from './components/EyesBuddy.jsx'
import Achievements from './components/Achievements.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import EmberPet from './components/EmberPet.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Services from './components/Services.jsx'
import Terminal from './components/Terminal.jsx'
import Contact from './components/Contact.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log(
      '%c BRIJ® ',
      'background:#ff4d00;color:#0a0a0a;font-size:18px;padding:6px 14px;border-radius:6px;font-weight:bold',
      '\nhey, fellow dev 👋 — there is a real shell in section 04.\ntry `sudo hire brij`.'
    )
    const onVis = () => {
      document.title = document.hidden
        ? '✦ come back — BRIJ®'
        : 'BRIJ® — Full Stack Developer'
    }
    document.addEventListener('visibilitychange', onVis)

    let sparksEnabled = window.matchMedia('(pointer: fine)').matches
    const onDown = (e) => {
      if (!sparksEnabled) return
      for (let i = 0; i < 5; i++) {
        const bit = document.createElement('span')
        bit.className = 'confetti-bit'
        bit.textContent = Math.random() > 0.5 ? '✦' : '●'
        bit.style.color = i % 3 === 0 ? '#ff4d00' : 'rgba(232,228,220,0.8)'
        bit.style.fontSize = '9px'
        document.body.appendChild(bit)
        const angle = Math.random() * Math.PI * 2
        const dist = 18 + Math.random() * 34
        gsap.fromTo(
          bit,
          { x: e.clientX, y: e.clientY, scale: 0.5, opacity: 1 },
          {
            x: e.clientX + Math.cos(angle) * dist,
            y: e.clientY + Math.sin(angle) * dist,
            scale: 1,
            opacity: 0,
            duration: 0.5 + Math.random() * 0.3,
            ease: 'power2.out',
            onComplete: () => bit.remove(),
          }
        )
      }
    }
    window.addEventListener('mousedown', onDown)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('mousedown', onDown)
    }
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    window.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      delete window.lenis
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    if (!loading) ScrollTrigger.refresh()
  }, [loading])

  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      })
      gsap.utils.toArray('.section-ghost').forEach((ghost) => {
        gsap.fromTo(
          ghost,
          { yPercent: -30 },
          {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
              trigger: ghost.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })
      gsap.utils.toArray('.scribble--auto').forEach((scribble) => {
        gsap.fromTo(
          scribble,
          { opacity: 0, y: 20, rotate: -9 },
          {
            opacity: 1,
            y: 0,
            rotate: -2,
            duration: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: scribble, start: 'top 88%' },
          }
        )
        const path = scribble.querySelector('path')
        if (path) {
          gsap.fromTo(
            path,
            { strokeDasharray: 150, strokeDashoffset: 150 },
            {
              strokeDashoffset: 0,
              duration: 0.8,
              delay: 0.3,
              scrollTrigger: { trigger: scribble, start: 'top 88%' },
            }
          )
        }
      })
    })
    return () => ctx.revert()
  }, [loading])

  return (
    <ContentProvider>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <Cursor />
      <div className="grain" />
      <div className="scroll-progress" />
      <EyesBuddy />
      <Achievements />
      <CommandPalette />
      <EmberPet />
      <Nav loaded={!loading} />
      <main>
        <Hero loaded={!loading} />
        <Marquee />
        <About />
        <Projects />
        <Services />
        <Terminal />
        <Contact />
      </main>
    </ContentProvider>
  )
}
