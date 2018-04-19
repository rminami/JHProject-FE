<template>
  <div id="input-flex">
    <v-card id="input-card">
      <v-card-title primary-title>
        <div>
          <h3 id="input-title" class="headline">Select input file</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form>
          <div>
            <v-text-field
              name="inputFile"
              label="Input file"
              type="text"
              v-model="localValues.inputFile"
              append-icon="create"
              :append-icon-cb="() => { fileDialogOpen = !fileDialogOpen }"
            ></v-text-field>
          </div>
          <v-select
            label="Select Input Columns"
            :items="colNames"
            v-model="inputColNames"
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
            :items="colNames"
            v-model="outputColNames"
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
            v-model="localValues.advEnabled"
            color="primary"
          ></v-switch>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="primary">Preview</v-btn>
        <v-btn flat color="primary">Edit</v-btn>
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
import path from 'path'

import bindMixin from '@/mixins/bindMixin'
import InputFileDialog from '../dialogs/InputFileDialog'

export default {
  props: ['values'],
  mixins: [bindMixin],
  components: {
    'input-file-dialog': InputFileDialog
  },
  data() {
    return {
      inputColNames: [],
      outputColNames: [],
      cols: [],
      fileDialogOpen: false,
    }
  },
  computed: {
    colNames() {
      return this.cols.map(col => col.header)
    },
    // Put other stuff here
    ...mapState({
      beEndpoint: s => s.beEndpoint
    })
  },
  watch: {
    inputColNames() {
      this.localValues.inputCols = this.inputColNames.map(colName => ({
        header: colName,
        index: this.getColumnIndex(colName)
      }))
    },
    outputColNames() {
      this.localValues.outputCols = this.outputColNames.map(colName => ({
        header: colName,
        index: this.getColumnIndex(colName)
      }))
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
    getColumnIndex(colName) {
      return this.cols.filter(col => col.header === colName)[0].index
    },
    getColumns() {
      axios({
        url: url.resolve(this.beEndpoint, path.join('files', this.localValues.inputFile)),
        responseType: 'json',
        params: {
          view: 'meta'
        }
      })
      .then(res => {
        this.cols = res.data.supported_views.tabular.columns
        .map((col, index) => ({ ...col, index }))
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
