<template>
  <v-card>
    <v-card-title class="blue white--text">
      <span class="headline">Rename File/Directory</span>
    </v-card-title>
    <v-card-text>
      <v-text-field
        label="New name"
        v-model="newFileName"
        :rules="[(v) => (v.length < 255 || 'Name is too long.')]"
        :counter="255"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn color="secondary" flat @click.stop="$emit('close')">
        Cancel
      </v-btn>
      <v-btn color="primary" flat @click.stop="$emit('submit', prevFileName, newFileName)">
        Rename
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['prevFileName'],
  data() {
    return {
      newFileName: '',
    }
  },
  watch: {
    prevFileName: function() {
      this.newFileName = this.prevFileName
    }
  }
}
</script>
