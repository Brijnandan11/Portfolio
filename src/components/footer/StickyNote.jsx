export default function StickyNote({ email }) {
  return (
    <article className="footer-note" aria-labelledby="footer-note-title">
      <p className="footer-note-label" id="footer-note-title">
        NOTE FROM BRIJ
      </p>
      <div className="footer-note-lines">
        <p>Hi, thanks for stopping by &lt;3</p>
        <p>Code, to me, is craft and curiosity.</p>
        <p>If something here caught your eye,</p>
        <p>
          say <a href={`mailto:${email}`}>{email}</a>!
        </p>
      </div>
    </article>
  )
}
