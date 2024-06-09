import React from "react";
import { connect } from "react-redux";
import ChangeLocation from "../button/change/location";
import ProgressBar from "../bar/progress";

const mapStateToProps = ({
  state: {
    watched,
    user: { language },
  },
  router: { routes },
}) => ({ watched, language, routes });

const mapDispatchToProps = null;

function ContinueWatching({ watched, language, routes, parentRef }) {
  const movies = watched.movies[language];
  const series = watched.series[language];
  return (
    <>
      {shuffle([
        ...(movies
          ? Object.keys(movies)
              .map((category) => {
                return Object.keys(movies[category])
                  .filter(
                    (title) =>
                      movies[category][title].progress <
                      movies[category][title].credits
                  )
                  .map((title) => (
                    <ChangeLocation
                      {...{ key: title, parentRef }}
                      image={{
                        vertical: `/movies/${language}/${category}/${title}/cover/vertical`,
                      }}
                      viewmode="vertical"
                      href={`/${language}/${routes[language].movies}/${category}/${title}`}
                    >
                      <ProgressBar
                        progress={movies[category][title].progress}
                        duration={movies[category][title].credits}
                      />
                    </ChangeLocation>
                  ));
              })
              .flat(Infinity)
          : []),
        ...(series
          ? Object.keys(series).map((category) => {
              return Object.keys(series[category])
                .filter((title) => {
                  const seasons = Object.keys(series[category][title]);
                  const season = seasons.sort((a, b) => a - b).pop();
                  const episodes = Object.keys(series[category][title][season]);
                  const episode = episodes.sort((a, b) => a - b).pop();
                  return (
                    series[category][title][season][episode].progress <
                    series[category][title][season][episode].credits
                  );
                })
                .map((title) => {
                  const seasons = Object.keys(series[category][title]);
                  const season = seasons.sort((a, b) => a - b).pop();
                  const episodes = Object.keys(series[category][title][season]);
                  const episode = episodes.sort((a, b) => a - b).pop();
                  return (
                    <ChangeLocation
                      {...{ key: title, parentRef }}
                      image={{
                        vertical: `/series/${language}/${category}/${title}/cover/vertical`,
                      }}
                      viewmode="vertical"
                      href={`/${language}/${routes[language].series}/${category}/${title}/${season}/${episode}`}
                    >
                      <ProgressBar
                        progress={
                          series[category][title][season][episode].progress
                        }
                        duration={
                          series[category][title][season][episode].credits
                        }
                      />
                    </ChangeLocation>
                  );
                });
            })
          : []),
      ])}
    </>
  );
}
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export default connect(mapStateToProps, mapDispatchToProps)(ContinueWatching);
