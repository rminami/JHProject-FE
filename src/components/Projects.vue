<template>
<v-container xs10 offset-xs1>
  <v-list two-line>

    <v-subheader inset>Projects</v-subheader>
    <v-list-tile avatar v-for="project in projects" :key="project" @click="chooseProject(project)">
      <v-list-tile-avatar>
        <v-icon class="light-blue darken-1 white--text">assignment</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ project }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>

  <!-- Snackbar is displayed when connection to backend fails -->
  <v-snackbar
    :timeout="3000"
    color="error"
    v-model="backendSnackbar"
  >
    Could not connect to backend.
    <v-btn dark flat @click.native="backendSnackbar = false">Close</v-btn>
  </v-snackbar>
</v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      projects: [],
      backendSnackbar: false
    }
  },
  created() {
    axios({
      baseURL: this.beEndpoint,
      url: '/projects'
    })
    .then(res => {
      console.log(res.data)
      this.projects = res.data.data.map(project => project.project_name)
      // this.projects = res.data.map(project => project.project_name)
    })
    .catch(err => {
      console.log(err.response)
    })
  },
  computed: {
    ...mapState({
      beEndpoint: s => s.beEndpoint
    })
  },
  methods: {
    chooseProject(projectName) {
      this.$store.dispatch('SWITCH_PROJECT', projectName)
      this.$router.push(`/projects/${projectName}/files`)
    }
  },
  name: 'Projects'
}
</script>

<style scoped>

</style>
