import { DecisionTree } from '@/types/DecisionTree'
import { Node, NodeWithOutcome } from '@/types/Node'
import { TreeNodes } from '@/types/TreeNodes'
import { TreeEdgesArray, TreeEdgesObj } from '@/types/TreeEdges'
import { OutcomeEnum, OutcomeTypeEnum } from '@/types/OutcomeEnum'

export const retrieveNodes = (inputTree: DecisionTree): TreeNodes => {
  return Object.keys(inputTree.nodes).map((key) => {
    return {
      id: key,
      label: key
    }
  })
}
const createSimpleEdge = (outcomeType: OutcomeTypeEnum, node: NodeWithOutcome, key: string, edges: TreeEdgesObj): TreeEdgesObj => {
  const outcome: OutcomeEnum = <OutcomeEnum>`outcome${outcomeType}`
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const nextNode: string = node[outcome].nextNode
  edges = createEdge(nextNode, outcomeType, key, edges)
  return edges
}

export const createEdge = (nextNode: string, label: string, key: string, edges: TreeEdgesObj): TreeEdgesObj => {
  const edgeKey = `${key}_${nextNode}`
  if (edges[edgeKey] === undefined) {
    edges[edgeKey] = {
      from: key,
      to: nextNode,
      label: label
    }
  } else {
    edges[edgeKey].label = `${edges[edgeKey].label}\n${label}`
  }
  return edges
}

export const retrieveEdges = (inputTree: DecisionTree): TreeEdgesArray => {
  let edges: TreeEdgesObj = {}
  Object.keys(inputTree.nodes).forEach((key) => {
    const node: Node = inputTree.nodes[key]
    if ('outcomeTrue' in node) {
      edges = createSimpleEdge('True', node, key, edges)
      edges = createSimpleEdge('False', node, key, edges)
      if ('outcomeMissing' in node) {
        edges = createSimpleEdge('Missing', node, key, edges)
      }
    } else if ('outcomeMap' in node) {
      Object.keys(node.outcomeMap).forEach(
        (category) => {
          const nextNode = node.outcomeMap[category].nextNode
          edges = createEdge(nextNode, category, key, edges)
        }
      )
      edges = createSimpleEdge('Missing', node, key, edges)
      edges = createSimpleEdge('Default', node, key, edges)
    }
  })
  return Object.keys(edges).map((k) => edges[k])
}
