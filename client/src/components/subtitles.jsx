import React, { useEffect, useState } from 'react';
import addSubtitles from '../store/actions/add/subtitles';
import setSelectedSubtitles from '../store/actions/set/selected/subtitles';
import { connect } from 'react-redux';
const mapStateToProps = ({
  state: { 'selected-subtitles': selectedSubtitles, subtitles }
}) => ({
  availableSubtitles: subtitles,
  selectedSubtitles
});

const mapDispatchToProps = dispatch => ({
  addSubtitles: (availableSubtitles, newSubtitles) =>
    dispatch(addSubtitles(availableSubtitles, newSubtitles)),
  setSelectedSubtitles: selectedSubtitles =>
    dispatch(setSelectedSubtitles(selectedSubtitles))
});

function Subtitles({
  videoRef,
  addSubtitles,
  availableSubtitles,
  subtitles = {},
  current,
  className = 'subtitles',
  style,
  onWheel,
  selectedSubtitles,
  ...props
}) {
  delete props.setSelectedSubtitles;
  const [fontSize, setFontSize] = useState(4);
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
      setFontSize(fontSize + 0.1 > 5 ? 5 : fontSize + 0.1);
    }
  };
  useFetchSubtitles(
    subtitles,
    availableSubtitles,
    addSubtitles,
    selectedSubtitles
  );
  const videoTime = useDetermineVideoTime(videoRef);
  const currentSubtitle = useDetermineCurrentSubtitle(
    current,
    videoTime,
    subtitles,
    availableSubtitles
  );
  return (
    <div
      {...{
        className,
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

function SubtitlesButton({
  subtitles,
  selectedSubtitles,
  availableSubtitles,
  setSelectedSubtitles,
  ...other
}) {
  return [
    <div className="available-subtitles">
      {Object.keys(subtitles).map(language => (
        <div
          key={language}
          className={`available-subtitle${
            selectedSubtitles.includes(language) ? ' selected' : ''
          }`}
          onClick={() =>
            selectedSubtitles.includes(language)
              ? setSelectedSubtitles([
                  ...selectedSubtitles.filter(selected => language !== selected)
                ])
              : setSelectedSubtitles([...selectedSubtitles, language])
          }
        >
          {language}
        </div>
      ))}
    </div>,
    <div className="subtitles-button">Subtitles</div>
  ];
}

Subtitles.Button = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubtitlesButton);
export default connect(mapStateToProps, mapDispatchToProps)(Subtitles);

function useFetchSubtitles(
  subtitles,
  availableSubtitles,
  addSubtitles,
  selectedSubtitles
) {
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!fetching) {
      setFetching(true);
      (async () => {
        const freshlyAvailableSubtitles = {};
        for (let subset in subtitles) {
          if (
            availableSubtitles[subtitles[subset]] ||
            !selectedSubtitles.includes(subset)
          ) {
            continue;
          }
          let fetchedSubtitles = new TextDecoder('utf-8').decode(
            (
              await (await (await fetch(subtitles[subset])).body)
                .getReader()
                .read()
            ).value
          );
          const toReplace = { '\r': '', ' -> ': ' --> ' };
          for (let [key, value] of Object.entries(toReplace)) {
            while (fetchedSubtitles.includes(key)) {
              fetchedSubtitles = fetchedSubtitles.replace(key, value);
            }
          }
          fetchedSubtitles = fetchedSubtitles.split('\n\n');
          const formattedSubtitles = fetchedSubtitles.map(entry => {
            const entry_ = entry.substring(
              entry.indexOf('\n') + 1,
              entry.length
            );
            const [time, subtitle] = [
              entry_.substring(0, entry_.indexOf('\n')),
              entry_.substring(entry_.indexOf('\n') + 1, entry_.length)
            ];
            const [start, end] = time.split(' --> ');
            return [toNumber(start), toNumber(end), subtitle];
          });
          freshlyAvailableSubtitles[subtitles[subset]] = formattedSubtitles;
        }
        if (Object.keys(freshlyAvailableSubtitles).length > 0) {
          addSubtitles(availableSubtitles, freshlyAvailableSubtitles);
        }
        setFetching(false);
      })();
    }
  }, [subtitles, availableSubtitles, addSubtitles, fetching, setFetching]);
}

function useDetermineVideoTime(videoRef) {
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
  return videoTime;
}

function useDetermineCurrentSubtitle(
  current,
  videoTime,
  subtitles,
  availableSubtitles
) {
  const [currentSubtitle, setCurrentSubtitle] = useState(undefined);
  useEffect(() => {
    let newCurrentSubtitle = null;
    if (availableSubtitles[subtitles[current]]) {
      for (let [start, end, subtitle] of availableSubtitles[
        subtitles[current]
      ]) {
        if (videoTime >= start && videoTime <= end) {
          newCurrentSubtitle = subtitle;
          break;
        }
      }
    }
    if (newCurrentSubtitle !== currentSubtitle) {
      setCurrentSubtitle(newCurrentSubtitle);
    }
  }, [
    videoTime,
    current,
    currentSubtitle,
    setCurrentSubtitle,
    availableSubtitles
  ]);
  return currentSubtitle;
}

function toNumber(formattedTime) {
  let time = `${formattedTime}`;
  const toReplace = { '.': ':', ',': ':', '.': ':', ' ': '' };
  for (let [key, value] of Object.entries(toReplace)) {
    while (time.includes(key)) {
      time = time.replace(key, value);
    }
  }
  let [hours, minutes, seconds, millis] = time.split(':');

  return parseFloat(
    `${parseInt(hours) * 120 +
      parseInt(minutes) * 60 +
      parseInt(seconds)}.${millis}`
  );
}
