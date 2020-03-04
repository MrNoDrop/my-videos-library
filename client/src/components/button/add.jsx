import React from "react";
import "./add.scss";

function AddButton({ className, ...other }) {
  return (
    <div className={`add-button${className ? ` ${className}` : ""}`} {...other}>
      +
    </div>
  );
}

export default AddButton;
