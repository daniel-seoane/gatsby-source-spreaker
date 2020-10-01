import React from "react";
import { graphql } from "gatsby";

const EpisodeTemplate = ({ data }) => {
  const { spreakerEpisode } = data;

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "700px",
        marginRight: "auto",
        marginLeft: "auto",
      }}
    >
      <h1 style={{ marginBottom: 16 }}>{spreakerEpisode.title}</h1>
      <iframe
        title="spreaker-player"
        src={`https://widget.spreaker.com/player?episode_id=${spreakerEpisode.episode_id}`}
        width="100%"
        height="200px"
        frameBorder="0"
      />
      <div
        style={{ marginTop: 16, lineHeight: "1.6" }}
        dangerouslySetInnerHTML={{ __html: spreakerEpisode.description }}
      />
    </div>
  );
};

export default EpisodeTemplate;

export const query = graphql`
  query EpisodeQuery($id: String!) {
    spreakerEpisode(id: { eq: $id }) {
      episode_id
      title
      description
    }
  }
`;
