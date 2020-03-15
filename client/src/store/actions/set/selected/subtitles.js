import { SET_SELECTED_SUBTITLES } from '../../types';

export default selectedSubtitles => ({
  type: SET_SELECTED_SUBTITLES,
  payload: { 'selected-subtitles': selectedSubtitles }
});
