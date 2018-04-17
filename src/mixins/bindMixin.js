export default {
  props: ['values'],
  data() {
    return {
      localValues: undefined
    }
  },
  watch: {
    values: {
      handler() {
        this.localValues = this.values
      },
      deep: true
    },
    localValues: {
      handler() {
        this.$emit('change', this.localValues)
      },
      deep: true
    }
  },
  created() {
    this.localValues = this.values
  }
}
