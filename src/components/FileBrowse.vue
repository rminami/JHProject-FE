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
    <v-list-tile avatar v-for="dir in dirs" :key="dir.id"
    @click="$router.push('/projects/' + $route.params.project_name + '/files/' + dir.file_path)">
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
              @click.stop="downloadFile(file.file_name)"
            >
              <v-list-tile-title>Download</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click.stop="startCopyFile(dir.file_name)"
            >
              <v-list-tile-title>Copy</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click.stop="startMoveFile(dir.file_name)"
            >
              <v-list-tile-title>Move</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click.stop="deleteFile(dir.file_name)"
            >
              <v-list-tile-title>Delete</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-list-tile-action>
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
      <v-list-tile-action @click.stop>
        <v-menu bottom left>
          <v-btn icon slot="activator" dark ripple>
            <v-icon color="grey lighten-1">more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              @click.stop="downloadFile(file.file_name)"
            >
              <v-list-tile-title>Download</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click.stop="startCopyFile(file.file_name)"
            >
              <v-list-tile-title>Copy</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click.stop="startMoveFile(file.file_name)"
            >
              <v-list-tile-title>Move</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click.stop="deleteFile(file.file_name)"
            >
              <v-list-tile-title>Delete</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-list-tile-action>
    </v-list-tile>

    <v-alert :value="dirs.length === 0 && files.length === 0" color="info"
    icon="info" outline v-cloak>
      No files in current directory.
    </v-alert>
  </v-list>

  <v-dialog scrollable v-model="fileDialogIsOpen" max-width="500px">
    <file-dialog
      :initialPath="currentPath"
      :mode="fileDialogMode"
      @select="handleDirectorySelect"
      @close="fileDialogIsOpen = false"
    />
  </v-dialog>

  <!-- Snackbar is displayed when connection to backend fails -->
  <v-snackbar
    :timeout="3000"
    :color="snackbar.color"
    v-model="snackbar.isOpen"
  >
    {{ snackbar.text }}
    <v-btn dark flat @click.native="snackbar.isOpen = false">Close</v-btn>
  </v-snackbar>
</v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import path from 'path'
import { setTimeout } from 'timers'

import FileDialog from '@/components/dialogs/FileDialog'


export default {
  components: {
    'file-dialog': FileDialog
  },
  data() {
    return {
      currentPath: '',
      dirs: [],
      files: [],
      textDialog: false,
      fileDialogIsOpen: false,
      fileDialogMode: '', // move or copy
      snackbar: {
        text: '',
        color: '',
        isOpen: false
      },
      selectedItem: ''
    }
  },
  watch: {
    $route() {
      this.currentPath = this.$route.path
      this.getFiles()
    }
  },

  created() {
    this.currentPath = this.$route.path
    this.getFiles()
  },

  computed: {
    pathInProject() {
      return `/${this.currentPath.split('/').slice(4).join('/')}`
    },
    parentDirs() {
      const routeEls = this.$route.path.split('/').slice(3)
      return routeEls.map((routeEl, index) => ({
        text: decodeURIComponent(routeEl),
        path: `/projects/${this.$route.params.project_name}/${routeEls.slice(0, index + 1).join('/')}`
      }))
    },
    ...mapState({
      beEndpoint: s => s.beEndpoint,
      currentProject: s => s.currentProject
    })
  },

  methods: {
    getFiles() {
      axios({
        baseURL: this.beEndpoint,
        url: `${this.currentPath}/`,
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
        this.snackbar.text = 'Could not connect to backend server.'
        this.snackbar.color = 'error'
        this.snackbar.isOpen = true
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
    },
    /**
     * Called when the copy item on the menu is clicked. This brings up a
     * dialog where the user can select a directory to copy to.
     */
    startCopyFile(item) {
      this.fileDialogIsOpen = true
      this.selectedItem = item
      this.fileDialogMode = 'copy'
    },
    /**
     * Same thing as above but for moving files/directories.
     */
    startMoveFile(item) {
      this.fileDialogIsOpen = true
      this.selectedItem = item
      this.fileDialogMode = 'move'
    },

    /**
     * Called when the user has selected a copy or move destination from the
     * dialog. It closes the dialog and sends a request to the backend.
     */
    handleDirectorySelect(pathToCopyTo) {
      const selectedItem = this.selectedItem
      const requestMode = this.fileDialogMode

      // Delayed so that the user does not see text on the dialog changing.
      setTimeout(() => {
        this.selectedItem = ''
        this.fileDialogMode = ''
      }, 1000)

      this.fileDialogIsOpen = false

      if (pathToCopyTo !== this.pathInProject) {
        axios({
          method: 'post',
          baseURL: this.beEndpoint,
          url: path.join(this.currentPath, selectedItem),
          params: {
            action: requestMode // either 'copy' or 'move'
          },
          data: {
            path: pathToCopyTo
          }
        })
        .then(res => {
          this.snackbar.text = `'${selectedItem}' has been 
          ${requestMode === 'copy' ? 'copied' : 'moved'} to ${pathToCopyTo}.`
          this.snackbar.color = 'success'
          this.snackbar.isOpen = true

          if (requestMode === 'move') {
            // Updates the list of directories and files displayed
            this.dirs = this.dirs.filter(dir => dir.file_name !== selectedItem)
            this.files = this.files.filter(file => file.file_name !== selectedItem)
          }
        })
        .catch(err => {
          this.snackbar.text = `'${selectedItem}' could not be 
          ${requestMode === 'copy' ? 'copied' : 'moved'} to ${pathToCopyTo}.`
          this.snackbar.color = 'error'
          this.snackbar.isOpen = true
        })
      } else {
        this.snackbar.text = 'File cannot be copied into the same directory.'
        this.snackbar.color = 'error'
        this.snackbar.isOpen = true
      }
    },

    downloadFile(selectedItem) {
      axios({
        method: 'get',
        baseURL: this.beEndpoint,
        url: path.join(this.currentPath, selectedItem),
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
    deleteFile(selectedItem) {
      axios({
        method: 'post',
        baseURL: this.beEndpoint,
        url: path.join(this.currentPath, selectedItem),
        params: {
          action: 'delete'
        }
      })
      .then(res => {
        this.snackbar.text = `'${selectedItem}' has been deleted.`
        this.snackbar.color = 'success'
        this.snackbar.isOpen = true

        // Updates the list of directories and files displayed
        this.dirs = this.dirs.filter(dir => dir.file_name !== selectedItem)
        this.files = this.files.filter(file => file.file_name !== selectedItem)
      })
      .catch(err => {
        this.snackbar.text = `'${selectedItem}' could not be deleted.`
        this.snackbar.color = 'error'
        this.snackbar.isOpen = true
      })
    },
    toggleDialog() {
      this.textDialog = !this.textDialog
    }
  },
  name: 'FileBrowse'
}
</script>

<style lang="stylus" scoped>
[v-cloak]
  display: none
</style>
