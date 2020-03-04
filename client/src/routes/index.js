import React from 'react';
// import UploadSerieForm from '../components/form/upload/serie';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import SeriesRoute from './series';
import SeriesCategoryRoute from './series/category';
import SeriesViewRoute from './series/view';
import MoviesRoute from './movies';
import HomeRoute from './home';
import DisplayVideo from '../components/display/video';

const mapStateToProps = ({
  state: {
    user: { language }
  },
  router: { pathname, routes }
}) => ({ pathname, routes, language });
const routesComponents = {
  series: {
    route: SeriesRoute,
    category: {
      route: () => (
        <SeriesCategoryRoute
          fetchpath={pathname => {
            // eslint-disable-next-line
            const [language, fixedpath, category] = pathname
              .substring(1, pathname.length)
              .split('/');
            return `/series/${language}/${category}`;
          }}
        />
      ),
      serie: {
        route: () => (
          <SeriesViewRoute
            prefix="Season"
            fetchpath={pathname => {
              // eslint-disable-next-line
              const [language, fixedpath, category, serie] = pathname
                .substring(1, pathname.length)
                .split('/');
              return `/series/${language}/${category}/${serie}`;
            }}
          />
        ),
        seasons: {
          route: () => (
            <SeriesViewRoute
              fetchpath={pathname => {
                const [
                  language,
                  // eslint-disable-next-line
                  fixedpath,
                  category,
                  serie,
                  seasons
                ] = pathname.substring(1, pathname.length).split('/');
                return `/series/${language}/${category}/${serie}/${seasons}`;
              }}
            />
          ),
          episodes: {
            route: DisplayVideo
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
