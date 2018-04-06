<template>
  <v-app>
    <v-navigation-drawer dark persistent v-model="sidebar" :mini-variant.sync="mini"
    disable-resize-watcher fixed app>
      <v-list>
        <v-list-tile v-for="(item, i) in items" :key="i" :to="item.path">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-expansion-panel expand flat>
          <v-expansion-panel-content>
            <div slot="header">
              Admin Tools
            </div>
            <v-card>
              <v-list-tile v-for="(adminItem, i) in adminItems" :key="i" :to="adminItem.path">
                <v-list-tile-action>
                  <v-icon>{{ adminItem.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>{{ adminItem.title }}</v-list-tile-content>
              </v-list-tile>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="sidebar = !sidebar"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/files" tag="span" style="cursor: pointer">
          {{ title }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content >
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      sidebar: false,
      mini: false,
      items: [
        {
          icon: 'home',
          title: 'Files',
          path: '/files'
        },
        {
          icon: 'assignment',
          title: 'Machine Learning',
          path: '/ml'
        },
        {
          icon: 'settings',
          title: 'Settings',
          path: '/settings'
        },
        {
          icon: 'verified_user',
          title: 'Admin Console',
          path: '/admin/console'
        }
      ],
      adminItems: [
        {
          icon: 'dashboard',
          title: 'Dashboard',
          path: '/admin/dashboard'
        },
        {
          icon: 'people',
          title: 'User Permissions',
          path: '/admin/users'
        },
        {
          icon: 'swap_vertical_circle',
          title: 'Server Settings',
          path: '/admin/server-settings'
        },
        {
          icon: 'security',
          title: 'Project Controls',
          path: '/admin/project-controls'
        }
      ],
      title: 'Digital Pathology Viewer'
    }
  },
  name: 'App'
}
</script>

<style scoped>
/* Put custom CSS here. */
</style>
