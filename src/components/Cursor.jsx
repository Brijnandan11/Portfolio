import { useEffect, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from 'framer-motion'

const SIZE = 96

export default function Cursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 600, damping: 38, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 600, damping: 38, mass: 0.5 })

  const vx = useVelocity(sx)
  const vy = useVelocity(sy)
  const speed = useTransform([vx, vy], ([a, b]) =>
    Math.min(Math.hypot(a, b) / 5000, 0.35)
  )
  const stretchX = useSpring(useTransform(speed, (s) => 1 + s), {
    stiffness: 400,
    damping: 30,
  })
  const stretchY = useSpring(useTransform(speed, (s) => 1 - s * 0.5), {
    stiffness: 400,
    damping: 30,
  })
  const rotate = useTransform([vx, vy], ([a, b]) =>
    Math.hypot(a, b) > 60 ? `${(Math.atan2(b, a) * 180) / Math.PI}deg` : '0deg'
  )

  const [hover, setHover] = useState(false)
  const [label, setLabel] = useState('')
  const [pressed, setPressed] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target.closest('a, button, [data-hover], [data-cursor]')
      if (target) {
        const tagged = e.target.closest('[data-cursor]')
        setLabel(tagged?.dataset.cursor || '')
        setHover(true)
      } else {
        setHover(false)
      }
      setHidden(false)
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    const leave = () => setHidden(true)
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [x, y])

  const scale = hidden
    ? 0
    : pressed
      ? hover
        ? 0.62
        : 0.09
      : hover
        ? label
          ? 0.85
          : 0.4
        : 0.15

  return (
    <motion.div
      className="cursor-dot"
      style={{
        x: sx,
        y: sy,
        width: SIZE,
        height: SIZE,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        className="cursor-stretch"
        style={{ rotate, scaleX: stretchX, scaleY: stretchY }}
      >
        <motion.div
          className="cursor-disc"
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <AnimatePresence mode="wait">
            {hover && label && (
              <motion.span
                key={label}
                className="cursor-label"
                initial={{ scale: 0.3, opacity: 0, rotate: -30, y: 14 }}
                animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
                exit={{ scale: 0.3, opacity: 0, rotate: 20, y: -14 }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
