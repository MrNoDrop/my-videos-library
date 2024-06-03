import React, { Fragment, useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import { useFitAvailableSpace } from "../../components/effects";
import Bar, { fitAvailableSpaceBarOffset } from "../../components/bar";
import ViewmodeButton from "../../components/button/viewmode";
import Filter from "../../components/filter";
import ChangeLocationButton from "../../components/button/change/location";
import Center from "../../components/center";
import setMovies from "../../store/actions/movies/set";
import setCurrentMovie from "../../store/actions/movies/set/current/movie";
import addCategoryMovies from "../../store/actions/movies/add/category/movies";
import setMoviesMovieInfo from "../../store/actions/movies/set/movie/info";
import setCurrentCategory from "../../store/actions/movies/set/current/category";
import ProgressBar from "../../components/bar/progress";

const mapStateToProps = ({
  state: {
    user: { language },
    window: { inner },
    movies,
    viewmode,
    watched,
  },
  router: { pathname },
}) => ({
  pathname,
  language,
  windowInnerDimensions: inner,
  movies,
  viewmode,
  watched,
});

const mapDispatchToProps = (dispatch) => ({
  addCategoryMovies: (moviesState, language, category, movies) =>
    dispatch(addCategoryMovies(moviesState, language, category, movies)),
  setMoviesMovieInfo: (movies, language, movie, info) =>
    dispatch(setMoviesMovieInfo(movies, language, movie, info)),
  setCurrentMovie: (movies, movie) => dispatch(setCurrentMovie(movies, movie)),
  changePath: (pathname) => dispatch(push(pathname)),
  setMovies: (movies) => dispatch(setMovies(movies)),
  setCurrentCategory: (movies, category) =>
    dispatch(setCurrentCategory(movies, category)),
});

function SeriesCategoryRoute({
  language,
  windowInnerDimensions,
  addCategoryMovies,
  setCurrentMovie,
  changePath,
  movies,
  viewmode,
  pathname,
  setMovies,
  setMoviesMovieInfo,
  setCurrentCategory,
  watched,
}) {
  const [category] = pathname
    .substring(1, pathname.length)
    .split("/")
    .splice(2, 1);
  const ref = useRef();
  const [filter, setFilter] = useState("");
  updateCategoryRoute(
    movies,
    movies.current.category,
    pathname,
    setCurrentCategory
  );
  useFetchCategoryMovies(
    language,
    addCategoryMovies,
    movies,
    changePath,
    pathname,
    setMovies
  );
  const [scrollEventCounter, setScrollEventCounter] = useState(0);
  console.log(movies, movies.current.category);
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
        {movies[language] &&
        movies.current.category &&
        movies[language][movies.current.category]
          ? Object.keys(movies[language][movies.current.category])
              .filter((movie) =>
                movie.toLowerCase().includes(filter.toLowerCase())
              )
              .map((movie) => (
                <ChangeLocationButton
                  {...{ key: movie, viewmode }}
                  href={`${pathname}/${movie}`}
                  image={{
                    horizontal: `/movies/${language}/${movies.current.category}/${movie}/cover/horizontal`,
                    vertical: `/movies/${language}/${movies.current.category}/${movie}/cover/vertical`,
                  }}
                  parentRef={ref}
                  onClick={() => setCurrentMovie(movies, movie)}
                  parentScrollEventCounter={scrollEventCounter}
                  hovertext={
                    movies[language][movies.current.category][movie] &&
                    movies[language][movies.current.category][movie].info
                  }
                  onMouseEnter={async () => {
                    if (
                      movies[language][movies.current.category][movie] &&
                      movies[language][movies.current.category][movie].info
                    ) {
                      return;
                    }
                    try {
                      const { error, payload } = await (
                        await fetch(
                          `/movies/${language}/${movies.current.category}/${movie}/info`
                        )
                      ).json();
                      if (!error) {
                        const { info } = payload;
                        setMoviesMovieInfo(
                          movies,
                          language,
                          movie,
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
                  {viewmode === "list" && movie}
                  {watched.movies[language]?.[category]?.[movie] && (
                    <ProgressBar
                      progress={
                        watched.movies[language][category][movie].progress
                      }
                      duration={
                        watched.movies[language][category][movie].duration
                      }
                    />
                  )}
                </ChangeLocationButton>
              ))
          : ""}
      </Center>
    </section>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesCategoryRoute);

function updateCategoryRoute(
  movies,
  currentCategory,
  pathname,
  setCurrentCategory
) {
  const category = pathname.split("/")[3];
  if (category !== currentCategory) {
    setCurrentCategory(movies, category);
  }
}
function useFetchCategoryMovies(
  language,
  addCategoryMovies,
  moviesState,
  changePath,
  pathname,
  setMovies
) {
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (fetching !== language) {
      (async () => {
        const path = pathname.substring(1, pathname.length).split("/");
        const pathCategory = path.pop();
        setFetching(language);
        try {
          const { error, payload } = await (
            await fetch(`/movies/${language}/${pathCategory}`)
          ).json();
          if (!error) {
            const { movies, path } = payload;
            const category = path.pop();
            if (pathCategory !== category) {
              changePath(
                `/${pathname.substring(
                  1,
                  pathname.lastIndexOf("/")
                )}/${category}`
              );
            }
            if (!moviesState[language]) {
              setMovies({
                ...moviesState,
                current: { ...moviesState.current, category },
                [language]: {
                  [category]: movies.reduce((obj, key) => {
                    obj[key] = {};
                    return obj;
                  }, {}),
                },
              });
            } else if (
              Object.keys(moviesState[language][category]).join("") !==
              movies.join("")
            ) {
              addCategoryMovies(moviesState, language, category, movies);
            }
          } else if (
            error.type === "UNKNOWN_FIELD" &&
            error.field.index === 2
          ) {
            const path = pathname.substring(1, pathname.length).split("/");
            path.pop();
            changePath(`/${path.join("/")}`);
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [
    language,
    addCategoryMovies,
    moviesState,
    fetching,
    setFetching,
    changePath,
    pathname,
    setMovies,
  ]);
}
