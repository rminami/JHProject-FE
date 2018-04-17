<template>
  <v-container fluid fill-height grid-list-xs id="outer-container">
    <v-layout row>
      <v-container fluid grid-list-md id="inner-container">
        <v-layout row>
          <input-file-panel
            :adv-enabled="advEnabled"
            :values="inputs"
            @adv-toggle="toggleAdvOptions"
            @change="handleInputChange"
            @error="beConnected = false"
          />

          <!-- Components for advanced mode -->
          <transformer-panel
            v-show="advEnabled"
            v-for="(transformer, index) in transformers"
            :key="index"
            :index="index"
            :jobs="transformerJobs"
            :values="transformer"
            @change="handleTransformChange"
            @append="appendTransformer"
            @remove="removeTransformer"
          />
          <!-- A floating button to add more transformer steps is shown when
          the advanced options are enabled. -->
          <v-btn
            v-show="advEnabled"
            id="add-step-btn"
            color="primary white--text"
            fab
            @click="addTransformStep"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <estimator-panel
            v-show="advEnabled"
            :index="transformers.length"
            :jobs="estimatorJobs"
            @change="handleEstimatorChange"
          />
          <!-- Components for basic mode -->
          <basic-panel
            v-show="!advEnabled"
            :jobs="basicJobs"
            @change="handleBasicChange"
          />
          <next-panel
            :values="extras"
            :adv-enabled="advEnabled"
            @change="handleNextPanelChange"
          />
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

import BasicPanel from './ml/BasicPanel'
import InputFilePanel from './ml/InputFilePanel'
import EstimatorPanel from './ml/EstimatorPanel'
import TransformerPanel from './ml/TransformerPanel'
import NextPanel from './ml/NextPanel'


export default {
  components: {
    'basic-panel': BasicPanel,
    'input-file-panel': InputFilePanel,
    'next-panel': NextPanel,
    'estimator-panel': EstimatorPanel,
    'transformer-panel': TransformerPanel
  },
  data() {
    return {
      basicJobs: undefined,
      transformerJobs: undefined,
      estimatorJobs: undefined,
      basic: {
        name: '',
        parameters: []
      },
      transformers: [
        {
          name: '',
          parameters: []
        }
      ],
      estimator: {
        name: '',
        parameters: {},
      },
      inputs: {
        inputFile: '',
        inputCols: [],
        outputCols: []
      },
      extras: {
        k: '',
        outputPath: '/models',
        dropMissing: undefined
      },
      beConnected: true,
      mlConnected: true,
      advEnabled: false,
      snackbarIsOpen: false
    }
  },
  computed: {
    mlRequest() {
      if (this.advEnabled) {
        return {
          transformers: this.transformers.map(transformer => ({
            name: transformer.name,
            parameters: transformer.parameters.map(param => ({
              name: param.name,
              type: param.type,
              value: param.enabled ? param.value : param.default
            }))
          })),
          estimator: {
            name: this.estimator.name,
            parameters: this.estimator.parameters.map(param => ({
              name: param.name,
              type: param.type,
              value: param.enabled ? param.value : param.default
            }))
          },
          // TODO from here
          extras: {
            k: 0,
            splitRatio: 0.5
          },
          // This is done
          input_columns: this.inputs.inputCols.map(col => ({
            column_index: col.index,
            column_type: 'discrete'
          })),
          output_columns: this.inputs.outputCols.map(col => ({
            column_index: col.index,
            column_type: 'discrete'
          })),
        }
      } else {
        // Basic mode
        const basicParameters = {}
        this.basic.parameters.map(param => {
          basicParameters[param.name] = param.value
        })
        return {
          refresh_token: 'abc123',
          job_id: this.basic.job_id,
          training_data: {
            id: 'id1234',
            path: this.inputs.inputFile,
            project_name: 'project456'
          },
          input_columns: this.inputs.inputCols.map(col => ({
            column_index: col.index,
            column_type: 'discrete'
          })),
          output_columns: this.inputs.outputCols.map(col => ({
            column_index: col.index,
            column_type: 'discrete'
          })),
          parameters: basicParameters,
          output_directory_path: this.extras.outputPath
        }
      }
    },
    /**
     * The message shown on the snackbar is changed depending on whether or not
     * the connection to the backend server fails, the connection to the machine
     * learning server fails, or both.
     */
    snackbarMsg() {
      return `${`Could not connect to
        ${this.beConnected ? '' : 'backend'}
        ${(this.beConnected || this.mlConnected) ? '' : ' or '}
        ${this.mlConnected ? '' : 'machine learning server'}`
      .trim()}.`
    },
    /**
     * Retrieves the backend and machine learning endpoints from Vuex
     * centralized state.
     */
    ...mapState({
      beEndpoint: s => s.beEndpoint,
      mlEndpoint: s => s.mlEndpoint
    })
  },
  watch: {
    /**
     * snackbarIsOpen is updated everytime beConnected or mlConnect is changed;
     * that is, whenever either a connection to backend or the machine learning
     * server fails.
     *
     * This cannot be a computed property, as it must be set to
     * false after the snackbar has been displayed for a certain amount of time.
     */
    beConnected() {
      this.snackbarIsOpen = !this.beConnected || !this.mlConnected
    },
    mlConnected() {
      this.snackbarIsOpen = !this.beConnected || !this.mlConnected
    }
  },
  methods: {
    /**
     * Retrieves a list of jobs available on the machine learning server.
     *
     * @see https://github.com/CS3099JH2017/cs3099jh/blob/master/protocols/ML01.md#listing-available-jobs
     * for the protocol.
     */
    getJobs() {
      axios({
        method: 'get',
        baseURL: this.mlEndpoint,
        url: '/jobs',
        responseType: 'json'
      })
      .then(res => {
        /**
         * First, the jobs are filtered so that only those fit for use with
         * tabular data are included.
         *
         * Then, the job object received from this endpoint is reformatted to
         * comply with ML Group 7's protocol.
         */
        this.basicJobs = res.data.data.jobs
        .filter(job => job.data_type === 'tabular')
        .map(job => ({
          name: job.algorithm_name, // algorithm_name is changed to name
          job_description: job.job_description,
          job_id: job.job_id,
          parameters: job.parameters.map(param => ({
            name: param.id,
            // description is changed to info (actually, 'description' might be better)
            info: param.description,
            type: param.type,
            required: param.required
          })),
          partial_training_support: job.partial_training_support
        }))
      })
      .catch(err => {
        this.mlConnected = false
        console.log(err)
      })
    },
    /**
     * Retrieves a list of transformer jobs available on the machine learning
     * server. This functionality is not part of the basic specifications.
     *
     * @see https://app.swaggerhub.com/apis/syzroy/ML7-API/1.1#/algorithms/transformers
     * for the protocol.
     */
    getTransformers() {
      if (!this.advEnabled) {
        return
      }
      axios({
        method: 'get',
        baseURL: this.mlEndpoint,
        url: '/transformers',
        responseType: 'json'
      })
      .then(res => {
        this.transformerJobs = res.data.data.jobs
      })
      .catch(err => {
        this.mlConnected = false
        console.log('Could not retrieve transformers.')
        console.log(err)
      })
    },
    /**
     * Retrieves a list of estimator jobs available on the machine learning
     * server. This functionality is not part of the basic specifications.
     *
     * @see https://app.swaggerhub.com/apis/syzroy/ML7-API/1.1#/algorithms/estimators
     * for the protocol.
     */
    getEstimators() {
      if (!this.advEnabled) {
        return
      }
      axios({
        method: 'get',
        baseURL: this.mlEndpoint,
        url: '/estimators',
        responseType: 'json'
      })
      .then(res => {
        console.log(res.data)
        this.estimatorJobs = res.data.data.jobs
      })
      .catch(err => {
        this.mlConnected = false
        console.log('Could not retrieve estimators.')
        console.log(err)
      })
    },
    /**
     * Concatinates a new transformer step to the end of the list.
     */
    addTransformStep() {
      this.transformers.push({ selected: '', parameters: {} })
    },
    /**
     * Appends a new transformer step right after the step where the
     * append event came from.
     *
     * @param {number} index - The index of the step to append to.
     */
    appendTransformer(index) {
      this.transformers = [
        ...this.transformers.slice(0, index + 1),
        { name: '', parameters: {} },
        ...this.transformers.slice(index + 1)
      ]
    },
    /**
     * Updates the transformers list in this component. It is triggered whenever
     * a transfomer algorithm or parameter is changed.
     *
     * @param {Object} newTransformer - An object representing the updated step.
     * @param {number} index - The index of the updated step.
     */
    handleTransformChange(newTransformer, index) {
      this.transformers = [
        ...this.transformers.slice(0, index),
        newTransformer,
        ...this.transformers.slice(index + 1)
      ]
    },
    /**
     * Removes a step from the transformers list.
     *
     * @param {number} indexToRemove - The index of the step to remove.
     */
    removeTransformer(indexToRemove) {
      this.transformers = this.transformers.filter((step, index) => (
        index !== indexToRemove
      ))
    },
    handleEstimatorChange(newEstimatorJob) {
      this.estimator = newEstimatorJob
    },
    handleBasicChange(newBasicJob) {
      this.basic = newBasicJob
    },
    handleInputChange(newInputs) {
      this.inputs = newInputs
    },
    handleNextPanelChange(newExtras) {
      this.extras = newExtras
    },
    /**
     * This function is called whenever the advanced options switch is toggled.
     *
     * The frontend tries to retrieve a list of available transformer and
     * estimator jobs from the machine learning server when advanced options are
     * enabled.
     *
     * @param {boolean} toggleTo - The value the switch was toggled to.
     */
    toggleAdvOptions(toggleTo) {
      this.advEnabled = toggleTo
      if (this.advEnabled) {
        this.getTransformers()
        this.getEstimators()
      }
    }
  },
  /**
   * This function is run when the component is created i.e. when the machine
   * learning page is loaded. It retrieves all of the information needed to
   * populate the machine learning console.
   */
  created() {
    this.getJobs()
    if (this.advEnabled) {
      this.getTransformers()
      this.getEstimators()
    }
  }
}
</script>

<style lang="stylus" scoped>
#outer-container {
  overflow: auto;
  white-space: nowrap;
  background: #a3e2dd;
}

#inner-container {
  margin-top: 0px;
}

#add-step-btn {
  margin-top: 80px;
}
</style>
