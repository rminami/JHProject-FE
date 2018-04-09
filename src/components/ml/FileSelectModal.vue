<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card>
      <v-toolbar color="teal" dark>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>Topics</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title>
        Dialog 2
      </v-card-title>
      <v-card-text>
        Hello
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" flat @click.stop="fileModalOpen=false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['isOpen'],
  data() {
    return {
      
    }
  }
}
</script>

