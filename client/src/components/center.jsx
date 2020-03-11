import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { vmin } from './tools/vscale';
import { getElementRef } from './tools/element/getRef';

export default function Center({
  availableSpace,
  disable,
  style = {},
  children,
  ...other
}) {
  const ref = useRef();
  return (
    <div
      ref={ref}
      style={{
        ...style,
        ...useCenter(ref, availableSpace, disable)
      }}
      {...other}
    >
      {children}
    </div>
  );
}

function useCenter(ref, availableWidth, disable) {
  const [timeoutTime, setTimeoutTime] = useState(undefined);
  const [categoryProps, setCategoryProps] = useState({});
  useEffect(() => {
    if (!timeoutTime) {
      setTimeoutTime(
        setTimeout(() => {
          if (disable && categoryProps.marginLeft) {
            setCategoryProps({});
          } else if (
            !disable &&
            ref &&
            ref.current &&
            ref.current.children[0]
          ) {
            let categoryWidth = 0;
            const margin = vmin(1.4);
            for (let child of ref.current.children) {
              let { width } = ReactDOM.findDOMNode(
                getElementRef(child).current
              ).getBoundingClientRect();
              if (categoryWidth + width + margin < availableWidth) {
                categoryWidth += width + margin;
              } else {
                break;
              }
            }

            const marginLeft = (availableWidth - categoryWidth) / 2;
            if (categoryProps.marginLeft !== marginLeft) {
              setCategoryProps({ ...categoryProps, marginLeft });
            }
          }
          setTimeoutTime(clearTimeout(timeoutTime));
        }, 1)
      );
    }
  }, [
    timeoutTime,
    ref,
    availableWidth,
    categoryProps,
    setCategoryProps,
    disable
  ]);
  return categoryProps;
}
