import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Stars from "../Stars/Stars"
import StarsInput from "../StarsInput/StarsInput"
import { formatRating, formatDate } from "../../utils/format"
import "./PostDetail.css"

const fetchPostById = async ({ postId, setIsFetching, setError, setPost, setCaption }) => {
  setIsFetching(true)

  try {
    const res = await axios.get(`http://localhost:3001/posts/${postId}`)
    if (res?.data?.post) {
      setPost(res.data.post)
      setCaption(res.data.post.caption)
    } else {
      setError("Something went wrong fetching the post.")
    }
  } catch (err) {
    console.log(err)
    const message = err?.response?.data?.error?.message
    setError(message ?? String(err))
  } finally {
    setIsFetching(false)
  }
}

export default function PostDetail({ user }) {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [rating, setRating] = useState(null)
  const [caption, setCaption] = useState("")
  const [isFetching, setIsFetching] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSavingRating, setIsSavingRating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPostById({ postId, setIsFetching, setError, setPost, setCaption })
  }, [postId])

  const handleOnUpdate = async () => {
    setIsUpdating(false)

    try {
      const res = await axios.patch(`http://localhost:3001/posts/${postId}`)
      if (res?.data?.post) {
        setPost({ post, caption: res.data.post.caption })
      } else {
        setError("Something went wrong fetching the post.")
      }
    } catch (err) {
      console.log(err)
      const message = err?.response?.data?.error?.message
      setError(message ?? String(err))
    } finally {
      setIsUpdating(false)
    }
  }

  const handleOnSaveRating = async () => {
    setIsSavingRating(false)

    try {
      const res = await axios.post(`http://localhost:3001/posts/${postId}/ratings`)
      if (res?.data?.rating) {
        await fetchPostById({ postId, setIsFetching, setError, setPost, setCaption })
      } else {
        setError("Something went wrong rating this post.")
      }
    } catch (err) {
      console.log(err)
      const message = err?.response?.data?.error?.message
      setError(message ?? String(err))
    } finally {
      setIsSavingRating(false)
    }
  }

  const userIsLoggedIn = Boolean(user?.email)
  const userOwnsPost = userIsLoggedIn && post?.userEmail === user?.email

  if (!post && !isFetching) return null
  if (!post) return <h1>Loading...</h1>

  return (
    <div className="PostDetail">
      <div className="Post">
        <div
          className="media"
          style={{
            backgroundImage: `url(${post.imageUrl})`,
          }}
          to={`/posts/${post.id}`}
        />

        <div className="body">
          <div className="info">
            <p className="caption">{post.caption}</p>
            <span className="rating">
              <Stars rating={post.rating || 0} max={10} />
              {formatRating(post.rating || 0)}
            </span>
          </div>

          <div className="meta">
            <span className="date">{formatDate(post.createdAt)}</span>
            <span className="user">{post.userEmail}</span>
          </div>
        </div>
      </div>

      {error && <span className="error">Error: {error}</span>}

      <div className="actions">
        {userOwnsPost ? (
          <div className="edit-post">
            <p>Edit your post</p>
            <textarea value={caption} onChange={(event) => setCaption(event.target.value)} name="caption"></textarea>
            <button className="btn" onClick={handleOnUpdate}>
              {isUpdating ? "Loading..." : "Save Post"}
            </button>
          </div>
        ) : (
          <div className="rate-setup">
            <p>Rate this setup</p>
            <StarsInput value={rating} setValue={setRating} max={10} />
            <button className="btn" onClick={handleOnSaveRating} disabled={!userIsLoggedIn}>
              {isSavingRating ? "Loading..." : "Save Rating"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
