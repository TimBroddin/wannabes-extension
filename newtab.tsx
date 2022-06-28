import request, { gql } from "graphql-request"
import { useEffect } from "react"
import useSWR from "swr"

const fetcher = (query) => request("https://graphql.wannabes.be", query)

function IndexNewtab() {
  const { data, error } = useSWR(
    gql`
      query randomPost {
        randomPost(amount: 20) {
          data {
            thumbnail {
              hires
              dimensions {
                width
                height
              }
            }
            artist {
              name
            }
            venue {
              name
            }
            photographers {
              fullName
            }
            date
            slug
          }
        }
      }
    `,
    fetcher,
    { revalidateOnFocus: false }
  )

  let post = null

  if (data) {
    const landscape = data.randomPost?.data.filter(
      (post) =>
        post.thumbnail.dimensions.width > post.thumbnail.dimensions.height &&
        post.thumbnail.dimensions.width > 2000
    )
    post = landscape[0]
  }

  useEffect(() => {
    document.title = "New Tab"
  }, [])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "black",
        backgroundImage: post
          ? `url(https://images.wannabes.be/${post?.thumbnail.hires})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        color: "white",
        fontFamily: "Arial",
        cursor: "pointer"
      }}
      onClick={() =>
        post
          ? (window.location.href = `https://wannabes.be/${post?.slug}`)
          : null
      }>
      <div style={{ padding: "20px" }}>
        <h1
          style={{
            margin: 0,
            textShadow: "1px 1px 10px rgba(255,255,255,0.1)",
            textAlign: "right"
          }}>
          {post?.artist?.name}
        </h1>
        {post && (
          <h2
            style={{
              margin: 0,
              fontWeight: 100,
              fontSize: "10px",
              textAlign: "right"
            }}>
            {post?.venue.name} - {new Date(post?.date).toLocaleDateString()} -{" "}
            {post?.photographers.map((p) => p.fullName).join(" & ")}
          </h2>
        )}
      </div>
    </div>
  )
}

export default IndexNewtab
