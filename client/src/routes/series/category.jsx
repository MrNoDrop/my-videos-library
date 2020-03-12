import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-first-routing';
import { useFitAvailableSpace } from '../../components/effects';
import setCurrentSerie from '../../store/actions/series/set/current/serie';
import addCategorySeries from '../../store/actions/series/add/category/series';
import Bar, { fitAvailableSpaceBarOffset } from '../../components/bar';
import ViewmodeButton from '../../components/button/viewmode';
import Filter from '../../components/filter';
import ChangeLocationButton from '../../components/button/change/location';
import Center from '../../components/center';
import setSeries from '../../store/actions/series/set';

const mapStateToProps = ({
  state: {
    user: { language },
    window: { inner },
    series,
    viewmode
  },
  router: { pathname }
}) => ({ pathname, language, windowInnerDimensions: inner, series, viewmode });

const mapDispatchToProps = dispatch => ({
  addCategorySeries: (seriesState, language, category, series) =>
    dispatch(addCategorySeries(seriesState, language, category, series)),
  setCurrentSerie: (series, serie) => dispatch(setCurrentSerie(series, serie)),
  changePath: pathname => dispatch(push(pathname)),
  setSeries: series => dispatch(setSeries(series))
});

function SeriesCategoryRoute({
  language,
  windowInnerDimensions,
  addCategorySeries,
  setCurrentSerie,
  changePath,
  series,
  viewmode,
  pathname,
  setSeries
}) {
  const ref = useRef();
  const [filter, setFilter] = useState('');
  useFetchCategorySeries(
    language,
    addCategorySeries,
    series,
    changePath,
    pathname,
    setSeries
  );
  const [scrollEventCounter, setScrollEventCounter] = useState(0);
  console.log(series, series.current.category);
  return (
    <section
      {...{
        id: 'route',
        ref,
        style: useFitAvailableSpace(
          windowInnerDimensions,
          fitAvailableSpaceBarOffset()
        )
      }}
      onScroll={({ target: { scrollTop } }) => {
        if (
          scrollTop - scrollEventCounter > 30 ||
          scrollTop - scrollEventCounter < -30
        ) {
          setScrollEventCounter(scrollTop);
        }
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
          viewmodes={['list', 'horizontal', 'vertical']}
        />
      </Bar>
      <Center
        availableSpace={windowInnerDimensions.width}
        disable={viewmode === 'list'}
      >
        {series[language] &&
        series.current.category &&
        series[language][series.current.category]
          ? Object.keys(series[language][series.current.category])
              .filter(serie =>
                serie.toLowerCase().includes(filter.toLowerCase())
              )
              .map(serie => (
                <ChangeLocationButton
                  {...{ key: serie, viewmode }}
                  href={`${pathname}/${serie}`}
                  image={{
                    horizontal: `/series/shared/${series.current.category}/${serie}/cover/horizontal`,
                    vertical: `/series/shared/${series.current.category}/${serie}/cover/vertical`
                  }}
                  parentRef={ref}
                  onClick={() => setCurrentSerie(series, serie)}
                  parentScrollEventCounter={scrollEventCounter}
                >
                  {viewmode === 'list' && serie}
                </ChangeLocationButton>
              ))
          : ''}
      </Center>
    </section>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesCategoryRoute);

function useFetchCategorySeries(
  language,
  addCategorySeries,
  seriesState,
  changePath,
  pathname,
  setSeries
) {
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (fetching !== language) {
      (async () => {
        const path = pathname.substring(1, pathname.length).split('/');
        const pathCategory = path.pop();
        setFetching(language);
        try {
          const { error, payload } = await (
            await fetch(`/series/${language}/${pathCategory}`)
          ).json();
          if (!error) {
            const { series, path } = payload;
            const category = path.pop();
            if (pathCategory !== category) {
              changePath(
                `/${pathname.substring(
                  1,
                  pathname.lastIndexOf('/')
                )}/${category}`
              );
            }
            if (!seriesState[language]) {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category },
                [language]: {
                  [category]: series.reduce((obj, key) => {
                    obj[key] = {};
                    return obj;
                  }, {})
                }
              });
            } else if (
              Object.keys(seriesState[language][category]).join('') !==
              series.join('')
            ) {
              addCategorySeries(seriesState, language, category, series);
            }
          } else if (
            error.type === 'UNKNOWN_FIELD' &&
            error.field.index === 2
          ) {
            const path = pathname.substring(1, pathname.length).split('/');
            path.pop();
            changePath(`/${path.join('/')}`);
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [
    language,
    addCategorySeries,
    seriesState,
    fetching,
    setFetching,
    changePath,
    pathname,
    setSeries
  ]);
}
