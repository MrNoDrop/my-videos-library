import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import setTrailerRoute from "../../store/actions/set/trailer/route";
import shaka from "shaka-player";
import "./trailer.scss";

const mapStateToProps = ({
  state: {
    trailers,
    user: { language },
  },
}) => ({
  trailers,
  language,
});

const mapDispatchToProps = (dispatch) => ({
  setTrailerRoute: (trailers, trailerRoute, language, value) =>
    dispatch(setTrailerRoute(trailers, trailerRoute, language, value)),
});

function Trailer({ href, trailers, language, setTrailerRoute }) {
  useFetchTrailer(href, trailers, language, setTrailerRoute);
  const trailer = trailers[language][href];
  const videoRef = useRef();
  const player = useLoadPlayer(trailer?.manifest, videoRef, () => {
    videoRef.current.play();
  });
  return (
    trailer && (
      <div className="trailer">
        <img src={trailer?.cover} className="cover" />
        <video
          ref={videoRef}
          controls
          onLoadedMetadata={() => {
            player.configure({
              streaming: {
                bufferBehind: videoRef.current.duration,
              },
            });
          }}
        />
      </div>
    )
  );
}

function useFetchTrailer(href, trailers, language, setTrailerRoute) {
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!trailers[language][href] && !fetching) {
      setFetching(true);
      (async () => {
        const { error, payload } = await (await fetch(href)).json();
        if (!error) {
          const { cover, manifest, thumbnail } = payload;
          setTrailerRoute(trailers, href, language, {
            cover,
            manifest,
            thumbnail,
          });
        }
        setFetching(false);
      })();
    }
  }, [trailers, fetching]);
}
function useLoadPlayer(src, videoRef, onLoaded) {
  const [player, setPlayer] = useState(undefined);
  useEffect(() => {
    if (!videoRef || !videoRef.current || !src) {
      return;
    }
    const shakaPlayer = new shaka.Player(videoRef.current);
    shakaPlayer.addEventListener("error", console.error);
    shakaPlayer
      .load(src)
      .then(() => onLoaded())
      .catch(console.error);
    setPlayer(shakaPlayer);
  }, [src, videoRef]);
  return player;
}
export default connect(mapStateToProps, mapDispatchToProps)(Trailer);
