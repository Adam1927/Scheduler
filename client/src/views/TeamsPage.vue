<!-- Currently the teams page shows all teams the user is a part of instead of the details of one team specifically
the team members + events will only show up if they exist as part of the team. For some reason the users aren't added to the
members field of the team, tried figuring out why (gave up) this should work though. Not happy with the styling yet-->

<template>
  <div v-if="teamsLoaded">
    <div
        class="logo"
        style="font-size: 3rem; color: #fff; margin-top: 35px">
        Meeting Scheduler
    </div>
    <div
        class="title"
        style="font-size: 2rem; color: #fff; margin-top: 10px">
        Team Page
    </div>
    <b-col>
      <b-card style="background-color: #0f817a; margin-top: 12px">
        <b-card class="base-card" v-for="team in teams"
        :key="team._id">
          {{ team.name }}
          <div>
            <b-card class="border-0 text-left">
              Manager: {{ team.manager.name }}
            </b-card>
          </div>
          <div v-if="team.members.length>0">
            <b-card class="text-left ">
              Team members:
              <b-card class="border-0 text-left" v-for="member in team.members"
              :key="member._id">
                Name: {{ member.name }}<br>
                Username: {{ member.username }}
              </b-card>
            </b-card>
          </div>
          <div v-if="team.events.length>0">
            <b-card class="text-left ">
              Team events:
              <b-card class="border-0 text-left" v-for="event in team.events"
              :key="event._id">
                Name: {{ member.name }}<br>
                Start Date: {{ event.endDate }}<br>
                End Date: {{ event.endDate }}
              </b-card>
            </b-card>
          </div>
        </b-card>
      </b-card>
    </b-col>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  mounted() {
    this.fetchUserTeam()
    document.body.style.backgroundColor = '#232526'
  },
  data() {
    return {
      userID: sessionStorage.getItem('id'),
      teams: [],
      teamsLoaded: false
    }
    // teams since a user can be part of multiple teams
  },
  methods: {
    async fetchTeam(teamID) {
      try {
        const response = await Api.get('/teams/' + teamID)
        console.log(response.data)
        return response.data.team
      } catch (error) {
        console.error(error)
        alert('Team not found!')
        // TO DO implement
      }
    },
    async fetchUserTeam() {
      try {
        const response = await Api.get('/users/' + sessionStorage.getItem('id') + '/teams')
        const managedTeams = response.data.managedTeams
        const memberOfTeams = response.data.memberOfTeams
        this.teams = managedTeams.concat(memberOfTeams)
        this.teamsLoaded = true
        console.log('this.teams:', this.teams)
      } catch (error) {
        console.log(error)
        alert('User not found in team!')
      }
    },
    async fetchUser(id) {
      try {
        const response = await Api.get('/users/' + id)
        return response.data.user
      } catch (error) {
        console.log(error)
        alert('User not found!')
      }
    }
  }
}
</script>
<style>
.base-card {
  padding: 2%;
  margin: 2%;
  font-size: 1rem
}
</style>
