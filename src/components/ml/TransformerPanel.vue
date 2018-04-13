<template>
  <v-flex id="transformer-flex">
    <v-card id="transformer-card">
      <v-card-title primary-title>
        <h3 class="headline">Transformer Step {{ index + 1 }}</h3>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('remove', index)">
          <v-icon>close</v-icon>
        </v-btn>
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

          <h4 v-show="showParams" class="headline">Parameters</h4>
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
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="primary" @click="$emit('append', index)">Append</v-btn>
        <v-btn flat color="secondary" @click="$emit('remove', index)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  props: ['index', 'algos'],
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
      // Generates parameter form
      const paramCount = this.selectedAlgo.parameters ? this.selectedAlgo.parameters.length : 0
      let arr = []
      for (let i = 0; i < paramCount; i++) {
        arr.push({ input: '', enabled: false })
      }
      this.paramInputs = arr
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

<style scoped>
#transformer-flex {
  width: 328px;
}

#transformer-card {
  width: 320px;
}

.desc {
  white-space: normal;
}
</style>
