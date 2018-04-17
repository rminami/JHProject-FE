<template>
  <div id="input-flex">
    <v-card id="input-card">
      <v-card-title primary-title>
        <div>
          <h3 class="headline">Select input file</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form>
          <div>
            <v-text-field
              name="inputFile"
              label="Input file"
              type="text"
              v-model="inputFile"
              append-icon="create"
              :append-icon-cb="() => { fileDialogOpen = !fileDialogOpen }"
            ></v-text-field>
          </div>
          <v-select
            label="Select Input Columns"
            :items="cols"
            v-model="inputCols"
            multiple
            autocomplete
            chips
            deletable-chips
            clearable
            color="blue"
            max-height="300"
          ></v-select>
          <v-select
            label="Select Output Columns"
            :items="cols"
            v-model="outputCols"
            multiple
            autocomplete
            chips
            deletable-chips
            clearable
            color="blue"
            max-height="300"
          ></v-select>
          <div class="spacing"></div>
          <v-switch
            label="Enable advanced options?"
            v-model="advEnabledAlias"
            color="orange"
          ></v-switch>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="orange">Preview</v-btn>
        <v-btn flat color="orange">Edit</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="fileDialogOpen" max-width="500px" scrollable>
      <input-file-dialog @close="fileDialogOpen = false"/>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import url from 'url'

import InputFileDialog from '../dialogs/InputFileDialog'

export default {
  props: ['advEnabled'],
  components: {
    'input-file-dialog': InputFileDialog
  },
  data() {
    return {
      cols: [],
      inputCols: [],
      outputCols: [],
      inputFile: 'processed-data.csv', // Change later
      fileDialogOpen: false,
      advEnabledAlias: false
    }
  },
  computed: {
    // Put other stuff here
    ...mapState({
      beEndpoint: s => s.beEndpoint
    })
  },
  watch: {
    advEnabledAlias: function() {
      this.$emit('adv-toggle', this.advEnabledAlias)
    },
    inputCols: function() {
      this.$emit('input-change', this.inputCols)
    },
    outputCols: function() {
      this.$emit('output-change', this.outputCols)
    }
  },
  created() {
    this.advEnabledAlias = this.advEnabled
    this.getColumns()
  },
  methods: {
    toggleFileModal() {
      this.fileDialogOpen = !this.fileDialogOpen
    },
    getColumns() {
      axios({
        url: url.resolve(this.beEndpoint, '/files/processed-data.csv'),
        responseType: 'json',
        params: {
          view: 'headers'
        }
      })
      .then(res => {
        this.cols = res.data.columns
        .filter(col => col.type === 'number')
        .map(col => col.header)
      })
      .catch(err => {
        this.$emit('error')
        console.log(err)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

#input-flex
  width: 328px
  padding: 4px 4px 4px 4px

#input-card
  width: 320px

.spacing
  height: 20px
</style>
