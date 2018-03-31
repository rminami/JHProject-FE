<template>
    <v-app>
        <v-navigation-drawer persistent v-model="sidebar" disable-resize-watcher fixed app>
            <v-list>
                <v-list-tile
                    v-for="(item, i) in items"
                    :key="i"
                    :to="item.path"
                >
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>{{ item.title }}</v-list-tile-content>
                </v-list-tile>
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
        <v-content>
            <router-view/>
        </v-content>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            sidebar: false,
            items: [
                {
                    icon: 'home',
                    title: 'Files',
                    path: '/files',
                },
                {
                    icon: 'assignment',
                    title: 'Machine Learning',
                    path: '/ml',
                },
                {
                    icon: 'dashboard',
                    title: 'Admin Console',
                    path: '/admin',
                },
                {
                    icon: 'settings',
                    title: 'Settings',
                    path: '/settings',
                },
            ],
            title: 'Digital Pathology Viewer',
        }
    },
    name: 'App',
}
</script>

<style scoped>
/* Put custom CSS here. */
</style>

