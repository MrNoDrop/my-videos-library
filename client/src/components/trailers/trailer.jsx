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

shaka.polyfill.installAll();

const mapStateToProps = ({
  state: {
    images,
    trailers,
    user: { language },
  },
  router: { routes },
}) => ({
  trailers,
  language,
  images,
  routes,
});

const mapDispatchToProps = (dispatch) => ({
  changePath: (path) => dispatch(push(path)),
  addImage: (images, image, imageUrl) =>
    dispatch(addImage(images, image, imageUrl)),
  setTrailerRoute: (trailers, trailerRoute, language, value) =>
    dispatch(setTrailerRoute(trailers, trailerRoute, language, value)),
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
}) {
  const { ref: trailerRef, render: fetchTrailer } = useRender(
    containerRef,
    containerScrollEventCounter
  );
  useFetchTrailer(href, trailers, language, setTrailerRoute, fetchTrailer);
  const trailer = trailers[language][href];
  const image = useImageLoader(
    trailer?.thumbnail,
    images,
    addImage,
    trailer?.thumbnail
  );
  const videoRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const player = useLoadPlayer(trailer?.manifest, videoRef);
  const [mouseEntered, setMouseEntered] = useState(false);
  useEffect(() => {
    if (!videoRef?.current || !loaded) {
      return;
    }
    if (mouseEntered && videoRef.current.paused) {
      videoRef.current.play();
    }
    if (!mouseEntered && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [mouseEntered, videoRef, loaded]);
  return (
    <div
      ref={trailerRef}
      className="trailer"
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
      {image && (
        <PlaySvg paused={loaded ? !mouseEntered : true} disableEvents={true} />
      )}
      <img
        src={trailer?.cover ? trailer.cover : staticImages.animated.loading}
        className="cover"
      />

      {trailer?.manifest && (
        <video
          key={href}
          ref={videoRef}
          poster={image}
          onLoadedData={() => {
            setLoaded(true);
          }}
          onLoadedMetadata={() => {
            player.configure({
              streaming: {
                bufferBehind: videoRef.current.duration,
              },
            });
          }}
        />
      )}
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
function useLoadPlayer(src, videoRef, onLoaded = () => {}) {
  const [player, setPlayer] = useState(undefined);
  useEffect(() => {
    if (!videoRef?.current || !src) {
      return;
    }
    (async () => {
      const shakaPlayer = new shaka.Player(videoRef.current);
      try {
        await shakaPlayer.load(src);
        onLoaded();
        setPlayer(shakaPlayer);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [src, videoRef]);
  return player;
}
export default connect(mapStateToProps, mapDispatchToProps)(Trailer);
