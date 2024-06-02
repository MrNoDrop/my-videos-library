import React, { useRef } from "react";
import "./progress.scss";

function ProgressBar({ progress, duration }) {
  const progressPercentage = Math.floor((progress / duration) * 100);
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progressPercentage}%` }} />
    </div>
  );
}
export default ProgressBar;
