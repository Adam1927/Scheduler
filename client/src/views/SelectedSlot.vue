<template>
  <div>
    <div
      v-if="isLocked"
      style="
        display: flex;
        flex-direction: column;
        color: #0f817a;
        font-size: x-large;
        margin-top: 1%;
      "
    >
      <b-card style="background-color: #cff4f4; margin-left: 25%; margin-right: 25%;"><p>{{ this.eventName }}</p>
      <p>The meeting is scheduled on:</p>
      <p>{{ new Date(this.selctedSlot.date).toDateString() + ' - ' +  this.selctedSlot.time + ':00' }}</p></b-card>
      <img src="../assets/office.gif" style="width: 50%; margin-left: 25%" />
    </div>
    <div v-if="!isLocked">
      <b-card
        style="font-size: x-large; background-color: #6c1d1d; color: white"
        >ERROR: THIS EVENT IS NOT SCHEDULED</b-card
      ><img src="../assets/oh-oh.gif" />
    </div>
    <HomeButtonVue />
  </div>
</template>

<script>
import { Api } from '@/Api'
import HomeButtonVue from '../components/HomeButton.vue'
export default {
  name: 'selected-slot',
  components: { HomeButtonVue },
  data() {
    return {
      eventName: '',
      selctedSlot: {},
      isLocked: true
    }
  },
  mounted() {
    Api.get('/events/' + this.$route.params.event_id).then((response) => {
      this.eventName = response.data.event.name
      this.isLocked = response.data.event.isLocked
      this.selctedSlot = response.data.event.selectedSlot
    })
  }
}
</script>

<style>
</style>
