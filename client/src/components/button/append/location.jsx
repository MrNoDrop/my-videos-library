import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-first-routing';
import './location.scss';

const mapStateToProps = ({ router: { pathname } }) => ({ pathname });

const mapDispatchToProps = dispatch => ({
  setLocation: (pathname, location) => {
    let pathcopy = pathname;
    pathcopy = pathcopy.startsWith('/')
      ? pathcopy.substring(1, pathcopy.length)
      : pathcopy;
    pathcopy = pathcopy.endsWith('/')
      ? pathcopy.substring(0, pathcopy.length - 1)
      : pathcopy;
    dispatch(push(`/${pathcopy}/${location}`));
  }
});

function ButtonAppendLocation(
  { setLocation, pathname, location, prefix },
  ref
) {
  const defaultRef = useRef();
  return (
    <button
      ref={ref || defaultRef}
      className="append-location-button"
      onClick={() => setLocation(pathname, location)}
    >
      {`${prefix ? `${prefix} ` : ''}${location}`}
    </button>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.forwardRef(ButtonAppendLocation));
