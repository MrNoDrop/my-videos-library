import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-first-routing';
import './location.scss';
import { getElementRect } from '../../../tools/element';
import Hovertext, { useShowHovertext } from '../../../hovertext';

const mapStateToProps = ({
  state: {
    window: { inner }
  },
  router: { pathname }
}) => ({ pathname, windowInnderDimensions: inner });

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
  {
    infopath,
    infoFormatter,
    setLocation,
    pathname,
    location,
    image,
    onLoad,
    orientation,
    className,
    prefix,
    named = false,
    windowInnderDimensions,
    ...other
  },
  ref
) {
  const defaultRef = useRef();
  const [hidden, setHidden] = useState(true);
  const [descriptorStyle, setDescriptorStyle] = useState({});
  const [watchedTimeout, setWatchedTimeout] = useState(undefined);
  const [info, setInfo] = useState(undefined);
  const {
    mousePostion,
    isVisible: infoVisible,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    infoVisibleTimeout,
    setInfoVisibleTimeout,
    setInfoVisible
  } = useShowHovertext();
  useEffect(() => {
    if (!info && typeof infopath === 'string') {
      fetch(infopath)
        .then(res => res.json())
        .then(info =>
          setInfo(infoFormatter ? infoFormatter(info) : JSON.stringify(info))
        )
        .catch(err => console.error(err));
    }
  }, [pathname, infopath]);
  useEffect(() => {
    if (!watchedTimeout)
      setWatchedTimeout(
        setTimeout(() => {
          const imageRef = ref || defaultRef;
          if (imageRef.current && named) {
            const { x, y, width, height } = getElementRect(imageRef);
            const newDescriptorStyle = { left: x, top: y, width, height };
            if (
              JSON.stringify(descriptorStyle) !==
              JSON.stringify(newDescriptorStyle)
            ) {
              setDescriptorStyle(newDescriptorStyle);
            }
          }
          setWatchedTimeout(clearTimeout(watchedTimeout));
        }, 25)
      );
  }, [
    named,
    ref,
    defaultRef,
    descriptorStyle,
    setDescriptorStyle,
    windowInnderDimensions,
    watchedTimeout,
    setWatchedTimeout
  ]);
  return (
    <span ref={useRef()} {...{ onMouseEnter, onMouseMove, onMouseLeave }}>
      {info && (
        <Hovertext
          hidden={!infoVisible}
          {...{
            infoVisible,
            infoVisibleTimeout,
            setInfoVisibleTimeout,
            setInfoVisible,
            mousePostion
          }}
        >
          {info}
        </Hovertext>
      )}
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
          orientation ? ` ${orientation}` : ''
        }${className ? ` ${className}` : ''}`}
        src={image}
        alt={location}
        onClick={() => setLocation(pathname, location)}
      />
      {named ? (
        <div
          {...{ hidden }}
          style={descriptorStyle}
          className={`append-location-image-button-descriptor${
            orientation ? ` ${orientation}` : ''
          }${className ? ` ${className}` : ''}`}
          onClick={() => setLocation(pathname, location)}
        >
          <div
            className="description"
            onClick={() => setLocation(pathname, location)}
          >{`${prefix ? `${prefix} ` : ''}${location}`}</div>
        </div>
      ) : (
        ''
      )}
    </span>
  );
}
export const orientations = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.forwardRef(ButtonAppendLocation));
