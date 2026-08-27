export default function FooterNav({ items = [] }) {
  return (
    <nav className="footer-nav" aria-label="Footer navigation">
      <span className="footer-kicker">Navigation</span>
      <ul className="footer-nav-list">
        {items.map(([label, href], i) => (
          <li key={label} className="footer-nav-item">
            <a className="footer-nav-link" href={href}>
              <span className="footer-nav-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="footer-nav-label">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
