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

      <!-- Path to current directory -->
      <v-breadcrumbs>
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item
          v-for="(parentDir, index) in parentDirs"
          :key="index"
          :to="parentDir.path"
          :exact="true"
        >
          {{ parentDir.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>

      <v-list two-line>
        <!-- List of directories in current path -->
        <v-subheader v-show="dirs.length > 0" inset>Folders</v-subheader>
        <v-list-tile avatar v-for="dir in dirs" :key="dir.id"
        @click="$router.push('/projects/' + $route.params.project_name + '/files/' + dir.file_path)">
          <v-list-tile-avatar>
            <v-icon :class="[dir.iconClass]">{{ dir.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ dir.file_name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Divider -->
        <v-divider inset v-show="dirs.length > 0 && files.length > 0"></v-divider>

        <!-- List of files in current path -->
        <v-subheader v-show="files.length > 0" inset>Files</v-subheader>
        <v-list-tile avatar v-for="file in files" :key="file.id"
        @click="$router.push('/projects/' + $route.params.project_name + '/files/' + file.file_path)">
          <v-list-tile-avatar>
            <v-icon :class="[file.iconClass]">{{ file.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ file.file_name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-alert :value="dirs.length === 0 && files.length === 0" color="info" icon="info" outline v-cloak>
          No files in current directory.
        </v-alert>
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

export default {
  name: 'FileDialog',
  data() {
    return {
      currentPath: ''
    }
  },
  created() {
    // this.currentPath = this.initialPath
    this.getFiles()
  },
  
  methods: {
    getFiles() {
      axios({
        baseURL: this.beEndpoint,
        url: this.currentPath + '/',
        params: {
          view: 'meta',
          include_children: true
        }
      })
      .then(res => {
        const processed = this.attachIcons(res.data.data.children)
        this.dirs = processed.filter(item => item.type === 'directory')
        this.files = processed.filter(item => item.type !== 'directory')
      })
      .catch(err => {
        console.log(err.response)
      })
    },
    attachIcons(items) {
      return items.map(item => {
        const res = item
        switch (res.type) {
          case 'directory':
            return { ...res, icon: 'folder', iconClass: 'grey lighten-1 white--text' }
          case 'tabular':
            return { ...res, icon: 'storage', iconClass: 'blue white--text' }
          case 'scalable_image':
            return { ...res, icon: 'image', iconClass: 'amber white--text' }
          default:
            return { ...res, icon: 'note', iconClass: 'teal white--text' }
        }
      })
    }
  }
}
</script>
