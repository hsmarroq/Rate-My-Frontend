import { useState } from "react"
import IconStar from "../Icons/Star"
import "./StarsInput.css"

const Star = ({ setValue, starType, setHoveredNumber, num, name }) => {
  const renderLabel = () => {
    if (starType === "filled")
      return (
        <IconStar
          onMouseEnter={() => setHoveredNumber(num)}
          onMouseLeave={() => setHoveredNumber(0)}
          onClick={() => setValue(num)}
        />
      )
    if (starType === "empty")
      return (
        <IconStar
          onClick={() => setValue(num)}
          onMouseEnter={() => setHoveredNumber(num)}
          onMouseLeave={() => setHoveredNumber(0)}
          fill="var(--star-color-empty)"
        />
      )
    return null
  }

  return <span>{renderLabel()}</span>
}

export default function StarsInput({ value, setValue, name = "", max = 5 }) {
  const [hoveredNumber, setHoveredNumber] = useState(0)

  const getStarType = (i) => {
    if (value > i) return "filled"
    if (hoveredNumber > i) return "filled"
    return "empty"
  }

  return (
    <fieldset className="StarsInput">
      {new Array(max).fill(0).map((_, i) => (
        <Star
          name={name}
          key={i}
          num={i + 1}
          setHoveredNumber={setHoveredNumber}
          starType={getStarType(i)}
          setValue={setValue}
        />
      ))}
      {typeof value === "undefined" || value === null ? null : (
        <span className="rating">
          {value} {value === 1 ? "star" : "stars"}
        </span>
      )}
    </fieldset>
  )
}
