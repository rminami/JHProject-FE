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
                v-model="beEndpoint"
                type="url"
                single-line
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-btn flat color="primary">Test</v-btn>
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
                v-model="mlEndpoint"
                type="url"
                single-line
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-btn flat color="primary">Test</v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-layout row>
            <v-btn flat color="primary">Update</v-btn>
            <v-btn flat color="secondary" @click.stop="clear">Clear</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      beEndpoint: '',
      mlEndpoint: ''
    }
  },
  watch: {
    beCurrent() { this.beEndpoint = this.beCurrent },
    mlCurrent() { this.mlEndpoint = this.mlCurrent }
  },
  computed: mapState({
    beCurrent: s => s.beEndpoint,
    mlCurrent: s => s.mlEndpoint
  }),
  created() {
    this.beEndpoint = this.beCurrent
    this.mlEndpoint = this.mlCurrent
  },
  methods: {
    clear() {
      this.beEndpoint = ''
      this.mlEndpoint = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
#title-row
  margin-bottom 32px
</style>
