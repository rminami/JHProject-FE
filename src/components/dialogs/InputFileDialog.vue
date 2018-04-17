<template>
  <v-card style="height: 600px;">
    <v-toolbar>
      <v-toolbar-title>Files</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text style="min-height: 482px;">
      <v-list two-line>
        <!-- List of directories in current path -->
        <v-subheader v-show="dirs.length > 0" inset>Folders</v-subheader>
        <v-list-tile avatar v-for="dir in dirs" :key="dir.id" @click="currentPath = dir.file_path">
          <v-list-tile-avatar>
            <v-icon :class="[dir.iconClass]">{{ dir.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ dir.file_name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Divider -->
        <v-divider inset v-show="dirs.length > 0"></v-divider>

        <!-- List of files in current path -->
        <v-subheader inset>Files</v-subheader>
        <v-list-tile avatar v-for="file in files" :key="file.id"
                     @click="currentPath = file.file_path">
          <v-list-tile-avatar>
            <v-icon :class="[file.iconClass]">{{ file.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ file.file_name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="secondary" flat @click="$emit('close')">Close</v-btn>
      <v-btn color="primary" flat @click.native="dialog = false">Select</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import fileBrowserMixin from '@/mixins/fileBrowserMixin'

export default {
  mixins: [fileBrowserMixin],
  name: 'InputFileDialog'
}
</script>
