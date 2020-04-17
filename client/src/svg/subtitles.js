import React, { useState } from 'react';

export default function PlaySvg({
  paused,
  className,
  svg,
  locked = false,
  ...other
}) {
  const [fill, setFill] = useState('white');
  return (
    <div
      {...{
        className: `subtitles-svg${
          typeof className === 'string' ? ` ${className}` : ''
        }`,
        ...other
      }}
      onMouseEnter={() => !locked && setFill('grey')}
      onMouseLeave={() => !locked && setFill('white')}
      onMouseDown={() => !locked && setFill('yellow')}
      onMouseUp={() => !locked && setFill('grey')}
    >
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path {...{ style: { fill } }} d="m179.056 160h-11.056v16h19.056z" />
        <path {...{ style: { fill } }} d="m219.056 176-8-16h-14.112l8 16z" />
        <path {...{ style: { fill } }} d="m283.056 176-8-16h-14.112l8 16z" />
        <path
          {...{ style: { fill } }}
          d="m336 72v-40h-216a40.045 40.045 0 0 0 -40 40v280h352v-224h-40a56.063 56.063 0 0 1 -56-56zm24 224a8 8 0 0 1 -8 8h-192a8 8 0 0 1 -8-8v-144a8 8 0 0 1 8-8h192a8 8 0 0 1 8 8z"
        />
        <path {...{ style: { fill } }} d="m251.056 176-8-16h-14.112l8 16z" />
        <path {...{ style: { fill } }} d="m315.056 176-8-16h-14.112l8 16z" />
        <path
          {...{ style: { fill } }}
          d="m168 288h176v-96h-176zm32-32h112a8 8 0 0 1 0 16h-112a8 8 0 0 1 0-16z"
        />
        <path
          {...{ style: { fill } }}
          d="m264 408a8.009 8.009 0 0 0 -8-8h-8v16h8a8.009 8.009 0 0 0 8-8z"
        />
        <path
          {...{ style: { fill } }}
          d="m392 112h28.687l-68.687-68.687v28.687a40.045 40.045 0 0 0 40 40z"
        />
        <path {...{ style: { fill } }} d="m332.944 176h11.056v-16h-19.056z" />
        <path
          {...{ style: { fill } }}
          d="m80 440a40.045 40.045 0 0 0 40 40h272a40.045 40.045 0 0 0 40-40v-72h-352zm224-56h32a8 8 0 0 1 0 16h-8v56h-.007a7.993 7.993 0 1 1 -15.986 0h-.007v-56h-8a8 8 0 0 1 0-16zm-72 8a8 8 0 0 1 8-8h16a24 24 0 0 1 3.106 47.792l18.551 18.551a8 8 0 0 1 -11.314 11.314l-18.343-18.343v12.686a8 8 0 0 1 -16 0zm-40 40a24 24 0 0 1 0-48h16a8 8 0 0 1 0 16h-16a8 8 0 0 0 0 16 24 24 0 0 1 0 48h-16a8 8 0 0 1 0-16h16a8 8 0 0 0 0-16z"
        />
      </svg>
    </div>
  );
}
