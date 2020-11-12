import React, { useRef, useEffect, useState } from 'react';
import './subtitle.scss';

function Subtitle({
  videoTime,
  collection,
  className,
  style,
  onWheel,
  ...props
}) {
  const ref = useRef();
  const [fontSize, setFontSize] = useState(5);
  const changeFontSize = event => {
    let delta;

    if (event.wheelDelta) {
      delta = event.wheelDelta;
    } else {
      delta = -1 * event.deltaY;
    }

    if (delta > 0) {
      setFontSize(fontSize - 0.1 < 2.5 ? 2.5 : fontSize - 0.1);
    } else if (delta < 0) {
      setFontSize(fontSize + 0.1);
    }
  };
  const currentSubtitle = useDetermineCurrentSubtitle(videoTime, collection);
  return (
    <div
      {...{
        ref,
        className: `subtitle${className ? ` ${className}` : ''}`,
        style: {
          ...style,
          fontSize: `${fontSize}vmin`,
          textShadow: `-${fontSize / 25}vmin -${fontSize /
            25}vmin 0 white, ${fontSize / 25}vmin -${fontSize / 25}vmin 0 white,
          -${fontSize / 25}vmin ${fontSize / 25}vmin 0 white, ${fontSize /
            25}vmin ${fontSize / 25}vmin 0 white`
        },
        ...props
      }}
      hidden={!currentSubtitle}
      scrollable
      onWheel={event => {
        changeFontSize(event);
        if (typeof onWheel === 'function') {
          onWheel(event);
        }
      }}
    >
      {currentSubtitle}
    </div>
  );
}
export default Subtitle;

function useDetermineCurrentSubtitle(videoTime, collection) {
  const [currentSubtitle, setCurrentSubtitle] = useState(undefined);
  useEffect(() => {
    let newCurrentSubtitle = null;
    if (typeof collection === 'object') {
      for (let [start, end, subtitle] of Object.values(collection)) {
        if (videoTime >= start && videoTime <= end) {
          newCurrentSubtitle = subtitle;
          break;
        }
      }
    }
    if (newCurrentSubtitle !== currentSubtitle) {
      setCurrentSubtitle(newCurrentSubtitle);
    }
  }, [videoTime, currentSubtitle, setCurrentSubtitle]);
  return currentSubtitle;
}
