<template>
  <v-container xs6 offset-xs2>
    <v-tabs centered> 
      <v-tab>User Details</v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <!-- Content for user details card goes here. -->
            <h2>User Details</h2>
            <v-spacer></v-spacer>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>First Name</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="user.firstName"
                  single-line
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs4>
                <v-subheader>Last Name</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="user.lastName"
                  single-line
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs4>
                <v-subheader>Email</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="user.email"
                  single-line
                ></v-text-field>
              </v-flex>
            </v-layout>

          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab>Projects</v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            Content for projects card goes here.
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      editMode: false,
      user: {
        firstName: 'Adam',
        lastName: 'Barker',
        email: 'adambarker@gmail.com'
      },
      tabs: ['User Details', 'Projects']
    }
  }
}
</script>
