import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import shaka from 'shaka-player';
import setCurrentTime from '../../store/actions/set/current/time';
import './video.scss';

shaka.polyfill.installAll();

const mapStateToProps = ({ state: { currenttime } }) => ({ currenttime });

const mapDispatchToProps = dispatch => ({
  setCurrentTime: currenttime => dispatch(setCurrentTime(currenttime))
});

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}
function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}
function DisplayVideo({ currenttime, setCurrentTime, className, ...other }) {
  const videoRef = useRef();
  const [player, setPlayer] = useState(undefined);
  const [ended, setEnded] = useState(false);
  const [blurred, setBlurred] = useState(true);
  const [timeouttime, setTimeouttime] = useState(undefined);
  const [currentTimeSet, setCurrentTimeSet] = useState(false);
  const { pathname } = document.location;
  // eslint-disable-next-line
  const [language, fixedpath, ...playbackroute] = pathname
    .substring(1, pathname.length)
    .split('/');
  // eslint-disable-next-line
  const [category, ...videoPath] = playbackroute;
  useEffect(() => {
    if (videoRef.current && blurred) {
      videoRef.current.focus();
      setBlurred(false);
    }
  }, [videoRef, blurred, setBlurred]);
  useEffect(() => {
    if (videoRef && videoRef.current && !currentTimeSet) {
      for (let key of Object.keys(currenttime)) {
        console.log(key);
        if (videoPath.join('/') === key) {
          videoRef.current.currentTime = currenttime[key];
          break;
        }
      }
      setCurrentTimeSet(true);
    }
    if (!timeouttime) {
      setTimeouttime(
        setTimeout(() => {
          if (ended) {
            setEnded(false);
            setCurrentTime({ ...currenttime, [videoPath.join('/')]: 0 });
          } else if (videoRef.current) {
            setCurrentTime({
              ...currenttime,
              [videoPath.join('/')]: videoRef.current.currentTime
            });
            setTimeouttime(clearTimeout(timeouttime));
          }
        }, 1000)
      );
    }
  }, [
    videoRef,
    timeouttime,
    ended,
    currentTimeSet,
    currenttime,
    setCurrentTime,
    videoPath
  ]);
  useEffect(() => {
    if (!videoRef || !videoRef.current) {
      return;
    }
    const player = new shaka.Player(videoRef.current);

    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    // Listen for error events.
    player.addEventListener('error', onErrorEvent);

    // Try to load a manifest.
    // This is an asynchronous process.
    player
      .load(`/series/${language}/${playbackroute.join('/')}`)
      .then(function() {
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');
      })
      .catch(onError); // onError is executed if the asynchronous load fails.
    // eslint-disable-next-line
    setPlayer(player);
  }, [videoRef, language]);
  useEffect(() => {}, [pathname, player]);
  return (
    <video
      {...{
        ref: videoRef,
        ...other
      }}
      onBlur={e => setBlurred(true)}
      className={`display-video${className ? ` ${className}` : ''}`}
      onEnded={() => setEnded(true)}
      autoPlay
      preload="metadata"
      poster={`/series/shared/${playbackroute.join('/')}/thumbnail`}
      controls
      ref={videoRef}
    />
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayVideo);
