import React, { useState, useEffect } from "react";
import "./popup.scss";

import { useDisplayFixedMapDimensions } from "../../effects";

export function Popup({ children, ...other }) {
  return (
    <div id="popup" {...other}>
      {children}
    </div>
  );
}
function PopupScreen({
  useState: [display, setDisplay],
  windowInnerDimensions,
  children,
  ...other
}) {
  const style = {
    ...useDisplayFixedMapDimensions(windowInnerDimensions)
  };
  const { hidden, effectClass } = useOpacityEffect(display);
  return (
    <section
      {...{
        hidden,
        id: "popup-background",
        className: `popup-background${effectClass ? ` ${effectClass}` : ""}`,
        style,
        onClick: ({ target }) =>
          target.id === "popup-background" &&
          target.className.includes("popup-background")
            ? setDisplay(false)
            : ""
      }}
      {...other}
    >
      {children}
    </section>
  );
}

function useOpacityEffect(display) {
  const [hidden, setHidden] = useState(undefined);
  const [effectClass, setEffectClass] = useState(undefined);
  useEffect(() => {
    if (!display && (effectClass || !hidden)) {
      const effectTimeout = setTimeout(() => {
        setEffectClass(undefined);
        clearTimeout(effectTimeout);
      }, 1);
      const hiddenTimeout = setTimeout(() => {
        setHidden(true);
        clearTimeout(hiddenTimeout);
      }, 300);
    }
    if (display && (!effectClass || hidden)) {
      setHidden(false);
      const effectTimeout = setTimeout(() => {
        setEffectClass(display ? "visible" : undefined);
        clearTimeout(effectTimeout);
      }, 1);
    }
  }, [hidden, display, effectClass]);
  return { hidden, effectClass };
}
export default PopupScreen;
