<template>
  <div id="step-wrapper">
    <v-card id="step-card">
      <v-card-title primary-title>
        <h3 class="headline">{{ 'Estimator Step' }}</h3>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-select
            label="Select Algorithm"
            :items="jobNameList"
            v-model="localValues.name"
            max-height="400"
            style="white-space:nowrap; text-overflow:ellipsis;"
          ></v-select>
          <p class="desc">{{ selectedJob.job_description }}</p>

          <h4 v-show="showParams" class="headline">Parameters</h4>
          <v-divider v-show="showParams" class="under-headline"/>

          <div v-for="(parameter, i) in localValues.parameters" :key="i">
            <h3 class="param-name">{{ parameter.name }}</h3>
            <p class="desc">{{ parameter.info }}</p>
  
            <!-- Displays a switch, selector, or input box depending on the parameter type. -->
            <v-switch
              v-if="parameter.type === 'boolean'"
              :label="parameter.name"
              v-model="parameter.value"
              :hint="parameter.required ? '*required' : undefined"
              :disabled="!parameter.enabled"
            ></v-switch>
            <v-select
              v-else-if="parameter.type === 'select'"
              :label="parameter.name"
              v-model="parameter.value"
              :items="parameter.default.trim().split('|')"
              :hint="parameter.required ? '*required' : undefined"
              :disabled="!parameter.enabled"
              max-height="400"
              style="white-space:nowrap; text-overflow:ellipsis;"
            ></v-select>
            <v-text-field
              v-else
              :label="parameter.name"
              :type="parameter.htmlType"
              :step="parameter.htmlStep"
              v-model="parameter.value"
              :hint="parameter.required ? '*required' : undefined"
              :disabled="!parameter.enabled"
            ></v-text-field>
          </div>

          <!-- <div v-if="showHyperParams">
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
          </div> -->
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
import localValues from '@/mixins/localValues'
import jobNameList from '@/mixins/jobNameList'

export default {
  props: ['index', 'jobs', 'values'],
  mixins: [localValues, jobNameList],
}
</script>

<style lang="stylus" scoped>

#step-wrapper
  width: 328px
  padding: 4px 4px 4px 4px

#step-card
  width: 320px

.desc
  white-space: normal

.under-headline
  margin-bottom: 20px

.param-name
  margin-top: 10px
  margin-bottom: 14px

</style>