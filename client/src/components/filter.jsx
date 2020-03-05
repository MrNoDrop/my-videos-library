import React, { useRef, useEffect, useState } from 'react';
import { getElementRect } from './tools/element/getRect';
import { getElementRef } from './tools/element/getRef';
import './filter.scss';

const mapStateToProps = ({ state: { window: inner } }) => ({
  windowInnerDimensions: inner
});
function Filter({
  marginLeftPercentage = 23.5,
  widthPercentage = 40,
  marginRightPercentage = 36.5,
  style,
  filter,
  setFilter,
  windowInnerDimensions,
  ...other
}) {
  const { ref, availableSpace } = useGetAvailableSpace(
    false,
    windowInnerDimensions
  );
  return (
    <input
      style={{
        ...space(
          availableSpace,
          marginLeftPercentage,
          widthPercentage,
          marginRightPercentage
        ),
        style
      }}
      className="filter"
      value={filter || ''}
      onChange={e => setFilter(e.target.value)}
      {...{ ref, ...other }}
    />
  );
}
function space(availableSpace, marginLeft, width, marginRight) {
  const style = { marginLeft: 0, marginRight: 0, width: 0 };
  style.marginLeft = (marginLeft / 100) * availableSpace;
  style.width = (width / 100) * availableSpace;
  style.marginRight = (marginRight / 100) * availableSpace;
  // console.log(
  //   (marginLeft / 100) * availableSpace,
  //   (marginRight / 100) * availableSpace
  // );
  return style;
}

function useGetAvailableSpace(includeSelf = true, ...triggers) {
  const ref = useRef();
  const [availableSpace, setAvailableSpace] = useState({});
  useEffect(() => {
    if (ref.current) {
      const parent = ref.current.parentNode;
      const children = parent.childNodes;
      const parentRect = getElementRect(getElementRef(parent));
      const childrenRects = [];

      for (let child of children) {
        if (
          !includeSelf &&
          child.className === ref.current.className &&
          child.localName === ref.current.localName
        ) {
          continue;
        } else {
          childrenRects.push(getElementRect(getElementRef(child)));
        }
      }
      let newAvailableSpace = parentRect.width;
      let index = 0;
      for (let childRect of childrenRects) {
        if (childRect && childRect.width) {
          newAvailableSpace -= childRect.width;
        }
      }
      if (newAvailableSpace !== availableSpace) {
        setAvailableSpace(newAvailableSpace);
      }
    }
  }, [ref, availableSpace, setAvailableSpace, triggers]);
  return { ref, availableSpace };
}

export default Filter;
