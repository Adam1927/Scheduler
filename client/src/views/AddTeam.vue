<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <div class="logo">Meeting Scheduler</div>
          <div class="heading">ADD TEAM</div>
          <b-form @submit="onSubmit">
            <b-form-group
              id="team-name-group"
              label="Team Name:"
              label-for="input-1"
              class="form-group"
            >
              <b-form-input
                id="input-1"
                placeholder="Enter team name"
                v-model="teamName"
                required
              ></b-form-input>
            </b-form-group>
            <AddMemberVue />
            <b-button id="submit-button" type="submit" variant="primary"
              >Create</b-button
            >
            </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Api } from '@/Api'
import AddMemberVue from '../components/AddMember.vue'
export default {
  name: 'add-team',
  data() {
    return {
      teamName: ''
    }
  },
  components: {
    AddMemberVue
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      const users = AddMemberVue.selectedUserIds
      Api.post('/teams', {
        name: this.teamName,
        user: sessionStorage.getItem('id'),
        members: users
      }).then((response) => {
        if (response.status === 201) {
          this.$router.push('/teams/' + response.data.id)
        }
      }).catch((error) => {
        alert('Error creating team')
        console.log(error)
      })
    }
  }
}
</script>

<style>
</style>
