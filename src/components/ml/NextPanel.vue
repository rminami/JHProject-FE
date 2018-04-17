<template>
  <div id="next-wrapper">
    <v-card id="next-card">
      <v-card-title primary-title>
        <div>
          <h3 class="headline">Next</h3>
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
            :append-icon-cb="() => { fileDialogOpen = !fileDialogOpen }"
            :rules="[rules.required]"
          ></v-text-field>
        </div>
        <div v-if="advEnabled">
          <v-checkbox
            label="Drop missing values"
            v-model="localValues.dropMissing"
            color="primary"
          ></v-checkbox>
        </div>
        <div>
          <v-btn color="primary" @click.stop="jobSubmitted = true">Run Job</v-btn>
          <v-progress-circular v-if="jobSubmitted" indeterminate :size="26" :width="3" color="primary"></v-progress-circular>
        </div>
        <div>
          <v-btn color="normal" :disabled="!jobSubmitted" @click.stop="jobSubmitted = false">Cancel</v-btn>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog v-model="fileDialogOpen" max-width="500px" scrollable>
      <input-file-dialog @close="fileDialogOpen = false"/>
    </v-dialog>
  </div>
</template>

<script>
import InputFileDialog from '../dialogs/InputFileDialog'
import bindMixin from '@/mixins/bindMixin'

export default {
  props: ['advEnabled'],
  mixins: [bindMixin],
  components: {
    'input-file-dialog': InputFileDialog
  },
  data() {
    return {
      jobSubmitted: false,
      fileDialogOpen: false,
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
