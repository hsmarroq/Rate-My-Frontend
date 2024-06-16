import { Fragment } from "react"
import IconStar from "../Icons/Star"
import IconStarHalf from "../Icons/StarHalf"
import "./Stars.css"

const createStars = ({ numStars, max, epsilon = 0.2 }) => {
  return new Array(max).fill(0).map((_, i) => {
    const starsLeft = numStars - i
    if (starsLeft >= 1) return { pos: String(i + 1), star: "full" }
    // this part makes sure that anything 4.8 and above gets rounded up to 5, and same all the way down
    if (starsLeft > 0 && 1 - starsLeft < epsilon) return { pos: String(i + 1), star: "full" }
    if (starsLeft <= 0) return { pos: String(i + 1), star: "empty" }
    return { pos: `${i}.5`, star: "half" }
  })
}

const Star = ({ name }) => {
  if (name === "full") return <IconStar />
  if (name === "half") return <IconStarHalf />
  if (name === "empty") return <IconStar fill="var(--star-color-empty)" />
  return null
}

const Stars = ({ rating, max = 5, epsilon = 0.2 }) => {
  const createdStars = createStars({ numStars: rating, max, epsilon })

  return (
    <div className="Stars">
      {createdStars.map(({ pos, star }) => (
        <Fragment key={pos}>
          <Star name={star} />
        </Fragment>
      ))}
    </div>
  )
}

export default Stars
