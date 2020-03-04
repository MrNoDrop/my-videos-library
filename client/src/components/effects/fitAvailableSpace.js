import { useEffect, useState } from 'react';
import { getElementRef, getElementRect } from '../tools/element';

export function useFitAvailableSpace(windowInnerDimensions, addToResult = 0) {
  const [style, setStyle] = useState({
    overflowY: 'auto'
  });
  useEffect(() => {
    let menuHeight = 0;
    const menuHeaderElement = document.getElementById('menu-header');
    if (menuHeaderElement) {
      const menuHeaderRef = getElementRef(menuHeaderElement);
      const { height } = getElementRect(menuHeaderRef);
      if (typeof height === 'number') {
        menuHeight += height;
      }
    }
    const menuFooterElement = document.getElementById('menu-footer');
    if (menuFooterElement) {
      const menuFooterRef = getElementRef(menuFooterElement);
      const { height } = getElementRect(menuFooterRef);
      if (typeof height === 'number') {
        menuHeight += height;
      }
    }
    const newHeight =
      Math.ceil(windowInnerDimensions.height - menuHeight) + addToResult;
    if (newHeight !== style.height) {
      setStyle({
        ...style,
        height: newHeight
      });
    }
  }, [style, setStyle, windowInnerDimensions, addToResult]);
  return style;
}
