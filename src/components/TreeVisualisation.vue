<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue'

import { select } from 'd3-selection'
// import { zoom, zoomIdentity } from 'd3-zoom'
import graphlib from 'dagre/lib/graphlib'
import * as layout from 'dagre/lib/layout'
import { retrieveNodes, retrieveEdges } from '@/utils/treeBuilder'
// import { calculateWidthScale, calculateHeightScale } from '@/utils/scaleCalculator'
import { TreeNodes } from '@/types/TreeNodes'
import { DecisionTree } from '@/types/DecisionTree'
import { TreeEdgesArray } from '@/types/TreeEdges'
import { TreeGraph } from '@/types/dagre'
import { D3SVGSelection } from '@/types/d3'
import { getNode, drawNodes, drawEdges } from '@/utils/treeDrawer'

export default Vue.extend({
  name: 'TreeVisualisation',
  props: {
    tree: String,
    fontSize: {
      type: Number,
      default: 10
    },
    font: {
      type: String,
      default: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,Liberation Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
    }
  },
  mounted (): void {
    this.render(this.nodes, this.edges)
  },
  data (): { svg: D3SVGSelection, initialScale: number } {
    return {
      svg: {},
      initialScale: 0.65
    }
  },
  computed: {
    barHeight (): number {
      return 3 * this.fontSize
    },
    jsonTree (): DecisionTree {
      return JSON.parse(this.tree)
    },
    nodes (): TreeNodes {
      return retrieveNodes(this.jsonTree)
    },
    edges (): TreeEdgesArray {
      return retrieveEdges(this.jsonTree)
    }
  },
  watch: {
    nodes (): void {
      this.refresh()
    },
    edges (): void {
      this.refresh()
    }
  },
  methods: {
    defineNodes (nodes: TreeNodes, g: TreeGraph): void {
      nodes.forEach((node) => {
        g.setNode(node.id, getNode(node.label, this.barHeight, this.fontSize, this.font))
      })
    },
    defineEdges (edges: TreeEdgesArray, g: TreeGraph): void {
      edges.forEach((edge) => {
        g.setEdge(edge.from, edge.to)
      })
    },
    addZoom (g: TreeGraph): void {
      // const inner = this.svg.append('g')
      // const d3zoom = zoom().on('zoom', () => {
      //   inner.attr('transform', event.transform)
      // })
      // this.svg.call(d3zoom)
      // const renderTree = new render()
      // renderTree(inner, g)
      // const width = parseInt(this.svg.attr('width'))
      // const graphWidth = g.graph().width
      // if (graphWidth) {
      //   this.svg.call(
      //     d3zoom.transform,
      //     zoomIdentity
      //       .translate(
      //         calculateWidthScale(width, graphWidth, this.initialScale), 20)
      //       .scale(this.initialScale)
      //   )
      // }
      // const graphHeight = g.graph().height
      // if (graphHeight) {
      //   this.svg.attr('height', calculateHeightScale(graphHeight, this.initialScale))
      // }
    },
    setSvg (g: TreeGraph): void {
      this.svg = select(this.$el)
        .append('svg')
        .attr('width', document.body.clientWidth - 350)
        .attr('height', 1700)
      // this.addZoom(g)
    },
    render (nodes: TreeNodes, edges: TreeEdgesArray): void {
      const g: TreeGraph = new graphlib.Graph()
      g.setGraph({})
      g.setDefaultEdgeLabel(function () { return {} })
      console.log('defining nodes')
      this.defineNodes(nodes, g)
      this.defineEdges(edges, g)
      layout(g)
      this.setSvg(g)
      drawNodes(this.svg, g, this.fontSize)
      drawEdges(this.svg, g, this.barHeight)
    },
    refresh (): void {
      this.svg.remove()
      this.render(this.nodes, this.edges)
    }
  }
})
</script>

<style>
h1,
svg {
  text-align: center;
}

svg {
  display: block;
  margin: auto;
  border: 1px solid #ccc;
}

.node rect {
  stroke: #333;
  fill: #fff;
}

.edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}
</style>
