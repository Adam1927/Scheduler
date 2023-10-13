<template>
  <div>
    <RegisterHeaderVue />
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <div class="logo">Meeting Scheduler</div>
          <div class="heading">LOG IN</div>
          <b-form @submit="onSubmit">
            <b-form-group
              id="username-group"
              label="Username:"
              label-for="input-1"
              class="form-group"
            >
              <b-form-input
                id="input-1"
                v-model="username"
                placeholder="Enter username"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="password-group"
              label="Password:"
              label-for="input-2"
              class="form-group"
            >
              <b-form-input
                id="input-2"
                v-model="password"
                placeholder="Enter password"
                type="password"
                required
              ></b-form-input>
            </b-form-group>

            <b-button id="submit-button" type="submit" variant="primary"
              >Log in</b-button
            >
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Api } from '@/Api'
import RegisterHeaderVue from '../components/RegisterHeader.vue'
export default {
  name: 'login',
  components: {
    RegisterHeaderVue
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      Api.post('/users/login', {
        username: this.username,
        password: this.password
      })
        .then((response) => {
          if (response.data.message === 'Log-in successful') {
            sessionStorage.setItem('id', response.data.id)
            this.$router.push('/')
            // brings back user to login page by reloading so commented out
            // this.$router.go(0)
          }
        })
        .catch((error) => {
          console.error(error)
          alert('Log-in failed')
          this.username = ''
          this.password = ''
        })
    }
  }
}
</script>
