export default function FooterCta({ email }) {
  return (
    <section className="footer-cta" aria-labelledby="footer-cta-title">
      <h2 className="footer-cta-title" id="footer-cta-title">
        Say Hi!
      </h2>
      <p className="footer-cta-copy">Interested in working with me?</p>
      <a className="footer-cta-button" href={`mailto:${email}`}>
        Let&rsquo;s Chat!
      </a>
    </section>
  )
}
