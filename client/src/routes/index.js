import React from 'react';
// import UploadSerieForm from '../components/form/upload/serie';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import SeriesCategoriesRoute from './series/categories';
import SeriesCategoryRoute from './series/category';
import SeriesViewRoute from './series/view';
import SerieSeasonsRoute from './series/seasons';
import SerieEpisodesRoute from './series/episodes';
import MoviesRoute from './movies';
import HomeRoute from './home';
import VideoRoute from './video';

const mapStateToProps = ({
  state: {
    user: { language }
  },
  router: { pathname, routes }
}) => ({ pathname, routes, language });
const imagepath = {
  horizontal: (pathname, item) => {
    const [language, fixedpath, ...requestedPath] = pathname
      .substring(1, pathname.length)
      .split('/');
    return `/series/shared/${requestedPath.join('/')}/${item}/cover/horizontal`;
  },
  vertical: (pathname, item) => {
    const [language, fixedpath, ...requestedPath] = pathname
      .substring(1, pathname.length)
      .split('/');
    return `/series/shared/${requestedPath.join('/')}/${item}/cover/vertical`;
  }
};
const routesComponents = {
  series: {
    route: SeriesCategoriesRoute,
    category: {
      route: SeriesCategoryRoute,
      serie: {
        route: SerieSeasonsRoute,
        seasons: {
          route: SerieEpisodesRoute,
          episodes: {
            route: VideoRoute
          }
        }
      }
    }
  },
  movies: { route: MoviesRoute },
  home: { route: HomeRoute }
};

export default connect(mapStateToProps)(({ pathname, routes, language }) => (
  <Switch>
    {Object.entries(routes).map(route(routes['supported-languages']))}
    {(() => {
      if (pathname.startsWith(`/${language}/${routes[language].series}/`)) {
        let route = pathname.substring(1, pathname.length);
        route = route.endsWith('/')
          ? route.substring(0, route.length - 1)
          : route;
        route = route.split('/');
        route.shift();
        route.shift();
        const path = `/${language}/${routes[language].series}/${route.join(
          '/'
        )}`;
        switch (route.length) {
          default:
            return '';
          case 1:
            return (
              <Route
                {...{ path }}
                exact
                strict
                component={routesComponents.series.category.route}
              />
            );
          case 2:
            return (
              <Route
                {...{ path }}
                exact
                strict
                component={routesComponents.series.category.serie.route}
              />
            );
          case 3:
            return (
              <Route
                {...{ path }}
                exact
                strict
                component={routesComponents.series.category.serie.seasons.route}
              />
            );
          case 4:
            return (
              <Route
                {...{ path }}
                exact
                strict
                component={
                  routesComponents.series.category.serie.seasons.episodes.route
                }
              />
            );
        }
      }
    })()}
    <Route path="/" exact strict component={() => 'hello'} />
  </Switch>
));

/**
 * @param {[language:string,routes:Object]}
 * @returns {[Route]}
 */
function route(supportedLanguages, language) {
  return ([language, routes]) => {
    return Object.values(supportedLanguages).includes(language)
      ? Object.entries(routes).map(([key, route]) => (
          <Route
            path={`/${language}/${route}`}
            exact
            strict
            component={routesComponents[key].route}
          />
        ))
      : undefined;
  };
}
