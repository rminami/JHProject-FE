<template>
  <div id="particles">
    <v-container class="inside">
      <v-layout row justify-space-around>
        <v-flex xs5>
          <v-card>
            <v-card-title>
              <span class="headline">Log in</span>
            </v-card-title>
            <v-card-text class="card-text">
              <v-form>
                <v-text-field
                  name="login"
                  label="Username"
                  v-model="username"
                  type="text"
                  autocomplete="username"
                  :rules="[rules.required]"
                  aria-label="Username"
                ></v-text-field>
                <v-text-field
                  name="password"
                  label="Password"
                  v-model="password"
                  autocomplete="current-password"
                  :append-icon="pwdHidden ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (pwdHidden = !pwdHidden)"
                  :type="pwdHidden ? 'password' : 'text'"
                  :rules="[rules.required]"
                  aria-label="Password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click.prevent="login">Login</v-btn>
              <v-btn color="secondary" to="/signup">Sign up</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import particlesMixin from '@/mixins/particlesMixin'
import validatorMixin from '@/mixins/validatorMixin'
import { AUTH_REQUEST } from '@/store/actions';

export default {
  mixins: [particlesMixin, validatorMixin],
  data() {
    return {
      username: '',
      password: '',
      pwdHidden: true,
    }
  },
  methods: {
    login() {
      const { username, password } = this
      this.$store.dispatch(AUTH_REQUEST, { username, password })
      .then(() => {
        this.$router.push('/')
      })
    }
  }
}

</script>

<style lang="stylus" scoped>
.canvas
  display: block

#particles
  position: fixed
  width: 100%
  height: 100%
  background: #00356B
  background-size: cover

.inside
  position: fixed
  top: 50%
  right: 50%
  transform: translate(50%, -50%)
  max-width: 90%
  min-width: 40%
  padding: 2em 3em

.card-text
  padding-left 24px
  padding-right 24px

</style>
