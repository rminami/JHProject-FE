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

          <h4 v-show="showParams" class="headline">Hyperparameters</h4>
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
        </v-form>
      </v-card-text>
      <v-card-actions>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import localValues from '@/mixins/localValues'
import jobNameList from '@/mixins/jobNameList'

export default {
  props: ['index', 'jobs', 'values'],
  mixins: [localValues, jobNameList]
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
