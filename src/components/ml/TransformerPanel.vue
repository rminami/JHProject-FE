<template>
  <v-flex xs3>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline">Transformer Step {{ stepNumber }}</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form>
          <!-- <v-select
            label="Select Algorithm"
            :items="algos.map(algo => algo.algorithm_name)"
            v-model="algoName"
            max-height="400"
            style="white-space:nowrap; text-overflow:ellipsis;"
          ></v-select> -->
          <h3>Parameters</h3>
          <div>

          </div>
          <v-switch
            label="k fold validation?"
            v-model="kfold"
            color="orange"
          ></v-switch>
          <v-text-field
            label="k Value"
            :rules="[(v) => parseInt(v) <= 25 || 'k cannot be greater than 25']"
            type="number"
            v-model="kValue"
            :disabled="!kfold"
          ></v-text-field>
        </v-form>

      </v-card-text>
      <v-card-actions>
        <v-btn flat color="orange">Close</v-btn>
        <v-btn flat color="orange">Options</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import axios from 'axios'
import url from 'url'

const BE_ENDPOINT = 'http://127.0.0.1:4000'
const ML_ENDPOINT = 'http://127.0.0.1:7000'

export default {
  props: ['stepNumber', 'algos'],
  data() {
    return {
      selectedCols: [],
      kfold: true,
      kValue: 0,
      speed: 20,
      cols: [],
      algoName: '',

      // algos: [{algorithm_name: 'error'}],
    }
  },
  propsData() {
    algosCopy: 'algos'
  },
  // watch() {
  //
  // },
  // computed: {
  //   algo: (this.algos && this.algoName) ? this.algos.filter(a => a.algorithm_name === this.algoName) : {}
  // },
  // components: {
  // },
  created() {

    console.log(this.algosCopy)

  },
  // methods: {
  //   getAlgos() {
  //     axios({
  //       url: url.resolve(ML_ENDPOINT, '/jobs'),
  //       responseType: 'json',
  //     })
  //     .then(res => {
  //       const jobs = res.data.jobs
  //       this.algos = jobs
  //       console.log(res.data.jobs.map(job => job.algorithm_name))
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  //   }
  // }
}
</script>
