import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useFitAvailableSpace } from '../../components/effects';
import goBack from '../../store/actions/route/go/back';
import AppendLocationButton from '../../components/button/append/location';
import images from '../../images';
import ViewmodeButton from '../../components/button/viewmode';
import Bar, { fitAvailableSpaceBarOffset } from '../../components/bar';
import Filter from '../../components/filter';

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

function SeriesViewRoute({
  windowInnerDimensions,
  language,
  pathname,
  online,
  goBack,
  fetchpath,
  prefix,
  ...other
}) {
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (online) {
      console.log(fetchpath(pathname));
      (async () => {
        const availableItems = await (await fetch(fetchpath(pathname))).json();
        if (availableItems.error) {
          goBack(pathname);
        } else if (JSON.stringify(items) !== JSON.stringify(availableItems)) {
          setItems(availableItems);
        }
      })();
    }
  }, [items, language, online, fetchpath, goBack, pathname]);
  return (
    <section
      {...{
        id: 'route',
        ref: useRef(),
        style: useFitAvailableSpace(
          windowInnerDimensions,
          fitAvailableSpaceBarOffset()
        ),
        ...other
      }}
    >
      <Bar>
        <Filter {...{ filter, setFilter }} />
        <ViewmodeButton viewmodes={['list', 'horizontal', 'vertical']} />
      </Bar>
      {items ? (
        items.map(item => (
          <AppendLocationButton key={item} location={item} {...{ prefix }} />
        ))
      ) : (
        <img src={images.animated.loading} alt="loading" />
      )}
    </section>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(SeriesViewRoute);
