import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "./previous.scss";
import { push } from "redux-first-routing";

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => ({
  changeLocation: (href) => dispatch(push(href)),
});

function PreviousVideoButton({
  changeLocation,
  hidden,
  render,
  src,
  href,
  season,
  episode,
}) {
  const seasons = useFetchSeasons(src, render);
  const [previousSeason, setPreviousSeason] = useState(season);
  const [previousEpisode, setPreviousEpisode] = useState(episode);
  useEffect(() => {
    if (seasons) {
      (async () => {
        for (let season_ of seasons.slice(seasons.indexOf(previousSeason))) {
          setPreviousSeason(season_);
          try {
            const { error, payload } = await (
              await fetch(`${src}/${season_}`)
            ).json();
            if (!error) {
              const { episodes: ep } = payload;
              const episodes = ep.sort((a, b) => b - a);
              const previousEpisode_ = episodes.slice(
                episodes.indexOf(previousEpisode)
              )[1];
              if (previousEpisode_) {
                setPreviousEpisode(previousEpisode_);
                break;
              } else {
                setPreviousEpisode(episodes[0]);
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
      })();
    }
  }, [seasons]);
  return render && (previousSeason < season || previousEpisode < episode) ? (
    <button
      className="previous-video-button"
      {...{ hidden }}
      onClick={() => {
        changeLocation(`${href}/${previousSeason}/${previousEpisode}`);
        window.location.reload();
      }}
    >
      {"<"}
    </button>
  ) : (
    <></>
  );
}

function useFetchSeasons(src, render) {
  const [seasons, setSeasons] = useState(undefined);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!seasons && !fetching && render) {
      setFetching(true);
      (async () => {
        try {
          const { error, payload } = await (await fetch(src)).json();
          if (!error) {
            const { seasons } = payload;
            setSeasons(seasons);
          }
        } catch (e) {
          console.error(e);
        }
        setFetching(false);
      })();
    }
  }, [seasons, setSeasons, src, render]);
  return seasons?.sort((a, b) => b - a);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviousVideoButton);
