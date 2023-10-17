<template>
  <div>
    <div class="heading">{{ eventName }}</div>
    <h2>Choose your availabilities:</h2>
    <b-container style="overflow-y: auto">
      <b-list-group style="display: flex; flex-direction: row">
        <b-list-group-item
          v-for="index in days.length"
          :key="index"
          style="background-color: #cff4f4; color: white; margin-right: 10px"
        >
          <div style="height:18%; color:black; font-size:115%">{{ days[index - 1].toDateString() }}</div>
          <section>
            <b-list-group>
              <b-list-group-item
                v-for="row in 9"
                :key="row"
                style="background-color: #232526; height: 10%;"
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
        id="optimal-time-button"
        type="submit"
        @click="getOptimal"
        variant="primary"
        style="margin-top: 1%; margin-bottom: 2%"
        >Get Optimal Time</b-button
      >
    </section>
  </div>
</template>

<script>
import { Api } from '@/Api'
export default {
  name: 'event-details',
  components: {},
  data() {
    return {
      eventName: '',
      days: [],
      selectedSlots: []
    }
  },
  mounted() {
    Api.get('/events/' + this.$route.params.event_id)
      .then((response) => {
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
        '/teams/' + this.$route.params.team_id + '/events/' + this.$route.params.event_id + '/optimal'
      )
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
