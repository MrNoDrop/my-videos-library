import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useFitAvailableSpace } from '../../components/effects';
import goBack from '../../store/actions/route/go/back';
import AppendLocationButton from '../../components/button/append/location';
import images from '../../images';

const mapStateToProps = ({
  state: {
    user: { language },
    window: { inner },
    navigator: { online }
  },
  router: { pathname }
}) => ({ windowInnerDimensions: inner, language, pathname, online });

const mapDispatchToProps = dispatch => ({
  goBack: pathname => dispatch(goBack(pathname))
});

function EpisodesRoute({
  windowInnerDimensions,
  language,
  pathname,
  online,
  goBack
}) {
  const [episodes, setEpisodes] = useState([]);
  useEffect(() => {
    if (online) {
      (async () => {
        let route = pathname;
        route = pathname.startsWith('/')
          ? pathname.substring(1, pathname.length)
          : pathname;
        route = pathname.endsWith('/')
          ? pathname.substring(0, pathname.length - 1)
          : pathname;
        route = route.split('/');
        const category = route[3];
        const episodes = route[4];
        const availableEpisodes = await (
          await fetch(`/series/${language}/${category}/${episodes}`)
        ).json();
        if (availableEpisodes.error) {
          goBack(pathname);
        } else if (
          JSON.stringify(episodes) !== JSON.stringify(availableEpisodes)
        ) {
          setEpisodes(availableEpisodes);
        }
      })();
    }
  }, [episodes, language, online]);
  return (
    <section
      {...{
        id: 'route',
        ref: useRef(),
        style: useFitAvailableSpace(windowInnerDimensions)
      }}
    >
      {episodes ? (
        episodes.map(episode => (
          <AppendLocationButton key={episode} location={episode} />
        ))
      ) : (
        <img src={images.animated.loading} alt="loading" />
      )}
    </section>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(EpisodesRoute);
