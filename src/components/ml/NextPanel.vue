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
          <h3>k Value</h3>
          <p class="desc">Value of k for k-fold cross validation</p>
          <v-text-field
            label="k"
            type="number"
            v-model="k"
            :rules="[() => k <= 999 || 'Value too large']"
            hint="*required"
          ></v-text-field>
          <v-checkbox
            label="Drop missing values"
            v-model="dropMissing"
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
  </div>
</template>

<script>

export default {
  props: ['advEnabled'],
  data() {
    return {
      jobSubmitted: false,
      k: '',
      dropMissing: true,
    }
  },
  watch: {
    
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>


#next-wrapper
  width: 328px
  padding: 4px 4px 4px 4px

#next-card
  width: 320px

</style>
