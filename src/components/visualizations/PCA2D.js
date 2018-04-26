import { select, event } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'
import { axisRight, axisBottom } from 'd3-axis'
import { zoom, zoomIdentity } from 'd3-zoom'
import { eig, transpose, dot } from 'numeric'

import { radius, zoomDur, maxZoom, tooltipLeft, tooltipTop } from '../../assets/Constants'

/* Functions used for generating 2D principal component analysis. */

/**
 * Adjusts the range so that it is centered at zero. This allows us
 *     to produce a plot centered at (0, 0).
 *
 * @param {!Array<number>} range - The range to adjust.
 * @return {!Array<number>} The adjusted range.
 */
const centerAtZero = range => {
  const absmax = Math.max(Math.abs(range[0]), Math.abs(range[1]))
  return [-absmax, absmax]
}

/**
 * Calculates the covariance between two sets of variables.
 *
 * @param {!Array<number>} arr1 The first set of variables.
 * @param {!Array<number>} arr2 The second set of variables.
 * @param {number} n The number of entries in the sets.
 * @return {number} The covariance of the two sets.
 */
const covariance = (arr1, arr2, n) => {
  let ret = 0
  for (let i = 0; i < n; ++i) {
    ret += arr1[i] * arr2[i]
  }
  return ret / (n - 1)
}

export default {
  /**
   * Displays 2D principal component analysis.
   *
   * @param {!Array<string>} headers - Array of header titles
   * @param {Object[]} data - Data points to calculate clusters from.
   */
  render(headers, data, svgWidth, svgHeight) {
    const svg = select('#svg')

    const margin = {
      top: 0, bottom: 0, left: 0, right: 0
    }
    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom
    const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const zoomFunc = zoom()
    .scaleExtent([1, maxZoom])
    .translateExtent([[width / 2, height / 2], [width / 2, height / 2]])

    const xarr = []
    const yarr = []

    data.forEach(d => {
      xarr.push(d[0])
      yarr.push(d[1])
    })

    // Calculates mean of x and y values
    const len = xarr.length
    const xmean = xarr.reduce((s, d) => (s + d), 0) / len
    const ymean = yarr.reduce((s, d) => (s + d), 0) / len

    // Calculates the distance of each of the data points from the mean
    const xdiff = xarr.map(d => (xmean - d))
    const ydiff = yarr.map(d => (ymean - d))

    // Calculates covariance for each of the axes
    const xycov = covariance(xdiff, ydiff, len)
    const xxcov = covariance(xdiff, xdiff, len)
    const yycov = covariance(ydiff, ydiff, len)

    // Creates covariance matrix
    const covmat = [[xxcov, xycov], [xycov, yycov]]

    // Calculates eigenvectors using numeric.js
    const eigs = eig(covmat).E.x

    // Transposes data according to eigenvectors
    const vecs = []
    vecs.push(eigs[1])
    vecs.push(eigs[0])

    const displayData = transpose(dot(vecs, [xdiff, ydiff]))
    .map(d => [d[0], d[1]])

    displayData.forEach((d, i) => {
      d.orig = data[i] // eslint-disable-line
    })

    const x = scaleLinear()
    .range([radius, width - radius])
    .domain(centerAtZero(extent(displayData, d => d[0])))
    const y = scaleLinear()
    .range([height - radius, radius])
    .domain(centerAtZero(extent(displayData, d => d[1])))

    let zoomX = x
    let zoomY = y

    const figureGroup = g.append('g')
    .attr('class', 'circles')
    .attr('clip-path', 'url(#clip)')

    /* Adds clip path to hide data points outside axes */
    figureGroup.append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)


    const circles = figureGroup.selectAll('circle')
    .data(displayData)
    .enter()
    .append('circle')
    .attr('r', radius)
    .attr('opacity', 0.7)
    .attr('cx', d => x(d[0]))
    .attr('cy', d => y(d[1]))
    .on('mouseover', d => {
      select('#x-tooltip-value').text(d.orig[0])
      select('#y-tooltip-value').text(d.orig[1])
      for (let i = 4; i < headers.length; ++i) {
        select(`#tooltip-value-${i}`).text(d.orig[i])
      }

      const xTooltipPos = zoomX(d[0]) + margin.left + radius + tooltipLeft
      const yTooltipPos = zoomY(d[1]) + margin.top + radius + tooltipTop

      select('#tooltip')
      .style('left', `${xTooltipPos}px`)
      .style('top', `${yTooltipPos}px`)
      .classed('invisible', false)
    })
    .on('mouseout', () => {
      select('#tooltip').classed('invisible', true)
    })

    /* x-axis */
    const xFunc = axisBottom(x)
    const xAxis = g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height / 2})`)
    .call(xFunc)

    /* label for x-axis */
    g.append('text')
    .attr('class', 'axis-label x-axis-label')
    .attr('transform', `translate(${width},${(height / 2) + 35})`)
    .style('text-anchor', 'end')
    .text(headers[0])

    /* y-axis */
    const yFunc = axisRight(y)
    const yAxis = g.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${width / 2},0)`)
    .call(yFunc)

    /* label for y-axis */
    g.append('text')
    .attr('class', 'axis-label y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', (width / 2) - 24)
    .attr('x', 0)
    .attr('dy', '1em')
    .style('text-anchor', 'end')
    .text(headers[1])

    function zoomed() {
      xAxis.transition()
      .duration(zoomDur)
      .call(xFunc.scale(event.transform.rescaleX(x)))

      yAxis.transition()
      .duration(zoomDur)
      .call(yFunc.scale(event.transform.rescaleY(y)))

      /* redraw circles to new scale */
      zoomX = event.transform.rescaleX(x)
      zoomY = event.transform.rescaleY(y)

      circles.attr('cx', d => zoomX(d[0]))
      .attr('cy', d => zoomY(d[1]))
    }

    svg.call(zoomFunc.transform, zoomIdentity) // clears previous zoom level
    .call(zoomFunc.on('zoom', zoomed)) // zoom will be handled by function 'zoomed'
    .on('dblclick.zoom', null) // disables double click to zoom
  }
}
