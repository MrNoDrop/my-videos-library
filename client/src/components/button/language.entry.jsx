import React from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-first-routing';

const LANGUAGE = 0;

const mapStateToProps = ({ router }) => ({
  router
});

const mapDispatchToProps = dispatch => ({
  changePath: (router, desiredLanguage) => {
    const currentLanguage = router.pathname.split('/').filter(invalid)[
      LANGUAGE
    ];
    if (currentLanguage) {
      dispatch(
        push(
          router.pathname.replace(`/${currentLanguage}`, `/${desiredLanguage}`)
        )
      );
    }
  }
});

function LanguageButtonEntry({
  title,
  isCurrent,
  changePath,
  router,
  onClick,
  ...other
}) {
  const { routes } = router;
  return isCurrent ? (
    ''
  ) : (
    <div
      className="entry"
      onClick={event => {
        onClick(event);
        const [language] = routes['language-descriptors'][title].split(' ');
        changePath(router, language);
      }}
      {...other}
    >
      {title}
    </div>
  );
}

//x.filter(invalid)
function invalid(entry) {
  return typeof entry === 'string' && entry !== '';
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageButtonEntry);
