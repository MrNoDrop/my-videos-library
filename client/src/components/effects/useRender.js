import { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
export default function useRender(parentRef, trigger) {
  const ref = useRef();
  const [render, setRender] = useState(false);
  const [firstRun, setFirstRun] = useState(true);

  useEffect(() => {
    if (ref.current && !render) {
      if (firstRun) {
        setFirstRun(false);
        return;
      }
      const rect = ReactDOM.findDOMNode(ref.current).getBoundingClientRect();
      const parentRect = ReactDOM.findDOMNode(
        parentRef.current
      ).getBoundingClientRect();
      if (
        rect.left < parentRect.right &&
        rect.right > parentRect.left &&
        rect.top < parentRect.bottom &&
        rect.bottom > parentRect.top &&
        !render
      ) {
        setRender(true);
      }
    }
  }, [ref, parentRef, render, setRender, firstRun, trigger]);
  return { ref, render };
}
