import React, { useState, useRef } from 'react';
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
  { setLocation, pathname, location, image, onLoad, className, ...other },
  ref
) {
  const defaultRef = useRef();
  const [hidden, setHidden] = useState(true);
  return (
    <img
      ref={ref || defaultRef}
      {...{ hidden, ...other }}
      onLoad={e => {
        setHidden(false);
        if (typeof onLoad === 'function') {
          onLoad(e);
        }
      }}
      className={`append-location-image-button${
        className ? ` ${className}` : ''
      }`}
      src={image}
      alt={location}
      onClick={() => setLocation(pathname, location)}
    />
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.forwardRef(ButtonAppendLocation));
