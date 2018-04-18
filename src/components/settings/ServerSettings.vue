<template>
  <v-container>
    <v-layout row justify-space-around>
      <v-flex xs5>
        <v-card>
          <v-card-title>
            <span class="headline">Sign up</span>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                name="backend"
                label="Backend Server"
                v-model="beEndpoint"
                :placeholder="beCurrent"
                type="url"
              ></v-text-field>
              <v-text-field
                name="machineLearning"
                label="Machine Learning Server"
                v-model="mlEndpoint"
                :placeholder="mlCurrent"
                type="url"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">Update</v-btn>
            <v-btn color="secondary" @click.stop="clear">Clear</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
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
  methods: {
    clear() {
      this.beEndpoint = ''
      this.mlEndpoint = ''
    }
  }
}
</script>
