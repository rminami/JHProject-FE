<template>
  <v-container>
    <v-layout row justify-space-around>
      <v-flex xs5>
        <v-card>
          <v-card-title>
            <span class="headline">Log in</span>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                name="login"
                label="Email address"
                type="email"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
              <v-text-field
                name="password"
                label="Password"
                :append-icon="pwdHidden ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (pwdHidden = !pwdHidden)"
                :type="pwdHidden ? 'password' : 'text'"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn primary>Login</v-btn>
            <v-btn secondary>Sign up</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      pwdHidden: true,
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  }
}
</script>
