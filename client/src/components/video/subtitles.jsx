import React, { useRef, useEffect, useState } from "react";
import addSubtitles from "../../store/actions/add/subtitles";
import parseSrt from "../tools/parseSrt.mjs";
import { connect } from "react-redux";
import Subtitle from "./subtitle";
import "./subtitles.scss";
import { getElementRect, getElementRef } from "../tools/element";

const mapStateToProps = ({
  state: {
    subtitles,
    "selected-subtitles": selected,
    window: { inner },
  },
}) => ({ fetched: subtitles, selected, windowInnerDimensions: inner });

const mapDispatchToProps = (dispatch) => ({
  add: (fetched, newSubtitles) => dispatch(addSubtitles(fetched, newSubtitles)),
});

function Subtitles({
  windowInnerDimensions,
  className,
  videoTime,
  subtitles = {},
  fetched,
  selected,
  offset = { height: 0 },
  add,
  ...other
}) {
  const ref = useRef();
  useFetchSubtitles(subtitles, fetched, add, selected);
  const spacerHeight = useDetermineSpacerHeight(
    ref,
    windowInnerDimensions,
    videoTime,
    offset
  );
  return (
    <div
      {...{
        ref,
        className: `subtitles${className ? ` ${className}` : ""}`,
        ...other,
      }}
    >
      <div style={{ width: "100%", height: spacerHeight }} />
      {selected.map((selected) => (
        <Subtitle
          {...{
            key: selected,
            videoTime,
            collection: fetched[subtitles[selected]],
          }}
        />
      ))}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Subtitles);

function useFetchSubtitles(subtitles, fetched, add, selected) {
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!fetching) {
      setFetching(true);
      (async () => {
        const freshSubtitles = {};
        for (let subset in subtitles) {
          if (fetched[subtitles[subset]]) {
            continue;
          }
          freshSubtitles[subtitles[subset]] = parseSrt(
            (
              await (await (await fetch(subtitles[subset])).body)
                .getReader()
                .read()
            ).value
          );
        }
        if (Object.keys(freshSubtitles).length > 0) {
          add(fetched, freshSubtitles);
        }
        setFetching(false);
      })();
    }
  }, [subtitles, fetched, add, fetching, setFetching]);
}

function useDetermineSpacerHeight(
  ref,
  windowInnerDimensions,
  videoTime,
  offset
) {
  const [spacerHeight, setSpacerHeight] = useState(0);
  useEffect(() => {
    if (ref.current) {
      let { height } = getElementRect(ref);
      height -= offset.height;
      for (let subtitle of ref.current.children) {
        const subtitleRef = getElementRef(subtitle);
        if (!subtitleRef || !subtitleRef.current) {
          continue;
        }
        const { height: subtitleHeight } = getElementRect(subtitleRef);
        height -= subtitleHeight;
      }
      if (height !== spacerHeight) {
        setSpacerHeight(height);
      }
    }
  }, [
    ref,
    windowInnerDimensions,
    videoTime,
    spacerHeight,
    setSpacerHeight,
    offset,
  ]);
  return spacerHeight;
}
