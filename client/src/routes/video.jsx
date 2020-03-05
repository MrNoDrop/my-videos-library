import React, { Fragment, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useFitAvailableSpace } from '../components/effects';
import DisplayVideo from '../components/display/video';
import Bar from '../components/bar';
import Hovertext, { useShowHovertext } from '../components/hovertext';

const mapStateToProps = ({
  state: {
    window: { inner }
  },
  router: { pathname }
}) => ({ windowInnerDimensions: inner, pathname });

function HomeRoute({ windowInnerDimensions, pathname }) {
  const [info, setInfo] = useState(undefined);
  const [paused, setPaused] = useState(true);
  const {
    mousePostion,
    isVisible: infoVisible,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    infoVisibleTimeout,
    setInfoVisibleTimeout,
    setInfoVisible
  } = useShowHovertext();
  const [subtitles, setSubtitles] = useState(undefined);
  useEffect(() => {
    const newSubtitles = {};
    if (!subtitles) {
      const [language, fixedpath, ...playbackroute] = pathname
        .substring(1, pathname.length)
        .split('/');
      (async () => {
        const availableSubtitles = await (
          await fetch(`/series/shared/${playbackroute.join('/')}/subtitles`)
        ).json();
        console.log(availableSubtitles);
      })();
    }
  }, [subtitles, setSubtitles]);
  useEffect(() => {
    if (!info && typeof pathname === 'string') {
      const [language, fixedpath, ...infopath] = pathname
        .substring(1, pathname.length)
        .split('/');
      fetch(`/series/${language}/${infopath.join('/')}/info`)
        .then(res => res.json())
        .then(info =>
          setInfo(
            Object.entries(info).map(([title, description]) => (
              <Fragment>
                {title}: {description}
                <br />
              </Fragment>
            ))
          )
        )
        .catch(err => console.error(err));
    }
  }, [pathname]);
  return (
    <section
      {...{
        id: 'route',
        ref: useRef(),
        style: useFitAvailableSpace(windowInnerDimensions)
      }}
    >
      <Bar />
      {info && paused && (
        <Hovertext
          hidden={!infoVisible}
          {...{
            style: { cursor: 'default' },
            infoVisible,
            infoVisibleTimeout,
            setInfoVisibleTimeout,
            setInfoVisible,
            mousePostion
          }}
        >
          {info}
        </Hovertext>
      )}
      <DisplayVideo
        {...{
          onMouseMove,
          onMouseEnter,
          onMouseLeave,
          onPlay: () => setPaused(false),
          onPause: () => setPaused(true)
        }}
      />
    </section>
  );
}
export default connect(mapStateToProps)(HomeRoute);
