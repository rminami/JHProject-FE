<template>
  <div id="next-wrapper">
    <v-card id="next-card">
      <v-card-title primary-title>
        <div>
          <h3 class="headline">Output</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-if="advEnabled">
          <h3 class="param-name">k Value</h3>
          <p class="desc">Value of k for k-fold cross validation</p>
          <v-text-field
            label="k"
            type="number"
            v-model="localValues.k"
            :rules="[rules.required]"
            hint="*required"
          ></v-text-field>
        </div>
        <div>
          <h3 class="param-name">Output path</h3>
          <v-text-field
            label="Output Path"
            type="text"
            v-model="localValues.outputPath"
            hint="*required"
            append-icon="create"
            :append-icon-cb="() => $emit('fileDialog', 'directory')"
            :rules="[rules.required]"
          ></v-text-field>
        </div>
        <div v-if="advEnabled">
          <h3 class="param-name">Split ratio</h3>
          <p class="desc">Ratio of training rows to total rows</p>
          <v-slider
            v-model="localValues.splitRatio"
            thumb-label
            min="0"
            max="1"
            step="0.01"        
          />
        </div>
        <div v-if="advEnabled">
          <v-checkbox
            label="Drop missing values"
            v-model="localValues.dropMissing"
            color="primary"
          ></v-checkbox>
        </div>
        
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
  props: ['advEnabled'],
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
