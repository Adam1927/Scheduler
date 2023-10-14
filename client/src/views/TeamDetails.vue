<!--This is a dummy page for now to access event details-->
<template>
  <div>
    <div class="logo">Meeting Scheduler</div>
    <b-container>
      <div class="heading">
        {{ teamName }}
        <b-button pill style="background-color: #0f817a" @click="addEvent()">
          <b-icon icon="plus"></b-icon>
        </b-button>
      </div>
      <b-list-group horizontal class="event-list">
        <b-card
          v-for="event in events"
          :key="event._id"
          class="event-card"
          @click="openEvent(event._id)"
        >
          {{ event.name }}
          <b-button
            variant="outline-danger"
            size="sm"
            @click="deleteEvent(event._id)"
          >
            <b-icon icon="trash"></b-icon>
          </b-button>
        </b-card>
        <b-card class="event-card" v-if="events.length === 0"
          >No events found.</b-card
        >
      </b-list-group>
    </b-container>
  </div>
</template>

<script>
import { Api } from '@/Api'
export default {
  name: 'team-details',
  components: {},
  data() {
    return {
      teamName: '',
      events: []
    }
  },
  mounted() {
    Api.get('/teams/' + this.$router.currentRoute.path.substring(7))
      .then((response) => {
        this.teamName = response.data.team.name
        this.events = response.data.team.events
      })
      .catch((error) => {
        alert(error.response.data.message || 'Team not found')
        console.log(error)
      })
  },
  methods: {
    deleteEvent(eventId) {
      Api.delete('/events/' + eventId)
        .then((response) => {
          if (response.status === 200) {
            this.events = this.events.filter(
              (event) => event._id !== eventId
            )
            this.$router.go(0)
          }
        })
        .catch((error) => {
          alert(error.response.data.message || 'Event deletion failed')
          console.log(error)
        })
    },
    openEvent(eventId) {
      this.$router.push('/events/' + eventId)
    },
    addEvent() {
      this.$router.push('/events/new')
    }
  }
}
</script>
  <style scoped>
.event-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.event-card {
  padding: 2%;
  margin: 2%;
  width: 200px;
  display: inline-block;
  background-color: #cff4f4;
  color: #0f817a;
}
</style>
