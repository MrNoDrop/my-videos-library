import { TOGGLE_SUBTITLE } from '../types';

export default (selectedSubtitlesState, subtitle) => {
  const newSelectedSubtitles = [...selectedSubtitlesState];

  return {
    type: TOGGLE_SUBTITLE,
    payload: {
      'selected-subtitles': newSelectedSubtitles.includes(subtitle)
        ? newSelectedSubtitles.filter(sub => sub !== subtitle)
        : [...newSelectedSubtitles, subtitle]
    }
  };
};
