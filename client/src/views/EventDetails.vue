<template>
  <div>
    <div class="logo">Meeting Scheduler</div>
    <div class="heading">{{ eventName }}</div>
    <b-container style="overflow-y: auto">
      <b-list-group style="display: flex; flex-direction: row">
        <b-list-group-item
          v-for="index in days.length"
          :key="index"
          style="background-color: #cff4f4; color: white; margin-right: 10px"
        >
          <b-card style="background-color: #0f817a; color: white">
            {{ days[index - 1].toDateString() }}
          </b-card>
          <b-list-group>
            <b-list-group-item
              v-for="row in 9"
              :key="row"
              style="background-color: #232526"
              @click="ToggleSlot(9 * (index - 1) + row - 1)"
              :class="{ pressed: selectedSlots[9 * (index - 1) + row - 1] }"
              >{{ row + 7 }}</b-list-group-item
            ></b-list-group
          >
        </b-list-group-item>
      </b-list-group>
    </b-container>
    <div>
      <b-button
        id="submit-button"
        type="submit"
        @click="onSubmit"
        variant="primary"
        style="margin-top: 5%; margin-bottom: 5%"
        >Submit</b-button
      >
    </div>
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
    Api.get('/events/' + this.$router.currentRoute.path.substring(8))
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
      Api.post('/events/' + this.$router.currentRoute.path.substring(8) + '/availability',
        {
          availabilities: this.selectedSlots,
          userId: sessionStorage.getItem('id')
        }
      )
        .then((response) => {
          if (response.status === 200) {
            alert('Availability submitted successfully')
          }
        })
        .catch((error) => {
          alert(error.response.data.message || 'Availability submission failed')
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
</style>
