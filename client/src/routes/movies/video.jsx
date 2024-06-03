import React, { Fragment, useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import { useFitAvailableSpace } from "../../components/effects";
import setMovies from "../../store/actions/movies/set";
import Bar, { fitAvailableSpaceBarOffset } from "../../components/bar";
import Video from "../../components/video";
const mapStateToProps = ({
  state: {
    user: { language },
    window: { inner },
    movies,
    viewmode,
  },
  router: { pathname },
}) => ({ pathname, language, windowInnerDimensions: inner, movies, viewmode });

const mapDispatchToProps = (dispatch) => ({
  setMovies: (movies) => dispatch(setMovies(movies)),
  changePath: (pathname) => dispatch(push(pathname)),
});

function SeriesSeasonsRoute({
  language,
  windowInnerDimensions,
  setMovies,
  changePath,
  movies,
  pathname,
}) {
  const ref = useRef();
  useFetchMovieVideo(language, setMovies, movies, pathname, changePath);
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
      {movies[language]?.[movies.current.category]?.[movies.current.movie]
        ?.manifest && (
        <Video
          src={
            movies[language][movies.current.category][movies.current.movie]
              .manifest
          }
          poster={
            movies[language][movies.current.category][movies.current.movie]
              .thumbnail
          }
          hovertext={
            movies[language][movies.current.category][movies.current.movie] &&
            movies[language][movies.current.category][movies.current.movie].info
          }
          subtitles={
            movies[language][movies.current.category][movies.current.movie] &&
            movies[language][movies.current.category][movies.current.movie]
              .subtitles
          }
        />
      )}
    </section>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SeriesSeasonsRoute);

function useFetchMovieVideo(
  language,
  setMovies,
  moviesState,
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
          const [pathCategory, pathMovie] = path;
          const { error, payload } = await (
            await fetch(`/movies/${language}/${pathCategory}/${pathMovie}`)
          ).json();
          if (!error) {
            const { thumbnail, subtitles, info, manifest, path } = payload;
            path.shift();
            path.shift();
            const [category, movie] = path;
            if (!moviesState[language]) {
              setMovies({
                ...moviesState,
                current: {
                  ...moviesState.current,
                  category,
                  movie,
                },
                [language]: {
                  [category]: {
                    [movie]: {
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
              });
            } else if (!moviesState[language][category]) {
              setMovies({
                ...moviesState,
                current: { ...moviesState.current, category, movie },
                [language]: {
                  ...moviesState[language],
                  [category]: {
                    [movie]: {
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
              });
            } else if (!moviesState[language][category][movie]) {
              setMovies({
                ...moviesState,
                current: { ...moviesState.current, category, movie },
                [language]: {
                  ...moviesState[language],
                  [category]: {
                    ...moviesState[language][category],
                    [movie]: {
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
              });
            } else {
              setMovies({
                ...moviesState,
                current: { ...moviesState.current, category, movie },
                [language]: {
                  ...moviesState[language],
                  [category]: {
                    ...moviesState[language][category],
                    [movie]: {
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
              });
            }
          } else if (error.type === "UNKNOWN_FIELD") {
            const [movies] = pathname
              .substring(1, pathname.length)
              .split("/")
              .splice(1, 1);
            error.fields.shift();
            const [lang, category, movie] = error.fields;
            const path = [lang, movies, category, movie];
            changePath(`/${path.splice(0, error.field.index).join("/")}`);
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [
    language,
    setMovies,
    moviesState,
    fetching,
    setFetching,
    pathname,
    changePath,
  ]);
}
