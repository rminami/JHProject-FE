<template>
  
  <v-container xs10 offset-xs1>
    <v-card>
      <v-card-title>
        <h2 class="headline">Users</h2>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="items"
        select-all
        :pagination.sync="pagination"
        :search="search"
        item-key="email"
        class="elevation-1"
        v-show="items.length > 0"
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <th>
              <v-checkbox
                primary
                hide-details
                @click.native="toggleAll"
                :input-value="props.all"
                :indeterminate="props.indeterminate"
              ></v-checkbox>
            </th>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="['text-xs-left', 'column sortable', pagination.descending
              ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td>
              <v-checkbox
                primary
                hide-details
                :input-value="props.selected"
              ></v-checkbox>
            </td>
            <td>{{ props.item.firstname }}</td>
            <td>{{ props.item.lastname }}</td>
            <td>{{ props.item.email }}</td>
            <td>
              <v-chip
                label
                small
                :color="`${props.item.role === 'Admin' ? 'red' : 'blue'} lighten-4`"
                class="ml-0"
              >
                {{ props.item.role }}
              </v-chip>
            </td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click.stop="editItem(props.item)">
                <v-icon color="grey">edit</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          No results for "{{ search }}".
        </v-alert>
      </v-data-table>
    </v-card>

    <!-- Dialog for changing user information. -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Edit User</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="close">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-form>
              <v-text-field label="First Name" v-model="editedItem.firstname" @keyup.enter="save"></v-text-field>
              <v-text-field label="Last Name" v-model="editedItem.lastname" @keyup.enter="save"></v-text-field>
              <v-text-field label="email" v-model="editedItem.email" @keyup.enter="save"></v-text-field>
              <v-select label="Role" v-model="editedItem.role" :items="roles">
                <template slot="selection" slot-scope="role">
                  <v-chip
                    label
                    :color="`${role.item === 'Admin' ? 'red' : 'blue'} lighten-4`"
                    class="ml-0"
                  >
                    {{ role.item }}
                  </v-chip>
                </template>
                <template slot="item" slot-scope="role">
                  <v-chip
                    label
                    :color="`${role.item === 'Admin' ? 'red' : 'blue'} lighten-4`"
                    class="ml-0"
                  >
                    {{ role.item }}
                  </v-chip>
                </template>
              </v-select>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" flat @click.native="close">Cancel</v-btn>
          <v-btn color="primary" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    pagination: {
      sortBy: 'firstname'
    },
    search: '',
    selected: [],
    headers: [
      { text: 'First Name', value: 'firstname' },
      { text: 'Last Name', value: 'lastname' },
      { text: 'Email', value: 'email' },
      { text: 'Role', value: 'role' },
      { text: 'Edit', value: 'edit' }
    ],
    roles: ['User', 'Admin'],
    items: [],
    editedIndex: -1,
    editedItem: {
      value: false,
      firstname: '',
      lastname: '',
      email: '',
      role: 'User'
    },
    defaultItem: {
      value: false,
      firstname: '',
      lastname: '',
      email: '',
      role: 'User'
    },
    dialog: false
  }),
  created() {
    axios.get('https://randomuser.me/api', {
      params: { results: 42 }
    })
    .then(res => {
      // const users = res.data.results
      this.items = res.data.results.map(user => ({
        firstname: this.capitalize(user.name.first),
        lastname: this.capitalize(user.name.last),
        email: user.email,
        role: Math.random() > 0.1 ? 'User' : 'Admin'
      }))
    })
    .catch(err => {
      console.log('Could not get users!')
    })
  },

  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.items.slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
      } else {
        this.items.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
