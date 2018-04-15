<template>
  <div id="transformer-flex">
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
            v-model="tvalues.name"
            max-height="400"
            style="white-space:nowrap; text-overflow:ellipsis;"
          ></v-select>

          <h4 v-show="showParams" class="headline">Parameters</h4>
          <div v-for="(parameter, i) in tvalues.parameters" :key="i">
            <h3>{{ parameter.name }}</h3>
            <p class="desc">{{ parameter.description }}</p>
            <v-switch
              :label="parameter.required ? parameter.name + ' is required.' : 'Use ' + parameter.name + '?'"
              v-model="parameter.enabled"
              color="orange"
              v-if="!parameter.required"
            ></v-switch>
            <v-text-field
              :label="parameter.name"
              :type="paramTypeToInputType(parameter.type)"
              v-model="parameter.value"
              :hint="parameter.required ? '*required' : undefined"
              :disabled="!parameter.enabled"
            ></v-text-field>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="primary" @click="$emit('append', index)">Append</v-btn>
        <v-btn flat color="secondary" @click="$emit('remove', index)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ['index', 'algos', 'values'],
  data() {
    return {
      tvalues: {
        name: '',
        parameters: []
      },
    }
  },
  
  computed: {
    algoNames: function() {
      return this.algos ? this.algos.map(a => a.algorithm_name) : []
    },
    selectedAlgo: function() {
      if (!this.algos || this.tvalues.name.length === 0) {
        this.tvalues.parameters = []
        return {}
      }
      const newSelectedAlgo = this.algos.filter(a => a.algorithm_name === this.tvalues.name)[0]
      this.tvalues.parameters = newSelectedAlgo.parameters
        .map(param => ({
          name: param.id,
          type: param.type,
          description: param.description,
          value: '',
          required: param.required,
          enabled: true
        }))
      return newSelectedAlgo
    },
    showParams: function() {
      const params = this.tvalues.parameters
      return params && params.length > 0
    },
  },
  
  watch: {
    values: {
      handler: function() {
        this.tvalues = this.values
      },
      deep: true
    },
    tvalues: {
      handler: function() {
        this.$emit('change', this.tvalues, this.index)
      },
      deep: true
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

<style scoped>
#transformer-flex {
  width: 328px;
  padding: 4px 4px 4px 4px;
}

#transformer-card {
  width: 320px;
}

.desc {
  white-space: normal;
}
</style>
