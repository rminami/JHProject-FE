<template>
  <div>
    <v-card width="220px">
      <v-card-title primary-title>
        <div>
          <h3 class="headline">{{ boxTitle }}</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <p>This is the text.</p>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="orange">Share</v-btn>
        <v-btn flat color="orange" @click.stop="toggleFileModal">Explore</v-btn>
        <file-input-modal :is-open="fileModalOpen"></file-input-modal>
      </v-card-actions>
    </v-card>
  </div>
  
</template>

<script>
import FileInputModal from './FileInputModal'

export default {
  props: ['boxTitle'],
  components: {
    'file-input-modal': FileInputModal
  },
  data() {
    return {
      fileModalOpen: false
    }
  },
  methods: {
    toggleFileModal() {
      this.fileModalOpen = !this.fileModalOpen
    }
  }
}
</script>
