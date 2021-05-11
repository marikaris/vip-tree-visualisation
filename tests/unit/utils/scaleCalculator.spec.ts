import { calculateHeightScale, calculateWidthScale } from '@/utils/scaleCalculator'

describe('scaleCalculator', () => {
  it('should calculate the width scale', () => {
    const scale = 1
    const graph = 2
    const svg = 3
    const observed = calculateWidthScale(svg, graph, scale)
    const expected = 0.5
    expect(observed).toEqual(expected)
  })
  it('should calculate the height scale', () => {
    const scale = 1
    const graph = 2
    const observed = calculateHeightScale(graph, scale)
    const expected = 42
    expect(observed).toEqual(expected)
  })
})
