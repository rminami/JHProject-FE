import Plotly from 'plotly.js'

export default {
  /**
   * Displays 3D scatter plot using plotly.js.
   *
   * @param {!Array<string>} headers - Array of header titles.
   * @param {!Array<Array<number>>} data - Data points to calculate 3D scatter plot from.
   */
  render(headers, data) {
    /**
     * Refactors structure of data to comply with Plotly.
     *
     * @param {string} header - Header of the column to retrieves.
     */
    const plotify = header => (
      data.map(row => row[headers.indexOf(header)])
    )

    const displayData = {
      x: plotify(headers[0]),
      y: plotify(headers[1]),
      z: plotify(headers[2]),
      mode: 'markers',
      marker: {
        size: 12,
        line: {
          color: 'rgba(217, 217, 217, 0.14)',
          width: 0.5
        },
        opacity: 0.8
      },
      type: 'scatter3d'
    }
    const layout = {
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
      }
    }
    Plotly.newPlot('plotly-div', [displayData], layout)
  }
}
