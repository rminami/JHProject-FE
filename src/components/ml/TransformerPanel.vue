<template>
  <div id="step-wrapper">
    <v-card id="step-card">
      <v-card-title primary-title>
        <h3 class="headline">Transformer Step {{ index + 1 }}</h3>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('remove', index)">
          <v-icon>close</v-icon>
        </v-btn>
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
  
            <!-- If the parameter type is a boolean, a switch is shown; otherwise, and input box is shown.  -->
            <v-switch
              v-if="parameter.type === 'boolean'"
              :label="parameter.name"
              v-model="parameter.value"
              :hint="parameter.required ? '*required' : undefined"
              :disabled="!parameter.enabled"
            ></v-switch>
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
        <v-btn flat color="primary" @click="$emit('append', index)">Append</v-btn>
        <v-btn flat color="secondary" @click="$emit('remove', index)">Close</v-btn>
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
  // data() {
  //   return {
  //     localValues: {
  //       name: '',
  //       parameters: []
  //     },
  //   }
  // },
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