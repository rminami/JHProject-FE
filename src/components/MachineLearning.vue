<template>
<div>
  <v-container fluid fill-height grid-list-xs style="padding-left: 0">
    <v-layout row>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 class="text-xs-center" mt-5>
            <h1>Machine Learning</h1>
            <p>Let's get started.</p>
          </v-flex>
        </v-layout>
        <v-layout row>
          <input-box box-title="Select input file"/>
          <ml-box box-title="ML Step 1"/>
          <ml-box box-title="ML Step 2"/>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
  
</div>
</template>

<script>
import MLBox from './ml/MLBox'
import InputBox from './ml/InputBox'

export default {
  components: {
    'ml-box': MLBox,
    'input-box': InputBox
  },
  data() {
    return {
      items: [
        { title: 'Dashboard', icon: 'dashboard' },
        { title: 'Account', icon: 'account_box' },
        { title: 'Admin', icon: 'gavel' }
      ]
    }
  }
}
</script>
