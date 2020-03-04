import React from 'react';
import { push } from 'redux-first-routing';
import { connect } from 'react-redux';

import MenuHeader from './header';
import MenuFooter, { Entry } from './footer';
import OfflineNotice from '../screen/notice/noInternetConnection';
import images from '../../images';

const mapStateToProps = ({
  state: {
    navigator: { online },
    user: { language, name }
  },
  router
}) => ({ language, userName: name, router, isOnLine: online });
const mapDispatchToProps = dispatch => ({
  changePath: path => dispatch(push(path))
});
const appTitle = {
  pl: 'Filmowo',
  en: 'Filmically',
  nl: 'Filmisch',
  fr: 'Filmiquement'
};
function Menu({ language, router, changePath, isOnLine, userName }) {
  const { routes } = router;
  const path = {
    series: `/${language}/${routes[language].series}`,
    movies: `/${language}/${routes[language].movies}`,
    home: `/${language}/${routes[language].home}`
  };
  document.title = appTitle[language];
  return [
    <OfflineNotice
      {...{ key: 'offline-notice', language, isOnLine, userName }}
    />,
    <MenuHeader
      {...{
        key: 'header',
        title: appTitle[language],
        image: { src: images.menu.hd, alt: `${appTitle[language]} HD` },
        changePath
      }}
    />,
    <MenuFooter {...{ key: 'footer', changePath }}>
      <Entry
        title={routes[language].series}
        image={{
          src: <images.interactive.menu.List />,
          alt: 'series'
        }}
        enabled={router.pathname.includes(path.series)}
        href={path.series}
      />
      <Entry
        title={routes[language].home}
        image={{
          src: <images.interactive.menu.Stats />,
          alt: 'home'
        }}
        enabled={router.pathname.includes(path.home)}
        href={path.home}
      />
      <Entry
        title={routes[language].movies}
        image={{
          src: <images.interactive.menu.Stats />,
          alt: 'movies'
        }}
        enabled={router.pathname.includes(path.movies)}
        href={path.movies}
      />
    </MenuFooter>
  ];
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
