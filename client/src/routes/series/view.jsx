import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { useFitAvailableSpace } from '../../components/effects';
import goBack from '../../store/actions/route/go/back';
import AppendLocationButton from '../../components/button/append/location';
import AppendImageLocationButton, {
  orientations
} from '../../components/button/image/append/location';
import { vmin } from '../../components/tools/vscale';
import { getElementRef } from '../../components/tools/element/getRef';
import ViewmodeButton from '../../components/button/viewmode';
import Bar, { fitAvailableSpaceBarOffset } from '../../components/bar';
import Filter from '../../components/filter';
AppendImageLocationButton.orientations = orientations;
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
  goBack,
  prefix,
  fetchpath = pathname => pathname,
  imagepath = {
    horizontal: (pathname, subject) => pathname + '' + subject,
    vertical: (pathname, subject) => pathname + '' + subject
  },
  named = false,
  viewmodes = ['list', 'horizontal', 'vertical'],
  alterSelectedViewmodes
}) {
  const categoryRef = useRef();
  const [filter, setFilter] = useState('');
  const [generatedViewmodes, setGeneratedViewmodes] = useState({
    list: [],
    horizontal: [],
    vertical: []
  });
  const [items, setItems] = useState([]);
  // eslint-disable-next-line
  const path = fetchpath(pathname);
  useEffect(() => {
    if (online) {
      (async () => {
        const availableItems = await (await fetch(path)).json();
        if (availableItems.error) {
          goBack(pathname);
          return;
        } else if (JSON.stringify(items) !== JSON.stringify(availableItems)) {
          setItems(availableItems);
          const list = availableItems.map(item => (
            <AppendLocationButton key={item} location={item} {...{ prefix }} />
          ));
          const horizontal = availableItems.map(item => (
            <AppendImageLocationButton
              {...{ prefix, named }}
              className={AppendImageLocationButton.orientations.horizontal}
              key={item}
              location={item}
              image={
                typeof imagepath === 'function'
                  ? imagepath(pathname, item)
                  : imagepath.horizontal(pathname, item)
              }
            />
          ));
          const vertical = availableItems.map(item => (
            <AppendImageLocationButton
              {...{ prefix, named }}
              orientation={AppendImageLocationButton.orientations.vertical}
              key={item}
              location={item}
              image={
                typeof imagepath === 'function'
                  ? imagepath(pathname, item)
                  : imagepath.vertical(pathname, item)
              }
            />
          ));
          setGeneratedViewmodes({ list, horizontal, vertical });
        }
      })();
    }
  }, [items, pathname, online, goBack, path]);
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
            marginLeftPercentage: 8.5,
            widthPercentage: 80,
            marginRightPercentage: 11.5,
            filter,
            setFilter
          }}
        />
        <ViewmodeButton
          style={{ marginLeft: '-1.5vmin' }}
          {...{ viewmodes, alterSelected: alterSelectedViewmodes }}
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
        {generatedViewmodes[
          (() => {
            if (alterSelectedViewmodes) {
              for (let key in alterSelectedViewmodes) {
                if (
                  (typeof alterSelectedViewmodes[key] === 'object' &&
                    alterSelectedViewmodes[key].constructor.name === 'Array' &&
                    alterSelectedViewmodes[key].includes(viewmode)) ||
                  alterSelectedViewmodes[key] === viewmode
                ) {
                  return key;
                }
              }
            } else {
              return viewmode;
            }
          })()
        ].filter(({ props: { location } }) => location.includes(filter))}
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
