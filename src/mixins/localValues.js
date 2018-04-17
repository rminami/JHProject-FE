/**
 * This mixin contains the following.
 *
 * data:
 *     localValues - This is used to store a local copy of the selected
 *         algorithm and the parameter values
 *
 * computed:
 *     selectedJob
 *     showParams
 *
 * watch
 *     values
 *     localValues
 */
export default {
  data() {
    return {
      localValues: {
        name: '',
        job_id: '',
        parameters: []
      }
    }
  },
  computed: {
    selectedJob() {
      if (!this.jobs || this.localValues.name.length === 0) {
        this.localValues.parameters = []
        return {}
      }
      const newSelectedJob = this.jobs.filter(a => a.name === this.localValues.name)[0]

      this.localValues.job_id = newSelectedJob.job_id
      this.localValues.parameters = newSelectedJob.parameters
      .map(param => ({
        /**
         * The following fields _cannot_ be changed by the user.
         * Fields are copied to component-specific object for easy retrival.
         */
        name: param.name,
        type: param.type,
        info: param.info,
        default: param.value,

        /**
         * 'required' field is not in the protocol, but maybe it should be.
         * Boolean() ensures that it is set to false if undefined.
         */
        required: Boolean(param.required),

        /**
         * The following fields _can_ be changed by the user.
         * This initializes the value to default value specified by the
         * machine learning server, but it can be freely changed since the same
         * value is stored in the 'default' field as well.
         */
        value: param.value,

        /**
         * The following fields are used for generating the HTML input, and
         * correspond to the 'type' and 'step' attributes in the <input> tag.
         */
        htmlType: this.paramTypeToHtmlType(param.type),
        htmlStep: this.paramTypeToHtmlStep(param.type),

        /**
         * If set to false, the default value is sent instead of the user
         * specified value.
         */
        enabled: true
      }))
      return newSelectedJob
    },
    showParams() {
      const params = this.localValues.parameters
      return params && params.length > 0
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
        this.$emit('change', this.localValues, this.index)
      },
      deep: true
    }
  },
  methods: {
    paramTypeToHtmlType(type) {
      switch (type) {
        case 'string':
        case 'int|string':
          return 'text'

        case 'integer':
        case 'int':
        case 'float':
        case 'number':
          return 'number'

        default:
          return 'text'
      }
    },
    paramTypeToHtmlStep(type) {
      switch (type) {
        case 'integer':
        case 'int':
          return 1

        case 'float':
        case 'number':
          return 0

        default:
          return false
      }
    }
  }
}
