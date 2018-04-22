<template>
  <div id="next-wrapper">
    <v-card id="next-card">
      <v-card-title primary-title>
        <div>
          <h3 class="headline">Output</h3>
        </div>
      </v-card-title>
      <v-card-text>
       
        
        <div>
          <v-btn color="primary" @click.stop="localValues.jobSubmitted = true">Run Job</v-btn>
          <v-progress-circular v-if="localValues.jobSubmitted" indeterminate :size="26" :width="3" color="primary"/>
        </div>
        <div>
          <v-btn color="normal" :disabled="!localValues.jobSubmitted" @click.stop="localValues.jobSubmitted = false">
            Cancel
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import bindMixin from '@/mixins/bindMixin'

export default {
  mixins: [bindMixin],
  data() {
    return {
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

#next-wrapper
  width: 328px
  padding: 4px 4px 4px 4px

#next-card
  width: 320px

.desc
  white-space: normal

.param-name
  margin-top: 10px
  margin-bottom: 14px

</style>
