import { mapState } from 'vuex'
import axios from 'axios'
import url from 'url'

export default {
  data() {
    return {
      dirs: [],
      files: []
    }
  },
  computed: mapState({
    beEndpoint: s => s.beEndpoint
  }),

  created() {
    this.getFiles()
  },

  methods: {
    getFiles() {
      axios({
        url: url.resolve(this.beEndpoint, this.currentPath),
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
