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
            class="sign-up"
            style="
              font-size: 2rem;
              color: #0f817a;
              margin-top: 35px;
              margin-bottom: 15px;
            "
          >
            SIGN UP
          </div>
          <b-form @submit="onSubmit">
            <b-form-group
              id="name-group"
              label="Name:"
              label-for="input-1"
              style="color: #fff"
            >
              <b-form-input
                id="input-1"
                v-model="name"
                placeholder="Enter name"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="username-group"
              label="Username:"
              label-for="input-2"
              style="color: #fff"
            >
              <b-form-input
                id="input-2"
                v-model="username"
                placeholder="Enter username"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="password-group"
              label="Password:"
              label-for="input-3"
              style="color: #fff"
            >
              <b-form-input
                id="input-3"
                v-model="password"
                placeholder="Enter password"
                type="password"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="confirm-password-group"
              label="Confirm Password:"
              label-for="input-4"
              style="color: #fff"
            >
              <b-form-input
                id="input-4"
                v-model="confirmPassword"
                placeholder="Enter password"
                type="password"
                required
              ></b-form-input>
            </b-form-group>

            <b-button
              style="background-color: #0f817a; color: #cff4f4"
              type="submit"
              variant="primary"
              >Sign up</b-button
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
      name: '',
      username: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match')
        this.name = ''
        this.username = ''
        this.password = ''
        this.confirmPassword = ''
      } else {
        Api.post('/users/register', {
          name: this.name,
          username: this.username,
          password: this.password
        })
          .then((response) => {
            if (response.data.message === 'Registration successful') {
              localStorage.setItem('id', response.data.id)
              this.$router.push('/home')
              this.$router.go(0)
            }
          })
          .catch((error) => {
            console.error(error)
            alert('Registration failed')
            this.name = ''
            this.username = ''
            this.password = ''
            this.confirmPassword = ''
          })
      }
    }
  }
}
</script>
