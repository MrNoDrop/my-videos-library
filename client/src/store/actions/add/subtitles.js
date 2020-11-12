import { ADD_SUBTITLES } from '../types';

export default (subtitlesState, subtitles) => ({
  type: ADD_SUBTITLES,
  payload: { subtitles: { ...subtitlesState, ...subtitles } }
});
