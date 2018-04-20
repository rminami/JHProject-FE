/* global particlesJS */

export default {
  mounted() {
    this.initParticleJS()
  },
  methods: {
    initParticleJS() {
      particlesJS('particles', {
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
