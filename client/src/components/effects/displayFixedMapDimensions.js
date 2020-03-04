import { useEffect, useState } from "react";
import { getElementRef, getElementRect } from "../tools/element";

import ObjectIncludesObject from "../tools/objectIncludesObject";

export function useDisplayFixedMapDimensions(
  windowInnerDimensions,
  element = document.getElementById("route")
) {
  const [style, setStyle] = useState({});
  useEffect(() => {
    if (element) {
      const elementRef = getElementRef(element);
      const rect = getElementRect(elementRef);
      if (rect) {
        const { top, left, width, height } = rect;
        if (!ObjectIncludesObject(style, { top, left, width, height })) {
          setStyle({ top, left, width, height });
        }
      }
    }
  }, [element, style, setStyle, windowInnerDimensions]);
  return style;
}
