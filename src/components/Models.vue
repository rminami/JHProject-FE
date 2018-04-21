<template>

  <v-container xs10 offset-xs1>
    <v-card>
      <v-card-title>
        <h2 class="headline">Machine Learning Models</h2>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :pagination.sync="pagination"
        :search="search"
        item-key="model_id"
        class="elevation-1"
        v-show="items.length > 0"
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="['text-xs-left', 'column sortable', pagination.descending
              ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.expanded = !props.expanded">
            <td>{{ props.item.job_id }}</td>
            <td>{{ props.item.model_id }}</td>
            <td>
              <v-chip
                label
                small
                :color="statusToColor(props.item.status)"
                class="ml-0"
              >
                {{ capitalize(props.item.status) }}
              </v-chip>
            </td>
            <td class="justify-center">{{ Math.round(+props.item.percent_trained * 100) + '%' }}</td>

            <td v-if="props.item.status === 'running'" class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click.stop="stopTraining(props.item.model_id)">
                <v-icon color="grey">stop</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click.stop="deleteModel(props.item.model_id, props.index)">
                <v-icon color="grey">delete</v-icon>
              </v-btn>
            </td>
            <td v-else class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click.stop="deleteModel(props.item.model_id, props.index)">
                <v-icon color="grey">delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <p><strong>Description: </strong>{{ props.item.description }}</p>
              <p><strong>Start time: </strong>{{ dateFormat(props.item.start_time, 'YYYY-MM-DD hh:mm:ss') }}</p>
              <p><strong>Started by: </strong>{{ props.item.started_by }}</p>
              <p>Use this model for
                <router-link :to="`models/prediction/${props.item.model_id}`">
                making predictions
                </router-link>
                .
              </p>
            </v-card-text>
          </v-card>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          No results for "{{ search }}".
        </v-alert>
      </v-data-table>
    </v-card>
    <v-snackbar
      :timeout="3000"
      :color="snackbar.color"
      v-model="snackbar.isOpen"
    >
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.isOpen = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import path from 'path'
import { format } from 'date-fns'

const randomDate = () => new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))


export default {
  data: () => ({
    pagination: {
      sortBy: 'firstname'
    },
    search: '',
    selected: [],
    headers: [
      { text: 'Job ID', value: 'job_id' },
      { text: 'Model ID', value: 'model_id' },
      { text: 'Status', value: 'status' },
      { text: '% trained', value: 'percent_trained' },
      { text: 'Actions', value: 'actions' }
    ],
    status: ['running', 'complete', 'failed'],
    roles: ['User', 'Admin'],
    items: [
      {
        expanded: false,
        job_id: 'job123',
        model_id: 'model1234',
        status: 'complete',
        description: 'This model does stuff',
        percent_trained: 1,
        start_time: randomDate(),
        started_by: 'admin'
      },
      {
        expanded: false,
        job_id: 'some_job',
        model_id: 'some_model',
        status: 'complete',
        description: 'This model does stuff',
        percent_trained: 1,
        start_time: randomDate(),
        started_by: 'rm264'
      },
      {
        expanded: false,
        job_id: 'job456',
        model_id: 'model4567',
        status: 'running',
        description: 'This model is good',
        percent_trained: 0.78,
        start_time: randomDate(),
        started_by: 'user1'
      },
      {
        expanded: false,
        job_id: 'job789',
        model_id: 'model09834',
        status: 'failed',
        description: 'This model is useless',
        percent_trained: 0,
        start_time: randomDate(),
        started_by: 'user2'
      }
    ],
    snackbar: {
      isOpen: false,
      color: '',
      text: ''
    },
    dialog: false
  }),
  created() {
    // Get list of models
    // this.getProjects()
  },
  computed: {
    ...mapState({
      mlEndpoint: s => s.mlEndpoint,
      currentProject: s => s.currentProject
    })
  },

  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    dateFormat: format,
    statusToColor(status) {
      switch (status) {
        case 'running':
          return 'blue accent-1'
        case 'complete':
          return 'light-green accent-1'
        case 'failed':
          return 'red accent-1'
      }
    },
    getProjects() {
      axios({
        baseURL: this.mlEndpoint,
        url: path.join('models', this.currentProject),
        method: 'get'
      })
      .then(res => {
        console.log(res.data)
        this.items = res.data.data
      })
      .catch(err => {
        console.log(err)
        this.snackbar.color = 'error'
        this.snackbar.text = 'Could not retrieve list of models.'
        this.snackbar.isOpen = true
      })
    },
    stopTraining(model_id) {
      axios({
        baseURL: this.mlEndpoint,
        url: path.join('models/stop', this.currentProject, model_id),
        method: 'delete'
      })
      .then(res => {
        console.log(res.data)
        this.snackbar.color = 'info'
        this.snackbar.text = `${model_id} has been stopped.`
        this.snackbar.isOpen = true
      })
      .catch(err => {
        console.log(err)
        this.snackbar.color = 'error'
        this.snackbar.text = `${model_id} could not be stopped.`
        this.snackbar.isOpen = true
      })
    },
    deleteModel(model_id, index) {
      axios({
        baseURL: this.mlEndpoint,
        url: path.join('models', this.currentProject, model_id),
        method: 'delete'
      })
      .then(res => {
        console.log(res.data)
        this.snackbar.color = 'info'
        this.snackbar.text = `${model_id} has been deleted.`
        this.snackbar.isOpen = true
        this.items = [...this.items.slice(0, index), ...this.items.slice(index + 1)]
      })
      .catch(err => {
        console.log(err)
        this.snackbar.color = 'error'
        this.snackbar.text = `${model_id} could not be deleted.`
        this.snackbar.isOpen = true
      })
    },
    /**
     * Changes which column the table is sorted by.
     */
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
