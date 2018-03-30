<template>
    <v-container xs10 offset-xs1>
        <v-list two-line subheader>
            <v-subheader inset>Folders</v-subheader>
            <v-list-tile avatar v-for="item in items" :key="item.title" @click="">
                <v-list-tile-avatar>
                    <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon ripple>
                        <v-icon color="grey lighten-1">info</v-icon>
                    </v-btn>
                </v-list-tile-action>
            </v-list-tile>
            <v-divider inset></v-divider>
            <v-subheader inset>Files</v-subheader>
            <v-list-tile v-for="item in items2" :key="item.title" avatar @click="">
                <v-list-tile-avatar>
                    <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon ripple>
                        <v-icon color="grey lighten-1">info</v-icon>
                    </v-btn>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>
    </v-container>
</template>

<script>
import * as axios from 'axios'
import * as path from 'path'

const BE_ENDPOINT = 'http://127.0.0.1:3000/'

const attachIcon = (entry) => {
    const res = Object.assign({}, entry)
    switch (res.type) {
    case 'directory':
        res.icon = 'folder'
        return res
    case 'tabular':
        res.icon = 'database'
        return res
    case 'scalable_image':
        res.icon = 'image'
        return res
    default:
        res.icon = 'file'
        return res
    }
}

export default {
    data() {
        return {
            items: [
                { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Photos', subtitle: 'Jan 9, 2014' },
                { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Recipes', subtitle: 'Jan 17, 2014' },
                { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
            ],
            items2: [
                { icon: 'storage', iconClass: 'blue white--text', title: 'processed-data.csv', subtitle: 'Jan 20, 2014' },
                { icon: 'image', iconClass: 'amber white--text', title: 'slide_002.dzi', subtitle: 'Jan 10, 2014' },
            ],
        }
    },
    computed() {
        async () => axios.get(path.join(BE_ENDPOINT, 'files'), {
            params: {
                view: 'meta',
                include_children: true,
            },
        }).then((res) => {
            res.data.children.forEach(attachIcon)
            return res.data
        })
    },
    name: 'Files',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
