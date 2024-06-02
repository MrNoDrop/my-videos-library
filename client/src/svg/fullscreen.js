import React, { useState } from "react";
export default function FullscreenSVG({
  fullscreen,
  className,
  svg = {},
  ...other
}) {
  const [fill, setFill] = useState("white");
  return (
    <div
      {...{
        className: `fullscreen-svg${
          typeof className === "string" ? ` ${className}` : ""
        }`,
        ...other,
      }}
      onMouseEnter={() => setFill("grey")}
      onMouseLeave={() => setFill("white")}
      onMouseDown={() => setFill("yellow")}
      onMouseUp={() => setFill("grey")}
    >
      {fullscreen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 32 32"
          space="preserve"
          {...{
            ...svg,
            style: { enableBackground: "new 0 0 32 32", ...svg.style },
          }}
        >
          <g>
            <g id="fullscreen_x5F_exit_x5F_alt">
              <g>
                <polygon
                  {...{ style: { fill } }}
                  points="22.586,25.414 29.172,32 32,29.172 25.414,22.586 28,20 20,20 20,28 			"
                />
                <polygon
                  {...{ style: { fill } }}
                  points="6.547,9.371 4,12 11.961,11.957 12,4 9.375,6.543 2.828,0 0,2.828 			"
                />
                <polygon
                  {...{ style: { fill } }}
                  points="0,29.172 2.828,32 9.414,25.414 12,28 12,20 4,20 6.586,22.586 			"
                />
                <polygon
                  {...{ style: { fill } }}
                  points="28.031,12 25.438,9.404 32,2.838 29.164,0 22.598,6.566 20,3.971 20,12 			"
                />
              </g>
            </g>
          </g>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 488.4 488.4"
          space="preserve"
          {...{
            ...svg,
            style: { enableBackground: "new 0 0 488.4 488.4", ...svg.style },
          }}
        >
          <g>
            <g>
              <g>
                <polygon
                  {...{ style: { fill } }}
                  points="441.1,407.8 338.8,305.5 305.5,338.8 407.8,441.1 328.3,441.1 328.3,488.4 488.4,488.4 488.4,328.3 441.1,328.3 
							"
                />
                <polygon
                  {...{ style: { fill } }}
                  points="338.8,183 441.1,80.6 441.1,160.1 488.4,160.1 488.4,0 328.3,0 328.3,47.3 407.8,47.3 305.5,149.6 			"
                />
                <polygon
                  {...{ style: { fill } }}
                  points="149.6,305.5 47.3,407.8 47.3,328.3 0,328.3 0,488.4 160.1,488.4 160.1,441.1 80.6,441.1 183,338.8 			"
                />
                <polygon
                  {...{ style: { fill } }}
                  points="160.1,47.3 160.1,0 0,0 0,160.1 47.3,160.1 47.3,80.6 149.6,183 183,149.6 80.6,47.3 			"
                />
              </g>
            </g>
          </g>
        </svg>
      )}
    </div>
  );
}
