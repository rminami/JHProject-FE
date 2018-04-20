<template>
<v-container xs10 offset-xs1>

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
    <v-list-tile avatar v-for="dir in dirs" :key="dir.id" @click="$router.push(dir.file_path)">
      <v-list-tile-avatar>
        <v-icon :class="[dir.iconClass]">{{ dir.icon }}</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ dir.file_name }}</v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action @click.stop>
        <v-menu bottom left>
          <v-btn icon slot="activator" dark ripple>
            <v-icon color="grey lighten-1">more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
            >
              <v-list-tile-title>Download</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
            >
              <v-list-tile-title>Rename</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
            >
              <v-list-tile-title>Copy</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
            >
              <v-list-tile-title>Move</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
            >
              <v-list-tile-title>Delete</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-list-tile-action>
    </v-list-tile>

    <!-- Divider -->
    <v-divider inset v-show="dirs.length > 0"></v-divider>

    <!-- List of files in current path -->
    <v-subheader inset>Files</v-subheader>
    <v-list-tile avatar v-for="file in files" :key="file.id" @click="$router.push(file.file_path)">
      <v-list-tile-avatar>
        <v-icon :class="[file.iconClass]">{{ file.icon }}</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ file.file_name }}</v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action @click.stop>
        <v-menu bottom left>
          <v-btn icon slot="activator" dark ripple>
            <v-icon color="grey lighten-1">more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              @click.stop="downloadFile(file.file_name, file.file_path)"
            >
              <v-list-tile-title>Download</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click.stop="selectedFileName = file.file_name; textDialog = true"
            >
              <v-list-tile-title>Rename</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
            >
              <v-list-tile-title>Copy</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
            >
              <v-list-tile-title>Move</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click.stop="deleteFile(file.file_path)"
            >
              <v-list-tile-title>Delete</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>

  <v-dialog v-model="textDialog" max-width="500px">
    <rename-dialog
      :prevFileName="selectedFileName"
      @submit="renameFile"
      @close="textDialog = false"
    />
  </v-dialog>

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
import url from 'url'
import path from 'path'

import fileBrowserMixin from '@/mixins/fileBrowserMixin'
import RenameDialog from './dialogs/RenameDialog'

export default {
  components: {
    'rename-dialog': RenameDialog
  },
  mixins: [fileBrowserMixin],
  data() {
    return {
      textDialog: false,
      selectedFileName: '',
      backendSnackbar: false
    }
  },
  watch: {
    $route: 'getFiles'
  },
  computed: {
    parentDirs() {
      const routeEls = this.$route.path.split('/').slice(1)
      return routeEls.map((routeEl, index) => ({
        text: routeEl,
        path: `/${routeEls.slice(0, index + 1).join('/')}`
      }))
    },
    ...mapState({
      beEndpoint: s => s.beEndpoint
    })
  },

  methods: {
    downloadFile(fileName, filePath) {
      axios({
        method: 'get',
        baseURL: this.beEndpoint,
        url: filePath,
        params: {
          view: 'raw'
        },
        responseType: 'blob'
      })
      .then(res => {
        const dlUrl = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = dlUrl
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
    },
    deleteFile(filePath) {
      axios({
        method: 'post',
        baseURL: this.beEndpoint,
        url: filePath,
        params: {
          action: 'delete'
        },
      })
      .then(res => {
        console.log(res.data)
      })
    },
    renameFile(prevFileName, newFileName) {
      console.log('Renaming file')
      axios({
        method: 'post',
        url: url.resolve(this.beEndpoint, path.join(this.$route.path, prevFileName)),
        data: {
          action: 'rename',
          newname: newFileName
        }
      })
      .then(res => {
        this.dirs = this.dirs.map(item => {
          if (item.file_name === prevFileName) {
            item.file_name = newFileName
          }
          return item
        })
        this.files = this.dirs.map(item => {
          if (item.file_name === prevFileName) {
            item.file_name = newFileName
          }
          return item
        })
        console.log('Successfully renamed file.')
      })
      .catch(err => {
        console.log(err)
        console.log('Rename failed.')
      })
      this.textDialog = true
    },
    toggleDialog() {
      this.textDialog = !this.textDialog
    }
  },
  name: 'FileBrowse'
}
</script>

<style scoped>

</style>
