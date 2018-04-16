<template>
  <div id="particles-js">
    <v-container class="inside">
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
              <v-btn color="primary">Login</v-btn>
              <v-btn color="secondary">Sign up</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      pwdHidden: true,
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initParticleJS()
    })
  },
  methods: {
    initParticleJS() {
      particlesJS('particles-js', {
        particles: {
          number: {
            value: 200
          },
          color: {
            value: '#191970'
          },
          shape: {
            type: 'square',
            stroke: {
              width: 1,
              color: '#cccccc'
            }
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 1
            }
          },
          size: {
            value: 50
          },
          line_linked: {
            enable: true,
            distance: 100,
            color: '#ffffff',
            opacity: 0.4,
            width: 2
          },
          move: {
            enable: true,
            speed: 3
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: false,
              mode: 'repulse'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 100,
              line_linked: {
                opacity: 5,
                color: '#d45b0b',
                size: {
                  value: 20
                }
              }
            },
            bubble: {
              distance: 50,
              size: 20,
              duration: 2,
              opacity: 8,
              speed: 3
            },
            repulse: {
              distance: 10,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            }
          }
        }
      })
    }
  }
}

</script>

<style>
.canvas {
  display: block;
}

#particles-js {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #00356B;
	background-size: cover;
}

.inside {
  position: fixed;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  max-width: 90%;
  min-width: 40%;
  padding: 2em 3em;
}
</style>
