import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import SlatReveal from './SlatReveal.jsx'
import { useContent, richWords } from '../content.jsx'

const aboutImg = Object.values(
  import.meta.glob('../assets/about.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
)[0]

const ABOUT_DEFAULT = {
  text: 'I build products end to end — *resilient* *backends,* expressive frontends, and the infrastructure that keeps them alive. I obsess over *performance,* *craft,* and the tiny details most people never notice but everyone *feels.*',
  stats: [
    { value: '4', label: 'Years shipping' },
    { value: '20', label: 'Projects delivered' },
    { value: '∞', label: 'Curiosity' },
  ],
}

export default function About() {
  const rootRef = useRef(null)
  const about = useContent('about', ABOUT_DEFAULT)
  const TEXT = richWords(about.text)
  const STATS = (about.stats || ABOUT_DEFAULT.stats).map((s) => [s.value, s.label])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 0.6,
        },
      })
      tl.fromTo(
        '.about-scribble',
        { opacity: 0, y: 16, rotate: -9 },
        { opacity: 1, y: 0, rotate: -2, duration: 0.5, ease: 'back.out(2)' }
      )
      tl.fromTo(
        '.about-scribble path',
        { strokeDasharray: 150, strokeDashoffset: 150 },
        { strokeDashoffset: 0, duration: 0.7 },
        '>-0.15'
      )
      tl.to('.about-text .word', {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        duration: 0.4,
      })
      tl.fromTo(
        '.portrait-frame',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'power2.out' },
        0.4
      )
      tl.fromTo(
        '.about-img, .portrait-ph',
        { scale: 1.35 },
        { scale: 1.03, duration: 2.2, ease: 'power2.out' },
        0.4
      )
      tl.fromTo(
        '.portrait-tag',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 },
        '>-0.5'
      )
      tl.fromTo(
        '.about-stat',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.25, duration: 1, ease: 'power2.out' },
        '>-0.3'
      )
      gsap.utils.toArray('.stat-num').forEach((el) => {
        tl.to(
          el,
          { innerText: +el.dataset.count, snap: { innerText: 1 }, duration: 1.2 },
          '<'
        )
      })
      tl.to({}, { duration: 0.6 })
    }, rootRef)
    return () => ctx.revert()
  }, [about])

  return (
    <section className="section section--pin" id="about" ref={rootRef}>
      <SlatReveal />
      <span className="section-ghost" aria-hidden>01</span>
      <div className="scribble scribble--lg about-scribble" aria-hidden>
        <span>so, who&apos;s this guy?</span>
        <svg viewBox="0 0 130 12">
          <path
            d="M3 8 C 34 2, 68 11, 127 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="about-body">
        <p className="about-text">
          {TEXT.map(([word, serif], i) => (
            <span key={i} className={`word${serif ? ' serif' : ''}`}>
              {word}
            </span>
          ))}
        </p>
        <div className="about-portrait" data-hover>
          <div className="portrait-frame">
            {aboutImg ? (
              <img className="about-img" src={aboutImg} alt="Portrait of Brij" />
            ) : (
              <div className="portrait-ph">
                <span className="portrait-ph-mark">D®</span>
                <span className="portrait-ph-scan" />
                <p className="portrait-ph-note">
                  portrait — coming soon
                  <br />
                  drop about.jpg in /src/assets
                </p>
              </div>
            )}
            <span className="portrait-tag">that&apos;s me ✦</span>
          </div>
        </div>
      </div>
      <div className="about-foot">
        {STATS.map(([value, label]) => (
          <div className="about-stat" key={label}>
            <h3>
              {value === '∞' ? (
                '∞'
              ) : (
                <>
                  <span className="stat-num" data-count={value}>
                    0
                  </span>
                  <sup>+</sup>
                </>
              )}
            </h3>
            <p>{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
