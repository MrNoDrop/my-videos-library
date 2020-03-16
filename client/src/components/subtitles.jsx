import React, { useRef, useEffect, useState } from 'react';
import addSubtitles from '../store/actions/add/subtitles';
import parseSrt from './tools/parseSrt.mjs';
import { connect } from 'react-redux';
import Subtitle from './subtitle';
import './subtitles.scss';

const mapStateToProps = ({
  state: { subtitles, 'selected-subtitles': selected }
}) => ({ fetched: subtitles, selected });

const mapDispatchToProps = dispatch => ({
  add: (fetched, newSubtitles) => dispatch(addSubtitles(fetched, newSubtitles))
});

function Subtitles({
  className,
  videoTime,
  subtitles = {},
  fetched,
  selected,
  add
}) {
  const ref = useRef();
  useFetchSubtitles(subtitles, fetched, add, selected);
  return (
    <div
      {...{ ref, className: `subtitles${className ? ` ${className}` : ''}` }}
    >
      {selected.map(selected => (
        <Subtitle
          {...{
            key: selected,
            videoTime,
            collection: fetched[subtitles[selected]]
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
          if (fetched[subtitles[subset]] || !selected.includes(subset)) {
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
