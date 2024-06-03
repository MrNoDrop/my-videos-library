import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import addTrailerRoute from "../store/actions/add/trailer/route";
import Trailer from "./trailers/trailer";
import "./trailers.scss";

const mapStateToProps = ({
  state: {
    trailers,
    user: { language },
  },
}) => ({
  trailers,
  language,
});

const mapDispatchToProps = (dispatch) => ({
  addTrailerRoute: (trailers, trailerRoute, language) =>
    dispatch(addTrailerRoute(trailers, trailerRoute, language)),
});

function Trailers({
  trailers,
  language,
  addTrailerRoute,
  parentRef,
  parentScrollEventCounter,
}) {
  useFetchTrailerList(trailers, language, addTrailerRoute);
  return (
    <div className="trailers">
      {Object.keys(trailers[language]).map((trailerRoute) => (
        <Trailer
          href={trailerRoute}
          key={trailerRoute}
          containerRef={parentRef}
          containerScrollEventCounter={parentScrollEventCounter}
        />
      ))}
    </div>
  );
}

function useFetchTrailerList(trailers, language, addTrailerRoute) {
  const [trailerListFetched, setTrailerListFetched] = useState(false);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!fetching && !trailerListFetched) {
      setFetching(true);
      (async () => {
        const {
          error,
          payload: { trailerRoute, trailersFetched },
        } = await (
          await fetch(
            `/trailers/trailer/route/${language}?definedRoutes=${JSON.stringify(
              Object.keys(trailers[language])
            )}`
          )
        ).json();
        if (!error) {
          if (trailersFetched) {
            setTrailerListFetched(trailersFetched);
          }
          if (trailerRoute) {
            addTrailerRoute(trailers, trailerRoute, language);
          }
        }
      })();
      setFetching(false);
    }
  }, [fetching, trailerListFetched, trailers]);
}

export default connect(mapStateToProps, mapDispatchToProps)(Trailers);
