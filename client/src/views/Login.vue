<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <div
            class="logo"
            style="font-size: 3rem; color: #fff; margin-top: 35px"
          >
            Meeting Scheduler
          </div>
          <div
            class="log-in"
            style="
              font-size: 2rem;
              color: #0f817a;
              margin-top: 35px;
              margin-bottom: 15px;
            "
          >
            LOG IN
          </div>
          <b-form @submit="onSubmit">
            <b-form-group
              id="username-group"
              label="Username:"
              label-for="input-1"
              style="color: #fff"
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
              style="color: #fff"
            >
              <b-form-input
                id="input-2"
                v-model="password"
                placeholder="Enter password"
                type="password"
                required
              ></b-form-input>
            </b-form-group>

            <b-button
              style="background-color: #0f817a; color: #cff4f4"
              type="submit"
              variant="primary"
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
export default {
  mounted() {
    document.body.style.backgroundColor = '#232526'
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
          console.log(response.data)
          if (response.data.message === 'Log-in successful') {
            localStorage.setItem('id', response.data.id)
            this.$router.push('/home')
            this.$router.go(0)
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
