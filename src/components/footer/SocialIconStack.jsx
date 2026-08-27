const SOCIALS = [
  { id: 'email', label: 'Email', mark: '@', mail: true },
  { id: 'github', label: 'GitHub', mark: 'GH' },
  { id: 'linkedin', label: 'LinkedIn', mark: 'in' },
  { id: 'x', label: 'X', mark: 'X' },
]

export default function SocialIconStack({ site }) {
  return (
    <nav className="footer-social-stack" aria-label="Social links">
      {SOCIALS.map(({ id, label, mark, mail }) => {
        const href = mail ? `mailto:${site.email}` : id === 'github'
          ? `https://github.com/${site.github}`
          : site[id]

        return (
          <a
            className={`footer-social-tile footer-social-tile--${id}`}
            href={href}
            key={id}
            target={mail ? undefined : '_blank'}
            rel={mail ? undefined : 'noreferrer'}
            aria-label={label}
          >
            <span aria-hidden="true">{mark}</span>
          </a>
        )
      })}
    </nav>
  )
}
