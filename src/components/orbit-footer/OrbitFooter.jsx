import OrbitScene from './OrbitScene.jsx'
import FooterBottomBar from './FooterBottomBar.jsx'
import { buildOrbitFooterCards, ORBIT_FOOTER_LINES, SITE_DEFAULT } from './orbitFooter.data.js'
import { useContent } from '../../content.jsx'

export default function OrbitFooter() {
  const site = useContent('site', SITE_DEFAULT)
  const cards = buildOrbitFooterCards(site)

  return (
    <div className="orbit-footer">
      <OrbitScene cards={cards} connections={ORBIT_FOOTER_LINES} />
      <FooterBottomBar />
    </div>
  )
}
