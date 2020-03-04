import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import "./footer.scss";

import generateKeyFromComponent from "../tools/keyGenerator";

export { default as Entry } from "./footer.entry";
const mapStateToProps = ({
  state: {
    window: { inner }
  }
}) => ({ windowInnerDimensions: inner });

function MenuFooter({
  windowInnerDimensions,
  changePath,
  children: entries,
  ...other
}) {
  delete other.dispatch;
  const [entriesRects, setEntriesRects] = useState(undefined);
  const [separatorStyle, setSeparatorStyle] = useState({});
  useEntriesRectSetter(entriesRects, setEntriesRects);
  useSeparatorStyleSetter(
    entriesRects,
    windowInnerDimensions,
    separatorStyle,
    setSeparatorStyle
  );
  return (
    <div style={{ width: "100%", position: "fixed", bottom: 0, left: 0 }}>
      <footer {...{ ref: useRef(), id: "menu-footer", ...other }}>
        {[entries].flat(Infinity).map((entry, index, entries) =>
          index !== entries.length - 1
            ? typeof entry === "object"
              ? [
                  React.cloneElement(entry, {
                    key: generateKeyFromComponent(entry)
                  }),
                  <div key={`separator-${index}`} style={separatorStyle} />
                ]
              : entry
            : entry
        )}
      </footer>
    </div>
  );
}
//[entries].map(refs)
function refs(entry) {
  const props = 0;
  return Object.values(entry)[props].ref;
}
//[entriesRefs].map(boundingClientRect)
function boundingClientRect(ref) {
  return (
    ref &&
    ref.current &&
    ReactDOM.findDOMNode(ref.current).getBoundingClientRect()
  );
}
function useEntriesRectSetter(entriesRects, setEntriesRects) {
  useEffect(() => {
    const entrieElements = document
      .getElementById("menu-footer")
      .getElementsByClassName("entry");
    const entriesRefs = Object.values(entrieElements).map(refs);
    const currentEntriesRects = entriesRefs
      .map(boundingClientRect)
      .filter(rect => rect !== undefined);
    if (
      [entriesRects].flat(Infinity).join("") !==
      [currentEntriesRects].flat(Infinity).join("")
    ) {
      setEntriesRects(currentEntriesRects);
    }
  }, [entriesRects, setEntriesRects]);
}

function useSeparatorStyleSetter(
  entriesRects,
  windowInnerDimensions,
  separatorStyle,
  setSeparatorStyle
) {
  useEffect(() => {
    if (entriesRects) {
      const entriesWidth = entriesRects
        .map(({ width }) => width)
        .reduce((prevVal, currVal) => prevVal + currVal);
      const currentSeparatorWidth =
        (windowInnerDimensions.width - entriesWidth) /
        (entriesRects.length - 1);
      if (
        (currentSeparatorWidth && !separatorStyle.width) ||
        separatorStyle.width !== currentSeparatorWidth
      ) {
        setSeparatorStyle({ width: currentSeparatorWidth });
      }
    }
  }, [entriesRects, windowInnerDimensions, separatorStyle, setSeparatorStyle]);
}
export default connect(mapStateToProps)(MenuFooter);
