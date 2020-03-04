import React from "react";
import "./delete.scss";

function DeleteButton({ useState: [deleted, setDeleted], ...others }) {
  return (
    <div
      className="delete"
      onClick={() => (typeof setDeleted === "function" ? setDeleted(true) : "")}
      {...others}
    />
  );
}

export default DeleteButton;
