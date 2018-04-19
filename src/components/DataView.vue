<template>
<v-container fluid>
  <v-layout>
    <v-layout row wrap>
      <v-card id="datavis-form-card">
        <v-card-title class="headline">Data Visualizations</v-card-title>
        <v-container>
          <v-form v-model="valid">
            <v-select
              label="Select a visualization type"
              :items="vistypes"
              v-model="formSelection.vistype"
            />

            <v-select
              label="x-Axis"
              :items="numerical"
              v-model="formSelection.xAxis"
              autocomplete
            />

            <v-select
            v-if="formSelection.vistype !== 'Histogram'"
              label="y-Axis"
              :items="numerical"
              v-model="formSelection.yAxis"
              autocomplete
            />

            <v-select
              v-if="formSelection.vistype === '3D Scatter Plot'"
              label="z-Axis"
              :items="numerical"
              v-model="formSelection.zAxis"
              autocomplete
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
                    v-model="formSelection.xMin"
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
                    v-model="formSelection.xMax"
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
                    v-model="formSelection.yMin"
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
                    v-model="formSelection.yMax"
                  />
                </v-flex>
              </v-layout>

              <!-- Range for z-Axis -->
              <v-layout
                row
                justify-center
                v-if="formSelection.vistype === '3D Scatter Plot'"
              >
                <v-flex xs5>
                  <v-text-field
                    type="number"
                    label="z-Axis minimum"
                    step="0"
                    v-model="formSelection.zMin"
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
                    v-model="formSelection.zMax"
                  />
                </v-flex>
              </v-layout>
            </div>

            <v-select
              v-if="formSelection.vistype === 'Scatter Plot'"
              label="Categories"
              :items="categorical"
              v-model="formSelection.categories"
              multiple
              autocomplete
              chips
              deletable-chips
              clearable
            />

            <v-select
              v-if="formSelection.vistype !== 'Heatmap'
                && formSelection.vistype !== 'Histogram'
                && formSelection.vistype !== 'Table'"
              label="Show on tooltip"
              :items="columns.map(col => col.header)"
              v-model="formSelection.tooltip"
              multiple
              autocomplete
              chips
              deletable-chips
              clearable
            />

            <v-select
              v-if="formSelection.vistype === 'k-means'"
              label="k Value"
              :items="kValues"
              v-model="formSelection.k"
            />

            <v-btn color="primary" :disabled="!valid" @click="submit">Render</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-layout>
  </v-layout>
</v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import url from 'url'

export default {
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
      formSelection: {
        vistype: '',
        xAxis: '',
        yAxis: '',
        zAxis: '',
        categories: '',
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
      categorical: []
    }
  },
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
      this.columns = res.data.supported_views.tabular.columns

      this.numerical = this.columns
      .filter(col => col.type === 'number')
      .map(col => col.header)

      this.categorical = this.columns
      .filter(col => col.type === 'category')
      .map(col => col.header)
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
    submit() {
      const xAxisSelection = this.formSelection.xAxis
      console.log(`Column selected for x-Axis is ${xAxisSelection}`)
      console.log(`This index is ${this.getColumnIndex(xAxisSelection)}`)
    }
  }
}
</script>

<style scoped>
#datavis-form-card {
  width: 400px;
}
.tilde {
  font-size: 20px;
  line-height: 64px;
}
</style>

