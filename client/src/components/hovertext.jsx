import React, { useRef, useEffect, useState } from 'react';
import './hovertext.scss';
import { getElementRect } from './tools/element';
import { connect } from 'react-redux';

const mapStateToProps = ({
  state: {
    window: { inner }
  }
}) => ({ windowInnerDimensions: inner });

function Hovertext({
  windowInnerDimensions,
  hidden,
  mousePostion = { x: 0, y: 0 },
  children
}) {
  const ref = useRef();
  const [style, setStyle] = useState({
    left: mousePostion.x,
    top: mousePostion.y
  });
  useEffect(() => {
    if (ref.current && !hidden) {
      const { width, height } = getElementRect(ref);
      const newStyle = { ...style };
      newStyle.top = mousePostion.y;
      newStyle.left = mousePostion.x;
      const Horizontal = mousePostion.x + width;
      const vertical = mousePostion.y + height;
      if (Horizontal > windowInnerDimensions.width) {
        newStyle.left =
          mousePostion.x - (Horizontal - windowInnerDimensions.width);
      }
      if (vertical > windowInnerDimensions.height) {
        newStyle.top =
          mousePostion.y - (vertical - windowInnerDimensions.height);
      }
      if (JSON.stringify(newStyle) !== JSON.stringify(style)) {
        setStyle(newStyle);
      }
    }
  }, [ref, hidden, mousePostion, windowInnerDimensions]);
  return (
    <div className="hovertext" {...{ ref, style, hidden }}>
      <div className="hovertext-header" />
      <div className="hovertext-header-filler" />
      {children}
    </div>
  );
}
export function useShowHovertext() {
  const [mousePostion, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setInfoVisible] = useState(false);
  const [infoVisibleTimeout, setInfoVisibleTimeout] = useState(undefined);
  const onMouseEnter = () =>
    setInfoVisibleTimeout(
      setTimeout(() => {
        setInfoVisible(true);
      }, 1000)
    );

  const onMouseMove = e => {
    clearTimeout(infoVisibleTimeout);
    setInfoVisible(false);
    setMousePosition({ x: e.clientX, y: e.clientY });
    setInfoVisibleTimeout(
      setTimeout(() => {
        setInfoVisible(true);
      }, 1000)
    );
  };
  const onMouseLeave = () => {
    setInfoVisibleTimeout(clearTimeout(infoVisibleTimeout));
    setInfoVisible(false);
  };
  return { isVisible, mousePostion, onMouseEnter, onMouseMove, onMouseLeave };
}
export default connect(mapStateToProps)(Hovertext);
