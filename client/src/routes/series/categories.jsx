import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { useFitAvailableSpace } from "../../components/effects";
import addCategories from "../../store/actions/series/add/categories";
import setCurrentCategory from "../../store/actions/series/set/current/category";
import Bar, { fitAvailableSpaceBarOffset } from "../../components/bar";
import ViewmodeButton from "../../components/button/viewmode";
import Filter from "../../components/filter";
import ChangeLocationButton from "../../components/button/change/location";

const mapStateToProps = ({
  state: {
    user: { language },
    window: { inner },
    series,
  },
  router: { pathname },
}) => ({ pathname, language, windowInnerDimensions: inner, series });

const mapDispatchToProps = (dispatch) => ({
  addCategories: (series, language, categories) =>
    dispatch(addCategories(series, language, categories)),
  setCurrentCategory: (series, category) =>
    dispatch(setCurrentCategory(series, category)),
});

function SeriesRoute({
  language,
  windowInnerDimensions,
  addCategories,
  setCurrentCategory,
  series,
  pathname,
}) {
  const ref = useRef();
  const [filter, setFilter] = useState("");
  useResetCurrentCategory(series, setCurrentCategory);
  useFetchCategories(language, addCategories, series);
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
          viewmodes={["list"]}
          alterSelected={{ list: ["list", "horizontal", "vertical"] }}
        />
      </Bar>
      {series[language]
        ? Object.keys(series[language])
            .filter((category) =>
              category.toLowerCase().includes(filter.toLowerCase())
            )
            .map((category, index) => (
              <ChangeLocationButton
                key={`${category}${index}`}
                viewmode="list"
                href={`${pathname}/${category}`}
                onClick={() => setCurrentCategory(series, category)}
                parentRef={ref}
              >
                {category}
              </ChangeLocationButton>
            ))
        : ""}
    </section>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SeriesRoute);

function useResetCurrentCategory(series, setCurrentCategory) {
  useEffect(() => {
    if (series.current.category) {
      setCurrentCategory(series, null);
    }
  }, [series, setCurrentCategory]);
}

function useFetchCategories(language, setCategories, series) {
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!fetching) {
      setFetching(true);
      (async () => {
        try {
          const { error, payload } = await (
            await fetch(`/series/${language}`)
          ).json();
          if (!error) {
            const { categories } = payload;
            if (
              !series[language] ||
              Object.keys(series[language]).join("") !== categories.join("")
            ) {
              setCategories(series, language, categories);
            }
          }
        } catch (e) {
          console.log(e);
        }
        setFetching(false);
      })();
    }
  }, [language, setCategories, series]);
}
