import { useEffect, useRef } from "react";

export const useD3 = (render: (svg: SVGSVGElement) => void) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = ref.current;
    render(svg);

    return () => {
      svg.innerHTML = "";
    };
  }, [render]);

  return ref;
};
