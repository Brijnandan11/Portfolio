import { useEffect, useRef, useState } from 'react'
import {
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export function useOrbitCamera() {
  const reducedMotion = useReducedMotion()
  const sceneRef = useRef(null)
  const dragRef = useRef(null)
  const hintTimerRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [sceneHovered, setSceneHovered] = useState(false)
  const [hintsDimmed, setHintsDimmed] = useState(false)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const rotX = useMotionValue(-10)
  const rotY = useMotionValue(20)
  const panX = useMotionValue(0)
  const panY = useMotionValue(0)
  const zoom = useMotionValue(1)

  const sRotX = useSpring(rotX, { stiffness: 120, damping: 20, mass: 0.75 })
  const sRotY = useSpring(rotY, { stiffness: 120, damping: 20, mass: 0.75 })
  const sPanX = useSpring(panX, { stiffness: 120, damping: 20, mass: 0.8 })
  const sPanY = useSpring(panY, { stiffness: 120, damping: 20, mass: 0.8 })
  const sZoom = useSpring(zoom, { stiffness: 120, damping: 20, mass: 0.9 })

  const cameraStyle = useMotionTemplate`
    translate3d(${sPanX}px, ${sPanY}px, 0px)
    rotateX(${sRotX}deg)
    rotateY(${sRotY}deg)
    scale(${sZoom})
  `

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const update = () => setIsDesktop(mq.matches && !reducedMotion)
    update()
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)

    return () => {
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!isDesktop) {
      setSpaceHeld(false)
      setIsDragging(false)
      setHintsDimmed(false)
      dragRef.current = null
    }
  }, [isDesktop])

  useEffect(() => {
    if (!isDesktop) return
    const onKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        setSpaceHeld(true)
        e.preventDefault()
      }
    }
    const onKeyUp = (e) => {
      if (e.code === 'Space') setSpaceHeld(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [isDesktop])

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current)
    }
  }, [])

  const markInteraction = () => {
    if (hintTimerRef.current) return
    hintTimerRef.current = window.setTimeout(() => {
      setHintsDimmed(true)
    }, 4000)
  }

  const beginDrag = (e) => {
    if (!isDesktop || e.button !== 0) return
    if (e.target.closest('a,button,[data-orbit-lock]')) return
    const node = sceneRef.current
    if (!node) return

    markInteraction()
    setIsDragging(true)
    dragRef.current = {
      pointerId: e.pointerId,
      mode: spaceHeld ? 'pan' : 'orbit',
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      lastT: performance.now(),
      baseRotX: rotX.get(),
      baseRotY: rotY.get(),
      basePanX: panX.get(),
      basePanY: panY.get(),
      vx: 0,
      vy: 0,
    }

    node.setPointerCapture?.(e.pointerId)
  }

  const updateDrag = (e) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return

    const now = performance.now()
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    const frame = Math.max(16, now - drag.lastT)
    drag.vx = (e.clientX - drag.lastX) / frame
    drag.vy = (e.clientY - drag.lastY) / frame
    drag.lastX = e.clientX
    drag.lastY = e.clientY
    drag.lastT = now

    if (drag.mode === 'pan') {
      panX.set(clamp(drag.basePanX + dx * 0.85, -220, 220))
      panY.set(clamp(drag.basePanY + dy * 0.78, -160, 160))
      return
    }

    rotY.set(drag.baseRotY + dx * 0.12)
    rotX.set(clamp(drag.baseRotX - dy * 0.12, -25, 25))
  }

  const endDrag = (e) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return

    if (drag.mode === 'pan') {
      panX.set(clamp(panX.get() + drag.vx * 220, -260, 260))
      panY.set(clamp(panY.get() + drag.vy * 220, -200, 200))
    } else {
      rotY.set(rotY.get() + drag.vx * 180)
      rotX.set(clamp(rotX.get() - drag.vy * 180, -25, 25))
    }

    sceneRef.current?.releasePointerCapture?.(e.pointerId)
    setIsDragging(false)
    dragRef.current = null
  }

  const onWheel = (e) => {
    if (!isDesktop) return
    e.preventDefault()
    markInteraction()
    const delta = -e.deltaY * (e.ctrlKey ? 0.0007 : 0.0011)
    zoom.set(clamp(zoom.get() + delta, 0.72, 1.32))
  }

  const sceneProps = {
    ref: sceneRef,
    onPointerEnter: () => setSceneHovered(true),
    onPointerLeave: () => setSceneHovered(false),
    onPointerDown: beginDrag,
    onPointerMove: updateDrag,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onWheelCapture: onWheel,
  }

  return {
    reducedMotion,
    isDesktop,
    isDragging,
    sceneHovered,
    hintsDimmed,
    spaceHeld,
    cameraStyle,
    sceneProps,
    markInteraction,
  }
}
