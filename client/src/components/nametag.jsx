import React from 'react';
import './nametag.scss';

function Nametag({ className, children, ...other }) {
  return (
    <div className={`nametag${className ? ' ' + className : ''}`}>
      <div className="name">{children}</div>
    </div>
  );
}

export default Nametag;
