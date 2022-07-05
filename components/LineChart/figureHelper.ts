import * as d3 from "d3";

export function calculateFigureSize(
  container: Dimension,
  marginVertical: number,
  marginHorizontal: number
): Dimension {
  return {
    width: container.width - marginHorizontal,
    height: container.height - marginVertical,
  };
}

export type Coordinate = {
  x: number;
  y: number;
};

export type FigureDomain = {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
};

export type Dimension = {
  width: number;
  height: number;
};

export type FigureScale = {
  x: d3.ScaleLinear<number, number, never>;
  y: d3.ScaleLinear<number, number, never>;
};

export type Figure = d3.Selection<SVGGElement, Coordinate[], null, undefined>;

export function calculateFigureDomain(data: Coordinate[]): FigureDomain {
  const xMin = d3.min<Coordinate, number>(data, (d) => d.x) || 0;
  const xMax = d3.max<Coordinate, number>(data, (d) => d.x) || 1;

  const yMin = d3.min<Coordinate, number>(data, (d) => d.y) || 0;
  const yMax = d3.max<Coordinate, number>(data, (d) => d.y) || 1;

  const xStart = xMin;
  const xEnd = xMax;

  const yStart = yMin - yMin * 0.15;
  const yEnd = yMax + yMax * 0.05;

  return { xStart, xEnd, yStart, yEnd };
}

export function getFigureScale(
  figureDomain: FigureDomain,
  figureSize: Dimension
): FigureScale {
  const { xStart, xEnd, yStart, yEnd } = figureDomain;
  const { width: figureWidth, height: figureHeight } = figureSize;
  const x = d3.scaleLinear().domain([xStart, xEnd]).range([0, figureWidth]);
  const y = d3.scaleLinear().domain([yStart, yEnd]).range([figureHeight, 0]);

  return { x, y };
}

export function createFigureContainer(
  svg: SVGSVGElement,
  marginVertical: number,
  marginHorizontal: number
) {
  return d3
    .select<SVGSVGElement, Coordinate[]>(svg)
    .append("g")
    .attr(
      "transform",
      `translate(${marginHorizontal / 2}, ${marginVertical / 2})`
    );
}

export function drawAxes(
  graph: Figure,
  figureSize: Dimension,
  xAxis: d3.Axis<d3.NumberValue>,
  yAxis: d3.Axis<d3.NumberValue>
) {
  const xLine = graph
    .append("g")
    .attr("transform", `translate(0,${figureSize.height})`)
    .attr("stroke-width", 3)
    .call(xAxis);

  const yLine = graph.append("g").attr("stroke-width", 3).call(yAxis);

  return { xLine, yLine };
}

export function plotData(
  figure: Figure,
  figureScale: FigureScale,
  data: Coordinate[]
) {
  const { x, y } = figureScale;
  figure
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "deeppink")
    .attr("stroke-width", 3)
    .attr("stroke-linecap", "round")
    .attr(
      "d",
      d3
        .line<Coordinate>()
        .x((d) => x(d.x))
        .y((d) => y(d.y))
    );
}

export function drawTooltip(
  figure: Figure,
  figureScale: FigureScale,
  figureDomain: FigureDomain
) {
  const { x, y } = figureScale;
  const { xStart, yStart, yEnd } = figureDomain;
  const tooltipContainer = figure.append("g").attr("display", "none");

  const tooltipLine = tooltipContainer
    .append("path")
    .datum([
      { x: xStart, y: yStart },
      { x: xStart, y: yEnd },
    ])
    .attr("stroke", "hsl(245deg,100%,60%)")
    .style("stroke-dasharray", "5")
    .attr(
      "d",
      d3
        .line<Coordinate>()
        .x((d) => x(d.x))
        .y((d) => y(d.y))
    );

  const tooltipText = tooltipContainer
    .append("g")
    .append("text")
    .attr("class", "tooltipText")
    .attr("alignment-baseline", "middle")
    .attr("text-anchor", "middle")
    .attr("fill", "hsl(245deg,100%,60%)")
    .attr("y", `-10`);

  return { tooltipContainer, tooltipLine, tooltipText };
}

export function drawMouseEventContainer(figure: Figure, figureSize: Dimension) {
  return figure
    .append("rect")
    .attr("fill", "none")
    .style("pointer-events", "all")
    .attr("width", figureSize.width)
    .attr("height", figureSize.height);
}
export function getClosestCoordinates(coordinates: Coordinate[], x: number) {
  if (x <= coordinates[0].x || x >= coordinates[coordinates.length - 1].x)
    return;

  const closestRight = d3.bisectLeft(
    coordinates.map((c) => c.x),
    x
  );
  const closestLeft = closestRight - 1;

  return [coordinates[closestLeft], coordinates[closestRight]];
}

export function handleTooltipChange(
  mouseEventContainer: d3.Selection<
    SVGRectElement,
    Coordinate[],
    null,
    undefined
  >,
  figureScale: FigureScale,
  coordinates: Coordinate[],
  tooltipContainer: Figure,
  tooltipText: d3.Selection<SVGTextElement, Coordinate[], null, undefined>
) {
  mouseEventContainer
    .on("mouseover", handleMouseOver)
    .on("mousemove", handleMouseMove)
    .on("mouseout", handleMouseExit);

  function handleMouseOver() {
    tooltipContainer.attr("display", null);
  }

  function handleMouseExit() {
    tooltipContainer.attr("display", "none");
  }
  function handleMouseMove(event: React.MouseEvent) {
    const [horizontalMousePos] = d3.pointer(event);
    const xMousePos = figureScale.x.invert(horizontalMousePos);
    const roundedX = Math.floor(xMousePos);

    const closestNodes = getClosestCoordinates(coordinates, roundedX);
    if (!closestNodes) {
      return;
    }
    const [closestLeft, closestRight] = closestNodes;

    tooltipContainer.attr("transform", `translate(${horizontalMousePos}, 0)`);

    const y = interpolate(closestLeft, closestRight, roundedX);
    const roundedSize = Math.round(y * 100) / 100;
    tooltipText.html(`${roundedSize}rem at ${roundedX}px`);
  }

  return mouseEventContainer;
}

export function interpolate(a: Coordinate, b: Coordinate, x: number): number {
  const slope = (b.y - a.y) / (b.x - a.x);
  const yIntercept = b.y - slope * b.x;

  return slope * x + yIntercept;
}
