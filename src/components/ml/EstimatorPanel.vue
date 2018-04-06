<!-- <template>
  <v-flex xs3>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline">{{ boxTitle }}</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-select
            label="Select Algorithm"
            :items="algos.map(algo => algo.algorithm_name)"
            v-model="algoName"
            max-height="400"
            style="white-space:nowrap; text-overflow:ellipsis;"
          ></v-select>
          <v-select
            label="Select Columns"
            :items="cols"
            v-model="selectedCols"
            multiple
            autocomplete
            chips
            deletable-chips
            clearable
            color="blue"
            max-height="400"
          ></v-select>
          <h3>Parameters</h3>
          <div>

          </div>
          <v-switch
            label="k fold validation?"
            v-model="kfold"
            color="orange"
          ></v-switch>
          <v-text-field
            label="k Value"
            :rules="[(v) => parseInt(v) <= 25 || 'k cannot be greater than 25']"
            type="number"
            v-model="kValue"
            :disabled="!kfold"
          ></v-text-field>
        </v-form>

      </v-card-text>
      <v-card-actions>
        <v-btn flat color="orange">Close</v-btn>
        <v-btn flat color="orange">Options</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import axios from 'axios'
import url from 'url'

const ML_ENDPOINT = 'http://127.0.0.1:7000'

export default {
  props: ['boxTitle'],
  data() {
    return {
      selectedCols: [],
      kfold: true,
      kValue: 0,
      speed: 20,
      cols: [],
      algoName: '',
      algos: [{algorithm_name: 'error'}],
    }
  },
  watch() {

  },
  computed: {
    algo: (this.algos && this.algoName) ? this.algos.filter(a => a.algorithm_name === this.algoName) : {}
  },
  components: {
  },
  created() {
    this.getColumns()
    this.getAlgos()
  },
  methods: {
    getColumns() {
      axios({
        url: url.resolve(BE_ENDPOINT, '/files/processed-data.csv'),
        responseType: 'json',
        params: {
          view: 'headers',
        }
      })
      .then(res => {
        this.cols = res.data.columns
          .filter(col => col.type === 'number')
          .map(col => col.header)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script> -->
