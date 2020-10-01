import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import Img from "gatsby-image";
import prettyMilliseconds from "pretty-ms";

const pageQuery = graphql`
  {
    spreakerShow {
      title
      description
      image {
        childImageSharp {
          fixed(width: 300, height: 300) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      episodes {
        title
        episode_id
        published_at(formatString: "MMMM DD YYYY")
        duration
      }
    }
  }
`;

const IndexPage = () => {
  const { spreakerShow } = useStaticQuery(pageQuery);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "700px",
        marginRight: "auto",
        marginLeft: "auto",
      }}
    >
      <div style={{ marginBottom: 100 }}>
        <Img fixed={spreakerShow.image.childImageSharp.fixed} />

        <div>
          <h1>{spreakerShow.title}</h1>
          <div
            style={{ lineHeight: "1.6" }}
            dangerouslySetInnerHTML={{ __html: spreakerShow.description }}
          />
        </div>
      </div>
      {spreakerShow.episodes.map((episode) => (
        <div style={{ marginBottom: 75 }}>
          <span style={{ textTransform: "uppercase" }}>
            {episode.published_at}
          </span>
          <h2 style={{ marginTop: 8, marginBottom: 8 }}>{episode.title}</h2>
          <Link to={`/${episode.episode_id}`} style={{ marginRight: 16 }}>
            Listen to episode
          </Link>
          <span>
            {prettyMilliseconds(episode.duration, { colonNotation: true })}
          </span>
        </div>
      ))}
    </div>
  );
};

export default IndexPage;
