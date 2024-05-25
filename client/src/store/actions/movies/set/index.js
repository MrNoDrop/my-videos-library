import { SET_MOVIES } from "../../types";

export default (movies) => ({
  type: SET_MOVIES,
  payload: { movies: movies ? movies : {} },
});
