import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { push } from 'redux-first-routing';
import { connect } from 'react-redux';
import './location.scss';
import image from '../../../images';
import Hover from '../../hover';

const mapDispatchToProps = dispatch => ({
  changeLocation: pathname => {
    pathname.endsWith('/') &&
      (pathname = pathname.substring(0, pathname.length - 1));
    document.location.pathname !== pathname && dispatch(push(pathname));
  }
});

export const supportedViewmodes = {
  list: 'list',
  horizontal: 'horizontal',
  vertical: 'vertical'
};
function ChangeLocationButton({
  image: { horizontal, vertical },
  parentScrollEventCounter,
  useRenderingState = [true, () => {}],
  href,
  style,
  viewmode,
  hovertext,
  parentRef,
  changeLocation,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  ...other
}) {
  const {
    hidden: hovertextHidden,
    mousePostion,
    onMouseEnter: hoverOnMouseEnter,
    onMouseLeave: hoverOnMouseLeave,
    onMouseMove: hoverOnMouseMove
  } = Hover.useHide();
  const mouseEventListeners = {
    onMouseEnter: e => {
      if (typeof onMouseEnter === 'function') {
        onMouseEnter(e);
      }
      hoverOnMouseEnter(e);
    },
    onMouseLeave: e => {
      if (typeof onMouseLeave === 'function') {
        onMouseLeave(e);
      }
      hoverOnMouseLeave(e);
    },
    onMouseMove: e => {
      if (typeof onMouseMove === 'function') {
        onMouseMove(e);
      }
      hoverOnMouseMove(e);
    }
  };
  const { ref, render } = useRender(parentRef, parentScrollEventCounter);
  useNotifyAboutRenderProcess(render, useRenderingState);
  const [horizontalTrigger, horizontalImageLoaded] = useLoadImage(
    render,
    horizontal
  );
  const [verticalTrigger, verticalImageLoaded] = useLoadImage(render, vertical);
  const hover = hovertext && (
    <Hover hidden={hovertextHidden} {...{ mousePostion }}>
      {hovertext}
    </Hover>
  );
  switch (viewmode) {
    default:
      return [
        hover,
        <div
          key="undefined"
          onClick={() => changeLocation(href)}
          {...{ ...other, ...mouseEventListeners, className }}
        >
          {children}
        </div>
      ];

    case supportedViewmodes.list:
      return [
        hover,
        <button
          key="list"
          className={`change-location-button${
            className ? ' ' + className : ''
          }`}
          onClick={() => changeLocation(href)}
          {...{ ...other, ...mouseEventListeners }}
        >
          {children}
        </button>
      ];
    case supportedViewmodes.horizontal:
      return [
        horizontalTrigger,
        hover,
        <div
          key="horizontal"
          {...{
            ref,
            ...mouseEventListeners,
            ...other,
            style: {
              ...style,
              backgroundImage: `url(${
                horizontalImageLoaded ? horizontal : image.animated.loading
              })`
            }
          }}
          onClick={() => changeLocation(href)}
          className={`change-location-image-button horizontal${
            className ? ' ' + className : ''
          }`}
        >
          {children}
        </div>
      ];
    case supportedViewmodes.vertical:
      return [
        verticalTrigger,
        hover,
        <div
          key="vertical"
          {...{
            ref,
            ...mouseEventListeners,
            ...other,
            style: {
              ...style,
              backgroundImage: `url(${
                verticalImageLoaded ? vertical : image.animated.loading
              })`
            }
          }}
          onClick={() => changeLocation(href)}
          className={`change-location-image-button vertical${
            className ? ' ' + className : ''
          }`}
        >
          {children}
        </div>
      ];
  }
}

export default connect(null, mapDispatchToProps)(ChangeLocationButton);

function useNotifyAboutRenderProcess(render, useRenderingState) {
  const [rendering, setRendering] = useRenderingState;
  useEffect(() => {
    if (render && !rendering) {
      setRendering(true);
    }
  }, [render, rendering]);
}

function useRender(parentRef, trigger) {
  const ref = useRef();
  const [render, setRender] = useState(false);
  const [firstRun, setFirstRun] = useState(true);

  useEffect(() => {
    if (ref.current) {
      if (firstRun) {
        setFirstRun(false);
        return;
      }
      const rect = ReactDOM.findDOMNode(ref.current).getBoundingClientRect();
      const parentRect = ReactDOM.findDOMNode(
        parentRef.current
      ).getBoundingClientRect();
      if (
        rect.left < parentRect.right &&
        rect.right > parentRect.left &&
        rect.top < parentRect.bottom &&
        rect.bottom > parentRect.top &&
        !render
      ) {
        setRender(true);
      }
    }
  }, [ref, parentRef, render, setRender, firstRun, trigger]);
  return { ref, render };
}

function useLoadImage(render, image) {
  const [loadingImage, setLoadingImage] = useState(undefined);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (render && !loaded && !loadingImage) {
      setLoadingImage(
        <img
          key={image}
          src={image}
          style={{ width: 0, height: 0 }}
          alt={''}
          onLoad={() => {
            setLoaded(true);
            setLoadingImage(undefined);
          }}
        />
      );
    }
  }, [render, loadingImage, setLoadingImage, setLoaded]);
  return [loadingImage, loaded];
}
