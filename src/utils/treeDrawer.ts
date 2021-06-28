import { D3SVGSelection } from '@/types/d3'
import { TreeGraph } from '@/types/dagre'
import { line } from 'd3-shape'

const getTextWidth = (innerText: string, fontSize: number, font: string) => {
  const text = document.createElement('span')
  document.body.appendChild(text)
  text.style.font = font
  text.style.fontSize = fontSize + 'px'
  text.style.height = 'auto'
  text.style.width = 'auto'
  text.style.position = 'absolute'
  text.style.whiteSpace = 'no-wrap'
  text.innerHTML = innerText
  const width = Math.ceil(text.clientWidth)
  document.body.removeChild(text)
  return width
}

export const getNode = (label: string, barHeight: number, fontSize: number, font: string) => {
  const textWidth = getTextWidth(label, fontSize, font)
  return {
    label: label,
    width: textWidth + (textWidth / 3 * 2),
    height: barHeight
  }
}

const getXOffset = (svg: D3SVGSelection) => {
  // Get the third of the canvas to center the graph
  return Number(svg.style('width').replace('px', '')) / 3
}

const drawLine = (svg: D3SVGSelection, x1: number, y1: number, x2: number, y2: number) => {
  return svg.append('line')
    .style('stroke', 'black')
    .style('stroke-width', 1)
    .attr('x1', x1)
    .attr('y1', y1)
    .attr('x2', x2)
    .attr('y2', y2)
}

const drawNode = (gElement: D3SVGSelection, x: number, y: number, width: number, height: number) => {
  gElement.append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('stroke', 'black')
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('fill', '#69a3b2')
}

const addNodeLabel = (gElement: D3SVGSelection, x: number, y: number, label: string, fontSize: number) => {
  gElement.append('text')
    .attr('x', x)
    .attr('y', y)
    .style('font-size', `${fontSize}px`)
    .style('text-anchor', 'middle')
    .text(label)
}

export const drawNodes = (svg: D3SVGSelection, g: TreeGraph, fontSize: number): void => {
  const xOffset = getXOffset(svg)
  g.nodes().forEach((v: any) => {
    const node = g.node(v)
    const gElement = svg.append('g')
    drawNode(gElement, node.x + xOffset - node.width / 2, node.y, node.width, node.height)
    addNodeLabel(gElement, node.x + xOffset, node.y + fontSize * 2, node.label, fontSize)
  })
}

const defineArrowHead = (svg: D3SVGSelection) => {
  const markerBoxWidth = 10
  const markerBoxHeight = 10
  const refX = 9
  const refY = 5
  const arrowPoints: Iterable<[number, number]> = [[0, 0], [0, 10], [10, 5]]
  svg.append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
    .attr('refX', refX)
    .attr('refY', refY)
    .attr('markerWidth', 8)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', line()(arrowPoints))
    .attr('stroke', 'black')
}

export const drawEdges = (svg: D3SVGSelection, g: TreeGraph, barHeight: number): void => {
  const xOffset = getXOffset(svg)
  g.edges().forEach((e: any) => {
    const points = g.edge(e).points

    for (const [index, value] of points.entries()) {
      if (index + 1 !== points.length) {
        const x1 = value.x + xOffset
        const y1 = value.y + barHeight / 2
        const x2 = points[index + 1].x + xOffset
        const y2 = points[index + 1].y + barHeight / 2
        const drawnLine = drawLine(svg, x1, y1, x2, y2)
        // if line == last line, add arrowhead
        if (index + 1 === points.length - 1) {
          defineArrowHead(svg)
          drawnLine.attr('marker-end', 'url(#arrow)')
            .attr('fill', 'none')
        }
      }
    }
  })
}
