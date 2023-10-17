<template>
  <div>
    <h2>Meeting Scheduler</h2>
    <b-container>
      <div class="heading">
        Managed Teams
        <b-button pill style="background-color: #0f817a" @click="addTeam()">
          <b-icon icon="plus-circle"></b-icon>
        </b-button>
      </div>
      <b-list-group horizontal class="team-list">
        <b-card
          v-for="team in managedTeams"
          :key="team._id"
          class="team-card"
          @click="openTeam(team._id)"
        >
          {{ team.name }}
          <b-button
            variant="outline-danger"
            size="sm"
            @click="deleteTeam(team._id)"
          >
            <b-icon icon="trash"></b-icon>
          </b-button>
        </b-card>
        <b-card class="team-card" v-if="managedTeams.length === 0"
          >No teams found.</b-card
        >
      </b-list-group>
    </b-container>
    <b-container>
      <div class="heading">Teams You Belong To</div>
      <b-list-group horizontal class="team-list">
        <b-card
          v-for="team in memberOfTeams"
          :key="team._id"
          class="team-card"
          @click="openTeam(team._id)"
        >
          {{ team.name }}
        </b-card>
        <b-card class="team-card" v-if="memberOfTeams.length === 0"
          >No teams found.</b-card
        >
      </b-list-group>
    </b-container>
    <img v-b-toggle.sidebar-1 src="../assets/side-bar-man.gif" alt="side bar" id="side-bar-man" />
    <SideBarVue/>
  </div>
</template>

<script>
import { Api } from '@/Api'
import SideBarVue from '../components/SideBar.vue'
export default {
  name: 'home',
  components: {
    SideBarVue
  },
  data() {
    return {
      managedTeams: [],
      memberOfTeams: []
    }
  },
  mounted() {
    Api.get('/users/' + sessionStorage.getItem('id') + '/teams')
      .then((response) => {
        this.managedTeams = response.data.managedTeams
        this.memberOfTeams = response.data.memberOfTeams
      })
      .catch((error) => {
        alert(error.response.data.message || 'Failed to retrieve teams')
        console.log(error)
      })
  },
  methods: {
    deleteTeam(teamId) {
      Api.delete('/teams/' + teamId)
        .then((response) => {
          if (response.status === 200) {
            this.managedTeams = this.managedTeams.filter(
              (team) => team._id !== teamId
            )
            this.memberOfTeams = this.memberOfTeams.filter(
              (team) => team._id !== teamId
            )
            this.$router.go(0)
          }
        })
        .catch((error) => {
          alert(error.response.data.message || 'Team deletion failed')
          console.log(error)
        })
    },
    openTeam(teamId) {
      this.$router.push('/teamgigo/' + teamId)
    },
    addTeam() {
      this.$router.push('/teams/new')
    }
  }
}
</script>
<style scoped>
.team-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.team-card {
  padding: 2%;
  margin: 2%;
  width: 200px;
  display: inline-block;
  background-color: #cff4f4;
  color: #0f817a;
}
h2 {
  font-size: 2rem;
  color: #fff;
  margin-top: 35px;
}
#side-bar-man {
  position: fixed;
  bottom: 5%;
  left: 5%;
  width: 20%;
}
</style>
