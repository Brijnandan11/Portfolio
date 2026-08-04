import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function SlatReveal({ horizontal = false, reverse = false, count = 5, from = 'start' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const tween = gsap.to(el.children, {
      [horizontal ? 'xPercent' : 'yPercent']: reverse ? 101 : -101,
      duration: 0.8,
      ease: 'power4.inOut',
      stagger: { each: 0.07, from },
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top 85%',
        once: true,
      },
      onComplete: () => {
        el.style.display = 'none'
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [horizontal, reverse, from])

  return (
    <div
      className={`slat-reveal${horizontal ? ' is-horizontal' : ''}`}
      ref={ref}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <div className="slat-piece" key={i} />
      ))}
    </div>
  )
}
