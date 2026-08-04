import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { achieve } from './Achievements.jsx'

export default function EmberPet() {
  const petRef = useRef(null)
  const flipRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const pet = petRef.current
    const flip = flipRef.current
    const pupils = pet.querySelectorAll('.pet-eye i')

    const s = {
      x: window.innerWidth * 0.25,
      target: window.innerWidth * 0.55,
      mouseX: window.innerWidth / 2,
      lastMouse: performance.now(),
      nextWander: performance.now() + 3000,
      facing: 1,
      walking: false,
      asleep: false,
    }

    const setWalking = (on) => {
      if (s.walking === on) return
      s.walking = on
      pet.classList.toggle('is-walking', on)
    }
    const setAsleep = (on) => {
      if (s.asleep === on) return
      s.asleep = on
      pet.classList.toggle('is-asleep', on)
    }

    const onMove = (e) => {
      s.mouseX = e.clientX
      s.lastMouse = performance.now()
      const dx = e.clientX - (s.x + 27)
      pupils.forEach((p) => {
        p.style.transform = `translateX(${Math.max(-2.5, Math.min(2.5, dx / 60))}px)`
      })
    }
    const onDown = (e) => {
      if (pet.contains(e.target)) return
      s.lastMouse = performance.now()
      gsap.fromTo(
        flip,
        { y: 0 },
        {
          y: -30,
          duration: 0.16,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          onComplete: () => gsap.set(flip, { y: 0 }),
        }
      )
    }

    const update = (_, dtMs) => {
      const now = performance.now()
      const dt = Math.min(dtMs / 1000, 0.05)

      const idleFor = now - s.lastMouse
      setAsleep(idleFor > 22000)
      if (s.asleep) {
        setWalking(false)
        return
      }

      const mouseDist = s.mouseX - (s.x + 27)
      if (Math.abs(mouseDist) > 170) {
        s.target = s.mouseX - Math.sign(mouseDist) * 90
      } else if (now > s.nextWander) {
        s.target = 60 + Math.random() * (window.innerWidth - 180)
        s.nextWander = now + 2500 + Math.random() * 5000
      }

      const dist = s.target - s.x
      if (Math.abs(dist) > 10) {
        const speed = Math.abs(mouseDist) > 450 ? 320 : 110
        s.x += Math.sign(dist) * speed * dt
        s.x = Math.max(6, Math.min(window.innerWidth - 60, s.x))
        setWalking(true)
        const face = Math.sign(dist)
        if (face !== s.facing) {
          s.facing = face
          flip.style.transform = `scaleX(${face})`
        }
      } else {
        setWalking(false)
      }
      pet.style.transform = `translateX(${s.x}px)`
    }

    gsap.ticker.add(update)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    return () => {
      gsap.ticker.remove(update)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
    }
  }, [])

  const petIt = (e) => {
    e.stopPropagation()
    achieve('petter')
    gsap.fromTo(
      flipRef.current,
      { rotation: 0 },
      { rotation: 360, duration: 0.7, ease: 'back.inOut(1.6)' }
    )
    const rect = petRef.current.getBoundingClientRect()
    for (let i = 0; i < 5; i++) {
      const bit = document.createElement('span')
      bit.className = 'confetti-bit'
      bit.textContent = '♥'
      bit.style.color = i % 2 ? '#ff4d00' : '#e8e4dc'
      bit.style.fontSize = '12px'
      document.body.appendChild(bit)
      gsap.fromTo(
        bit,
        { x: rect.left + 27, y: rect.top, opacity: 1, scale: 0.4 },
        {
          x: rect.left + 27 + (Math.random() - 0.5) * 70,
          y: rect.top - 50 - Math.random() * 40,
          opacity: 0,
          scale: 1.1,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => bit.remove(),
        }
      )
    }
  }

  return (
    <div className="pet" ref={petRef} aria-hidden>
      <div className="pet-flip" ref={flipRef}>
        <button className="pet-inner" onClick={petIt} data-cursor="PET" tabIndex={-1}>
          <span className="pet-shadow" />
          <span className="pet-body" />
          <span className="pet-eye pet-eye--l"><i /></span>
          <span className="pet-eye pet-eye--r"><i /></span>
        </button>
      </div>
      <span className="buddy-zzz pet-zzz">
        <i>z</i>
        <i>z</i>
        <i>z</i>
      </span>
    </div>
  )
}
