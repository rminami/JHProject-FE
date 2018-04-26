import { select, event } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { extent, mean } from 'd3-array'
import { axisLeft, axisBottom } from 'd3-axis'
import { zoom, zoomIdentity } from 'd3-zoom'

import {
  radius, zoomDur, maxZoom, tooltipLeft,
  tooltipTop, colors
} from '../../assets/Constants'

/**
 * Returns the Euclidean distance between two points.
 *
 * @typedef {Object} point - An object representing a point.
 *
 * @param {point} pt1 - First point.
 * @param {point} pt2 - Second point.
 * @return {number} Distance between pt1 and pt2.
 */
function distance(pt1, pt2) {
  return Math.sqrt(((pt1[0] - pt2[0]) ** 2) + ((pt1[1] - pt2[1]) ** 2))
}

export default {
  /**
   * Displays k-means clustering visualization.
   *
   * This implementation uses the Random Partition method for initializing the
   *     centroids, and Lloyd's algorithm for incrementally refining the clusters.
   *
   * @param {string[]} headers - Array of header titles
   * @param {number[][]} data - Data points to calculate clusters from
   * @param {number} kValue - The value of k to use.
   */
  render(headers, data, kValue, svgWidth, svgHeight) {
    // initial iterations for k-means clustering
    const initIterations = 10

    const zoomFunc = zoom().scaleExtent([1, maxZoom])
    const svg = select('#svg')

    const margin = {
      top: 30, bottom: 80, left: 80, right: radius
    }
    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom

    const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${
      margin.top})`)

    const xExtent = extent(data, d => d[0])
    const yExtent = extent(data, d => d[1])

    // Initializes cluster array
    const clusters = []
    for (let i = 0; i < kValue; ++i) {
      clusters.push([])
    }

    /**
     * Initializes cluster centers using Random Partition. This method first
     *     randomly assigns each data point to a cluster, and uses the means
     *     of these clusters as the initial centroids.
     *
     * @return {Object[]} Array of cluster centroid coordinates.
     */
    const initCenters = () => {
      data.forEach(d => {
        clusters[Math.floor(Math.random() * kValue)].push(d)
      })
      const centerArr = []

      for (let i = 0; i < kValue; ++i) {
        centerArr.push({
          xcol: mean(clusters[i], d => d[0]),
          ycol: mean(clusters[i], d => d[1])
        })
      }
      // sorts array so colors don't switch over each time
      return centerArr.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]))
    }

    const centerArr = initCenters()

    /**
     * Returns the closest cluster centroid, given the coordinates of a point.
     *
     * @param {obj} d The point to find the closest cluster centroid for.
     * @return {obj} The closest cluster centroid for d.
     */
    const findClosestCent = d => {
      let closestCent = 0
      const minimumDist = distance(d, centerArr[0])
      let tmpDist

      for (let i = 1; i < kValue; ++i) {
        tmpDist = distance(d, centerArr[i])
        if (tmpDist < minimumDist) {
          closestCent = i
        }
      }
      clusters[closestCent].push(d)
      return closestCent
    }

    /**
     * Performs another iteration of k-means clustering by taking the mean
     *     of each cluster and using it as the next cluster centroid.
     */
    const iterateKMeans = () => {
      for (let i = 0; i < kValue; ++i) {
        if (clusters[i].length > 0) {
          centerArr[i][0] = mean(clusters[i], d => d[0])
          centerArr[i][1] = mean(clusters[i], d => d[1])
        } else {
          centerArr[i] = data[Math.floor(Math.random() * data.length)]
        }
      }
    }

    const x = scaleLinear()
    .range([radius, width - radius])
    .domain(xExtent)
    const y = scaleLinear()
    .range([height - radius, radius])
    .domain(yExtent)

    let zoomX = x
    let zoomY = y

    const figureGroup = g.append('g')
    .attr('class', 'figures')
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
    .data(data)
    .enter()
    .append('circle')
    .attr('r', radius)
    .style('fill', d => colors(findClosestCent(d)))
    .attr('opacity', 0.7)
    .attr('cx', d => x(d[0]))
    .attr('cy', d => y(d[1]))
    .on('mouseover', d => {
      select('#x-tooltip-value').text(d[0])
      select('#y-tooltip-value').text(d[1])
      for (let i = 4; i < headers.length; ++i) {
        select(`#tooltip-value-${i}`).text(d[i])
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

    /**
     * Updates the colors of the circles so that data points in the same
     *     cluster have the same color.
     */
    const updateClusters = () => {
      circles.style('fill', d => colors(findClosestCent(d)))
    }

    for (let i = 0; i < initIterations; ++i) {
      iterateKMeans()
      updateClusters()
    }

    /* x-axis */
    const xFunc = axisBottom(x)
    const xAxis = g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xFunc)

    /* label for x-axis */
    g.append('text')
    .attr('class', 'axis-label x-axis-label')
    .attr('transform', `translate(${width / 2},${height + margin.top + 10})`)
    .style('text-anchor', 'middle')
    .text(headers[0])

    /* y-axis */
    const yFunc = axisLeft(y)
    const yAxis = g.append('g')
    .attr('class', 'y-axis')
    .call(yFunc)

    /* label for y-axis */
    g.append('text')
    .attr('class', 'axis-label y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', 10 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text(headers[1])

    /** zoom function */
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
