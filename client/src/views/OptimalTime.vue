<template>
  <div>
    <h2>Meeting Scheduler</h2>
    <div class="heading">{{ 'Optimal Times' }}</div>
    <h3 style="color: white">{{ 'Select the preffered time:' }}</h3>
    <b-list-group style="align-items: center">
      <b-list-group-item
        class="slot-card"
        v-for="slot in slots"
        :key="slot"
        @click="selectSlot(slot._id)"
        :class="{ pressed: selectedSlot === slot._id }"
      >
        <div>{{ slot.time + ':00' }}</div>
        <div>{{ new Date(slot.date).toDateString() }}</div>
        <div>{{ 'Attendees:' + slot.attendees }}</div>
      </b-list-group-item>
    </b-list-group>
    <b-button
      id="submit-button"
      type="submit"
      @click="onSubmit"
      variant="primary"
      style="margin-top: 5%; margin-bottom: 5%"
      >Submit</b-button
    >
    <img
      src="../assets/round-men.gif"
      alt="Random Image"
      style="position: fixed; top: 25%; left: 5%; width: 20%;"
      class="round-men"
    />
    <img
      src="../assets/round-men.gif"
      alt="Random Image"
      style="position: fixed; top: 25%; right: 5%; width: 20%;"
      class="round-men"
    />
  </div>
</template>

<script>
import { Api } from '@/Api'
export default {
  name: 'optimal-time',
  components: {},
  data() {
    return {
      eventName: '',
      numberOfVotes: 0,
      slots: [],
      selectedSlot: ''
    }
  },
  mounted() {
    Api.get('/events/' + this.$route.params.id)
      .then((response) => {
        this.eventName = response.data.name
        this.numberOfVotes = response.data.usersVoted
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.message || 'Event not found')
      })
    Api.post('/events/' + this.$route.params.id + '/optimal_time', {
      userId: sessionStorage.getItem('id')
    })
      .then((response) => {
        this.slots = response.data.optimal_time
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.message || 'Event not found')
        this.$router.push('/events/' + this.$route.params.id)
      })
  },
  methods: {
    selectSlot(slotId) {
      this.selectedSlot = slotId
    },
    onSubmit() {
      Api.post('/events/' + this.$route.params.id + '/selected_slot', {
        userId: sessionStorage.getItem('id'),
        slotId: this.selectedSlot
      })
        .then((response) => {
          alert('Vote submitted successfully')
          this.$router.push('/events/' + this.$route.params.id)
        })
        .catch((error) => {
          console.log(error)
          alert(error.response.data.message || 'Event not found')
          this.$router.push('/events/' + this.$route.params.id)
        })
    }
  }
}
</script>

<style scoped>
h2 {
  font-size: 2rem;
  color: #fff;
  margin-top: 35px;
}
.slot-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  width: 100%;
  max-width: 400px;
  background-color: #0f817a;
  color: white;
  border-radius: 10px;
}
.slot-card:hover {
  background-color: #114a94;
}
.pressed {
  background-color: #114a94;
}
@media screen and (max-width: 768px) {
  .round-men {
    display: none;
  }
}
</style>
