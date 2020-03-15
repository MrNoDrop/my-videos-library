import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import shaka from 'shaka-player';
import { connect } from 'react-redux';
import useImageLoader from './effects/imageLoader';
import addImage from '../store/actions/add/image';
import './video.scss';
import Subtitles from './subtitles';
import PlaySvg from '../svg/play';
import FullscreenSvg from '../svg/fullscreen';
import Hover from './hover';
shaka.polyfill.installAll();

const mapStateToProps = ({
  state: {
    images,
    'selected-subtitles': selectedSubtitles,
    window: { inner }
  }
}) => ({ images, windowInnerDimensions: inner, selectedSubtitles });

const mapDispatchToProps = dispatch => ({
  addImage: (images, image, imageUrl) =>
    dispatch(addImage(images, image, imageUrl))
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
  ...other
}) {
  const inputRef = useRef();
  const videoRef = useRef();
  const playerRef = useRef();
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const setBlurred = useFocusVideo(videoRef);
  const player = useLoadPlayer(src, videoRef, onLoaded);
  const image = useImageLoader(poster, images, addImage, true);
  const {
    hidden: hovertextHidden,
    mousePostion,
    onMouseEnter: hoverOnMouseEnter,
    onMouseLeave: hoverOnMouseLeave,
    onMouseMove: hoverOnMouseMove
  } = Hover.useHide();
  const mouseEventListeners = {
    onClick: e => {
      if (typeof onClick === 'function') {
        onClick(e);
      }
    },
    onMouseEnter: e => {
      if (typeof onMouseEnter === 'function') {
        onMouseEnter(e);
      }
      if (videoRef.current && videoRef.current.paused) {
        hoverOnMouseEnter(e);
      }
    },
    onMouseLeave: e => {
      if (typeof onMouseLeave === 'function') {
        onMouseLeave(e);
      }
      hoverOnMouseLeave(e);
    },
    onMouseMove: e => {
      if (typeof onMouseMove === 'function') {
        onMouseMove(e);
      }
      if (videoRef.current && videoRef.current.paused) {
        hoverOnMouseMove(e);
      }
    }
  };
  const [timeouttime, setTimeouttime] = useState(undefined);
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
        }, 50)
      );
    }
  }, [videoRef, timeouttime, setTimeouttime, videoTime, setVideoTime]);
  const [overlayStyle, setOverlayStyle] = useState({});
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
          console.log(top, left, width, height);
          setOverlayStyle({ top, left, width, height });
        }
      }
    }
  }, [videoRef, overlayStyle, setOverlayStyle, windowInnerDimensions]);
  return (
    <div className="player" ref={playerRef}>
      <video
        key="video"
        ref={videoRef}
        onBlur={() => setBlurred(true)}
        poster={image}
        onLoadedMetadata={() =>
          player.configure({
            streaming: {
              bufferBehind: videoRef.current.duration
            }
          })
        }
        {...{ ...other }}
      />
      <div className="overlay" style={overlayStyle}>
        <div className="subtitles-container" {...mouseEventListeners}>
          {selectedSubtitles.map(current => (
            <Subtitles {...{ subtitles, videoRef, current }} />
          ))}
        </div>
        <div className="controls">
          <PlaySvg
            className={`play-button`}
            paused={videoRef.current && videoRef.current.paused}
            onClick={() =>
              videoRef.current.paused
                ? videoRef.current.play()
                : videoRef.current.pause()
            }
          />
          <input
            ref={inputRef}
            type="range"
            min="0"
            value={videoTime}
            max={videoRef.current && videoRef.current.duration}
            onInput={e =>
              setVideoTime(e.target.value) ||
              (videoRef.current.currentTime = e.target.value)
            }
            step="0.01"
          />
          <Subtitles.Button {...{ subtitles }} />
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
    shakaPlayer.addEventListener('error', console.error);
    shakaPlayer
      .load(src)
      .then(() => onLoaded())
      .catch(console.error);
    setPlayer(shakaPlayer);
  }, [src, videoRef]);
  return player;
}
function useFocusVideo(videoRef) {
  const [blurred, setBlurred] = useState(true);
  useEffect(() => {
    if (videoRef.current && blurred) {
      videoRef.current.focus();
      setBlurred(false);
    }
  }, [videoRef, blurred, setBlurred]);
  return setBlurred;
}
