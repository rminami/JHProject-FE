<template>
  <div id="input-flex">
    <v-card id="input-card">
      <v-card-title primary-title>
        <div>
          <h3 id="input-title" class="headline">Select model</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-select
            label="Select model"
            :items="modelIds"
            v-model="localValues.selectedModelName"
            autocomplete
            color="blue"
            max-height="300"
          ></v-select>
        </v-form>

        <div id="model-details" v-if="selectedModel">
          <h3 class="param-name">Job ID</h3>
          <p class="desc">{{ selectedModel.job_id }}</p>

          <h3 class="param-name">Description</h3>
          <p class="desc">{{ selectedModel.description }}</p>

          <h3 class="param-name">Status</h3>
          <p class="desc">{{ selectedModel.status }}</p>

          <h3 class="param-name">Start time</h3>
          <p class="desc">{{ selectedModel.start_time }}</p>

          <h3 class="param-name">Started by</h3>
          <p class="desc">{{ selectedModel.started_by }}</p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="primary">Preview</v-btn>
        <v-btn flat color="primary">Edit</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import path from 'path'

import bindMixin from '@/mixins/bindMixin'

export default {
  mixins: [bindMixin],
  data() {
    return {
      inputColNames: [],
      outputColNames: [],
      cols: [],
    }
  },
  computed: {
    modelIds() {
      return this.localValues.models.map(model => model.model_id)
    },
    selectedModel() {
      return this.localValues.models.filter(model => model.model_id === this.localValues.selectedModelName)[0]
    },
    // Put other stuff here
    ...mapState({
      beEndpoint: s => s.beEndpoint,
      currentProject: s => s.currentProject
    })
  },
  watch: {
  
  },
  created() {
  },
  methods: {
    
  }
}
</script>

<style lang="stylus" scoped>

#input-flex
  width: 328px
  padding: 4px 4px 4px 4px

#input-card
  width: 320px

.desc
  white-space: normal

.param-name
  margin-top: 10px
  margin-bottom: 14px
</style>
