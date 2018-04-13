<template>
  <v-flex>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline">Next</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <div>
          <v-btn color="primary" @click.stop="jobSubmitted = true">Run Job</v-btn>
          <v-progress-circular v-if="jobSubmitted" indeterminate :size="26" :width="3" color="primary"></v-progress-circular>
        </div>
        <div>
          <v-btn color="normal" :disabled="!jobSubmitted" @click.stop="jobSubmitted = false">Cancel</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>

export default {
  data() {
    return {
      jobSubmitted: false,
    }
  },
  methods: {
  }
}
</script>
