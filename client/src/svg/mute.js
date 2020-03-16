import React, { useState } from 'react';
export default function MuteSVG({ muted, className, svg, ...other }) {
  const [fill, setFill] = useState('white');
  return (
    <div
      {...{
        className: `mute-svg${
          typeof className === 'string' ? ` ${className}` : ''
        }`,
        ...other
      }}
      onMouseEnter={() => setFill('grey')}
      onMouseLeave={() => setFill('white')}
      onMouseDown={() => setFill('yellow')}
      onMouseUp={() => setFill('grey')}
    >
      {muted ? (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 384 384"
          style={{ enableBackground: 'new 0 0 384 384', ...svg }}
          space="preserve"
        >
          <g>
            <g>
              <g>
                <path
                  {...{ style: { fill } }}
                  d="M288,192c0-37.653-21.76-70.187-53.333-85.867v47.147l52.373,52.373C287.68,201.173,288,196.587,288,192z"
                />
                <path
                  {...{ style: { fill } }}
                  d="M341.333,192c0,20.053-4.373,38.933-11.52,56.32l32.32,32.32C376,254.08,384,224,384,192
				c0-91.307-63.893-167.68-149.333-187.093V48.96C296.32,67.307,341.333,124.373,341.333,192z"
                />
                <polygon
                  {...{ style: { fill } }}
                  points="192,21.333 147.413,65.92 192,110.507 			"
                />
                <path
                  {...{ style: { fill } }}
                  d="M27.2,0L0,27.2L100.8,128H0v128h85.333L192,362.667V219.2l90.773,90.773c-14.293,10.987-30.4,19.84-48.107,25.173V379.2
				c29.333-6.72,56.107-20.16,78.613-38.613L356.8,384l27.2-27.2l-192-192L27.2,0z"
                />
              </g>
            </g>
          </g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
        </svg>
      ) : (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 384 384"
          style={{ ...svg, enableBackground: 'new 0 0 384 384' }}
          space="preserve"
        >
          <g>
            <g>
              <g>
                <path
                  {...{ style: { fill } }}
                  d="M288,192c0-37.653-21.76-70.187-53.333-85.867v171.84C266.24,262.187,288,229.653,288,192z"
                />
                <polygon
                  {...{ style: { fill } }}
                  points="0,128 0,256 85.333,256 192,362.667 192,21.333 85.333,128 			"
                />
                <path
                  {...{ style: { fill } }}
                  d="M234.667,4.907V48.96C296.32,67.307,341.333,124.373,341.333,192S296.32,316.693,234.667,335.04v44.053
				 C320.107,359.68,384,283.413,384,192S320.107,24.32,234.667,4.907z"
                />
              </g>
            </g>
          </g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
        </svg>
      )}
    </div>
  );
}
