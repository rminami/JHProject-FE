<template>
  <div id="particles">
    <v-container class="inside">
      <v-layout row justify-space-around>
        <v-flex xs5>
          <v-card>
            <v-card-title>
              <span class="headline">Sign up</span>
            </v-card-title>
            <v-card-text class="card-text">
              <v-form>
                <v-text-field
                  name="firstname"
                  label="First name"
                  type="text"
                ></v-text-field>
                <v-text-field
                  name="lastname"
                  label="Last name"
                  type="text"
                ></v-text-field>
                <v-text-field
                  name="login"
                  label="Email address"
                  type="email"
                  autocomplete="username"
                  :rules="[rules.required, rules.email]"
                  aria-label="Email address"
                ></v-text-field>
                <v-text-field
                  name="password"
                  label="Password"
                  autocomplete="new-password"
                  v-model="pwd"
                  :append-icon="pwdHidden ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (pwdHidden = !pwdHidden)"
                  :type="pwdHidden ? 'password' : 'text'"
                  :rules="[rules.required]"
                  aria-label="Password"
                ></v-text-field>
                <v-text-field
                  name="passwordConf"
                  label="Confirm Password"
                  autocomplete="new-password"
                  v-model="pwdConf"
                  :append-icon="pwdConfHidden ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (pwdConfHidden = !pwdConfHidden)"
                  :type="pwdConfHidden ? 'password' : 'text'"
                  :rules="[rules.required, rules.pwdConfMatches]"
                  aria-label="Password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click.prevent="signup">Sign up</v-btn>
              <v-btn color="secondary" to="/login">Log in</v-btn>
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

export default {
  mixins: [particlesMixin, validatorMixin],
  data() {
    return {
      email: '',
      pwd: '',
      pwdConf: '',
      pwdHidden: true,
      pwdConfHidden: true,
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
