import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      currentPath: '',
      dirs: [],
      files: []
    }
  },
  computed: mapState({
    beEndpoint: s => s.beEndpoint
  }),

  watch: {
    /**
     * Updates currentPath when the URL path changes, as is necessary for
     * the file browser to work as expected.
     */
    $route() {
      this.currentPath = this.$route.path
    },
    /**
     * Watcher for currentPath needs to be kept separate because the actual
     * path does not change when using the dialog.
     */
    currentPath() {
      this.getFiles()
    }
  },
  created() {
    this.currentPath = this.$route.path
    this.getFiles()
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
