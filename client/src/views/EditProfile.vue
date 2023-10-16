<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <h1>Meeting Scheduler</h1>
          <div class="heading">EDIT PROFILE</div>
            <b-form @submit.prevent="onSubmit">
              <b-form-group
                id="name-group"
                label="Name:"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="name"
                  required
                  placeholder="Enter your name"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="username-group"
                label="Username:"
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  v-model="username"
                  required
                  placeholder="Enter your username"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="password-group"
                label="Password:"
                label-for="input-3"
              >
                <b-form-input
                  id="input-3"
                  v-model="password"
                  required
                  placeholder="Enter your password"
                  type="password"
                ></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary">Submit</b-button>
            </b-form>
        </b-col>
      </b-row>
    </b-container>
    <img
      src="../assets/men-row.gif"
      alt="meeting"
    />
  </div>
</template>

<script>
import { Api } from '@/Api'
export default {
  name: 'edit-profile',
  data() {
    return {
      name: '',
      username: '',
      password: '',
      putLink: ''
    }
  },
  mounted() {
    Api.get('/users/' + sessionStorage.getItem('id'))
      .then((response) => {
        this.name = response.data.user.name
        this.username = response.data.user.username
        this.putLink = response.data.links.find((link) => link.type === 'PUT')
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    onSubmit() {
      Api.put(
        this.putLink.href,
        {
          name: this.name,
          username: this.username,
          password: this.password
        },
        { withCredentials: true }
      )
        .then((response) => {
          if (response.status === 200) {
            this.$router.push('/')
          }
        })
        .catch((error) => {
          alert('Error: ' + error.response.data.message)
          console.log(error)
        })
    }
  }
}
</script>

<style>
h1 {
  font-size: 3rem;
  color: #fff;
  margin-top: 35px;
}
</style>
