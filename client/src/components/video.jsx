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

shaka.polyfill.installAll();

const mapStateToProps = ({
  state: {
    images,
    "selected-subtitles": selectedSubtitles,
    window: { inner },
  },
}) => ({ images, windowInnerDimensions: inner, selectedSubtitles });

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
  ...other
}) {
  if (!subtitles) {
    subtitles = {};
  }
  const videoVolumeSliderRef = useRef();
  const videoTimeSliderRef = useRef();
  const videoRef = useRef();
  const playerRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [bufferedTimeout, setBufferedTimeout] = useState(undefined);
  const [hideControls, setHideControls] = useState(false);
  const [hideControlsTimeout, setHideControlsTimeout] = useState(undefined);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const player = useLoadPlayer(src, videoRef, (e) => {
    setLoaded(true);
    onLoaded(e);
    videoRef.current.play();
  });
  const image = useImageLoader(poster, images, addImage, true);
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
      videoRef.current.paused
        ? videoRef.current.play()
        : hoverOnMouseMove(e) || videoRef.current.pause();
    },
    onMouseEnter: (e) => {
      if (typeof onMouseEnter === "function") {
        onMouseEnter(e);
      }
      if (videoRef.current && videoRef.current.paused && loaded) {
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
      if (videoRef.current && videoRef.current.paused) {
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
  const [timeouttime, setTimeouttime] = useState(undefined);
  const [videoVolume, setVideoVolume] = useState(0.1);
  useEffect(
    () => {
      videoRef && videoRef.current && (videoRef.current.volume = 0.1);
    },
    // eslint-disable-next-line
    []
  );
  const [videoTime, setVideoTime] = useState(
    (videoRef && videoRef.current && videoRef.current.currentTime) || 0
  );
  useEffect(() => {
    if (!timeouttime) {
      setTimeouttime(
        setTimeout(() => {
          if (videoRef && videoRef.current) {
            if (videoTime !== videoRef.current.currentTime) {
              setVideoTime(videoRef.current.currentTime);
            }
          }
          setTimeouttime(clearTimeout(timeouttime));
        }, 10)
      );
    }
  }, [videoRef, timeouttime, setTimeouttime, videoTime, setVideoTime]);
  const [overlayStyle, setOverlayStyle] = useState({});
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    if (videoRef.current) {
      const rect = ReactDOM.findDOMNode(
        videoRef.current
      ).getBoundingClientRect();
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
  }, [videoRef, overlayStyle, setOverlayStyle, windowInnerDimensions]);
  useEffect(() => {
    if (videoRef.current) {
      if (!bufferedTimeout) {
        setBufferedTimeout(
          setTimeout(() => {
            if (
              videoRef.current &&
              videoRef.current.buffered.length !== buffered
            ) {
              setBuffered(videoRef.current.buffered.length);
            }
            setBufferedTimeout(clearTimeout(bufferedTimeout));
          }, 10)
        );
      }
    }
    return () => clearTimeout(bufferedTimeout);
  }, [videoRef, buffered, setBuffered, bufferedTimeout, setBufferedTimeout]);
  return (
    <div className="player" ref={playerRef}>
      <video
        key="video"
        autoplay
        ref={videoRef}
        poster={image}
        onLoadedMetadata={() => {
          player.configure({
            streaming: {
              bufferBehind: videoRef.current.duration,
            },
          });
        }}
        {...{ ...other }}
      />
      <div
        className="overlay"
        style={{
          ...overlayStyle,
          cursor:
            videoRef.current && !videoRef.current.paused && hideControls
              ? "none"
              : "default",
          ...(() =>
            loaded && buffered ? {} : { backgroundImage: `url(${loading})` })(),
        }}
      >
        <PlaySvg
          className={`play-button absolute`}
          locked={true}
          hidden={videoRef.current && !videoRef.current.paused}
          paused={videoRef.current && videoRef.current.paused}
          {...mouseEventListeners}
          onClick={() =>
            videoRef.current.paused
              ? videoRef.current.play()
              : videoRef.current.pause()
          }
        />
        <Subtitles
          {...{
            subtitles,
            videoTime,
            ...mouseEventListeners,
            offset: {
              height:
                videoRef.current && !videoRef.current.paused && hideControls
                  ? vmin(4)
                  : vmin(6),
            },
          }}
        />
        <div
          className={`controls${
            videoRef.current && !videoRef.current.paused && hideControls
              ? " hidden"
              : ""
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
            paused={videoRef.current && videoRef.current.paused}
            onClick={() =>
              videoRef.current.paused
                ? videoRef.current.play()
                : videoRef.current.pause()
            }
          />
          <Slider
            className="video-time-slider"
            ref={videoTimeSliderRef}
            min="0"
            value={videoTime}
            setValue={(value) => {
              setVideoTime(value);
              videoRef.current.currentTime = value;
            }}
            max={(videoRef.current && videoRef.current.duration) || 1}
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
            muted={videoRef.current && videoRef.current.volume === 0}
            onClick={() => {
              if (muted) {
                videoRef.current.volume = muted;
                setVideoVolume(muted);
                setMuted(false);
              } else {
                setMuted(videoVolume);
                setVideoVolume(0);
                videoRef.current.volume = 0;
              }
            }}
          />
          <Slider
            ref={videoVolumeSliderRef}
            className="video-volume-slider"
            value={videoVolume}
            max="0.1"
            setValue={(value) => {
              if (muted && value !== 0) {
                setMuted(false);
              }
              setVideoVolume(value);
              videoRef.current.volume = value;
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
            hidden={
              hovertextHidden || (videoRef.current && !videoRef.current.paused)
            }
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

function useLoadPlayer(src, videoRef, onLoaded) {
  const [player, setPlayer] = useState(undefined);
  useEffect(() => {
    if (!videoRef || !videoRef.current) {
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
