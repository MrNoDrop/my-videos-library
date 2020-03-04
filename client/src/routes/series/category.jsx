import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { useFitAvailableSpace } from '../../components/effects';
import goBack from '../../store/actions/route/go/back';
import AppendLocationButton from '../../components/button/append/location';
import AppendImageLocationButton from '../../components/button/image/append/location';
import { vmin } from '../../components/tools/vscale';
import { getElementRef } from '../../components/tools/element/getRef';
import ViewmodeButton from '../../components/button/viewmode';
import Bar, { fitAvailableSpaceBarOffset } from '../../components/bar';
import Filter from '../../components/filter';
import { vminPercent } from '../../components/tools/vscale';

const mapStateToProps = ({
  state: {
    viewmode,
    window: { inner },
    navigator: { online }
  },
  router: { pathname }
}) => ({ windowInnerDimensions: inner, pathname, online, viewmode });

const mapDispatchToProps = dispatch => ({
  goBack: pathname => dispatch(goBack(pathname))
});

function ListViewRoute({
  windowInnerDimensions,
  pathname,
  online,
  viewmode,
  goBack
}) {
  const categoryRef = useRef();
  const [filter, setFilter] = useState('');
  const [viewmodes, setViewmodes] = useState({
    list: [],
    horizontal: [],
    vertical: []
  });
  const [series, setSeries] = useState([]);
  // eslint-disable-next-line
  const [language, fixedpath, category] = pathname
    .substring(1, pathname.length)
    .split('/');
  const path = `/series/${language}/${category}`;
  useEffect(() => {
    if (online) {
      (async () => {
        const availableSeries = await (await fetch(path)).json();
        if (availableSeries.error) {
          goBack(pathname);
          return;
        } else if (JSON.stringify(series) !== JSON.stringify(availableSeries)) {
          setSeries(availableSeries);
          const list = availableSeries.map(serie => (
            <AppendLocationButton key={serie} location={serie} />
          ));
          const horizontal = availableSeries.map((serie, index) => (
            <AppendImageLocationButton
              className="horizontal"
              key={serie}
              location={serie}
              image={`/series/shared/${category}/${serie}/cover/horizontal`}
            />
          ));
          const vertical = availableSeries.map((serie, index) => (
            <AppendImageLocationButton
              className="vertical"
              key={serie}
              location={serie}
              image={`/series/shared/${category}/${serie}/cover/vertical`}
            />
          ));
          setViewmodes({ list, horizontal, vertical });
        }
      })();
    }
  }, [series, pathname, online, category, goBack, path]);
  return (
    <section
      {...{
        id: 'route',
        ref: useRef(),
        style: useFitAvailableSpace(
          windowInnerDimensions,
          fitAvailableSpaceBarOffset()
        )
      }}
    >
      <Bar>
        <Filter
          {...{
            marginLeftPercentage: 43.5,
            marginRightPercentage: 56.5,
            filter,
            setFilter
          }}
        />
        <ViewmodeButton
          style={{ marginLeft: '-1vmin' }}
          viewmodes={['list', 'horizontal', 'vertical']}
        />
      </Bar>
      <div
        ref={categoryRef}
        style={{
          ...useCenter(
            categoryRef,
            windowInnerDimensions.width,
            viewmode === 'list'
          )
        }}
      >
        {viewmodes[viewmode].filter(({ props: { location } }) =>
          location.includes(filter)
        )}
      </div>
    </section>
  );
}
function useCenter(ref, availableWidth, disable) {
  const [timeoutTime, setTimeoutTime] = useState(undefined);
  const [categoryProps, setCategoryProps] = useState({});
  useEffect(() => {
    if (!timeoutTime) {
      setTimeoutTime(
        setTimeout(() => {
          if (disable && categoryProps.marginLeft) {
            setCategoryProps({});
          } else if (
            !disable &&
            ref &&
            ref.current &&
            ref.current.children[0]
          ) {
            let { width } = ReactDOM.findDOMNode(
              getElementRef(ref.current.children[0]).current
            ).getBoundingClientRect();
            width += vmin(1.4);
            let categoryWidth = 0;
            for (let i = 0; i < ref.current.children.length; i++) {
              if (categoryWidth + width < availableWidth) {
                categoryWidth += width;
              } else {
                break;
              }
            }

            const marginLeft = (availableWidth - categoryWidth) / 2;
            if (categoryProps.marginLeft !== marginLeft) {
              setCategoryProps({ ...categoryProps, marginLeft });
            }
          }
          setTimeoutTime(clearTimeout(timeoutTime));
        }, 1)
      );
    }
  }, [
    timeoutTime,
    ref,
    availableWidth,
    categoryProps,
    setCategoryProps,
    disable
  ]);
  return categoryProps;
}
export default connect(mapStateToProps, mapDispatchToProps)(ListViewRoute);
