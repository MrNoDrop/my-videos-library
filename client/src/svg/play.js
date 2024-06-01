import React, { useState } from "react";

export default function PlaySvg({
  paused,
  className,
  svg,
  locked = false,
  disableEvents = false,
  ...other
}) {
  const [fill, setFill] = useState("white");
  return (
    <div
      {...{
        className: `play-svg${
          typeof className === "string" ? ` ${className}` : ""
        }`,
        ...other,
      }}
      onMouseEnter={() => !disableEvents && !locked && setFill("grey")}
      onMouseLeave={() => !disableEvents && !locked && setFill("white")}
      onMouseDown={() => !disableEvents && !locked && setFill("yellow")}
      onMouseUp={() => !disableEvents && !locked && setFill("grey")}
    >
      {paused ? (
        <svg
          id="Capa_1"
          enable-background="new 0 0 499.999 499.999"
          viewBox="0 0 499.999 499.999"
          xmlns="http://www.w3.org/2000/svg"
          {...svg}
        >
          <path
            {...{ style: { fill } }}
            d="m171.875 372.237c-2.701 0-5.402-.702-7.812-2.09-4.837-2.792-7.812-7.95-7.812-13.535v-215.987c0-5.585 2.975-10.727 7.797-13.519 4.837-2.792 10.788-2.838 15.625-.015l187.5 107.94c4.837 2.777 7.828 7.95 7.828 13.535s-2.975 10.742-7.828 13.535l-187.5 108.047c-2.412 1.388-5.113 2.089-7.798 2.089zm15.625-204.589v161.926l140.564-81.009c-.001 0-140.564-80.917-140.564-80.917z"
          />
          <path
            {...{ style: { fill } }}
            d="m250 499.999c-137.848 0-250-112.152-250-250s112.152-249.999 250-249.999 250 112.152 250 250-112.153 249.999-250 249.999zm0-468.749c-120.62 0-218.75 98.129-218.75 218.75s98.129 218.75 218.75 218.75 218.749-98.13 218.749-218.75-98.129-218.75-218.749-218.75z"
          />
        </svg>
      ) : (
        <svg
          id="Layer_1"
          enable-background="new 0 0 511.448 511.448"
          viewBox="0 0 511.448 511.448"
          xmlns="http://www.w3.org/2000/svg"
          {...svg}
        >
          <path
            {...{ style: { fill } }}
            d="m436.508 74.94c-99.913-99.913-261.64-99.928-361.567 0-99.913 99.913-99.928 261.64 0 361.567 99.913 99.913 261.64 99.928 361.567 0 99.912-99.912 99.927-261.639 0-361.567zm-180.784 394.45c-117.816 0-213.667-95.851-213.667-213.667s95.851-213.666 213.667-213.666 213.666 95.851 213.666 213.667-95.85 213.666-213.666 213.666z"
          />
          <path
            {...{ style: { fill } }}
            d="m298.39 160.057c-11.598 0-21 9.402-21 21v149.333c0 11.598 9.402 21 21 21s21-9.402 21-21v-149.333c0-11.598-9.401-21-21-21z"
          />
          <path
            {...{ style: { fill } }}
            d="m213.057 160.057c-11.598 0-21 9.402-21 21v149.333c0 11.598 9.402 21 21 21s21-9.402 21-21v-149.333c0-11.598-9.401-21-21-21z"
          />
        </svg>
      )}
    </div>
  );
}
