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
        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="sidebar = !sidebar"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link :to="titleLink" tag="span" style="cursor: pointer">
          {{ title }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu transition="slide-y-transition" bottom offset-y>
          <v-btn flat slot="activator">{{ currentProject }}</v-btn>
          <v-list>
            <v-list-tile v-for="project in projects" :key="project" @click="changeProject(project)">
              <v-list-tile-title>{{ project }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content >
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      sidebar: false,
      mini: false,
      projects: [
        'project1',
        'project2',
        'project3'
      ],
      items: [
        {
          icon: 'home',
          title: 'Projects',
          path: '/projects'
        },
        // {
        //   icon: 'folder',
        //   title: 'Files',
        //   path: ''
        // },
        {
          icon: 'assignment',
          title: 'Machine Learning',
          path: '/ml'
        },
        {
          icon: 'view_list',
          title: 'Models',
          path: '/models'
        },
        {
          icon: 'donut_large',
          title: 'Prediction',
          path: '/prediction'
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
      title: 'Digital Pathology Viewer',
      titleLink: '/projects'
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('authLogout')
      .then(() => {
        this.$router.push('/login')
        this.sidebar = false
      })
    }
  },
  computed: mapState({
    currentProject: s => s.currentProject
  }),
  watch: {
    currentProject() {
      // this.titleLink = currentProject ? `/projects/${this.currentProject}/files` : '/projects'
      // Updates path for files link
      // this.items[1].path = `/projects/${this.currentProject}/files`

      // Updates path for models link
      // this.items[3].path = `/models/${this.currentProject}`
    }
  },
  name: 'App'
}
</script>

<style scoped>
/* Put custom CSS here. */
</style>
