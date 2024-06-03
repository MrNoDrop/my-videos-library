import React, { Fragment, useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import { useFitAvailableSpace } from "../../components/effects";
import setCurrentSeason from "../../store/actions/series/set/current/season";
import setSeries from "../../store/actions/series/set";
import Bar, { fitAvailableSpaceBarOffset } from "../../components/bar";
import Video from "../../components/video";
const mapStateToProps = ({
  state: {
    user: { language },
    window: { inner },
    series,
    viewmode,
  },
  router: { pathname },
}) => ({ pathname, language, windowInnerDimensions: inner, series, viewmode });

const mapDispatchToProps = (dispatch) => ({
  setSeries: (series) => dispatch(setSeries(series)),
  setCurrentSeason: (series, season) =>
    dispatch(setCurrentSeason(series, season)),
  changePath: (pathname) => dispatch(push(pathname)),
});

function SeriesSeasonsRoute({
  language,
  windowInnerDimensions,
  setSeries,
  changePath,
  series,
  pathname,
}) {
  const ref = useRef();
  useFetchSerieSeasons(language, setSeries, series, pathname, changePath);
  return (
    <section
      {...{
        id: "route",
        ref,
        style: useFitAvailableSpace(
          windowInnerDimensions,
          fitAvailableSpaceBarOffset()
        ),
      }}
    >
      <Bar />
      {series[language]?.[series.current.category]?.[series.current.serie]?.[
        series.current.season
      ]?.[series.current.episode]?.manifest && (
        <Video
          src={
            series[language][series.current.category][series.current.serie][
              series.current.season
            ][series.current.episode].manifest
          }
          poster={
            series[language][series.current.category][series.current.serie][
              series.current.season
            ][series.current.episode].thumbnail
          }
          hovertext={
            series[language][series.current.category][series.current.serie][
              series.current.season
            ][series.current.episode] &&
            series[language][series.current.category][series.current.serie][
              series.current.season
            ][series.current.episode].info
          }
          subtitles={
            series[language][series.current.category][series.current.serie][
              series.current.season
            ][series.current.episode] &&
            series[language][series.current.category][series.current.serie][
              series.current.season
            ][series.current.episode].subtitles
          }
        />
      )}
    </section>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SeriesSeasonsRoute);

function useFetchSerieSeasons(
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
          const path = pathname.substring(1, pathname.length).split("/");
          path.shift();
          path.shift();
          const [pathCategory, pathSerie, pathSeason, pathEpisode] = path;
          const { error, payload } = await (
            await fetch(
              `/series/${language}/${pathCategory}/${pathSerie}/${pathSeason}/${pathEpisode}`
            )
          ).json();
          if (!error) {
            const { thumbnail, subtitles, info, manifest, path } = payload;
            path.shift();
            path.shift();
            const [category, serie, season, episode] = path;
            if (!seriesState[language]) {
              setSeries({
                ...seriesState,
                current: {
                  ...seriesState.current,
                  category,
                  serie,
                  season,
                  episode,
                },
                [language]: {
                  [category]: {
                    [serie]: {
                      [season]: {
                        [episode]: {
                          thumbnail,
                          subtitles,
                          info: Object.entries(info).map(([key, value]) => (
                            <Fragment>
                              {`${key}: ${value}`}
                              <br />
                            </Fragment>
                          )),
                          manifest,
                        },
                      },
                    },
                  },
                },
              });
            } else if (!seriesState[language][category]) {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category, serie },
                [language]: {
                  ...seriesState[language],
                  [category]: {
                    [serie]: {
                      [season]: {
                        [episode]: {
                          thumbnail,
                          subtitles,
                          info: Object.entries(info).map(([key, value]) => (
                            <Fragment>
                              {`${key}: ${value}`}
                              <br />
                            </Fragment>
                          )),
                          manifest,
                        },
                      },
                    },
                  },
                },
              });
            } else if (!seriesState[language][category][serie]) {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category, serie },
                [language]: {
                  ...seriesState[language],
                  [category]: {
                    ...seriesState[language][category],
                    [serie]: {
                      [season]: {
                        [episode]: {
                          thumbnail,
                          subtitles,
                          info: Object.entries(info).map(([key, value]) => (
                            <Fragment>
                              {`${key}: ${value}`}
                              <br />
                            </Fragment>
                          )),
                          manifest,
                        },
                      },
                    },
                  },
                },
              });
            } else if (!seriesState[language][category][serie][season]) {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category, serie },
                [language]: {
                  ...seriesState[language],
                  [category]: {
                    ...seriesState[language][category],
                    [serie]: {
                      ...seriesState[language][category][serie],
                      [season]: {
                        [episode]: {
                          thumbnail,
                          subtitles,
                          info: Object.entries(info).map(([key, value]) => (
                            <Fragment>
                              {`${key}: ${value}`}
                              <br />
                            </Fragment>
                          )),
                          manifest,
                        },
                      },
                    },
                  },
                },
              });
            } else {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category, serie },
                [language]: {
                  ...seriesState[language],
                  [category]: {
                    ...seriesState[language][category],
                    [serie]: {
                      ...seriesState[language][category][serie],
                      [season]: {
                        ...seriesState[language][category][serie][season],
                        [episode]: {
                          thumbnail,
                          subtitles,
                          info: Object.entries(info).map(([key, value]) => (
                            <Fragment>
                              {`${key}: ${value}`}
                              <br />
                            </Fragment>
                          )),
                          manifest,
                        },
                      },
                    },
                  },
                },
              });
            }
          } else if (error.type === "UNKNOWN_FIELD") {
            const [series] = pathname
              .substring(1, pathname.length)
              .split("/")
              .splice(1, 1);
            error.fields.shift();
            const [lang, category, serie] = error.fields;
            const path = [lang, series, category, serie];
            changePath(`/${path.splice(0, error.field.index).join("/")}`);
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
    changePath,
  ]);
}
