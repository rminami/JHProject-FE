<template>
  <v-container fluid grid-list-xl>
    <v-layout row justify-start>
      <v-flex xs8 offset-xs2>
        <h1>Admin Console</h1>
      </v-flex>
    </v-layout>

    <v-layout row justify-center wrap>
      <router-link to="/admin/dashboard" tag="span" style="cursor: pointer">
        <v-card class="admin-card">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs2 class="admin-icon-wrapper">
                <v-icon large>dashboard</v-icon>
              </v-flex>
              <v-flex xs10>
                <div>
                  <h3>Admin Dashboard</h3>
                  <div>View resource usage and other things.</div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </router-link>
      <router-link to="/admin/users" tag="span" style="cursor: pointer">
        <v-card class="admin-card">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs2 class="admin-icon-wrapper">
                <v-icon large>people</v-icon>
              </v-flex>
              <v-flex xs10>
                <div>
                  <h3>User Permissions</h3>
                  <div>System-wide user control.</div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </router-link>
  </v-layout>
  <v-layout row justify-center wrap>
      <router-link to="/admin/server-settings" tag="span" style="cursor: pointer">
        <v-card class="admin-card">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs2 class="admin-icon-wrapper">
                <v-icon large>swap_vertical_circle</v-icon>
              </v-flex>
              <v-flex xs10>
                <div>
                  <h3>Server Settings</h3>
                  <div>Change backend/ML servers.</div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </router-link>
      <router-link to="/admin/project-controls" tag="span" style="cursor: pointer">
        <v-card class="admin-card">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex class="admin-icon-wrapper">
                <v-icon large>security</v-icon>
              </v-flex>
              <v-flex xs10>
                <div>
                  <h3>Project Controls</h3>
                  <div>Give users access to projects.</div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </router-link>
    </v-layout>
  </v-container>
</template>

<script>
export default {
}
</script>

<style scoped>

.admin-card {
  width: 280px;
  height: 100px !important;
  margin: 4px 4px 4px 4px;
}

.admin-icon-wrapper {
  margin-right: 8px;
}
</style>
