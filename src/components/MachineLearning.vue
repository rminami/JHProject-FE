<template>
<div>
  <v-container fluid fill-height grid-list-xs style="padding-left: 0">
    <v-layout row>
      <v-container fluid grid-list-md>
        <v-layout row>
          <input-file-panel :box-title="inputTitle"/>
          <transformer-panel step-number="1" :algos="tabularAlgos"/>
          <transformer-panel step-number="2" :algos="tabularAlgos"/>
          <v-btn color="primary" fab dark style="margin-top: 80px;">
            <v-icon>add</v-icon>
          </v-btn>
          <next-panel/>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import axios from 'axios'
import url from 'url'

import MLBox from './ml/MLBox'
import InputFilePanel from './ml/InputFilePanel'
import EstimatorPanel from './ml/EstimatorPanel'
import TransformerPanel from './ml/TransformerPanel'
import NextPanel from './ml/NextPanel'


const BE_ENDPOINT = 'http://127.0.0.1:4000'
const ML_ENDPOINT = 'http://127.0.0.1:7000'

export default {
  components: {
    'ml-box': MLBox,
    'input-file-panel': InputFilePanel,
    'next-panel': NextPanel,
    'estimator-panel': EstimatorPanel,
    'transformer-panel': TransformerPanel,

  },
  computed: {
    
  },
  data() {
    return {
      algos: [],
      currentJobSteps: [
        {
          type: 'InputFile'
        }
      ],
      items: [
        { title: 'Dashboard', icon: 'dashboard' },
        { title: 'Account', icon: 'account_box' },
        { title: 'Admin', icon: 'gavel' }
      ],
      inputTitle: 'Select input file'
    }
  },
  computed: {
    tabularAlgos: function() {
      return this.algos.filter(a => a.data_type === 'tabular')
    }
  },
  methods: {
    getAlgos() {
      axios({
        url: url.resolve(ML_ENDPOINT, '/jobs'),
        responseType: 'json',
      })
      .then(res => {
        const jobs = res.data.jobs
        this.algos = jobs
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.getAlgos()
  },
}
</script>
