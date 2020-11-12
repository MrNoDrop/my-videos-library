import React from 'react';
import './slider.scss';

function Slider({
  className,
  min = 0,
  value = 0,
  onInput,
  setValue,
  ...other
}) {
  return (
    <input
      {...{
        type: 'range',
        className: `slider${className ? ` ${className}` : ''}`,
        min,
        value,
        onInput: event => {
          typeof onInput === 'function' && onInput(event);
          typeof setValue === 'function' && setValue(event.target.value);
        },
        ...other
      }}
    />
  );
}

export default Slider;
