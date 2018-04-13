<template>
  <v-container fluid fill-height grid-list-xs id="outer-container">
    <v-layout row>
      <v-container fluid grid-list-md id="inner-container">
        <v-layout row>
          <input-file-panel :box-title="inputTitle"/>
          <transformer-panel
            v-for="(transformStep, index) in transformSteps"
            :key="index"
            :index="index"
            :algos="tabularAlgos"
            @append="appendTransformStep"
            @remove="removeTransformStep"
          />
          <v-btn id="add-step-btn" color="primary" fab dark @click="addTransformStep">
            <v-icon>add</v-icon>
          </v-btn>
          <next-panel/>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import url from 'url'

import MLBox from './ml/MLBox'
import InputFilePanel from './ml/InputFilePanel'
import EstimatorPanel from './ml/EstimatorPanel'
import TransformerPanel from './ml/TransformerPanel'
import NextPanel from './ml/NextPanel'


export default {
  components: {
    'input-file-panel': InputFilePanel,
    'next-panel': NextPanel,
    'estimator-panel': EstimatorPanel,
    'transformer-panel': TransformerPanel
  },
  computed: mapState({
    beEndpoint: s => s.beEndpoint,
    mlEndpoint: s => s.mlEndpoint
  }),
  data() {
    return {
      algos: [],
      transformSteps: [
        {
          type: 'transformer'
        }
      ],
      inputTitle: 'Select input file'
    }
  },
  computed: {
    tabularAlgos() {
      return this.algos.filter(a => a.data_type === 'tabular')
    },
    ...mapState({
      beEndpoint: s => s.beEndpoint,
      mlEndpoint: s => s.mlEndpoint
    })
  },
  methods: {
    getAlgos() {
      axios({
        // url: 'https://to26.host.cs.st-andrews.ac.uk/JH-Project/machine-learning-api/1.0/jobs',
        url: url.resolve(this.mlEndpoint, '/jobs'),
        responseType: 'json'
      })
      .then(res => {
        // const jobs = res.data.data.jobs
        const jobs = res.data.jobs
        this.algos = jobs
      })
      .catch(err => {
        console.log(err)
      })
    },
    addTransformStep() {
      this.transformSteps.push({ type: 'transformer' })
    },
    appendTransformStep(indexToAppendTo) {
      const tmp = [
        ...this.transformSteps.slice(0, indexToAppendTo),
        { type: 'transformer' },
        ...this.transformSteps.slice(indexToAppendTo + 1)
      ]
      console.log(tmp)

      this.transformSteps = [
        ...this.transformSteps.slice(0, indexToAppendTo),
        { type: 'transformer' },
        ...this.transformSteps.slice(indexToAppendTo)
      ]
    },
    removeTransformStep(idToRemove) {
      this.transformSteps = this.transformSteps.filter((step, index) => (
        index !== idToRemove
      ))
    }
  },
  created() {
    this.getAlgos()
  }
}
</script>

<style scoped>
#outer-container {
  overflow: auto;
  white-space: nowrap;
}

#inner-container {
  margin-top: 0px;
}

#add-step-btn {
  margin-top: 80px;
}
</style>
