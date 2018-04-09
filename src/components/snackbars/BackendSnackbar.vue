<template>
  <v-snackbar
    :timeout="3000"
    color="error"
    v-model="isDisplayed"
  >
    Could not connect to back-end server.
    <v-btn dark flat @click.native="$emit('input')">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: ['isDisplayed'],
  name: 'BackendSnackbar'
}
</script>
