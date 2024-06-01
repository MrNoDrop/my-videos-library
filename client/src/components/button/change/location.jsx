import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { push } from "redux-first-routing";
import { connect } from "react-redux";
import "./location.scss";
import staticImages from "../../../images";
import Hover from "../../hover";
import useImageLoader from "../../effects/imageLoader";
import addImage from "../../../store/actions/add/image";

const mapStateToProps = ({ state: { images } }) => ({ images });

const mapDispatchToProps = (dispatch) => ({
  changeLocation: (pathname) => {
    pathname.endsWith("/") &&
      (pathname = pathname.substring(0, pathname.length - 1));
    document.location.pathname !== pathname && dispatch(push(pathname));
  },
  addImage: (images, image, imageUrl) =>
    dispatch(addImage(images, image, imageUrl)),
});

export const supportedViewmodes = {
  list: "list",
  horizontal: "horizontal",
  vertical: "vertical",
};

function ChangeLocationButton({
  image = {},
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
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  images,
  addImage,
  ...other
}) {
  const {
    hidden: hovertextHidden,
    mousePostion,
    onMouseEnter: hoverOnMouseEnter,
    onMouseLeave: hoverOnMouseLeave,
    onMouseMove: hoverOnMouseMove,
  } = Hover.useHide();
  const mouseEventListeners = {
    onClick: (e) => {
      if (typeof onClick === "function") {
        onClick(e);
      }
      changeLocation(href);
    },
    onMouseEnter: (e) => {
      if (typeof onMouseEnter === "function") {
        onMouseEnter(e);
      }
      hoverOnMouseEnter(e);
    },
    onMouseLeave: (e) => {
      if (typeof onMouseLeave === "function") {
        onMouseLeave(e);
      }
      hoverOnMouseLeave(e);
    },
    onMouseMove: (e) => {
      if (typeof onMouseMove === "function") {
        onMouseMove(e);
      }
      hoverOnMouseMove(e);
    },
  };
  const { ref, render } = useRender(
    parentRef,
    parentScrollEventCounter,
    viewmode
  );
  useNotifyAboutRenderProcess(render, useRenderingState);
  const horizontalImage = useImageLoader(
    image.horizontal,
    images,
    addImage,
    render === "horizontal"
  );
  const verticalImage = useImageLoader(
    image.vertical,
    images,
    addImage,
    render === "vertical"
  );
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
          {...{ ...other, ...mouseEventListeners, className }}
        >
          {children}
        </div>,
      ];

    case supportedViewmodes.list:
      return [
        hover,
        <button
          key="list"
          className={`change-location-button${
            className ? " " + className : ""
          }`}
          {...{ ...other, ref, ...mouseEventListeners }}
        >
          {children}
        </button>,
      ];
    case supportedViewmodes.horizontal:
      return [
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
                horizontalImage || staticImages.animated.loading
              })`,
            },
          }}
          className={`change-location-image-button horizontal${
            className ? " " + className : ""
          }`}
        >
          {children}
        </div>,
      ];
    case supportedViewmodes.vertical:
      return [
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
                verticalImage || staticImages.animated.loading
              })`,
            },
          }}
          className={`change-location-image-button vertical${
            className ? " " + className : ""
          }`}
        >
          {children}
        </div>,
      ];
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeLocationButton);

function useNotifyAboutRenderProcess(render, useRenderingState) {
  const [rendering, setRendering] = useRenderingState;
  useEffect(() => {
    if (render && !rendering) {
      setRendering(true);
    }
  }, [render, rendering]);
}

function useRender(parentRef, trigger, image) {
  const ref = useRef();
  const [render, setRender] = useState(false);
  const [firstRun, setFirstRun] = useState(true);

  useEffect(() => {
    if (ref.current && !render) {
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
        render !== image
      ) {
        setRender(image);
      }
    }
  }, [ref, parentRef, render, setRender, firstRun, trigger, image]);
  return { ref, render };
}
