import { motion } from 'framer-motion'
import ConstellationLines from './ConstellationLines.jsx'
import FloatingCard from './FloatingCard.jsx'
import { useState } from 'react'
import { useOrbitCamera } from './useOrbitCamera.js'

export default function OrbitScene({ cards, connections }) {
  const {
    reducedMotion,
    isDesktop,
    isDragging,
    sceneHovered,
    hintsDimmed,
    cameraStyle,
    sceneProps,
    markInteraction,
  } = useOrbitCamera()
  const [activeCardId, setActiveCardId] = useState(null)
  const staticLayout = reducedMotion || !isDesktop

  return (
    <div
      className={`orbit-scene${staticLayout ? ' is-static' : ' is-3d'}${
        isDragging ? ' is-dragging' : ''
      }`}
      ref={sceneProps.ref}
      onPointerEnter={sceneProps.onPointerEnter}
      onPointerLeave={sceneProps.onPointerLeave}
      onPointerDown={sceneProps.onPointerDown}
      onPointerMove={sceneProps.onPointerMove}
      onPointerUp={sceneProps.onPointerUp}
      onPointerCancel={sceneProps.onPointerCancel}
      onWheelCapture={sceneProps.onWheelCapture}
    >
      <div className="orbit-glow" aria-hidden />

      <div className="orbit-hints" aria-hidden>
        <span
          className="orbit-hint orbit-hint--tl"
          style={{ opacity: sceneHovered ? (hintsDimmed ? 0.68 : 1) : hintsDimmed ? 0.4 : 1 }}
        >
          [ drag to orbit ]
        </span>
        {!staticLayout && (
          <span
            className="orbit-hint orbit-hint--bl"
            style={{ opacity: sceneHovered ? (hintsDimmed ? 0.68 : 1) : hintsDimmed ? 0.4 : 1 }}
          >
            [ space + drag to pan ]
          </span>
        )}
        <span
          className="orbit-hint orbit-hint--tr"
          style={{ opacity: sceneHovered ? (hintsDimmed ? 0.68 : 1) : hintsDimmed ? 0.4 : 1 }}
        >
          [ scroll to zoom ]
        </span>
      </div>

      {staticLayout ? (
        <div className="orbit-grid" onPointerDown={markInteraction}>
          {cards.map((card) => (
            <FloatingCard
              key={card.id}
              card={card}
              staticLayout
              active={activeCardId === card.id}
              onHover={setActiveCardId}
            />
          ))}
        </div>
      ) : (
        <div className="orbit-perspective">
          <motion.div className="orbit-world" style={{ transform: cameraStyle }}>
            <ConstellationLines
              cards={cards}
              connections={connections}
              activeCardId={activeCardId}
            />
            {cards.map((card) => (
              <FloatingCard
                key={card.id}
                card={card}
                active={activeCardId === card.id}
                onHover={setActiveCardId}
              />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}
