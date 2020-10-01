# gatsby-source-spreaker

🎙 Source plugin for getting a podcast show and its episodes from the [Spreaker API](https://developers.spreaker.com/api/)

## Usage

Install the plugin

```sh
npm install --save gatsby-source-spreaker
```

or

```sh
yarn add gatsby-source-spreaker
```

Add the plugin to your `gatsby-config.js`

```javascript
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-spreaker",
      options: {
        // See options section for more information
        showId: 1433865,
      },
    },
  ],
};
```

## Options

| Key                 | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| `showId` (required) | Id of the podcast show. You can get it from the url (`www.spreaker.com/show/1433865`) |

## Example of query

```
query ShowWithEpisodes {
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
```
