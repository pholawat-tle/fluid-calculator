import { MutableRefObject, useEffect, useReducer, useRef } from "react";
import { Dimension } from "../components/LineChart/figureHelper";

const reducer = (_state: Dimension, action: Dimension) => {
  return action;
};

export const useElementSize = <T extends HTMLElement>(): [
  MutableRefObject<T | null>,
  Dimension
] => {
  const ref = useRef<T>(null);
  const observer = useRef<ResizeObserver>();
  const [state, dispatch] = useReducer(reducer, {
    height: 0,
    width: 0,
  });

  useEffect(() => {
    if (!ref.current) return;
    const currentRef = ref.current;

    const updateSize = () => {
      dispatch({
        height: currentRef.offsetHeight,
        width: currentRef.offsetWidth,
      });
    };

    observer.current = new ResizeObserver(updateSize);
    observer.current.observe(ref.current);

    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return [ref, state];
};
