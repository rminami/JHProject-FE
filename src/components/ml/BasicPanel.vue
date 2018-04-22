<template>
  <div id="step-wrapper">
    <v-card id="step-card">
      <v-card-title primary-title>
        <h3 class="headline">Choose algorithm</h3>
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
        </v-form>
      </v-card-text>
      <v-card-actions>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import localValues from '@/mixins/localValues'

export default {
  props: ['jobs'],
  mixins: [localValues],
  data() {
    return {
      index: 0
    }
  },
  computed: {
    selectedJob() {
      if (!this.jobs || this.localValues.name.length === 0) {
        this.localValues.parameters = []
        return {}
      }
      // Both transformers and estimators have
      const newSelectedJob = this.jobs.filter(a => a.name === this.localValues.name)[0]

      this.localValues.job_id = newSelectedJob.job_id
      this.localValues.parameters = newSelectedJob.parameters
      .map(param => ({
        /**
         * The following fields _cannot_ be changed by the user.
         * Fields are copied to component-specific object for easy retrival.
         */
        name: param.name,
        type: param.type,
        info: param.info,
        default: param.value,

        /**
         * 'required' field is not in the protocol, but maybe it should be.
         * Boolean() ensures that it is set to false if undefined.
         */
        required: Boolean(param.required),

        /**
         * The following fields _can_ be changed by the user.
         * This initializes the value to default value specified by the
         * machine learning server, but it can be freely changed since the same
         * value is stored in the 'default' field as well.
         */
        value: param.value,

        /**
         * The following fields are used for generating the HTML input, and
         * correspond to the 'type' and 'step' attributes in the <input> tag.
         */
        htmlType: this.paramTypeToHtmlType(param.type),
        htmlStep: this.paramTypeToHtmlStep(param.type),

        /**
         * If set to false, the default value is sent instead of the user
         * specified value.
         */
        enabled: true
      }))
      return newSelectedJob
    },
    showParams() {
      const params = this.localValues.parameters
      return params && params.length > 0
    },
    jobNameList() {
      try {
        return this.jobs.map(a => a.name)
      } catch (err) {
        return []
      }
    }
  }
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
