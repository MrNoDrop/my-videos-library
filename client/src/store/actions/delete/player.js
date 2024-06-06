import { DELETE_PLAYER } from "../types";

export default (players, src) => {
  delete players[src];
  return {
    type: DELETE_PLAYER,
    payload: {
      players: { ...players },
    },
  };
};
