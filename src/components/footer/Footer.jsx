import { useContent } from '../../content.jsx'
import FooterCta from './FooterCta.jsx'
import FooterEdge from './FooterEdge.jsx'
import FooterMascot from './FooterMascot.jsx'
import FooterNav from './FooterNav.jsx'
import FooterSocial from './FooterSocial.jsx'

const SITE_DEFAULT = {
  email: 'brij19069@gmail.com',
  github: 'Brijnandan11',
  linkedin: 'https://linkedin.com',
  x: 'https://x.com/BRIJhqu',
}

const NAV_ITEMS = [
  ['About', '#about'],
  ['Services', '#services'],
  ['Projects', '#work'],
  ['Terminal', '#terminal'],
  ['Contact', '#contact'],
]

export default function Footer() {
  const site = useContent('site', SITE_DEFAULT)

  return (
    <footer className="footer-shell" aria-label="Site footer">
      <div className="footer-stage">
        <div className="footer-stage-inner">
          <FooterMascot />
        </div>
        <FooterEdge />
      </div>

      <div className="footer-band">
        <div className="footer-band-inner">
          <FooterNav items={NAV_ITEMS} />
          <FooterCta email={site.email} />
          <FooterSocial site={site} />
        </div>
      </div>

      <div className="footer-bottom-text" aria-hidden="true">
        <span>BRIJ</span>
      </div>
    </footer>
  )
}
