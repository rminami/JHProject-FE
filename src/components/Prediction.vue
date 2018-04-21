<template>
  <v-container fluid fill-height grid-list-xs id="outer-container">
    <v-layout row>
      <v-container fluid grid-list-md id="inner-container">
        <v-layout row>
          <div id="model-flex">
            <v-card id="model-card">
              <v-card-title primary-title>
                <div>
                  <h3 id="model-title" class="headline">Model Overview</h3>
                </div>
              </v-card-title>
              <v-card-text>

              </v-card-text>
              <v-card-actions>
                <v-btn flat color="primary">Preview</v-btn>
                <v-btn flat color="primary">Edit</v-btn>
              </v-card-actions>
            </v-card>
            <v-dialog v-model="fileDialogOpen" max-width="500px" scrollable>
              <input-file-dialog @close="fileDialogOpen = false"/>
            </v-dialog>
          </div>
          <input-file-panel
            :values="inputs"
            @change="handleInputChange"
            @error="beConnected = false"
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

import InputFilePanel from './ml/InputFilePanel'
import NextPanel from './ml/NextPanel'


export default {
  components: {
    'input-file-panel': InputFilePanel,
    'next-panel': NextPanel
  },
  data() {
    return {
      inputs: {
        inputFile: 'processed-data.csv',
        inputCols: [],
        outputCols: [],
        advEnabled: false
      },
      beConnected: true,
      mlConnected: true,
      snackbarIsOpen: false,
      snackbarMsg: ''
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
      this.snackbarMsg = this.connectionErrorMsg
      this.snackbarIsOpen = !this.beConnected || !this.mlConnected
    },
    mlConnected() {
      this.snackbarMsg = this.connectionErrorMsg
      this.snackbarIsOpen = !this.beConnected || !this.mlConnected
    },
    /**
     * Sends a request to train a model on the machine learning server.
     *
     * This function ensures that no request is made when the run job is
     * unselected, and makes sure that the request is made in the correct form
     * depending on whether or not the console is in basic or advanced mode.
     */
    jobSubmitted() {
      if (this.jobSubmitted) {
        console.log(this.requestData)
        if (this.advEnabled) {
          this.requestAdvancedJob()
        } else {
          this.requestBasicJob()
        }
      }
    }
  },
  methods: {

    /**
     * Sends a request to the machine learning server for a model to be trained
     * according to the basic machine learning protocol.
     * (Why is this path called '/models'?)
     */
    requestBasicJob() {
      axios({
        method: 'post',
        baseURL: this.mlEndpoint,
        url: '/models',
        responseType: 'json',
        data: this.requestData,
        // TODO get actual bearer token
        headers: {
          Authorization: 'Bearer 12345',
          'Cache-Control': 'no-cache',
          'Postman-Token': 'c2598d64-503b-4d2e-8f11-b38772d65dba'
        }
        // headers: {
        //   'Authorisation': 'Bearer YES',
        //   'Authorization': 'Bearer YES'
        // }
      })
      .then(res => {
        console.log('Advanced ML job successfully started!')
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
      this.inputs = newInputs
      if (newInputs.advEnabled) {
        this.getTransformers()
        this.getEstimators()
      }
    },
    handleNextPanelChange(newExtras) {
      this.extras = newExtras
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
