import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import shaka from "shaka-player";
import { connect } from "react-redux";
import useImageLoader from "./effects/imageLoader";
import addImage from "../store/actions/add/image";
import "./video.scss";
import Subtitles from "./video/subtitles";
import PlaySvg from "../svg/play";
import FullscreenSvg from "../svg/fullscreen";
import MuteSvg from "../svg/mute";
import Hover from "./hover";
import Slider from "./slider";
import loading from "../svg/loading.svg";
import { vmin } from "./tools/vscale";
import VideoMenu from "./video/button/menu";
import SubtitlesButton from "../svg/subtitles";
import setSelectedSubtitles from "../store/actions/set/selected/subtitles";
import setWatchedMovie from "../store/actions/set/watched/movie";
import setWatchedSerie from "../store/actions/set/watched/serie";
import Player from "./player";

shaka.polyfill.installAll();

const mapStateToProps = ({
  state: {
    images,
    "selected-subtitles": selectedSubtitles,
    window: { inner },
    watched,
  },
}) => ({ images, windowInnerDimensions: inner, selectedSubtitles, watched });

const mapDispatchToProps = (dispatch) => ({
  addImage: (images, image, imageUrl) =>
    dispatch(addImage(images, image, imageUrl)),
  toggleSelectedSubtitle: (selectedSubtitles, selectedSubtitle) => {
    if (selectedSubtitles.includes(selectedSubtitle)) {
      dispatch(
        setSelectedSubtitles(
          selectedSubtitles.filter((subtitle) => subtitle != selectedSubtitle)
        )
      );
    } else {
      dispatch(setSelectedSubtitles([...selectedSubtitles, selectedSubtitle]));
    }
  },
  setWatchedMovie: (watched, language, category, title, value) =>
    dispatch(setWatchedMovie(watched, language, category, title, value)),
  setWatchedSerie: (
    watched,
    language,
    category,
    title,
    season,
    episode,
    value
  ) =>
    dispatch(
      setWatchedSerie(
        watched,
        language,
        category,
        title,
        season,
        episode,
        value
      )
    ),
});
function Video({
  src,
  hovertext,
  images,
  onLoaded = () => {},
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  subtitles = {},
  selectedSubtitles,
  poster,
  addImage,
  windowInnerDimensions,
  toggleSelectedSubtitle,
  watched,
  setWatchedMovie,
  setWatchedSerie,
  ...other
}) {
  if (!subtitles) {
    subtitles = {};
  }
  const [selectedContentDB, language, category, title, season, episode] = src
    .replace("/manifest", "")
    .replace("/movies", "movies")
    .replace("/series", "series")
    .split("/");
  const videoVolumeSliderRef = useRef();
  const videoTimeSliderRef = useRef();
  const playerRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [bufferedTimeout, setBufferedTimeout] = useState(undefined);
  const [hideControls, setHideControls] = useState(false);
  const [hideControlsTimeout, setHideControlsTimeout] = useState(undefined);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [timeouttime, setTimeouttime] = useState(undefined);
  const [videoVolume, setVideoVolume] = useState(1);
  const [video, setVideo] = useState(undefined);
  const image = useImageLoader(poster, images, addImage, true);
  // const player = useLoadPlayer(src, video, (e) => {
  //   setLoaded(true);
  //   onLoaded(e);
  //   video.play();
  // });
  const metadata = useFetchMetadata(src);
  useEffect(() => {
    if (video?.duration) {
      switch (selectedContentDB) {
        case "movies":
          setWatchedMovie(watched, language, category, title, {
            duration: video.duration,
            progress: videoTime,
            credits: metadata.credits,
          });
          break;
        case "series":
          setWatchedSerie(watched, language, category, title, season, episode, {
            duration: video.duration,
            progress: videoTime,
            credits: metadata.credits,
          });
          break;
        default:
          throw new Error("missing case.");
      }
    }
  }, [video, videoTime]);
  const {
    hidden: hovertextHidden,
    mousePostion,
    onMouseEnter: hoverOnMouseEnter,
    onMouseLeave: hoverOnMouseLeave,
    onMouseMove: hoverOnMouseMove,
  } = Hover.useHide();
  const mouseEventListeners = {
    onClick: (e) => {
      if (typeof onClick === "function") {
        onClick(e);
      }
      video.paused ? video.play() : hoverOnMouseMove(e) || video.pause();
    },
    onMouseEnter: (e) => {
      if (typeof onMouseEnter === "function") {
        onMouseEnter(e);
      }
      if (video.paused && loaded) {
        hoverOnMouseEnter(e);
      }
    },
    onMouseLeave: (e) => {
      if (typeof onMouseLeave === "function") {
        onMouseLeave(e);
      }
      hoverOnMouseLeave(e);
    },
    onMouseMove: (e) => {
      if (typeof onMouseMove === "function") {
        onMouseMove(e);
      }
      if (!loaded) {
        hoverOnMouseLeave(e);
        return;
      }
      if (video.paused) {
        hoverOnMouseMove(e);
      }
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
      }
      setHideControls(false);
      setHideControlsTimeout(
        setTimeout(() => {
          setHideControls(true);
          setHideControlsTimeout(clearTimeout(hideControlsTimeout));
        }, 1000)
      );
    },
  };
  useEffect(
    () => {
      video && (video.volume = videoVolume);
    },
    // eslint-disable-next-line
    []
  );
  useEffect(() => {
    if (!timeouttime) {
      setTimeouttime(
        setTimeout(() => {
          if (video) {
            if (videoTime !== video.currentTime) {
              setVideoTime(video.currentTime);
            }
          }
          setTimeouttime(clearTimeout(timeouttime));
        }, 10)
      );
    }
  }, [video, timeouttime, setTimeouttime, videoTime, setVideoTime]);
  const [overlayStyle, setOverlayStyle] = useState({});
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    if (video) {
      const rect = ReactDOM.findDOMNode(video).getBoundingClientRect();
      if (rect) {
        const { top, left, width, height } = rect;
        if (
          JSON.stringify(overlayStyle) !==
          JSON.stringify({ top, left, width, height })
        ) {
          setOverlayStyle({ top, left, width, height });
        }
      }
    }
  }, [video, overlayStyle, setOverlayStyle, windowInnerDimensions]);
  useEffect(() => {
    if (video) {
      if (!bufferedTimeout) {
        setBufferedTimeout(
          setTimeout(() => {
            if (video.buffered.length !== buffered) {
              setBuffered(video.buffered.length);
            }
            setBufferedTimeout(clearTimeout(bufferedTimeout));
          }, 10)
        );
      }
    }
    return () => clearTimeout(bufferedTimeout);
  }, [video, buffered, setBuffered, bufferedTimeout, setBufferedTimeout]);
  document.body.onkeyup = function ({ key }) {
    if (video && key === " ") {
      video.paused ? video.play() : video.pause();
    }
  };
  return (
    <div className="player" ref={playerRef}>
      <Player
        key="video"
        className="video"
        autoPlay
        init={true}
        poster={image}
        getVideo={setVideo}
        onLoadedData={() => setLoaded(true)}
        onLoadedMetadata={() => {
          video.currentTime = (() => {
            switch (selectedContentDB) {
              case "movies":
                return (
                  watched.movies[language]?.[category]?.[title]?.progress || 0
                );
              case "series":
                return (
                  watched.series[language]?.[category]?.[title]?.[season]?.[
                    episode
                  ]?.progress || 0
                );
              default:
                try {
                  throw new Error("missing case.");
                } catch (e) {
                  console.error(e);
                }
                break;
            }
            return 0;
          })();
        }}
        {...{ src, ...other }}
      />
      <div
        className="overlay"
        style={{
          ...overlayStyle,
          cursor: video && !video.paused && hideControls ? "none" : "default",
          ...(() =>
            loaded && buffered ? {} : { backgroundImage: `url(${loading})` })(),
        }}
      >
        <PlaySvg
          className={`play-button absolute`}
          locked={true}
          hidden={video && !video.paused}
          paused={video?.paused}
          {...mouseEventListeners}
          onClick={() => (video.paused ? video.play() : video.pause())}
        />
        <Subtitles
          {...{
            subtitles,
            videoTime,
            ...mouseEventListeners,
            offset: {
              height:
                video && !video.paused && hideControls ? vmin(4) : vmin(6),
            },
          }}
        />
        <div
          className={`controls${
            video && !video.paused && hideControls ? " hidden" : ""
          }`}
          ref={useRef()}
          onMouseEnter={() => {
            if (hideControlsTimeout) {
              clearTimeout(hideControlsTimeout);
            }
            setHideControls(false);
          }}
          onMouseLeave={() => {
            if (hideControlsTimeout) {
              clearTimeout(hideControlsTimeout);
            }
            setHideControls(false);
            setHideControlsTimeout(
              setTimeout(() => {
                setHideControls(true);
                setHideControlsTimeout(clearTimeout(hideControlsTimeout));
              }, 1000)
            );
          }}
        >
          <PlaySvg
            className={`play-button`}
            paused={video?.paused}
            onClick={() => (video.paused ? video.play() : video.pause())}
          />
          <Slider
            className="video-time-slider"
            ref={videoTimeSliderRef}
            min="0"
            value={videoTime}
            setValue={(value) => {
              setVideoTime(value);
              video.currentTime = value;
            }}
            max={video?.duration || 1}
            step="0.01"
          />
          <VideoMenu
            {...{ button: <SubtitlesButton />, windowInnerDimensions }}
          >
            {Object.keys(subtitles).map((language) => (
              <div
                className={`language-button${
                  selectedSubtitles.includes(language) ? " selected" : ""
                }`}
                onClick={() => {
                  toggleSelectedSubtitle(selectedSubtitles, language);
                }}
              >
                {language}
              </div>
            ))}
          </VideoMenu>
          <MuteSvg
            className="mute-button"
            muted={video?.volume === 0}
            onClick={() => {
              if (muted) {
                video.volume = muted;
                setVideoVolume(muted);
                setMuted(false);
              } else {
                setMuted(videoVolume);
                setVideoVolume(0);
                video.volume = 0;
              }
            }}
          />
          <Slider
            ref={videoVolumeSliderRef}
            className="video-volume-slider"
            value={videoVolume}
            max="1"
            setValue={(value) => {
              if (muted && value !== 0) {
                setMuted(false);
              }
              if (!muted && value === 0) {
                setMuted(true);
              }
              setVideoVolume(value);
              video.volume = value;
            }}
            step="0.001"
          />
          <FullscreenSvg
            fullscreen={fullscreenMode}
            className={`fullscreen-button`}
            onClick={() =>
              fullscreenMode
                ? document.exitFullscreen().then(() => setFullscreenMode(false))
                : playerRef.current
                    .requestFullscreen()
                    .then(() => setFullscreenMode(true))
            }
          />
        </div>
        {hovertext && (
          <Hover
            hidden={hovertextHidden || (video && !video.paused)}
            {...{ mousePostion }}
          >
            {hovertext}
          </Hover>
        )}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Video);

function useLoadPlayer(src, video, onLoaded) {
  const [player, setPlayer] = useState(undefined);
  useEffect(() => {
    if (!video || !video) {
      return;
    }
    const shakaPlayer = new shaka.Player(video);
    shakaPlayer.addEventListener("error", console.error);
    shakaPlayer
      .load(src)
      .then(() => onLoaded())
      .catch(console.error);
    setPlayer(shakaPlayer);
  }, [src, video]);
  return player;
}

function useFetchMetadata(src) {
  const [isFetching, setIsFetching] = useState(false);
  const [metadata, setMetadata] = useState(undefined);
  useEffect(() => {
    if (!isFetching && !metadata) {
      (async () => {
        setIsFetching(true);
        try {
          const { payload } = await (await fetch(`${src}/metadata`)).json();
          const { metadata } = payload;
          setMetadata(metadata);
        } catch (e) {
          console.error(e);
        }
        setIsFetching(false);
      })();
    }
  }, [isFetching, metadata]);
  return metadata;
}
