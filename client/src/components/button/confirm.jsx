import React from "react";
import "./confirm.scss";

function ConfirmButton({
  onlySetConfirmTrueAllowed = false,
  useState: useConfirmedState,
  classNamePrefix,
  className,
  onClick,
  ...other
}) {
  const [confirmed, setConfirmed] = useConfirmedState;
  return (
    <div
      className={`${
        classNamePrefix ? `${classNamePrefix}-` : ""
      }confirm-button${className ? ` ${className}` : ""}`}
      onClick={event => {
        if (typeof onClick === "function") {
          onClick(event, {
            confirmed: onlySetConfirmTrueAllowed ? true : !confirmed
          });
        }
        setConfirmed(onlySetConfirmTrueAllowed ? true : !confirmed);
      }}
      {...other}
    />
  );
}

export default ConfirmButton;
