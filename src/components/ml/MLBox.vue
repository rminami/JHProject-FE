<template>
  <v-flex xs4>
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
            :items="algorithms"
            v-model="algorithm"
            max-height="400"
            style="white-space:nowrap; text-overflow:ellipsis;"
          ></v-select>
          <v-select
            label="Select Columns"
            :items="options"
            v-model="selected"
            multiple
            autocomplete
            chips
            deletable-chips
            clearable
            color="blue"
            max-height="400"
          ></v-select>
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
        <v-btn flat color="orange">Share</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>

export default {
  props: ['boxTitle'],
  data() {
    return {
      selected: [],
      kfold: true,
      kValue: 0,
      speed: 20,
      options: ['Linux', 'macOS', 'Windows'],
      algorithms: ['Gaussian naive bayes', 'Bernoulli naive bayes', 'Multinomial naive bayes'], 
    }
  },
  components: {
  },
}
</script>
