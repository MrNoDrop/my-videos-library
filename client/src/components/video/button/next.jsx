import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => ({
  changeLocation: (href) => dispatch(push(href)),
});

function NextVideoButton({
  changeLocation,
  hidden,
  render,
  src,
  href,
  season,
  episode,
}) {
  const seasons = useFetchSeasons(src, render);
  const [nextSeason, setNextSeason] = useState(season);
  const [nextEpisode, setNextEpisode] = useState(episode);
  useEffect(() => {
    if (seasons) {
      (async () => {
        for (let season_ of seasons.slice(seasons.indexOf(nextSeason))) {
          setNextSeason(season_);
          try {
            const { error, payload } = await (
              await fetch(`${src}/${season_}`)
            ).json();
            if (!error) {
              const { episodes: ep } = payload;
              const episodes = ep.sort((a, b) => a - b);
              const nextEpisode_ = episodes.slice(
                episodes.indexOf(nextEpisode)
              )[1];
              if (nextEpisode_) {
                setNextEpisode(nextEpisode_);
                break;
              } else {
                setNextEpisode("1");
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
      })();
    }
  }, [seasons]);
  return render && (nextSeason > season || nextEpisode > episode) ? (
    <button
      className="next-video-button"
      {...{ hidden }}
      onClick={() => {
        changeLocation(`${href}/${nextSeason}/${nextEpisode}`);
        window.location.reload();
      }}
    >
      Next
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
  return seasons?.sort((a, b) => a - b);
}
export default connect(mapStateToProps, mapDispatchToProps)(NextVideoButton);
