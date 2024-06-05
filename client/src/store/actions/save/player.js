import { SAVE_PLAYER } from "../types";

export default (players, player, video, src, initialized) => ({
  type: SAVE_PLAYER,
  payload: {
    players: { ...players, [src]: { player, video, initialized } },
  },
});
