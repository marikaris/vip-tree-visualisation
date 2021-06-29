<template>
  <div class="d3-tree-visualisation"></div>
</template>

<script lang="ts">
import Vue from 'vue'

import { select } from 'd3-selection'
import { zoom } from 'd3-zoom'
import graphlib from 'dagre/lib/graphlib'
import * as layout from 'dagre/lib/layout'
import { retrieveNodes, retrieveEdges } from '@/utils/treeBuilder'
import { TreeNodes } from '@/types/TreeNodes'
import { DecisionTree } from '@/types/DecisionTree'
import { TreeEdgesArray } from '@/types/TreeEdges'
import { TreeGraph } from '@/types/dagre'
import { D3SVGSelection } from '@/types/d3'
import { getNode, drawNodes, drawEdges, getBarHeightFromFontSize } from '@/utils/treeDrawer'

export default Vue.extend({
  name: 'TreeVisualisation',
  props: {
    tree: String,
    nodeColour: {
      default: '#b0c4de'
    },
    nodeTextColour: {
      default: '#000'
    }
  },
  mounted (): void {
    this.render(this.nodes, this.edges)
  },
  data (): { svg: D3SVGSelection } {
    return {
      svg: {}
    }
  },
  computed: {
    fontSize (): number {
      return Number(this.getCss('font-size').replace('px', ''))
    },
    font (): string {
      return this.getCss('font')
    },
    barHeight (): number {
      return getBarHeightFromFontSize(this.fontSize)
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
    getCss (property) {
      const element = document.getElementsByClassName('d3-tree-visualisation')[0]
      return window.getComputedStyle(element, null).getPropertyValue(property)
    },
    defineNodes (nodes: TreeNodes, g: TreeGraph): void {
      nodes.forEach((node) => {
        g.setNode(node.id, getNode(node.label, this.barHeight, this.fontSize, this.font))
      })
    },
    defineEdges (edges: TreeEdgesArray, g: TreeGraph): void {
      edges.forEach((edge) => {
        g.setEdge(edge.from, edge.to, { label: edge.label })
      })
    },
    getZoom (svg) {
      return zoom()
        .scaleExtent([0.2, 8])
        .on('zoom', (event) => {
          svg.selectAll('line')
            .attr('transform', event.transform)
          svg.selectAll('rect')
            .attr('transform', event.transform)
          svg.selectAll('text')
            .attr('transform', event.transform)
        })
    },
    setSvg (): void {
      this.svg = select(this.$el)
        .append('svg')
        .attr('width', document.body.clientWidth - 350)
        .attr('height', window.screen.height - 200)
    },
    render (nodes: TreeNodes, edges: TreeEdgesArray): void {
      const g: TreeGraph = new graphlib.Graph()
      g.setGraph({})
      g.setDefaultEdgeLabel(() => {
        return {}
      })
      this.defineNodes(nodes, g)
      this.defineEdges(edges, g)
      layout(g)
      this.setSvg(g)
      drawNodes(this.svg, g, this.fontSize, this.nodeColour, this.nodeTextColour)
      drawEdges(this.svg, g, this.barHeight, this.font)
      const graphZoom = this.getZoom(this.svg)
      this.svg.call(graphZoom)
    },
    refresh (): void {
      this.svg.remove()
      this.render(this.nodes, this.edges)
    }
  }
})
</script>

<style>
.d3-tree-visualisation {
  font-size: 10px;
}
</style>
