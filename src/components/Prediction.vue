<template>
  <v-container fluid fill-height grid-list-xs id="outer-container">
    <v-layout row>
      <v-container fluid grid-list-md id="inner-container">
        <v-layout row>
          <prediction-model
            :values="models"
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
            @submit="requestPrediction"
          />
        </v-layout>
      </v-container>
    </v-layout>
    <v-dialog v-model="fileDialogIsOpen" max-width="500px" scrollable>
      <file-dialog
        :initialPath="`/projects/${this.currentProject}/files`"
        :mode="fileDialogMode"
        @select="selectInputFile"
        @close="fileDialogIsOpen = false"
      />
    </v-dialog>
    <v-snackbar
      :timeout="3000"
      :color="snackbar.color"
      v-model="snackbar.isOpen"
    >
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.isOpen = false">Close</v-btn>
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
import FileDialog from './dialogs/FileDialog'


export default {
  components: {
    'file-dialog': FileDialog,
    'prediction-model': PredictionModel,
    'prediction-input-file': PredictionInputFile,
    'prediction-next': PredictionNext
  },
  data() {
    return {
      models: {
        modelList: [],
        selectedModel: ''
      },
      inputs: {
        inputFile: '',
        inputCols: [],
        outputCols: [],
        advEnabled: false
      },
      extras: {
        submitted: false
      },
      snackbar: {
        text: '',
        color: '',
        isOpen: false
      },
      beConnected: true,
      mlConnected: true,
      snackbarIsOpen: false,
      snackbarMsg: '',
      fileDialogIsOpen: false,
      fileDialogMode: 'csv'
    }
  },
  computed: {
    requestData() {
      return {
        data_file: {
          // id: 1,
          id: this.inputs.inputFile,
          path: this.inputs.inputFile,
          project_name: this.currentProject
        },
        input_columns: this.inputs.inputCols.map(col => ({
          column_index: col.index,
          column_type: 'discrete' // TODO stop hardcoding this
        }))
      }
    },
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
  created() {
    axios({
      method: 'get',
      baseURL: this.mlEndpoint,
      url: path.join('models', this.currentProject),
      responseType: 'json',
    })
    .then(res => {
      this.models.modelList = res.data.data
    })
    .catch(err => {
      this.mlConnected = false
      setTimeout(() => {
        this.snackbar.text = this.connectionErrorMsg
        this.snackbar.color = 'error'
        this.snackbar.isOpen = true
      }, 0)
    })
  },
  methods: {
    requestPrediction() {
      axios({
        method: 'post',
        baseURL: this.mlEndpoint,
        url: path.join('models/prediction', this.currentProject, this.models.selectedModel),
        data: this.requestData,
      })
      .then(res => {
        this.snackbar.text = 'Prediction request successfully sent.'
        this.snackbar.color = 'success'
        this.snackbar.isOpen = true
      })
      .catch(err => {
        this.snackbar.text = 'Prediction request could not be sent.'
        this.snackbar.color = 'error'
        this.snackbar.isOpen = true
      })
    },
    handleModelChange(newModels) {
      this.models = newModels
    },
    /**
     * If the advanced options switch is switched on, the frontend tries to
     * retrieve a list of available transformer and estimator jobs from the
     * machine learning server when advanced options are enabled.
     */
    handleInputChange(newInputs) {
      this.inputs = newInputs
    },
    selectInputFile(inputFilePath) {
      this.inputs.inputFile = inputFilePath
      this.fileDialogIsOpen = false
    },
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
