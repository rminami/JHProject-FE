<template>
  <v-container>
    <!-- <v-layout row justify-space-around> -->
    <v-card flat>
      <v-card-text>
        <v-layout row id="title-row">
          <h2>Server settings</h2>
        </v-layout>
        <v-spacer></v-spacer>
        <v-layout row>
          <v-flex xs3>
            <v-subheader>Backend server</v-subheader>
          </v-flex>
          <v-flex xs7>
            <v-text-field
              name="backend"
              label="Backend Server"
              v-model="localBeEndpoint"
              type="url"
              single-line
            ></v-text-field>
          </v-flex>
          <v-flex xs2>
            <v-btn flat color="primary" @click="testBeEndpoint">Test</v-btn>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs3>
            <v-subheader>Machine learning server</v-subheader>
          </v-flex>
          <v-flex xs7>
            <v-text-field
              name="machineLearning"
              label="Machine Learning Server"
              v-model="localMlEndpoint"
              type="url"
              single-line
            ></v-text-field>
          </v-flex>
          <v-flex xs2>
            <v-btn flat color="primary" @click="testMlEndpoint">Test</v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-layout row>
          <v-btn flat color="primary" @click="update">Update</v-btn>
          <v-btn flat color="secondary" @click="clear">Clear</v-btn>
        </v-layout>
      </v-card-actions>
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
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      localBeEndpoint: '',
      localMlEndpoint: '',
      snackbar: {
        text: '',
        color: '',
        isOpen: false
      }
    }
  },
  watch: {
    beEndpoint() { this.localBeEndpoint = this.beEndpoint },
    mlEndpoint() { this.localMlEndpoint = this.mlEndpoint }
  },
  computed: mapState({
    beEndpoint: s => s.beEndpoint,
    mlEndpoint: s => s.mlEndpoint
  }),
  created() {
    this.localBeEndpoint = this.beEndpoint
    this.localMlEndpoint = this.mlEndpoint
  },
  methods: {
    testBeEndpoint() {
      axios({
        method: 'get',
        baseURL: this.localBeEndpoint,
        url: '/projects', // Probably the easiest one to test
      })
      .then(res => {
        this.snackbar.text = 'Connection to backend server was successful.'
        this.snackbar.color = 'success'
        this.snackbar.isOpen = true
      })
      .catch(err => {
        this.snackbar.text = 'Connection to backend server failed.'
        this.snackbar.color = 'error'
        this.snackbar.isOpen = true
      })
    },
    testMlEndpoint() {
      axios({
        method: 'get',
        baseURL: this.localMlEndpoint,
        url: '/jobs', // Probably the easiest one to test
      })
      .then(res => {
        this.snackbar.text = 'Connection to machine learning server was successful.'
        this.snackbar.color = 'success'
        this.snackbar.isOpen = true
      })
      .catch(err => {
        this.snackbar.text = 'Connection to machine learning server failed.'
        this.snackbar.color = 'error'
        this.snackbar.isOpen = true
      })
    },
    update() {
      this.$store.dispatch('CHANGE_BE', this.localBeEndpoint)
      this.$store.dispatch('CHANGE_ML', this.localMlEndpoint)
    },
    clear() {
      this.localBeEndpoint = ''
      this.localMlEndpoint = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
#title-row
  margin-bottom 32px
</style>
