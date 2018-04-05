<template>
  <v-dialog v-model="isOpenComputed" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">
          Select a file
        </span>
      </v-card-title>
      <v-card-text>
        Hello world
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['isOpen'],
  created() {
    this.isOpenComputed = this.isOpen
  },
  watch: {
    isOpenComputed: this.isOpen
  },
  data() {
    return {
      isOpenComputed: false
    }
  }
}
</script>
