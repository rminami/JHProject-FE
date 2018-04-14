<template>
  <v-container fluid fill-height grid-list-xs id="outer-container">
    <v-layout row>
      <v-container fluid grid-list-md id="inner-container">
        <v-layout row>
          <input-file-panel
            :box-title="inputTitle"
            @error="handleBackendConnectionError"
          />
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
     <!-- Snackbar is displayed when connection to backend fails -->
    <v-snackbar
      :timeout="3000"
      color="error"
      v-model="snackbarIsOpen"
    >
      {{ snackbarMsg }}
      <v-btn dark flat @click.native="snackbarIsOpen = false">Close</v-btn>
    </v-snackbar>
    
    <!-- Snackbar is displayed when connection to machine learning fails -->
    <!-- <v-snackbar
      :timeout="3000"
      color="error"
      v-model="mlSnackbar"
    >
      Could not connect to machine learning server.
      <v-btn dark flat @click.native="mlSnackbar = false">Close</v-btn>
    </v-snackbar> -->
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
      transformSteps: [
        {
          type: 'transformer'
        }
      ],
      inputTitle: 'Select input file',
      beSnackbar: false,
      mlSnackbar: false,
      snackbarIsOpen: false,
    }
  },
  watch: {
    beSnackbar: function() {
      this.snackbarIsOpen = this.beSnackbar || this.mlSnackbar
    },
    mlSnackbar: function() {
      this.snackbarIsOpen = this.beSnackbar || this.mlSnackbar
    }
  },
  computed: {
    tabularAlgos() {
      return this.algos.filter(a => a.data_type === 'tabular')
    },
    snackbarMsg() {
      return ('Could not connect to '
        + (this.beSnackbar ? 'back-end' : '')
        + ((this.beSnackbar && this.mlSnackbar) ? ' or ' : '')
        + (this.mlSnackbar ? 'machine learning' : '')
        + '.')
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
        this.mlSnackbar = true 
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
    },
    handleBackendConnectionError() {
      console.log('Backend error event emitted.')
      this.beSnackbar = true
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
