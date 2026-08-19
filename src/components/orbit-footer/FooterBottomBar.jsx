import { useContent } from '../../content.jsx'

const SITE_DEFAULT = {
  email: 'brij19069@gmail.com',
  github: 'Brijnandan11',
  linkedin: 'https://linkedin.com',
  x: 'https://x.com/BRIJhqu',
}

export default function FooterBottomBar() {
  const site = useContent('site', SITE_DEFAULT)

  return (
    <div className="orbit-footer-bar">
      <a className="orbit-footer-email" href={`mailto:${site.email}`}>
        {site.email}
      </a>
      <div className="orbit-footer-socials" aria-label="Social links">
        <a href={`https://github.com/${site.github}`} target="_blank" rel="noreferrer">
          GITHUB
        </a>
        <a href={site.linkedin} target="_blank" rel="noreferrer">
          LINKEDIN
        </a>
        <a href={site.x} target="_blank" rel="noreferrer">
          X
        </a>
      </div>
      <span className="orbit-footer-status">
        <i />
        OPEN FOR WORK
      </span>
    </div>
  )
}
