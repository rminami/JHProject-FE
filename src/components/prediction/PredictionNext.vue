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
          <v-btn color="primary" @click="submitted = true; $emit('submit')">Predict</v-btn>
          <v-progress-circular v-if="submitted" indeterminate
          :size="26" :width="3" color="primary"/>
        </div>
        <div>
          <v-btn color="normal" :disabled="!submitted"
          @click="submitted = false">
            Cancel
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      submitted: false
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
