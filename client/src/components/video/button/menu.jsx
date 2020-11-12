import React, { useRef, useEffect, useState } from 'react';
import './menu.scss';
import { getElementRect } from '../../tools/element';
import { vmin } from '../../tools/vscale';

function VideoMenuButton({ button, children, windowInnerDimensions }) {
  const buttonRef = useRef();
  const menuRef = useRef();
  const [hidden, setHidden] = useState(true);
  const [menuPosition, setMenuPosition] = useState({});
  useEffect(() => {
    if (buttonRef.current && menuRef.current) {
      const buttonRect = getElementRect(buttonRef);
      const menuRect = getElementRect(menuRef);
      const { x: buttonX, width: buttonWidth, y: buttonY } = buttonRect;
      const { width: menuWidth, height: menuHeight } = menuRect;
      const newMenuPosition = {};
      newMenuPosition.left = buttonX + buttonWidth / 2 - menuWidth / 2;
      newMenuPosition.top = buttonY - menuHeight + 1 - vmin(0.3);
      console.log(buttonY - menuHeight, buttonY);
      if (JSON.stringify(menuPosition) !== JSON.stringify(newMenuPosition)) {
        setMenuPosition(newMenuPosition);
      }
    }
  }, [
    hidden,
    buttonRef,
    menuRef,
    menuPosition,
    setMenuPosition,
    windowInnerDimensions
  ]);
  return [
    <div
      key="video-menu"
      ref={menuRef}
      className={`video-menu${hidden ? ' hidden' : ''}`}
      style={menuPosition}
    >
      {children}
    </div>,
    <div
      key="video-menu-button"
      ref={buttonRef}
      className="video-menu-button"
      onClick={() => setHidden(!hidden)}
    >
      {button}
    </div>
  ];
}

export default VideoMenuButton;
