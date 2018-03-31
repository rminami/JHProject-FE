<template>
    <v-container xs10 offset-xs1>
        <v-list two-line>
            <!-- List of directories in current path -->
            <v-subheader v-if="dirs.length > 0" inset>Folders</v-subheader>
            <v-list-tile avatar v-for="dir in dirs" :key="dir.id"
                v-on:click="$router.push(dir.file_path)" @click="">
                <v-list-tile-avatar>
                    <v-icon :class="[dir.iconClass]">{{ dir.icon }}</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title>{{ dir.file_name }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon ripple>
                        <v-icon color="grey lighten-1">more_vert</v-icon>
                    </v-btn>
                </v-list-tile-action>
            </v-list-tile>

            <!-- Divider -->
            <v-divider inset v-if="dirs.length > 0"></v-divider>

            <!-- List of files in current path -->
            <v-subheader inset>Files</v-subheader>
            <v-list-tile avatar v-for="file in files" :key="file.id" @click="">
                <v-list-tile-avatar>
                    <v-icon :class="[file.iconClass]">{{ file.icon }}</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title>{{ file.file_name }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon ripple>
                        <v-icon color="grey lighten-1">more_vert</v-icon>
                    </v-btn>
                </v-list-tile-action>
            </v-list-tile>

        </v-list>
    </v-container>
</template>

<script>
import * as axios from 'axios'
import * as url from 'url'

const SERVER_URL = 'http://127.0.0.1:3000/'

export default {
    data: () => ({
        dirs: [],
        files: [],
    }),

    created() {
        console.log(this.$route.path)
        this.getFiles()
    },

    watch: {
        $route: 'getFiles',
    },

    methods: {
        getFiles() {
            axios({
                url: url.resolve(SERVER_URL, this.$route.path),
                responseType: 'json',
                params: {
                    view: 'meta',
                    include_children: true,
                },
            })
            .then(res => {
                const processed = this.attachIcons(res.data.children)
                this.dirs = processed.filter(item => item.type === 'directory')
                this.files = processed.filter(item => item.type !== 'directory')
            })
            .catch(err => {
                console.log(err)
            })
        },
        attachIcons(items) {
            return items.map(item => {
                const res = item
                switch (res.type) {
                case 'directory':
                    res.icon = 'folder'
                    res.iconClass = 'grey lighten-1 white--text'
                    return res
                case 'tabular':
                    res.icon = 'storage'
                    res.iconClass = 'blue white--text'
                    return res
                case 'scalable_image':
                    res.icon = 'image'
                    res.iconClass = 'amber white--text'
                    return res
                default:
                    res.icon = 'note'
                    res.iconClass = 'teal white--text'
                    return res
                }
            })
        },
    },
    name: 'Files',
}
</script>

<style scoped>
h1, h2 {
    font-weight: normal;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
