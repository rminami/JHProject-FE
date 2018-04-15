<template>
  <v-container fluid fill-height grid-list-xs id="outer-container">
    <v-layout row>
      <v-container fluid grid-list-md id="inner-container">
        <v-layout row>
          <input-file-panel
            :adv-enabled="advEnabled"
            @adv-toggle="toggleAdvOptions"
            @error="beConnected = true"
          />
          <transformer-panel
            v-show="advEnabled"
            v-for="(transformer, index) in transformers"
            :key="index"
            :index="index"
            :algos="tabularAlgos"
            :values="transformer"
            @change="handleTransformChange"
            @append="appendTransformer"
            @remove="removeTransformer"
          />
          <v-btn
            v-show="advEnabled"
            id="add-step-btn"
            color="primary"
            fab
            dark
            @click="addTransformStep"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <estimator-panel
            :adv-enabled="advEnabled"
            :index="transformers.length"
            :algos="tabularAlgos"
          />
          <next-panel/>
        </v-layout>
      </v-container>
    </v-layout>
    <!-- Snackbar is displayed when connection to backend or ML fails -->
    <v-snackbar
      :timeout="3000"
      color="error"
      v-model="snackbarIsOpen"
    >
      {{ snackbarMsg }}
      <v-btn dark flat @click.native="snackbarIsOpen = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import url from 'url'

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
      transformers: [
        {
          name: '',
          parameters: []
        }
      ],
      estimator: {
        selected: '',
        parameters: {},
        hyperparams: {}
      },
      beConnected: false,
      mlConnected: false,
      snackbarIsOpen: false,
      advEnabled: true
    }
  },
  watch: {
    beConnected: function() {
      this.snackbarIsOpen = this.beConnected || this.mlConnected
    },
    mlConnected: function() {
      this.snackbarIsOpen = this.beConnected || this.mlConnected
    }
  },
  computed: {
    tabularAlgos() {
      return this.algos.filter(a => a.data_type === 'tabular')
    },
    snackbarMsg() {
      return ('Could not connect to '
        + (this.beConnected ? 'backend' : '')
        + ((this.beConnected && this.mlConnected) ? ' or ' : '')
        + (this.mlConnected ? 'machine learning server' : '')
        + '.')
    },
    ...mapState({
      beEndpoint: s => s.beEndpoint,
      mlEndpoint: s => s.mlEndpoint
    })
  },
  methods: {
    getAlgos() {
      // url: 'https://to26.host.cs.st-andrews.ac.uk/JH-Project/machine-learning-api/1.0/jobs',
      axios({
        method: 'get',
        baseURL: this.mlEndpoint,
        url: '/jobs',
        responseType: 'json',
      })
      .then(res => {
        // const jobs = res.data.data.jobs
        const jobs = res.data.jobs
        this.algos = jobs
      })
      .catch(err => {
        this.mlConnected = true 
        console.log(err)
      })
    },
    addTransformStep() {
      this.transformers.push({ selected: '', parameters: {} })
    },
    appendTransformer(indexToAppendTo) {
      this.transformers = [
        ...this.transformers.slice(0, indexToAppendTo),
        { name: '', parameters: {} },
        ...this.transformers.slice(indexToAppendTo)
      ]
    },
    handleTransformChange(newTransformer, index) {
      const prevStep = this.transformers[index]
      this.transformers = [
        ...this.transformers.slice(0, index),
        newTransformer,
        ...this.transformers.slice(index + 1)
      ]
    },
    removeTransformer(idToRemove) {
      this.transformers = this.transformers.filter((step, index) => (
        index !== idToRemove
      ))
    },
    toggleAdvOptions(toggleTo) {
      this.advEnabled = toggleTo
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
