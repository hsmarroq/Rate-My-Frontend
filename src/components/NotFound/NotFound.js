import "./NotFound.css"

export default function NotFound({ user, error }) {
  return (
    <div className="NotFound">
      <div className="cta">
        <h1>404</h1>
        <p>That page does not exist</p>
      </div>
    </div>
  )
}
