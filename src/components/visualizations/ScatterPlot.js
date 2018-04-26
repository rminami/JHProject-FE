import { select, event } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'
import { axisLeft, axisBottom } from 'd3-axis'
import { zoom, zoomIdentity } from 'd3-zoom'

import {
  radius, zoomDur, maxZoom, tooltipLeft,
  tooltipTop, colors
} from '../../assets/Constants'

export default {
  /**
   * Displays 2D scatter plot.
   *
   * @param {string[]} headers - Array of header titles.
   *         headers[0] = x-axis, headers[1] = y-axis.
   * @param {number[][]} data - Data points to render scatter plot from.
   *         data[][0] = x-axis values, data[][1] = y-axis values.
   */
  render(headers, data, svgWidth, svgHeight) {
    const zoomFunc = zoom().scaleExtent([1, maxZoom])
    const svg = select('#svg').html('') // empties all previous children

    const margin = {
      top: 30,
      bottom: 80,
      left: 80,
      right: radius
    }
    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom
    const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const x = scaleLinear()
    .range([radius, width - radius])
    .domain(extent(data, d => d[0]))
    const y = scaleLinear()
    .range([height - radius, radius])
    .domain(extent(data, d => d[1]))

    let zoomX = x
    let zoomY = y

    const circleGroup = g.append('g')
    .attr('class', 'circles')
    .attr('clip-path', 'url(#clip)')

    /* Adds clip path to hide data points outside axes */
    circleGroup.append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)

    const circles = circleGroup.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', radius)
    .attr('opacity', 0.7)
    .attr('cx', d => x(d[0]))
    .attr('cy', d => y(d[1]))
    .style('fill', d => colors(d[3]))
    // .on('mouseover', d => {
    //   select('#x-tooltip-value').text(d[0])
    //   select('#y-tooltip-value').text(d[1])
    //   select('#c-tooltip-value').text(d[3])
    //   for (let i = 4; i < headers.length; ++i) {
    //     select(`#tooltip-value-${i}`).text(d[i])
    //   }

    //   const xTooltipPos = zoomX(d[0]) + margin.left + radius + tooltipLeft
    //   const yTooltipPos = zoomY(d[1]) + margin.top + radius + tooltipTop

    //   select('#tooltip')
    //   .style('left', `${xTooltipPos}px`)
    //   .style('top', `${yTooltipPos}px`)
    //   .classed('invisible', false)
    // })
    // .on('mouseout', () => {
    //   select('#tooltip').classed('invisible', true)
    // })

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
    .attr('x', (-height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text(headers[1])

    /** Zoom function for the scatter plot. */
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
