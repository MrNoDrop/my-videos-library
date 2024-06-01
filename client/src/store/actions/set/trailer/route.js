import { SET_TRAILER_ROUTE } from "../../types";

export default (trailers, trailerRoute, language, value) => ({
  type: SET_TRAILER_ROUTE,
  payload: {
    trailers: {
      ...trailers,
      [language]: { ...trailers[language], [trailerRoute]: value },
    },
  },
});
