<template>
  <div>
    <h1>Meeting Scheduler</h1>
    <h2>{{ teamName }}</h2>
    <b-container
      overlay
      img-src="../assets/background.gif"
      img-alt="Background Image"
    >
      <b-row id="team-details-row"
        ><b-col
          ><b-list-group style="align-items: center"
            ><h3>EVENTS</h3>
            <b-list-group-item
              class="event-cards"
              v-for="event in events"
              :key="event._id"
              @click="openEvent(event._id)"
              >{{ event.name }}</b-list-group-item
            >
            <div>
              <b-button
                v-if="isManager"
                pill
                style="background-color: #0f817a"
                @click="addEvent()"
                ><b-icon icon="plus-circle"></b-icon></b-button
              ><b-button
                v-if="isManager"
                variant="danger"
                pill
                @click="deleteAllEvents()"
                >Delete All</b-button
              >
            </div></b-list-group
          ></b-col
        >
        <b-col
          ><b-list-group style="align-items: center"
            ><h3 style="margin-bottom: 5%">MEMBERS</h3>
            <b-list-group-item
              class="member-cards"
              v-for="member in members"
              :key="member._id"
              >{{ member.name }}</b-list-group-item
            ><AddMemberVue
              v-if="isManager"
              :selectedUserIds="selectedUsers"
              @userSelected="addUser"
              @userRemoved="removeUser"
              style="width: 80%" /></b-list-group
          ><b-button
            v-if="isManager"
            id="submit-button"
            type="submit"
            @click="onSubmit"
            variant="primary"
            style="margin-top: 5%; margin-bottom: 5%"
            >Submit</b-button
          ></b-col
        ></b-row
      >
    </b-container>
    <HomeButtonVue />
  </div>
</template>

<script>
import { Api } from '@/Api'
import AddMemberVue from '../components/AddMember.vue'
import HomeButtonVue from '../components/HomeButton.vue'
export default {
  name: 'team-details',
  components: { AddMemberVue, HomeButtonVue },
  data() {
    return {
      teamName: '',
      events: [],
      members: [],
      selectedUsers: [],
      isManager: false
    }
  },
  mounted() {
    Api.get('/teams/' + this.$route.params.id)
      .then((response) => {
        this.teamName = response.data.team.name
        this.events = response.data.team.events
        this.members = response.data.team.members
        this.isManager =
          sessionStorage.getItem('id') === response.data.team.manager
      })
      .catch((error) => {
        alert(error.response.data.message || 'Team not found')
        console.log(error)
      })
  },
  methods: {
    openEvent(eventId) {
      this.$router.push(
        '/teams/' + this.$route.params.id + '/events/' + eventId
      )
    },
    addEvent() {
      this.$router.push('/teams/' + this.$route.params.id + '/events/new')
    },
    onSubmit() {
      Api.post(
        '/teams/' + this.$router.currentRoute.path.substring(7) + '/members',
        {
          userId: sessionStorage.getItem('id'),
          members: this.selectedUsers
        }
      )
        .then((response) => {
          alert(response.data.message || 'Members added successfully')
          window.location.reload()
        })
        .catch((error) => {
          console.log(error)
          alert(error.response.data.message || 'Team not found')
        })
    },
    addUser(user) {
      this.selectedUsers.push(user)
    },
    removeUser(user) {
      const index = this.selectedUsers.indexOf(user)
      if (index !== -1) {
        this.selectedUsers.splice(index, 1)
      }
    },
    deleteAllEvents() {
      Api.delete('/teams/' + this.$route.params.id + '/events')
        .then((response) => {
          alert(response.data.message || 'Events deleted successfully')
          window.location.reload()
        })
        .catch((error) => {
          console.log(error)
          alert(error.response.data.message || 'Team not found')
        })
    }
  }
}
</script>
<style scoped>
h2 {
  font-size: 2rem;
  color: #0f817a;
  margin-top: 35px;
}
h3 {
  font-size: 1.5rem;
  color: #fff;
  margin-top: 35px;
}
.event-cards {
  background-image: linear-gradient(315deg, #0f817a 0%, #cff4f4 74%);
  color: #000000;
  margin-top: 5%;
  margin-bottom: 5%;
  border-radius: 30px;
  width: 80%;
}
.event-cards:hover {
  background-image: linear-gradient(315deg, #cff4f4 0%, #0f817a 74%);
}
.member-cards {
  background-image: linear-gradient(315deg, #cff4f4 0%, #0f817a 74%);
  color: #000000;
  width: 80%;
}
@media screen and (max-width: 768px) {
  #team-details-row {
    flex-direction: column;
    align-items: center;
  }
}
</style>
