import setUserLanguage from '../../actions/set/user/language';
import { push } from 'redux-first-routing';

export default ({ dispatch, getState }) => {
  const { router, state } = getState();
  const {
    user: { language }
  } = state;
  const { routes, pathname } = router;
  let [pathLanguage, currentRoute, ...path] = pathname
    .substring(1, pathname.length)
    .split('/');
  const currentLanguage = matchLanguages(
    pathLanguage,
    routes['language-descriptors']
  );
  if (language !== pathLanguage) {
    let routeKey = undefined;
    if (!currentRoute) {
      routeKey = 'home';
    } else {
      for (let key in routes[language]) {
        if (
          routes[language][key] === currentRoute ||
          routes[currentLanguage][key] === currentRoute
        ) {
          routeKey = key;
          break;
        }
      }
    }
    dispatch(
      push(
        `/${currentLanguage}/${routes[currentLanguage][routeKey]}/${path.join(
          '/'
        )}`
      )
    );
    dispatch(
      setUserLanguage({
        state,
        router,
        language: currentLanguage
      })
    );
  }
};
function matchLanguages(requestedLanguage, languageDescriptors) {
  let currentLanguage = 'en';
  let highestMatches = 0;
  for (let language in languageDescriptors) {
    const languageDescriptorSylabs = languageDescriptors[language].split('');
    if (
      !requestedLanguage ||
      typeof requestedLanguage.toLowerCase !== 'function'
    ) {
      continue;
    }
    let matches = 0;
    for (let sylab of languageDescriptorSylabs) {
      if (requestedLanguage.toLowerCase().includes(sylab)) {
        ++matches;
      }
    }
    if (matches >= highestMatches) {
      highestMatches = matches;
      currentLanguage = language;
    }
  }
  return currentLanguage;
}
