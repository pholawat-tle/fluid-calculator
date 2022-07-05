import styled from "styled-components";
import * as d3 from "d3";

import { useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import { useElementSize } from "../../hooks/useElementSize";
import { useD3 } from "../../hooks/useD3";

import {
  calculateFigureSize,
  calculateFigureDomain,
  getFigureScale,
  createFigureContainer,
  drawAxes,
  plotData,
  drawTooltip,
  drawMouseEventContainer,
  handleTooltipChange,
} from "./figureHelper";

import { Coordinate } from "./figureHelper";

const defaultOptions = {
  marginHorizontal: 80,
  marginVertical: 80,
};

const LineChart: React.FC<{
  data: Coordinate[];
  options?: {
    marginHorizontal?: number;
    marginVertical?: number;
  };
}> = ({ data: coordinates, options, ...rest }) => {
  const isMobile = useMediaQuery({ query: `(max-width: ${600 / 16}rem` });

  const [containerRef, containerSize] = useElementSize<HTMLDivElement>();

  const { marginHorizontal, marginVertical } = {
    ...defaultOptions,
    ...options,
  };

  const renderD3 = useCallback(
    (svg: SVGSVGElement) => {
      if (containerSize.width === 0 || containerSize.height === 0) return;

      const figureSize = calculateFigureSize(
        containerSize,
        marginVertical,
        marginHorizontal
      );

      const figureDomain = calculateFigureDomain(coordinates);

      const figureScale = getFigureScale(figureDomain, figureSize);

      const figure = createFigureContainer(
        svg,
        marginVertical,
        marginHorizontal
      );

      const xAxis = d3.axisBottom(figureScale.x).ticks(isMobile ? 3 : 5);
      const yAxis = d3.axisLeft(figureScale.y).ticks(5);

      drawAxes(figure, figureSize, xAxis, yAxis);

      plotData(figure, figureScale, coordinates);

      const { tooltipContainer, tooltipText } = drawTooltip(
        figure,
        figureScale,
        figureDomain
      );

      let mouseEventContainer = drawMouseEventContainer(figure, figureSize);

      handleTooltipChange(
        mouseEventContainer,
        figureScale,
        coordinates,
        tooltipContainer,
        tooltipText
      );
    },
    [coordinates, containerSize, marginVertical, marginHorizontal, isMobile]
  );

  const svgRef = useD3(renderD3);

  return (
    <Wrapper ref={containerRef} {...rest}>
      <svg
        ref={svgRef}
        style={{ overflow: "visible", width: "100%", height: "100%" }}
      ></svg>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  height: 100%;
`;

export default LineChart;
