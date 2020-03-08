import React, { useRef, useEffect, useState } from 'react';
import './hover.scss';
import { getElementRect } from './tools/element';

export function useHideHover() {
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
  return {
    hidden: !isVisible,
    mousePostion,
    onMouseEnter,
    onMouseMove,
    onMouseLeave
  };
}

function Hover({
  hidden,
  mousePostion = { x: 0, y: 0 },
  children,
  style,
  key,
  ...other
}) {
  const { ref, style: componentStyle } = useSetHoverPosition(
    style,
    hidden,
    mousePostion
  );
  return (
    <div
      key={key || 'hovertext'}
      className={`hovertext${hidden ? ' hidden' : ''}`}
      {...{ ref, style: componentStyle, ...other }}
      onClick={e =>
        e.target.parentNode &&
        e.target.parentNode.onClick &&
        e.target.parentNode.click(e)
      }
    >
      <div className="hovertext-header" />
      <div className="hovertext-header-filler" />
      {children}
    </div>
  );
}

Hover.useHide = useHideHover;
export default Hover;

function useSetHoverPosition(style, hidden, mousePostion) {
  const ref = useRef();
  const [componentStyle, setStyle] = useState({
    ...style,
    left: mousePostion.x,
    top: mousePostion.y
  });
  useEffect(() => {
    if (ref.current && !hidden) {
      const { width, height } = getElementRect(ref);
      const newStyle = { ...style, ...componentStyle };
      newStyle.top = mousePostion.y + 5;
      newStyle.left = mousePostion.x + 5;
      const Horizontal = mousePostion.x + width + 5;
      const vertical = mousePostion.y + height + 5;
      if (Horizontal > window.innerWidth) {
        newStyle.left = mousePostion.x - (Horizontal - window.innerWidth);
      }
      if (vertical > window.innerHeight) {
        newStyle.top = mousePostion.y - (vertical - window.innerHeight);
      }
      if (JSON.stringify(newStyle) !== JSON.stringify(componentStyle)) {
        setStyle(newStyle);
      }
    }
  }, [ref, hidden, mousePostion]);
  return { ref, style: componentStyle };
}
