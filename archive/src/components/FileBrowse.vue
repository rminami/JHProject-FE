<template>
<v-container xs10 offset-xs1>
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
            <v-list-tile v-for="(menuItem, i) in menuItems" :key="i" @click.stop="">
              <v-list-tile-title>{{ menuItem.title }}</v-list-tile-title>
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
            <v-list-tile v-for="(menuItem, i) in menuItems" :key="i" @click.stop="textDialog=true">
              <v-list-tile-title>{{ menuItem.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>

  <v-dialog v-model="textDialog" max-width="500px">
    <v-card>
      <v-card-title class="blue white--text">
        <span class="headline">Rename File/Directory</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="New name"
          v-model="newFileName"
          :rules="newFileNameRules"
          :counter="255"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" flat @click.stop="textDialog=false">Cancel</v-btn>
        <v-btn color="primary" flat @click.stop="textDialog=false">Rename</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
import * as axios from 'axios'
import * as url from 'url'

const SERVER_URL = 'http://127.0.0.1:4000/'

export default {
  data: () => ({
    textDialog: false,
    newFileName: '',
    dirs: [],
    files: [],
    menuItems: [
      {
        title: 'Download',
        onClick: '',
        fn: 'toggleDialog'
        // path: url.resolve(SERVER_URL, this.$route.path, '?action=move')
      },
      {
        title: 'Rename',
        fn: 'toggleDialog'
        // onClick: () => {
        //   console.log('hi there')
        //   console.log(this.dirs)
        //   this.toggleDialog()
        // }
        // path: url.resolve(SERVER_URL, this.$route.path, '?action=move')
      },
      {
        title: 'Copy',
        onClick: '',
        fn: 'this.toggleDialog()'
        // path: url.resolve(SERVER_URL, this.$route.path, '?action=copy')
      },
      {
        title: 'Move',
        onClick: '',
        fn: 'toggleDialog'
        // path: url.resolve(SERVER_URL, this.$route.path, '?action=move')
      },
      {
        title: 'Delete',
        onClick: '',
        fn: 'toggleDialog'
        // path: url.resolve(SERVER_URL, this.$route.path, '?action=delete')
      }
    ]
  }),
  computed: ({
    newFileNameRules: [
      v => (v && v.length <= 255) || 'File name must be less than 255 characters',
      v => {
        const cmb = [...this.dirs, ...this.files]
        console.log(cmb)
        return (v && ![...this.dirs, ...this.files].map(d => d.file_name).includes(v)) || 'File name is already taken'
      }
    ]
  }),

  created() {
    this.getFiles()
  },

  watch: {
    $route: 'getFiles'
  },

  methods: {
    toggleDialog() {
      this.textDialog = !this.textDialog
    },
    getFiles() {
      axios({
        url: url.resolve(SERVER_URL, this.$route.path),
        responseType: 'json',
        params: {
          view: 'meta',
          include_children: true
        }
      })
      .then(res => {
        const processed = this.attachIcons(res.data.children)
        this.dirs = processed.filter(item => item.type === 'directory')
        this.files = processed.filter(item => item.type !== 'directory')
      })
      .catch(err => {
        console.log(err)
      })
    },
    attachIcons(items) {
      return items.map(item => {
        const res = item
        switch (res.type) {
          case 'directory':
            res.icon = 'folder'
            res.iconClass = 'grey lighten-1 white--text'
            return res
          case 'tabular':
            res.icon = 'storage'
            res.iconClass = 'blue white--text'
            return res
          case 'scalable_image':
            res.icon = 'image'
            res.iconClass = 'amber white--text'
            return res
          default:
            res.icon = 'note'
            res.iconClass = 'teal white--text'
            return res
        }
      })
    }
  },
  name: 'Files'
}
</script>

<style scoped>

</style>
