<template>
<v-container fluid id="visualization-container">
  <div id="visualization-wrapper">
    <svg id="svg" :width="width" :height="height"/>
    <canvas id="canvas"/>
    <div id="plotly-div"/>
  </div>
  <div id="control-wrapper">
    <v-card id="datavis-form-card">
      <v-card-title class="headline">Data Visualizations</v-card-title>
      <v-container>
        <v-form v-model="valid">
          <v-select
            label="Select a visualization type"
            :items="vistypes"
            v-model="form.vistype"
          />

          <v-select
            label="x-Axis"
            :items="numerical"
            v-model="form.xAxis"
            autocomplete
            :rules="[rules.required]"
          />

          <v-select
          v-if="form.vistype !== 'Histogram'"
            label="y-Axis"
            :items="numerical"
            v-model="form.yAxis"
            autocomplete
            :rules="[rules.required]"
          />

          <v-select
            v-if="form.vistype === '3D Scatter Plot'"
            label="z-Axis"
            :items="numerical"
            v-model="form.zAxis"
            autocomplete
            :rules="[rules.required]"
          />

          <v-select
            v-if="form.vistype === 'Table'"
            label="Columns to display"
            :items="columns.map(col => col.header)"
            v-model="form.cols"
            multiple
            autocomplete
            chips
            deletable-chips
            clearable
          />


          <v-switch
            label="Filter by range"
            v-model="rangeSwitch"
          />

          <div v-show="rangeSwitch">
            <!-- Range for x-Axis -->
            <v-layout row justify-center>
              <v-flex xs5>
                <v-text-field
                  type="number"
                  label="x-Axis minimum"
                  step="0"
                  v-model="form.xMin"
                />
              </v-flex>
              <v-flex xs2 class="text-xs-center">
                <span class="tilde">~</span>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  type="number"
                  label="x-Axis maximum"
                  step="0"
                  v-model="form.xMax"
                />
              </v-flex>
            </v-layout>

            <!-- Range for y-Axis -->
            <v-layout row justify-center>
              <v-flex xs5>
                <v-text-field
                  type="number"
                  label="y-Axis minimum"
                  step="0"
                  v-model="form.yMin"
                />
              </v-flex>
              <v-flex xs2 class="text-xs-center">
                <span class="tilde">~</span>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  type="number"
                  label="y-Axis maximum"
                  step="0"
                  v-model="form.yMax"
                />
              </v-flex>
            </v-layout>

            <!-- Range for z-Axis -->
            <v-layout
              row
              justify-center
              v-if="form.vistype === '3D Scatter Plot'"
            >
              <v-flex xs5>
                <v-text-field
                  type="number"
                  label="z-Axis minimum"
                  step="0"
                  v-model="form.zMin"
                />
              </v-flex>
              <v-flex xs2 class="text-xs-center">
                <span class="tilde">~</span>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  type="number"
                  label="z-Axis maximum"
                  step="0"
                  v-model="form.zMax"
                />
              </v-flex>
            </v-layout>
          </div>

          <v-select
            v-if="form.vistype === 'Scatter Plot'"
            label="Categories"
            :items="categorical"
            v-model="form.categories"
            autocomplete
          />

          <v-select
            v-if="form.vistype !== 'Heatmap'
              && form.vistype !== 'Histogram'
              && form.vistype !== 'Table'"
            label="Show on tooltip"
            :items="columns.map(col => col.header)"
            v-model="form.tooltip"
            multiple
            autocomplete
            chips
            deletable-chips
            clearable
          />

          <v-select
            v-if="form.vistype === 'k-means'"
            label="k Value"
            :items="kValues"
            v-model="form.k"
            :rules="[rules.required]"
          />

          <v-btn color="primary" :disabled="!valid" @click="submit">Render</v-btn>
        </v-form>
      </v-container>
    </v-card>
  </div>
</v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { select } from 'd3-selection'

import PCA2D from '@/components/visualizations/PCA2D'
import KMeans from '@/components/visualizations/KMeans'
import Heatmap from '@/components/visualizations/Heatmap'
import ScatterPlot from '@/components/visualizations/ScatterPlot'
import ScatterPlot3D from '@/components/visualizations/ScatterPlot3D'

import validatorMixin from '@/mixins/validatorMixin'

export default {
  mixins: [validatorMixin],
  created() {
    axios({
      baseURL: this.beEndpoint,
      url: this.$route.path,
      responseType: 'json',
      params: {
        view: 'meta'
      }
    })
    .then(res => {
      this.columns = res.data.data.supported_views.tabular.columns

      if (this.columns[0].header) {
        this.numerical = this.columns
        .filter(col => col.type === 'number')
        .map(col => col.header)

        this.categorical = this.columns
        .filter(col => col.type === 'category')
        .map(col => col.header)

      } else {
        /**
         * Preserves backward compatibility with BE01
         */
        this.numerical = this.columns
        this.categorical = this.columns
        this.columns = this.columns.map(col => ({
          header: col,
          type: 'number'
        }))
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
  computed: {
    // Put other stuff here
    ...mapState({
      beEndpoint: s => s.beEndpoint
    })
  },
  methods: {
    getColumnIndex(header) {
      if (header === '') { return undefined }
      return this.columns
      .map((col, index) => ({ header: col.header, index }))
      .filter(col => col.header === header)[0].index
    },
    async get2dVisualizationData() {
      const selectedColumns = [
        this.form.xAxis,
        this.form.yAxis,
        ...this.form.categories
      ]
      this.form.tooltip.forEach(col => {
        if (!selectedColumns.includes(col)) {
          selectedColumns.push(col)
        }
      })
      const selectedColumnIndices = selectedColumns.map(this.getColumnIndex)
      await axios({
        baseURL: this.beEndpoint,
        url: this.$route.path,
        params: {
          view: 'tabular',
          cols: selectedColumnIndices.join(',')
        }
      })
      .then(res => {
        const rows = res.data.trim().split('\n')

        // Each entry is parsed from a string to a number.
        this.visData = rows.slice(1).map(row => row.split(',').map(f => +f))
        this.visHeaders = selectedColumns
      })
      .catch(err => {
        console.log('Could not retrieve CSV data.')
        console.log(err)
      })
    },
    async get3dVisualizationData() {
      const selectedColumns = [
        this.form.xAxis,
        this.form.yAxis,
        this.form.zAxis,
      ]
      const selectedColumnIndices = selectedColumns.map(this.getColumnIndex)
      await axios({
        baseURL: this.beEndpoint,
        url: this.$route.path,
        params: {
          view: 'tabular',
          cols: selectedColumnIndices.join(',')
        }
      })
      .then(res => {
        const rows = res.data.trim().split('\n')

        // Each entry is parsed from a string to a number.
        this.visData = rows.slice(1).map(row => row.split(',').map(f => +f))
        this.visHeaders = selectedColumns
      })
      .catch(err => {
        console.log('Could not retrieve CSV data.')
        console.log(err)
      })
    },
    beforeRender() {
      this.width = document.getElementById('visualization-wrapper').clientWidth
      this.height = document.getElementById('visualization-wrapper').clientHeight
      const svg = select('#svg').html('') // empties all previous children
    },
    async submit() {
      this.beforeRender()
      if (this.form.vistype === 'Scatter Plot') {
        await this.get2dVisualizationData()
        ScatterPlot.render(this.visHeaders, this.visData, this.width, this.height)
      }
      if (this.form.vistype === 'k-means') {
        await this.get2dVisualizationData()
        const k = parseInt(this.form.k, 10)
        KMeans.render(this.visHeaders, this.visData, k, this.width, this.height)
      }
      if (this.form.vistype === 'Heatmap') {
        await this.get2dVisualizationData()
        Heatmap.render(this.visHeaders, this.visData, this.width, this.height)
      }
      if (this.form.vistype === '2D PCA') {
        await this.get2dVisualizationData()
        PCA2D.render(this.visHeaders, this.visData, this.width, this.height)
      }
      if (this.form.vistype === '3D Scatter Plot') {
        await this.get3dVisualizationData()
        ScatterPlot3D.render(this.visHeaders, this.visData)
        // import('@/components/visualizations/ScatterPlot3D')
        // .then(ScatterPlot3D => {
        //   ScatterPlot3D.render(this.visHeaders, this.visData)
        // })
      }
    }
  },
  data() {
    return {
      vistypes: [
        'Heatmap',
        'k-means',
        '2D PCA',
        'Scatter Plot',
        '3D Scatter Plot',
        'Histogram',
        'Table'
      ],
      valid: false,
      form: {
        vistype: '',
        xAxis: '',
        yAxis: '',
        zAxis: '',
        cols: [],
        categories: [],
        tooltip: [],
        xMin: '',
        xMax: '',
        yMin: '',
        yMax: '',
        zMin: '',
        zMax: '',
        k: ''
      },
      kValues: ['2', '3', '4', '5'],
      rangeSwitch: false,
      columns: [],
      numerical: [],
      categorical: [],
      visHeaders: [],
      visData: [],
      visRendered: false,
      width: 0,
      height: 0
    }
  }
}
</script>

<style lang="stylus">
#visualization-container
  height: 100%

#visualization-wrapper
  width: calc(100% - 400px)
  float: left
  height: 100%
  overflow: hidden
  padding-bottom: 20px

#control-wrapper
  width: 400px
  left: calc(100% - 400px)
  float: left
  padding-left: 40px

.tilde
  font-size: 20px
  line-height 64px

circle, rect
  fill: rgb(31, 119, 180)
  stroke: none
</style>
