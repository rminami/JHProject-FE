<template>
  <v-flex style="width: 300px;">
    <v-card :id="'card-' + stepNumber">
      <v-card-title primary-title>
        <h3 class="headline">Transformer Step {{ stepNumber }}</h3>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form>
          <p>{{ selectedAlgo.job_description }}</p>
          <v-select
            label="Select Algorithm"
            :items="algoNames"
            v-model="selectedAlgoName"
            max-height="400"
            style="white-space:nowrap; text-overflow:ellipsis;"
          ></v-select>

          <h4 v-show="showParams" class="headline">Parameters</h4>
          <div v-for="(parameter, i) in selectedAlgo.parameters" :key="i">
            <h3>{{ parameter.id }}</h3>
            <p>{{ parameter.description }}</p>
            <v-switch
              :label="parameter.required ? parameter.id + ' is required.' : 'Use ' + parameter.id + '?'"
              v-model="paramInputs[i].enabled"
              color="orange"
              v-if="!parameter.required"
            ></v-switch>
            <v-text-field
              :label="parameter.id"
              :type="paramTypeToInputType(parameter.type)"
              v-model="paramInputs[i].input"
              :rules="[() => paramInputs[i].input <= 999 || 'Value too large']"
              :hint="parameter.required ? '*required' : undefined"
              :disabled="!kfold"
            ></v-text-field>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="primary">Append</v-btn>
        <v-btn flat color="secondary">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import axios from 'axios'
import url from 'url'

const BE_ENDPOINT = 'http://127.0.0.1:4000'
const ML_ENDPOINT = 'https://to26.host.cs.st-andrews.ac.uk/JH-Project/machine-learning-api/1.0'

export default {
  props: ['stepNumber', 'algos'],
  data() {
    return {
      kfold: true,
      kValue: 0,
      speed: 20,
      cols: [],
      paramInputs: [],
      selectedAlgoName: '',
    }
  },
  watch: {
    selectedAlgo: function() {
      const paramCount = this.selectedAlgo.parameters ? this.selectedAlgo.parameters.length : 0
      let arr = []
      for (let i = 0; i < paramCount; i++) {
        arr.push({ input: '', enabled: false })
      }
      this.paramInputs = arr
    }
  },
  computed: {
    algoNames: function() {
      return this.algos ? this.algos.map(a => a.algorithm_name) : []
    },
    selectedAlgo: function() {
      if (this.algos && this.selectedAlgoName.length > 0) {
        return this.algos.filter(a => a.algorithm_name === this.selectedAlgoName)[0]
      }
      return {}
    },
    showParams: function() {
      const params = this.selectedAlgo.parameters
      return params && params.length > 0
    },
    parameters: function() {
      return this.algos
    }
  },
  methods: {
    paramTypeToInputType(paramType) {
      switch(paramType) {
        case 'integer':
          return 'number'
        default:
          return 'text'
      }
    },
  }
}
</script>
