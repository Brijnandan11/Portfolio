import { useContent } from '../../content.jsx'
import useLocalTime from '../../hooks/useLocalTime.js'
import SocialIconStack from './SocialIconStack.jsx'
import StatusCard from './StatusCard.jsx'
import StickyNote from './StickyNote.jsx'

const SITE_DEFAULT = {
  email: 'brij19069@gmail.com',
  github: 'Brijnandan11',
  linkedin: 'https://linkedin.com',
  x: 'https://x.com/BRIJhqu',
}

export default function Footer() {
  const site = useContent('site', SITE_DEFAULT)
  const { time, city } = useLocalTime()

  return (
    <footer className="footer-shell" aria-label="Site footer">
      <div className="footer-meta footer-meta--updated">
        <span>LAST UPDATED</span>
        <strong>August 27th, 2026</strong>
      </div>
      <div className="footer-meta footer-meta--local">
        <span>LOCAL</span>
        <strong>☉ {city}, {time}</strong>
      </div>
      <div className="footer-note-wrap">
        <StickyNote email={site.email} />
        <SocialIconStack site={site} />
      </div>
      <StatusCard />
    </footer>
  )
}
