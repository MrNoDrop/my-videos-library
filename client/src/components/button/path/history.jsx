import React, { useRef } from 'react';
import { push } from 'redux-first-routing';
import { connect } from 'react-redux';
import './history.scss';

const mapStateToProps = ({ router: { pathname } }) => ({ pathname });

const mapDispatchToProps = dispatch => ({
  changePath: path => dispatch(push(path))
});
function PathHistory({ pathname, changePath, ...other }) {
  let path = pathname.substring(1, pathname.length).split('/');
  const [language, ...requestedPath] = path;
  let currentPath = `/${language}`;
  const paths = [];
  const pathIndexes = [];
  const pathButtons = [];
  for (let index = 0; index < requestedPath.length; index++) {
    const pathPiece = requestedPath[index];
    pathIndexes.push(index);
    paths.push((currentPath = `${currentPath}/${pathPiece}`));
    pathButtons.push(
      <div
        className={`path-history-button${
          pathIndexes[index] === requestedPath.length - 1 ? ' current' : ''
        }`}
        onClick={() =>
          pathname !== paths[index] ? changePath(paths[index]) : null
        }
      >
        <span
          className={`path-history-button-text${
            pathIndexes[index] === requestedPath.length - 1 ? ' current' : ''
          }`}
        >
          {pathPiece}
        </span>
        <span className="path-history-button-separator">
          {`${pathIndexes[index] !== requestedPath.length - 1 ? ' /' : ''}`}
        </span>
      </div>
    );
  }
  return (
    <div className="path-history" ref={useRef()} {...other}>
      {pathButtons}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PathHistory);
