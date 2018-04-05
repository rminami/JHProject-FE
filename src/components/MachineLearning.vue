<template>
<v-container fluid>
  <v-layout column>
    <v-flex xs12 class="text-xs-center" mt-5>
      <h1>Machine Learning</h1>
      <p>Let's get started.</p>
      <ml-box box-title="Hello"/>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import MLBox from './MLBox'

export default {
  components: {
    'ml-box': MLBox
  }
}
</script>
