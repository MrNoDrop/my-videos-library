import React, { Fragment, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-first-routing';
import { useFitAvailableSpace } from '../../components/effects';
import setCurrentEpisode from '../../store/actions/series/set/current/episode';
import setSeries from '../../store/actions/series/set';
import setSeriesEpisodeInfo from '../../store/actions/series/set/episode/info';
import Bar, { fitAvailableSpaceBarOffset } from '../../components/bar';
import ViewmodeButton from '../../components/button/viewmode';
import Filter from '../../components/filter';
import ChangeLocationButton from '../../components/button/change/location';
import Center from '../../components/center';
import Nametag from '../../components/nametag';

const episodeDescriptors = {
  pl: 'Odcinek',
  en: 'Episode',
  nl: 'Aflevering',
  fr: 'Épisode'
};
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
  setSeries: series => dispatch(setSeries(series)),
  setSeriesEpisodeInfo: (series, language, episode, info) =>
    dispatch(setSeriesEpisodeInfo(series, language, episode, info)),
  setCurrentEpisode: (series, episode) =>
    dispatch(setCurrentEpisode(series, episode)),
  changePath: pathname => dispatch(push(pathname))
});

function SeriesEpisodesRoute({
  language,
  windowInnerDimensions,
  setSeries,
  setCurrentEpisode,
  setSeriesEpisodeInfo,
  changePath,
  series,
  viewmode,
  pathname
}) {
  const ref = useRef();
  const [filter, setFilter] = useState('');
  useFetchSerieEpisodes(language, setSeries, series, pathname, changePath);
  const [scrollEventCounter, setScrollEventCounter] = useState(0);
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
          viewmodes={['list', 'horizontal']}
          alterSelected={{ horizontal: ['horizontal', 'vertical'] }}
        />
      </Bar>
      <Center
        availableSpace={windowInnerDimensions.width}
        disable={viewmode === 'list'}
      >
        {series[language] &&
        series.current.category &&
        series[language][series.current.category] &&
        series.current.serie &&
        series[language][series.current.category][series.current.serie] &&
        series[language][series.current.category][series.current.serie][
          series.current.season
        ]
          ? Object.keys(
              series[language][series.current.category][series.current.serie][
                series.current.season
              ]
            )
              .filter(episode =>
                `${episodeDescriptors[language]} ${episode}`
                  .toLowerCase()
                  .includes(filter.toLowerCase())
              )
              .map(episode => (
                <ChangeLocationButton
                  {...{
                    key: episode,
                    viewmode: viewmode === 'vertical' ? 'horizontal' : viewmode
                  }}
                  href={`${pathname}/${episode}`}
                  image={{
                    horizontal: `/series/shared/${series.current.category}/${series.current.serie}/${series.current.season}/${episode}/thumbnail`
                  }}
                  hovertext={
                    series[language][series.current.category][
                      series.current.serie
                    ][series.current.season][episode] &&
                    series[language][series.current.category][
                      series.current.serie
                    ][series.current.season][episode].info
                  }
                  parentRef={ref}
                  parentScrollEventCounter={scrollEventCounter}
                  onClick={() => setCurrentEpisode(series, episode)}
                  onMouseEnter={async () => {
                    if (
                      series[language][series.current.category][
                        series.current.serie
                      ][series.current.season][episode] &&
                      series[language][series.current.category][
                        series.current.serie
                      ][series.current.season][episode].info
                    ) {
                      return;
                    }
                    try {
                      const { error, payload } = await (
                        await fetch(
                          `/series/${language}/${series.current.category}/${series.current.serie}/${series.current.season}/${episode}/info`
                        )
                      ).json();
                      if (!error) {
                        const { info } = payload;
                        setSeriesEpisodeInfo(
                          series,
                          language,
                          episode,
                          Object.entries(info).map(([key, value]) => (
                            <Fragment>
                              {`${key}: ${value}`}
                              <br />
                            </Fragment>
                          ))
                        );
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  {viewmode === 'list' ? (
                    `${episodeDescriptors[language]} ${episode}`
                  ) : (
                    <Nametag>
                      {episodeDescriptors[language]} {episode}
                    </Nametag>
                  )}
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
)(SeriesEpisodesRoute);

function useFetchSerieEpisodes(
  language,
  setSeries,
  seriesState,
  pathname,
  changePath
) {
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (fetching !== language) {
      (async () => {
        setFetching(language);
        try {
          const path = pathname.substring(1, pathname.length).split('/');
          path.shift();
          path.shift();
          const [pathCategory, pathSerie, pathSeason] = path;
          const { error, payload } = await (
            await fetch(
              `/series/${language}/${pathCategory}/${pathSerie}/${pathSeason}`
            )
          ).json();
          if (!error) {
            const { episodes, path } = payload;
            path.shift();
            path.shift();
            const [category, serie, season] = path;
            if (!seriesState[language]) {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category, serie, season },
                [language]: {
                  [category]: {
                    [serie]: {
                      [season]: episodes.reduce((obj, key) => {
                        obj[key] = {};
                        return obj;
                      }, {})
                    }
                  }
                }
              });
            } else if (!seriesState[language][category]) {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category, serie, season },
                [language]: {
                  ...seriesState[language],
                  [category]: {
                    [serie]: {
                      [season]: episodes.reduce((obj, key) => {
                        obj[key] = {};
                        return obj;
                      }, {})
                    }
                  }
                }
              });
            } else if (!seriesState[language][category][serie]) {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category, serie, season },
                [language]: {
                  ...seriesState[language],
                  [category]: {
                    ...seriesState[language][category],
                    [serie]: {
                      [season]: episodes.reduce((obj, key) => {
                        obj[key] = {};
                        return obj;
                      }, {})
                    }
                  }
                }
              });
            } else if (!seriesState[language][category][serie][season]) {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category, serie, season },
                [language]: {
                  ...seriesState[language],
                  [category]: {
                    ...seriesState[language][category],
                    [serie]: {
                      ...seriesState[language][category][serie],
                      [season]: episodes.reduce((obj, key) => {
                        obj[key] = {};
                        return obj;
                      }, {})
                    }
                  }
                }
              });
            } else {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category, serie, season },
                [language]: {
                  ...seriesState[language],
                  [category]: {
                    ...seriesState[language][category],
                    [serie]: {
                      ...seriesState[language][category][serie],
                      [season]: episodes.reduce((obj, key) => {
                        obj[key] =
                          seriesState[language][category][serie][season][key] ||
                          {};
                        return obj;
                      }, {})
                    }
                  }
                }
              });
            }
          } else if (error.type === 'UNKNOWN_FIELD') {
            const [series] = pathname
              .substring(1, pathname.length)
              .split('/')
              .splice(1, 1);
            error.fields.shift();
            const [lang, category, serie, season] = error.fields;
            const path = [lang, series, category, serie, season];
            changePath(`/${path.splice(0, error.field.index).join('/')}`);
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [
    language,
    setSeries,
    seriesState,
    fetching,
    setFetching,
    pathname,
    changePath
  ]);
}
