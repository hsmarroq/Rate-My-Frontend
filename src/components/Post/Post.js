import { Link } from "react-router-dom"
import Stars from "../Stars/Stars"
import { formatRating, formatDate } from "../../utils/format"
import "./Post.css"

export default function Post({ post, user }) {
  const userOwnsPost = user?.email && post?.userEmail === user?.email

  return (
    <div className="Post">
      <Link
        className="media"
        style={{
          backgroundImage: `url(${post.imageUrl})`,
        }}
        to={`/posts/${post.id}`}
      ></Link>

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
          <span className="user">
            {userOwnsPost ? "You" : post.userEmail}
            {userOwnsPost ? (
              <Link to={`/posts/${post.id}`}>
                <i className="material-icons">edit</i>
              </Link>
            ) : null}
          </span>
        </div>
      </div>
    </div>
  )
}
