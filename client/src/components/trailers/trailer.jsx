import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import setTrailerRoute from "../../store/actions/set/trailer/route";
import addImage from "../../store/actions/add/image";
import useImageLoader from "../effects/imageLoader";
import { push } from "redux-first-routing";
import shaka from "shaka-player";
import "./trailer.scss";
import PlaySvg from "../../svg/play";

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
}) {
  useFetchTrailer(href, trailers, language, setTrailerRoute);
  const trailer = trailers[language][href];
  const image = useImageLoader(trailer?.thumbnail, images, addImage, true);
  const videoRef = useRef();
  const player = useLoadPlayer(trailer?.manifest, videoRef, () => {
    // videoRef.current.play();
  });
  const [mouseEntered, setMouseEntered] = useState(false);
  return (
    trailer && (
      <div
        className="trailer"
        onMouseEnter={() => {
          setMouseEntered(true);
          videoRef.current.play();
        }}
        onMouseLeave={() => {
          setMouseEntered(false);
          videoRef.current.pause();
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
        <PlaySvg paused={!mouseEntered} disableEvents={true} />
        <img src={trailer?.cover} className="cover" />
        <video
          key={href}
          ref={videoRef}
          poster={image}
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
