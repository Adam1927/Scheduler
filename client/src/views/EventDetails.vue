<template>
  <div>
    <div class="heading">
      {{ eventName }}
      <b-button v-if="isManager" v-b-toggle.sidebar-2 size="sm" style="background-color: #0f817a"
        ><b-icon icon="pencil"></b-icon
      ></b-button>
    </div>
    <h2>Choose your availabilities:</h2>
    <b-container style="overflow-y: auto">
      <b-list-group style="display: flex; flex-direction: row">
        <b-list-group-item
          v-for="index in days.length"
          :key="index"
          style="background-color: #cff4f4; color: white; margin-right: 10px"
        >
          <div style="height: 18%; color: black; font-size: 115%">
            {{ days[index - 1].toDateString() }}
          </div>
          <section>
            <b-list-group>
              <b-list-group-item
                v-for="row in 9"
                :key="row"
                style="background-color: #232526; height: 10%"
                @click="ToggleSlot(9 * (index - 1) + row - 1)"
                :class="{ pressed: selectedSlots[9 * (index - 1) + row - 1] }"
                >{{ row + 7 }}</b-list-group-item
              ></b-list-group
            >
          </section>
        </b-list-group-item>
      </b-list-group>
    </b-container>
    <section>
      <b-button
        id="submit-button"
        type="submit"
        @click="onSubmit"
        variant="primary"
        style="margin-top: 1%; margin-bottom: 2%; margin-right: 2%"
        >Submit</b-button
      >
      <b-button
        v-if="isManager"
        id="optimal-time-button"
        type="submit"
        @click="getOptimal"
        variant="primary"
        style="margin-top: 1%; margin-bottom: 2%"
        >Get Optimal Time</b-button
      >
    </section>
    <b-sidebar
      id="sidebar-2"
      bg-variant="dark"
      text-variant="light"
      backdrop
      shadow
    >
      <b-form-group
        id="name-group"
        label="Change Event Name:"
        label-for="input-1"
        class="form-group"
      >
        <b-form-input
          id="input-1"
          placeholder="Enter event name"
          v-model="eventName"
          style="width: 80%; display: inline-block"
          required
        ></b-form-input>
      </b-form-group>
      <section style="display:flex; flex-direction: column; align-items: center;">
        <b-button
          id="submit-button"
          @click="editEvent()"
          variant="primary"
          style="margin-top: 3%; margin-bottom: 2%; margin-right: 2%"
          >Submit</b-button
        ><b-button
          @click="deleteEvent()"
          variant="danger"
          style="margin-top: 2%; margin-bottom:5%; margin-right: 2%"
          >Delete Event</b-button
        >
      </section>
      <img src="../assets/side-bar-bottom.gif" alt="Random Image" />
    </b-sidebar>
    <HomeButtonVue />
  </div>
</template>

<script>
import { Api } from '@/Api'
import HomeButtonVue from '../components/HomeButton.vue'
export default {
  name: 'event-details',
  components: { HomeButtonVue },
  data() {
    return {
      eventName: '',
      days: [],
      selectedSlots: [],
      isManager: false
    }
  },
  mounted() {
    Api.get('/events/' + this.$route.params.event_id)
      .then((response) => {
        if (response.data.event.isLocked) {
          this.$router.push(
            '/teams/' + this.$route.params.team_id + '/events/' + this.$route.params.event_id + '/selected-slot'
          )
        }
        this.eventName = response.data.event.name
        const startDate = new Date(response.data.event.startDate)
        const endDate = new Date(response.data.event.endDate)
        const days = []
        for (
          let d = new Date(startDate);
          d <= new Date(endDate);
          d.setDate(d.getDate() + 1)
        ) {
          days.push(new Date(d))
        }
        this.days = days
        this.selectedSlots = new Array(days.length * 9).fill(false)
      })
      .catch((error) => {
        alert(error.response.data.message || 'Event not found')
        console.log(error)
      })
    Api.get('/teams/' + this.$route.params.team_id).then((response) => {
      this.isManager =
        response.data.team.manager === sessionStorage.getItem('id')
    })
  },
  methods: {
    ToggleSlot(slot) {
      console.log('ToggleSlot called with slot:', slot)
      this.$set(this.selectedSlots, slot, !this.selectedSlots[slot])
      console.log('selectedSlots:', this.selectedSlots)
    },
    onSubmit() {
      Api.post('/events/' + this.$route.params.event_id + '/availability', {
        availabilities: this.selectedSlots,
        userId: sessionStorage.getItem('id')
      })
        .then((response) => {
          if (response.status === 200) {
            alert('Availability submitted successfully')
          }
        })
        .catch((error) => {
          alert(error.response.data.message || 'Availability submission failed')
          console.log(error)
        })
    },
    getOptimal() {
      this.$router.push(
        '/teams/' +
          this.$route.params.team_id +
          '/events/' +
          this.$route.params.event_id +
          '/optimal'
      )
    },
    editEvent() {
      Api.patch('/events/' + this.$route.params.event_id, {
        name: this.eventName
      })
        .then((response) => {
          if (response.status === 200) {
            alert('Event edited successfully!')
            window.location.reload()
          }
        })
        .catch((error) => {
          alert(error.response.data.message || 'Event edit failed')
          console.log(error)
        })
    },
    deleteEvent() {
      Api.delete('/events/' + this.$route.params.event_id)
        .then((response) => {
          if (response.status === 200) {
            alert('Event deleted successfully!')
            this.$router.push('/teams/' + this.$route.params.team_id)
          }
        })
        .catch((error) => {
          alert(error.response.data.message || 'Event deletion failed')
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
.pressed {
  background-color: #0f817a !important;
  color: white;
}
h2 {
  font-size: 2rem;
  color: #fff;
  margin-top: 15px;
}
#optimal-time-button {
  background-color: #806319;
  color: white;
}
</style>
