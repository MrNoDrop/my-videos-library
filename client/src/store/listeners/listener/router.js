import setUserLanguage from '../../actions/set/user/language';
import { push } from 'redux-first-routing';

const TIMEOUT_TIME = 1300;

const LANGUAGE = 0;
const PATH = 1;

export default ({ dispatch, getState }) => {
  setInterval(() => {
    let languageUpdated = false;
    const {
      state,
      router: { pathname, routes }
    } = getState();
    let {
      user: { language }
    } = state;
    console.log(pathname);
    const currentPathname = pathname.split('/').filter(invalid);
    if (currentPathname.length > 2) {
      const timeout = setTimeout(() => {
        dispatch(
          push(
            `/${
              currentPathname[LANGUAGE] ? `${currentPathname[LANGUAGE]}` : ''
            }/${currentPathname[PATH]}`
          )
        );
        clearTimeout(timeout);
      }, TIMEOUT_TIME);
      return;
    }
    const requestedLanguage = pathname.split('/').filter(invalid)[LANGUAGE];
    if (!language.includes(requestedLanguage)) {
      languageUpdated = match(
        requestedLanguage,
        routes['language-descriptors']
      );
      dispatch(
        setUserLanguage({
          state,
          language: languageUpdated
        })
      );
    }
    if (languageUpdated) {
      language = languageUpdated;
    }
    const [skip, ...requestedPath] = pathname.split('/').filter(invalid);
    if (requestedPath) {
      const availableRoutes = routes[language];
      const currentPath = Object.values(availableRoutes)[
        findCurrentPathIndex(requestedPath, routes, language)
      ];
      const suggestedPathname = `/${language}/${currentPath}`;
      if (!pathname.includes(suggestedPathname)) {
        const timeout = setTimeout(() => {
          dispatch(push(`${suggestedPathname}`));
          clearTimeout(timeout);
        }, TIMEOUT_TIME);
      }
    } else {
      const timeout = setTimeout(() => {
        dispatch(push(`/${language}/${routes[language].list}`));
        clearTimeout(timeout);
      }, TIMEOUT_TIME);
    }
  }, 100);
};

//x.filter(invalid)
function invalid(entry) {
  return typeof entry === 'string' && entry !== '';
}

function match(requestedLanguage, languageDescriptors) {
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

function findCurrentPathIndex(path, routes, language) {
  let currentPathIndex = undefined;
  for (let language in routes) {
    let routeIndex = 0;
    let highestMatchScore = 0;
    for (let route of Object.values(routes[language])) {
      let matchScore = 0;
      for (let pathPart of path) {
        if (route === path.join('/')) {
          ++matchScore;
          break;
        }
        if (route.includes(pathPart)) {
          ++matchScore;
          break;
        }
      }
      if (matchScore > highestMatchScore) {
        currentPathIndex = routeIndex;
      }
      ++routeIndex;
    }
    if (currentPathIndex) {
      break;
    }
  }
  let highestMatches = 0;
  if (!currentPathIndex) {
    let index = 0;
    for (let route of Object.values(routes[language])) {
      const sylabs = path.split('');
      let matches = 0;
      for (let sylab of sylabs) {
        if (route.includes(sylab)) {
          matches += 1;
        }
      }
      if (matches >= highestMatches) {
        highestMatches = matches;
        currentPathIndex = index;
      }
      ++index;
    }
  }
  return currentPathIndex;
}
