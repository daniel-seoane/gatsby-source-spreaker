const EpisodeTemplate = require.resolve(`./src/templates/episode-template`);

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allSpreakerEpisode {
        edges {
          node {
            id
            episode_id
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic(result.errors);
  }

  // Create episodes pages.
  const { allSpreakerEpisode } = result.data;
  const episodes = allSpreakerEpisode.edges;

  // Create a page for each episode
  episodes.forEach(({ node: episode }) => {
    const { episode_id } = episode;
    createPage({
      path: "/" + episode_id,
      component: EpisodeTemplate,
      context: {
        id: episode.id,
      },
    });
  });
};
