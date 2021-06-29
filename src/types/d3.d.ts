import * as d3 from 'd3'

export type D3SVGSelection = d3.Selection<Element, never, null, never> | Record<string, never> | Selection<SVGSVGElement, unknown, null, undefined>
