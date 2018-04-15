<template>
  <div id="transformer-flex">
    <v-card id="transformer-card">
      <v-card-title primary-title>
        <h3 class="headline">{{ advEnabled ? 'Estimator Step' : 'Select algorithm' }}</h3>
      </v-card-title>
      <v-card-text>
        <v-form>
          <p class="desc">{{ selectedAlgo.job_description }}</p>
          <v-select
            label="Select Algorithm"
            :items="algoNames"
            v-model="selectedAlgoName"
            max-height="400"
            style="white-space:nowrap; text-overflow:ellipsis;"
          ></v-select>

          <div v-if="showParams">
            <h4 class="headline">Parameters</h4>
            <div v-for="(parameter, i) in selectedAlgo.parameters" :key="i">
              <h3>{{ parameter.id }}</h3>
              <p class="desc">{{ parameter.description }}</p>
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
          </div>

          <div v-if="showHyperParams">
            <h4 class="headline">Hyper Parameters</h4>
            <div v-for="(hyperParameter, i) in selectedAlgo.hyper_parameters" :key="i">
              <h3>{{ hyperParameter.id }}</h3>
              <p class="desc">{{ hyperParameter.description }}</p>
              <v-switch
                :label="hyperParameter.required ? hyperParameter.id + ' is required.' : 'Use ' + hyperParameter.id + '?'"
                v-model="hyperParamInputs[i].enabled"
                color="orange"
                v-if="!hyperParameter.required"
              ></v-switch>
              <v-text-field
                :label="hyperParameter.id"
                :type="paramTypeToInputType(hyperParameter.type)"
                v-model="hyperParamInputs[i].input"
                :hint="hyperParameter.required ? '*required' : undefined"
                :disabled="!hyperParamInputs[i].enabled"
              ></v-text-field>
            </div>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="primary" @click="() => 0">Append</v-btn>
        <v-btn flat color="secondary" @click="() => 0">Close</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ['index', 'algos', 'advEnabled'],
  data() {
    return {
      kfold: true,
      kValue: 0,
      speed: 20,
      cols: [],
      paramInputs: [],
      hyperParamInputs: [],
      selectedAlgoName: '',
    }
  },
  watch: {
    selectedAlgo: function() {
      // Generates parameter form
      const paramCount = this.selectedAlgo.parameters ? this.selectedAlgo.parameters.length : 0
      const hyperParamCount = this.selectedAlgo.hyper_parameters ? this.selectedAlgo.hyper_parameters.length : 0
      let paramArr = []
      let hyperParamArr = []
      for (let i = 0; i < paramCount; i++) {
        paramArr.push({ input: '', enabled: true })
      }
      for (let i = 0; i < hyperParamCount; i++) {
        hyperParamArr.push({ input: '', enabled: true })
      }
      this.paramInputs = paramArr
      this.hyperParamInputs = hyperParamArr
      // Sends event to parent
      this.$emit('change', this.selectedAlgoName, this.index)
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
    showHyperParams: function() {
      const hyperParams = this.selectedAlgo.hyper_parameters
      return hyperParams && hyperParams.length > 0
    }
  },
  methods: {
    paramTypeToInputType(paramType) {
      switch(paramType) {
        case 'integer':
        case 'float':
          return 'number'
        default:
          return 'text'
      }
    },
  }
}
</script>

<style lang="stylus" scoped>

#transformer-flex
  width: 328px
  padding: 4px 4px 4px 4px

#transformer-card
  width: 320px

.desc
  white-space: normal

</style>
