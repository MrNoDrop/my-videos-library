import { SET_USER_LANGUAGE } from '../../types';

export default ({
  state: { user } = {
    user: { language: 'en' }
  },
  router: { routes } = { routes: { 'supported-languages': [] } },
  language
}) => ({
  type: SET_USER_LANGUAGE,
  payload: {
    user: {
      ...user,
      language: checkIfLanguageIsSupported(
        routes['supported-languages'],
        language
      )
    }
  }
});

function checkIfLanguageIsSupported(supportedLanguages, language) {
  return supportedLanguages.includes(language) ? language : 'en';
}
