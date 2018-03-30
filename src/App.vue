<template>
    <v-app>
        <v-navigation-drawer persistent v-model="drawer" disable-resize-watcher fixed app>
            <v-list>
                <v-list-tile value="true" v-for="(item, i) in items" :key="i" @click="" v-on:click="[this.$router.push('/')]">
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title v-text="title"></v-toolbar-title>
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
            drawer: false,
            items: [
                {
                    icon: 'assignment',
                    title: 'Machine Learning',
                },
                {
                    icon: 'settings',
                    title: 'Settings',
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

