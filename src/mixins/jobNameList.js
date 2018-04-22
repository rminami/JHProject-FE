/**
 * Given a list of job objects as specified in the protocol, this mixin will
 * return a list containing just their names for the selector.
 */
export default {
  computed: {
    jobNameList() {
      try {
        return this.jobs.map(a => a.transformer_name)
      } catch (err) {
        return []
      }
    }
  }
}
