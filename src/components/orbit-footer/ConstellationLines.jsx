const POINT_SCALE = 1

const toPoint = ([x, y]) => [500 + x * POINT_SCALE, 340 + y * POINT_SCALE]

export default function ConstellationLines({ cards, connections, activeCardId }) {
  const byId = new Map(cards.map((card) => [card.id, card]))

  return (
    <svg
      className="orbit-lines"
      viewBox="0 0 1000 680"
      preserveAspectRatio="none"
      aria-hidden
    >
      {connections.map(([fromId, toId], index) => {
        const from = byId.get(fromId)
        const to = byId.get(toId)
        if (!from || !to) return null

        const [x1, y1] = toPoint(from.position)
        const [x2, y2] = toPoint(to.position)
        const isActive =
          !activeCardId || from.id === activeCardId || to.id === activeCardId

        const cx = (x1 + x2) / 2 + (y2 - y1) * 0.08
        const cy = (y1 + y2) / 2 - (x2 - x1) * 0.08
        const stroke = isActive
          ? 'rgba(232, 84, 42, 0.42)'
          : 'rgba(255, 255, 255, 0.14)'
        const dot = isActive ? '#e8542a' : 'rgba(255, 255, 255, 0.35)'

        return (
          <g key={`${fromId}-${toId}-${index}`}>
            <path
              d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
              fill="none"
              stroke={stroke}
              strokeWidth="1"
              strokeDasharray="5 10"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={x1} cy={y1} r="3.1" fill={dot} />
            <circle cx={x2} cy={y2} r="3.1" fill={dot} />
          </g>
        )
      })}
    </svg>
  )
}
