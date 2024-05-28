import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import { useFitAvailableSpace } from "../../components/effects";
import setCurrentSeason from "../../store/actions/series/set/current/season";
import setSeries from "../../store/actions/series/set";
import Bar, { fitAvailableSpaceBarOffset } from "../../components/bar";
import ViewmodeButton from "../../components/button/viewmode";
import Filter from "../../components/filter";
import ChangeLocationButton from "../../components/button/change/location";
import Center from "../../components/center";
import Nametag from "../../components/nametag";

const seasonDescriptors = {
  pl: "Sezon",
  en: "Season",
  nl: "seizoen",
  fr: "saison",
};
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
  setCurrentSeason,
  changePath,
  series,
  viewmode,
  pathname,
}) {
  const ref = useRef();
  const [filter, setFilter] = useState("");
  useFetchSerieSeasons(language, setSeries, series, pathname, changePath);
  const [scrollEventCounter, setScrollEventCounter] = useState(0);
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
            setFilter,
          }}
        />
        <ViewmodeButton
          style={{ marginLeft: "-1.5vmin" }}
          viewmodes={["list", "horizontal", "vertical"]}
        />
      </Bar>
      <Center
        availableSpace={windowInnerDimensions.width}
        disable={viewmode === "list"}
      >
        {series[language] &&
        series.current.category &&
        series[language][series.current.category] &&
        series.current.serie &&
        series[language][series.current.category][series.current.serie]
          ? Object.keys(
              series[language][series.current.category][series.current.serie]
            )
              .filter((season) =>
                `${seasonDescriptors[language]} ${season}`
                  .toLowerCase()
                  .includes(filter.toLowerCase())
              )
              .map((season) => (
                <ChangeLocationButton
                  {...{ key: season, viewmode }}
                  href={`${pathname}/${season}`}
                  image={{
                    horizontal: `/series/${language}/${series.current.category}/${series.current.serie}/${season}/cover/horizontal`,
                    vertical: `/series/${language}/${series.current.category}/${series.current.serie}/${season}/cover/vertical`,
                  }}
                  parentRef={ref}
                  parentScrollEventCounter={scrollEventCounter}
                  onClick={() => setCurrentSeason(series, season)}
                >
                  {viewmode === "list" ? (
                    `${seasonDescriptors[language]} ${season}`
                  ) : (
                    <Nametag>
                      {seasonDescriptors[language]} {season}
                    </Nametag>
                  )}
                </ChangeLocationButton>
              ))
          : ""}
      </Center>
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
          const [pathCategory, pathSerie] = path;
          const { error, payload } = await (
            await fetch(`/series/${language}/${pathCategory}/${pathSerie}`)
          ).json();
          if (!error) {
            const { seasons, path } = payload;
            path.shift();
            path.shift();
            const [category, serie] = path;
            if (!seriesState[language]) {
              setSeries({
                ...seriesState,
                current: { ...seriesState.current, category, serie },
                [language]: {
                  [category]: {
                    [serie]: seasons.reduce((obj, key) => {
                      obj[key] = {};
                      return obj;
                    }, {}),
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
                    [serie]: seasons.reduce((obj, key) => {
                      obj[key] = {};
                      return obj;
                    }, {}),
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
                    [serie]: seasons.reduce((obj, key) => {
                      obj[key] = {};
                      return obj;
                    }, {}),
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
                    [serie]: seasons.reduce((obj, key) => {
                      obj[key] =
                        seriesState[language][category][serie][key] || {};
                      return obj;
                    }, {}),
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
