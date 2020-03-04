import React from "react";
import "./checkbox.scss";

function CheckboxButton({ useState, onClick, className, ...other }) {
  const [checked, setChecked] = useState;
  return (
    <div
      className={`checkbox${checked ? " checked" : ""}${
        typeof className === "string" ? ` ${className}` : ""
      }`}
      onClick={event => {
        setChecked(!checked);
        if (typeof onClick === "function") {
          onClick(event);
        }
      }}
      {...other}
    />
  );
}

export default CheckboxButton;
