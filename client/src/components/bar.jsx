import React, { useRef } from 'react';
import './bar.scss';
import PathHistoryButton from './button/path/history';
import { vmin } from './tools/vscale';

export const fitAvailableSpaceBarOffset = () => -vmin(3.5);
function Bar({ children, ...other }) {
  return (
    <div className="bar" ref={useRef()}>
      <PathHistoryButton />
      {children}
    </div>
  );
}
export default Bar;
