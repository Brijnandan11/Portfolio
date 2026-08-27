import { useEffect, useState } from 'react'

const formatTime = () =>
  new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })

export default function useLocalTime() {
  const [time, setTime] = useState(formatTime)

  useEffect(() => {
    const update = () => setTime(formatTime())
    const id = window.setInterval(update, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local'
  const city = timezone.split('/').pop()?.replaceAll('_', ' ') || 'Local'

  return { time, city }
}
