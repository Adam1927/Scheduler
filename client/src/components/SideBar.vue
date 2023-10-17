<template>
  <b-sidebar id="sidebar-1" bg-variant="dark" text-variant="light" backdrop shadow>
    <div>
      <h3 style="color: white">{{ name }}</h3>
      <p style="color: white">{{ username }}</p>
    </div>
    <div class="sidebar-menu" style="display:flex; flex-direction: column; flex-wrap: wrap; justify-content: center;">
      <router-link to="/edit-profile">Edit Profile</router-link>
       <router-link to="/about">About</router-link>
       <a href="#" @click="logout">Logout</a>
    </div>
    <img src="../assets/side-bar-bottom.gif" alt="Random Image" />
  </b-sidebar>
</template>

<script>
import { Api } from '@/Api'
export default {
  data() {
    return {
      name: '',
      Username: ''
    }
  },
  mounted() {
    Api.get('/users/' + sessionStorage.getItem('id'))
      .then((response) => {
        this.name = response.data.user.name
        this.username = response.data.user.username
      })
      .catch((error) => {
        alert(error.response.data.message || 'User not found')
        console.log(error)
      })
  },
  methods: {
    logout() {
      Api.post('/users/logout')
        .then((response) => {
          if (response.status === 200) {
            sessionStorage.removeItem('id')
            this.$router.push('/login')
          }
        })
        .catch((error) => {
          alert(error.response.data.message || 'User not found')
          console.log(error)
        })
    }
  }
}
</script>
