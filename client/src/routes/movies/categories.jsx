import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { useFitAvailableSpace } from "../../components/effects";
import Bar, { fitAvailableSpaceBarOffset } from "../../components/bar";
import ViewmodeButton from "../../components/button/viewmode";
import Filter from "../../components/filter";
import addCategories from "../../store/actions/movies/add/categories";
import setCurrentCategory from "../../store/actions/movies/set/current/category";
import ChangeLocationButton from "../../components/button/change/location";

const mapStateToProps = ({
  state: {
    user: { language },
    window: { inner },
    movies,
  },
  router: { pathname },
}) => ({ pathname, language, windowInnerDimensions: inner, movies });

const mapDispatchToProps = (dispatch) => ({
  addCategories: (movies, language, categories) =>
    dispatch(addCategories(movies, language, categories)),
  setCurrentCategory: (movies, category) =>
    dispatch(setCurrentCategory(movies, category)),
});

function MoviesRoute({
  language,
  windowInnerDimensions,
  addCategories,
  setCurrentCategory,
  movies,
  pathname,
}) {
  const ref = useRef();
  const [filter, setFilter] = useState("");
  useResetCurrentCategory(movies, setCurrentCategory);
  useFetchCategories(language, addCategories, movies);
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
      {movies[language]
        ? Object.keys(movies[language])
            .filter((category) =>
              category.toLowerCase().includes(filter.toLowerCase())
            )
            .map(
              (category) =>
                console.log(`${pathname}/${category}`) || (
                  <ChangeLocationButton
                    viewmode="list"
                    href={`${pathname}/${category}`}
                    onClick={() => setCurrentCategory(movies, category)}
                    parentRef={ref}
                  >
                    {category}
                  </ChangeLocationButton>
                )
            )
        : ""}
    </section>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(MoviesRoute);

function useResetCurrentCategory(movies, setCurrentCategory) {
  useEffect(() => {
    if (movies.current.category) {
      setCurrentCategory(movies, null);
    }
  }, [movies, setCurrentCategory]);
}

function useFetchCategories(language, setCategories, movies) {
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!fetching) {
      setFetching(true);
      (async () => {
        try {
          const { error, payload } = await (
            await fetch(`/movies/${language}`)
          ).json();
          if (!error) {
            const { categories } = payload;
            if (
              !movies[language] ||
              Object.keys(movies[language]).join("") !== categories.join("")
            ) {
              setCategories(movies, language, categories);
            }
          }
        } catch (e) {
          console.log(e);
        }
        setFetching(false);
      })();
    }
  }, [language, setCategories, movies]);
}
