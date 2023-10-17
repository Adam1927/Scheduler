<template>
  <div>
    <b-container>
      <b-row>
        <b-col
          style="display: flex; flex-direction: column; align-items: center"
        >
          <h1>Meeting Scheduler</h1>
          <div class="heading">ADD EVENT</div>
          <b-form @submit="onSubmit" style="width: 50%">
            <b-form-group
              id="name-group"
              label="Event Name:"
              label-for="input-1"
              class="form-group"
            >
              <b-form-input
                id="input-1"
                placeholder="Enter event name"
                v-model="eventName"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="start-date-group"
              label="Start Date:"
              label-for="input-2"
              class="form-group"
            >
              <b-form-datepicker id="input-2" v-model="startDate" required>
              </b-form-datepicker>
            </b-form-group>
            <b-form-group
              id="end-date-group"
              label="End Date:"
              label-for="input-3"
              class="form-group"
            >
              <b-form-datepicker id="input-3" v-model="endDate" required>
              </b-form-datepicker>
            </b-form-group>
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
export default {
  name: 'add-event',
  data() {
    return {
      eventName: '',
      startDate: '',
      endDate: ''
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      if (this.startDate > this.endDate) {
        alert('Start date must be before end date')
        this.eventName = ''
        this.startDate = ''
        this.endDate = ''
      } else {
        Api.post('/events', {
          name: this.eventName,
          startDate: this.startDate,
          endDate: this.endDate,
          team: this.$route.params.id
        })
          .then((response) => {
            if (response.status === 201) {
              alert('Event added successfully!')
              this.$router.push(
                '/teams/' + this.$route.params.id + '/events/' + response.data.id
              )
            }
          })
          .catch((error) => {
            alert(error.response.data.message || 'Event creation failed')
            console.log(error)
          })
      }
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 3rem;
  color: #fff;
  margin-top: 35px;
}
</style>
