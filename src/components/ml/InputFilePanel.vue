<template>
  <v-flex xs3>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline">{{ boxTitle }}</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            name="inputFile"
            label="Input file"
            type="text"
            v-model="inputFile"
            append-icon="create"
            :append-icon-cb="() => { fileDialogOpen = true }"
          ></v-text-field>
          
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
            max-height="400"
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
            max-height="400"
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="orange">Preview</v-btn>
        <v-btn flat color="orange">Edit</v-btn>
      </v-card-actions>
    </v-card>
    <input-file-dialog :is-open="fileDialogOpen"/>
  </v-flex>
</template>

<script>
import axios from 'axios'
import url from 'url'

import InputFileDialog from '../dialogs/InputFileDialog'

const BE_ENDPOINT = 'http://127.0.0.1:4000'
const ML_ENDPOINT = 'http://127.0.0.1:7000'

export default {
  props: ['boxTitle'],
  components: {
    'input-file-dialog': InputFileDialog
  },
  data() {
    return {
      cols: [],
      inputCols: [],
      outputCols: [],
      inputFile: '',
      fileDialogOpen: false
    }
  },
  created() {
    this.getColumns()
  },
  methods: {
    toggleFileModal() {
      this.fileDialogOpen = !this.fileDialogOpen
    },
    getColumns() {
      axios({
        url: url.resolve(BE_ENDPOINT, '/files/processed-data.csv'),
        responseType: 'json',
        params: {
          view: 'headers',
        }
      })
      .then(res => {
        this.cols = res.data.columns
          .filter(col => col.type === 'number')
          .map(col => col.header)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
