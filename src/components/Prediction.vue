<template>
  <v-container fluid fill-height grid-list-xs id="outer-container">
    <v-layout row>
      <v-container fluid grid-list-md id="inner-container">
        <v-layout row>
          <prediction-model
            :values="predictionModels"
            @change="handleModelChange"
            @error="mlConnected = false"
          />
          <prediction-input-file
            :values="inputs"
            @fileDialog="fileDialogIsOpen = true"
            @change="handleInputChange"
            @error="beConnected = false"
          />
          <prediction-next
            :values="extras"
          />
        </v-layout>
      </v-container>
    </v-layout>
    <v-dialog v-model="fileDialogIsOpen" max-width="500px" scrollable>
      <file-dialog
        :initialPath="`/projects/${this.currentProject}/files`"
        :mode="fileDialogMode"
        @select="() => 0"
        @close="fileDialogIsOpen = false"
      />
    </v-dialog>
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
import path from 'path'

import PredictionModel from './prediction/PredictionModel'
import PredictionInputFile from './prediction/PredictionInputFile'
import PredictionNext from './prediction/PredictionNext'

import InputFilePanel from './ml/InputFilePanel'
import NextPanel from './ml/NextPanel'

import FileDialog from './dialogs/FileDialog'


export default {
  components: {
    'input-file-panel': InputFilePanel,
    'next-panel': NextPanel,
    'file-dialog': FileDialog,
    'prediction-model': PredictionModel,
    'prediction-input-file': PredictionInputFile,
    'prediction-next': PredictionNext
  },
  data() {
    return {
      predictionModels: {
        selectedModelName: '',
        models: [
          {
            expanded: false,
            job_id: 'job123',
            model_id: 'model1234',
            status: 'complete',
            description: 'This model does stuff',
            percent_trained: 1,
            start_time: new Date(),
            started_by: 'admin'
          },
          {
            expanded: false,
            job_id: 'some_job',
            model_id: 'some_model',
            status: 'complete',
            description: 'This model does stuff',
            percent_trained: 1,
            start_time: new Date(),
            started_by: 'rm264'
          },
          {
            expanded: false,
            job_id: 'job456',
            model_id: 'model4567',
            status: 'running',
            description: 'This model is good',
            percent_trained: 0.78,
            start_time: new Date(),
            started_by: 'user1'
          },
          {
            expanded: false,
            job_id: 'job789',
            model_id: 'model09834',
            status: 'failed',
            description: 'This model is useless',
            percent_trained: 0,
            start_time: new Date(),
            started_by: 'user2'
          }
        ],
      },
      inputs: {
        inputFile: 'processed-data.csv',
        inputCols: [],
        outputCols: [],
        advEnabled: false
      },
      extras: {
        jobSubmitted: false
      },
      beConnected: true,
      mlConnected: true,
      snackbarIsOpen: false,
      snackbarMsg: '',
      fileDialogIsOpen: false,
      fileDialogMode: ''
    }
  },
  computed: {
    
    /**
     * The message shown on the snackbar is changed depending on whether or not
     * the connection to the backend server fails, the connection to the machine
     * learning server fails, or both.
     */
    connectionErrorMsg() {
      return `${`Could not connect to
        ${this.beConnected ? '' : 'backend'}
        ${(this.beConnected || this.mlConnected) ? '' : ' or '}
        ${this.mlConnected ? '' : 'machine learning server'}`
      .trim()}.`
    },
    /**
     * This computed property needs to be declared so that we can set up a
     * watcher on it.
     */
    jobSubmitted() {
      return this.extras.jobSubmitted
    },
    /**
     * Retrieves the backend and machine learning endpoints from Vuex
     * centralized state.
     */
    ...mapState({
      beEndpoint: s => s.beEndpoint,
      mlEndpoint: s => s.mlEndpoint,
      currentProject: s => s.currentProject
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
      this.snackbarMsg = this.connectionErrorMsg
      this.snackbarIsOpen = !this.beConnected || !this.mlConnected
    },
    mlConnected() {
      this.snackbarMsg = this.connectionErrorMsg
      this.snackbarIsOpen = !this.beConnected || !this.mlConnected
    }
  },
  methods: {
    handleModelChange() {

    },
    /**
     * Sends a request to the machine learning server for a model to be trained
     * according to the basic machine learning protocol.
     * (Why is this path called '/models'?)
     */
    requestJob() {
      axios({
        method: 'post',
        baseURL: this.mlEndpoint,
        url: path.join('projects', this.currentProject, 'models'),
        responseType: 'json',
        data: this.requestData,
        headers: {
          'Authorization': 'Bearer 12345',
        }
      })
      .then(res => {
        console.log('Training successfully started!')
        console.log(res.data)
      })
      .catch(err => {
        this.snackbarIsOpen = true
        this.snackbarMsg = 'Machine learning job could not be started.'
        this.extras.jobSubmitted = false
        console.log(err)
      })
    },
   
    /**
     * If the advanced options switch is switched on, the frontend tries to
     * retrieve a list of available transformer and estimator jobs from the
     * machine learning server when advanced options are enabled.
     */
    handleInputChange(newInputs) {
    }
  },
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
