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
              <v-btn icon class="mx-0" @click.stop="() => 0">
                <v-icon color="grey">pause</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click.stop="() => 0">
                <v-icon color="grey">stop</v-icon>
              </v-btn>
            </td>
            <td v-else class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click.stop="() => 0">
                <v-icon color="grey">delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <p><strong>Description: </strong>{{ props.item.description }}</p>
            </v-card-text>
          </v-card>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          No results for "{{ search }}".
        </v-alert>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    pagination: {
      sortBy: 'firstname'
    },
    search: '',
    selected: [],
    // "percent_trained": 0.3,
    // "status": "running",
    // "description": "string",
    // "job_id": "string",
    // "model_id": "string",
    // "start_time": "string",
    // "started_by": "string"
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
        percent_trained: 1
      },
      {
        expanded: false,
        job_id: 'job456',
        model_id: 'model4567',
        status: 'running',
        description: 'This model is good',
        percent_trained: 0.78
      },
      {
        expanded: false,
        job_id: 'job789',
        model_id: 'model09834',
        status: 'failed',
        description: 'This model is useless',
        percent_trained: 0
      }
    ],
    dialog: false
  }),
  created() {
    // axios.get('https://randomuser.me/api', {
    //   params: { results: 42 }
    // })
    // .then(res => {
    //   this.items = res.data.results.map(user => ({
    //     firstname: this.capitalize(user.name.first),
    //     lastname: this.capitalize(user.name.last),
    //     email: user.email,
    //     role: Math.random() > 0.1 ? 'User' : 'Admin'
    //   }))
    // })
    // .catch(err => {
    //   console.log('Could not get users!')
    // })
  },

  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    statusToColor(status) {
      switch(status) {
        case 'running':
          return 'blue accent-1'
        case 'complete':
          return 'light-green accent-1'
        case 'failed':
          return 'red accent-1'
      }
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.items.slice()
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
  }
}
</script>

<style lang="stylus" scoped>
</style>
