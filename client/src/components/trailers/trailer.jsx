import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import setTrailerRoute from "../../store/actions/set/trailer/route";
import addImage from "../../store/actions/add/image";
import useImageLoader from "../effects/imageLoader";
import { push } from "redux-first-routing";
import shaka from "shaka-player";
import "./trailer.scss";
import PlaySvg from "../../svg/play";
import staticImages from "../../images";
import useRender from "../effects/useRender";
import FullscreenSVG from "../../svg/fullscreen";
import { useFitAvailableSpace } from "../effects";
import { fitAvailableSpaceBarOffset } from "../bar";
import savePlayer from "../../store/actions/save/player";
import Player from "../player";

shaka.polyfill.installAll();

const mapStateToProps = ({
  state: {
    images,
    trailers,
    user: { language },
    window: { inner },
    players,
  },
  router: { routes },
}) => ({
  trailers,
  language,
  images,
  routes,
  windowInnerDimensions: inner,
  players,
});

const mapDispatchToProps = (dispatch) => ({
  changePath: (path) => dispatch(push(path)),
  addImage: (images, image, imageUrl) =>
    dispatch(addImage(images, image, imageUrl)),
  setTrailerRoute: (trailers, trailerRoute, language, value) =>
    dispatch(setTrailerRoute(trailers, trailerRoute, language, value)),
  savePlayer: (players, href, player, playerLoading) =>
    dispatch(savePlayer(players, href, player, playerLoading)),
});

function Trailer({
  href,
  trailers,
  language,
  setTrailerRoute,
  addImage,
  images,
  changePath,
  routes,
  containerRef,
  containerScrollEventCounter,
  windowInnerDimensions,
  players,
  savePlayer,
}) {
  const { ref: trailerRef, render: fetchTrailer } = useRender(
    containerRef,
    containerScrollEventCounter
  );
  useFetchTrailer(href, trailers, language, setTrailerRoute, fetchTrailer);
  const trailer = trailers[language][href];
  const poster = useImageLoader(
    trailer?.thumbnail,
    images,
    addImage,
    trailer?.thumbnail
  );
  const cover = useImageLoader(
    trailer?.cover,
    images,
    addImage,
    trailer?.cover
  );
  const [video, setVideo] = useState(undefined);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState({ code: 1, message: "Shaka error 1" });
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [mouseEntered, setMouseEntered] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const trailerFullscreenStyle = useFitAvailableSpace(
    windowInnerDimensions,
    fitAvailableSpaceBarOffset()
  );
  useEffect(() => {
    if (!video || !loaded) {
      return;
    }
    if (mouseEntered && video.paused) {
      video.play();
    }
    if (!mouseEntered && !video.paused) {
      video.pause();
    }
  }, [mouseEntered, video, loaded]);
  return (
    <div
      ref={trailerRef}
      className={`trailer${fullscreen ? " fullscreen-video" : ""}`}
      style={fullscreen ? trailerFullscreenStyle : {}}
      onMouseEnter={() => {
        setMouseEntered(true);
      }}
      onMouseLeave={() => {
        setMouseEntered(false);
      }}
      onClick={() => {
        const [choosenTrailersDB, language, category, trailer] = href
          .replace("/trailers/trailer/", "")
          .split("/");
        changePath(
          `/${language}/${routes[language][choosenTrailersDB]}/${category}/${trailer}`
        );
      }}
    >
      {poster && (
        <PlaySvg paused={loaded ? !mouseEntered : true} disableEvents={true} />
      )}
      <img
        alt=""
        src={cover ? cover : staticImages.animated.loading}
        className="cover"
      />
      {playerLoaded && !loaded && (
        <img
          alt=""
          src={staticImages.animated.loading1}
          className="loading-video"
        />
      )}
      <Player
        src={trailer?.manifest}
        onPlayerError={console.error}
        init={poster && mouseEntered}
        onPlayerLoaded={() => setPlayerLoaded(true)}
        onError={setError}
        getVideo={setVideo}
        poster={poster}
        onLoadedData={() => {
          setLoaded(true);
        }}
      />
      {/* {trailer?.manifest && video} */}
      <FullscreenSVG
        {...{ fullscreen }}
        onClick={(e) => {
          e.stopPropagation();
          setFullscreen(!fullscreen);
        }}
      />
    </div>
  );
}

function useFetchTrailer(
  href,
  trailers,
  language,
  setTrailerRoute,
  fetchTrailer
) {
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!fetchTrailer) {
      return;
    } else if (!trailers[language][href] && !fetching) {
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
  }, [trailers, fetching, fetchTrailer]);
}
function useLoadPlayer(src, videoRef, onLoaded = () => {}, onError = () => {}) {
  const [player, setPlayer] = useState(undefined);
  useEffect(() => {
    if (!videoRef?.current || !src) {
      return;
    }
    (async () => {
      const shakaPlayer = new shaka.Player();
      shakaPlayer.attach(videoRef.current);
      try {
        await shakaPlayer.load(src);
        onLoaded();
        setPlayer(shakaPlayer);
      } catch (error) {
        onError(error);
        console.error(error);
      }
    })();
  }, [src, videoRef]);
  return player;
}
export default connect(mapStateToProps, mapDispatchToProps)(Trailer);
