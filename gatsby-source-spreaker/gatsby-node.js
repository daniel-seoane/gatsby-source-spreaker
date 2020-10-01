const axios = require("axios");
const { createRemoteFileNode } = require("gatsby-source-filesystem");

exports.sourceNodes = async (
  { actions: { createNode }, createContentDigest, createNodeId, reporter },
  { showId }
) => {
  if (!showId)
    return reporter.panic(
      "gatsby-source-spreaker: You must provide a valid showId"
    );

  // Get show and episodes
  const [show, showEpisodes] = await Promise.all([
    await axios(`https://api.spreaker.com/v2/shows/${showId}`).then(
      (response) => response.data.response.show
    ),
    await axios(`https://api.spreaker.com/v2/shows/${showId}/episodes`).then(
      (response) => response.data.response.items
    ),
  ]);

  // Get full data episodes
  const episodes = await Promise.all(
    showEpisodes.map((episode) =>
      axios(`https://api.spreaker.com/v2/episodes/${episode.episode_id}`).then(
        (response) => response.data.response.episode
      )
    )
  );

  const processEpisode = async ({ episode, show }) => {
    delete episode.show

    await createNode({
      ...episode,
      id: createNodeId(episode.episode_id),
      show___NODE: createNodeId(show.show_id),
      internal: {
        contentDigest: createContentDigest(episode),
        type: `SpreakerEpisode`,
      },
    });
  };

  const processShow = async ({ show, episodes }) => {
    await createNode({
      ...show,
      id: createNodeId(show.show_id),
      episodes___NODE: episodes.map((episode) =>
        createNodeId(episode.episode_id)
      ),
      internal: {
        contentDigest: createContentDigest(show),
        type: `SpreakerShow`,
      },
    });
  };

  await Promise.all([
    processShow({ show, episodes }),
    episodes.map(async (episode) => processEpisode({ episode, show })),
  ]);
};

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId,
  reporter,
}) => {
  const { createNode } = actions;

  // Download podcast cover image from show and episodes
  if (
    (node.internal.type === `SpreakerShow` ||
      node.internal.type === `SpreakerEpisode`) &&
    node.image_original_url
  ) {
    let imageNode;
    try {
      const { id } = await createRemoteFileNode({
        url: node.image_original_url,
        parentNodeId: node.id,
        store,
        cache,
        createNode,
        createNodeId,
      });
      imageNode = id;
    } catch (err) {
      reporter.error("gatsby-source-spreaker", err);
    }
    node.image___NODE = imageNode;
  }
};
