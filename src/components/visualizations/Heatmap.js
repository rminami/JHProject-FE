import { select, event } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'
import { axisLeft, axisBottom } from 'd3-axis'
import { zoom, zoomIdentity } from 'd3-zoom'
import heatmap from 'heatmap.js'

import { radius, zoomDur, maxZoom } from '../../assets/Constants'

export default {
  /**
   * Displays heatmap visualization.
   *
   * This implementation combines a heatmap created with heatmap.js with axes
   *     drawn using d3.js.
   *
   * @param {string[]} headers - Array of header titles
   * @param {number[][]} data - Data points to calculate heatmap from
   */
  render(headers, data, svgWidth, svgHeight) {
    // Defines the initial intensity of heatmap.
    const heatIntensity = 0.6

    // Defines the intensity of the heatmap as the user zooms in.
    const heatIntensityZoom = 0.15

    const svg = select('#svg')
    const canvas = select('#canvas')

    const zoomFunc = zoom().scaleExtent([1, maxZoom])

    const margin = {
      top: 30, bottom: 80, left: 80, right: radius
    }
    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom
    const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

    canvas.style('width', `${width}px`)
    .style('height', `${height}px`)
    .style('top', `${margin.top}px`)
    .style('left', `${margin.left}px`)

    const x = scaleLinear()
    .range([radius, width - radius])
    .domain(extent(data, d => +d[0]))
    const y = scaleLinear()
    .range([height - radius, radius])
    .domain(extent(data, d => +d[1]))

    let zoomX = x
    let zoomY = y

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

    const heatmapInstance = heatmap.create({
      container: document.querySelector('#canvas')
    })

    let points = data.map(d => ({
      x: Math.round(x(d[0])),
      y: Math.round(y(d[1])),
      value: Math.round(heatIntensity * 100)
    }))

    heatmapInstance.setData({
      max: 100,
      data: points
    })

    /** zoom function */
    function zoomed() {
      xAxis.transition()
      .duration(zoomDur)
      .call(xFunc.scale(event.transform.rescaleX(x)))

      yAxis.transition()
      .duration(zoomDur)
      .call(yFunc.scale(event.transform.rescaleY(y)))

      /* New scale for heatmap */
      zoomX = event.transform.rescaleX(x)
      zoomY = event.transform.rescaleY(y)

      points = data.map(d => ({
        x: Math.round(zoomX(d[0])),
        y: Math.round(zoomY(d[1])),
        value: Math.round(heatIntensity * 100 *
          ((event.transform.k * heatIntensityZoom) + (1 - heatIntensityZoom)))
      }))
      heatmapInstance.setData({
        max: 100,
        data: points
      })
    }

    svg.call(zoomFunc.transform, zoomIdentity) // clears previous zoom level
    .call(zoomFunc.on('zoom', zoomed)) // zoom will be handled by function 'zoomed'
    .on('dblclick.zoom', null) // disables double click to zoom

    canvas.call(zoomFunc.transform, zoomIdentity)
    .call(zoomFunc.on('zoom', zoomed))
    .on('dblclick.zoom', null)
  }
}
