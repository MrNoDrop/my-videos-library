import { ADD_TRAILER_ROUTE } from "../../types";

export default (trailers, trailerRoute, language) => ({
  type: ADD_TRAILER_ROUTE,
  payload: {
    trailers: {
      ...trailers,
      [language]: { ...trailers[language], [trailerRoute]: {} },
    },
  },
});
