<!-- Currently the teams page shows all teams the user is a part of instead of the details of one team specifically
the team members + events will only show up if they exist as part of the team. For some reason the users aren't added to the
members field of the team, tried figuring out why (gave up) this should work though. Not happy with the styling yet-->

<template>
  <div >
    <div
        class="logo"
        style="font-size: 3rem; color: #fff; margin-top: 35px">
        Team Page
    </div>
    <div v-if="!edit">
    <div
        class="title"
        style="font-size: 2rem; color: #fff; margin-top: 10px">
        {{ team.name }}
    </div>
    <b-col>
      <b-card style="background-color: #0f817a; margin-top: 12px">
        <b-card class="base-card">
          <b-row>
            <b-col class="border-0 text-left">
              <div style="text-left; margin: 5%">
                Manager: {{ team.manager.name }}<br>
                Username: {{ team.manager.username }}
              </div>
            </b-col>
            <b-col cols="3">
              <div style="margin: 5%; ml-auto">
                <b-button pill v-if="!isManager" :style="{ backgroundColor: edit ? '#dc3545' : '#0f817a' }" class="border-0" @click="edit = !edit">
                  <b-icon icon="gear-fill"></b-icon>
                </b-button>
              </div>
            </b-col>
          </b-row>
          <div>
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
              <b-card class="border-0 text-left" v-for="event in team.events" @click="openEvent(event._id)"
              :key="event._id">
                Name: {{ event.name }}<br>
                Start Date: {{ event.endDate }}<br>
                End Date: {{ event.endDate }}<br>
                <b-button @click="openEvent(event._id)">Open</b-button>
              </b-card>
            </b-card>
          </div>
        </b-card>
      </b-card>
      </b-col>
    </div>
    <!--alternate page version if edit mode-->
      <div v-if="edit">
        <div v-if="!editText" @click="editText = !editText"
        class="title"
        style="font-size: 2rem; color: #fff; margin-top: 10px">
        {{ team.name }}
        <b-icon icon="pencil-fill" inline></b-icon>
        </div>
        <b-input v-else v-model="editedText" @keyup.enter="saveTeamName" ref="editInput" placeholder="Type new team name and press Enter to save"
          class="transparent-input"
        ></b-input>
        <b-card style="background-color: #0f817a; margin-top: 12px">
          <b-card class="base-card">
            <b-row>
              <b-col class="border-0 text-left">
                <div style="text-left; margin: 5%">
                  Manager: {{ team.manager.name }}<br>
                  Username: {{ team.manager.username }}
                </div>
              </b-col>
              <b-col cols="3">
                <div style="margin: 5%; ml-auto">
                  <b-button pill :style="{ backgroundColor: edit ? '#dc3545' : '#0f817a' }" class="border-0" @click="edit = !edit">
                    <b-icon icon="gear-fill"></b-icon>
                  </b-button>
                </div>
              </b-col>
            </b-row>
            <div>
            </div>
            <div v-if="team.members.length>0">
              <b-card class="text-left ">
                Team members:
                <b-card class="border-0 text-left" v-for="member in team.members"
                :key="member._id">
                <b-row>
                  <b-col>
                  Name: {{ member.name }}<br>
                  Username: {{ member.username }}
                </b-col>
                <b-col cols="5" style="float-end">
                  <b-button class="btn btn-danger" style="margin: 2%" @click="removeMember(member._id)">
                    <b-icon icon="x-circle"></b-icon>
                  </b-button>
                </b-col></b-row>
                </b-card>
                <b-card class="border-0"><b-button v-if="!isEditTeam" @click="editTeam, isEditTeam = !isEditTeam"><b-icon icon="person-plus-fill"></b-icon></b-button></b-card>
                <div v-if="isEditTeam">
                  <div>
                    <b-button class="btn btn-danger" style="max-width: 35%; margin: 2%" @click="deleteAllMembers">
                      Delete all members
                    </b-button>
                    <b-form @submit.prevent="addItem">
                      <p>Enter the names of all the new members you'd like in your team:</p>
                      <b-input
                        id="newItem"
                        v-model="newMember"
                        placeholder="Type a new member and press Enter to add"
                      ></b-input>
                    </b-form>
                    <div v-if="newTeamMembers.length > 0">
                      <h5>{{team.name}} members:</h5>
                      <ul>
                        <li v-for="(item, index) in newTeamMembers" :key="index">{{ item }}</li>
                      </ul>
                      <b-button @click="saveTeamMembers" variant="primary">Save Selection</b-button>
                    </div>
                  </div>
                  <!--
                  <b-form @submit="onSubmit">
                    <AddMemberVue
                      :selectedUserIds="this.team.members"
                      @userSelected="addUser"
                      @userRemoved="removeUser"
                    />
                    <b-button id="submit-button" type="submit" variant="primary"
                      >Save</b-button
                    >
                  </b-form>-->
                </div>
              </b-card>
            </div>
            <div v-if="team.events.length>0">
              <b-card class="text-left ">
                Team events:
                <b-card class="border-0 text-left" v-for="event in team.events"
                :key="event._id" @click="openEvent(event._id)">
                  Name: {{ event.name }}<br>
                  Start Date: {{ event.endDate }}<br>
                  End Date: {{ event.endDate }}
                </b-card>
              </b-card>
            </div>
            <div class="d-flex align-items-center justify-content-center">
              <b-button class="btn btn-info" style="max-width: 35%; margin: 2%" @click="addEvent">
                <b-icon icon="calendar-plus"></b-icon>
                Add event
              </b-button>
              <b-button class="btn btn-danger" style="max-width: 35%; margin: 2%" @click="deleteAllEvents">
                Delete all events
              </b-button>
            </div>
            <div class="d-flex align-items-center justify-content-center">
              <b-button v-b-modal.modal-1 class="btn btn-danger" style="max-width: 35%; margin: 2%">
                Delete team
              </b-button>
              <b-modal id="modal-1" title="Cofirm deletion" @ok="deleteTeam">
                <p class="my-4">Type DELETE to confirm</p>
                <b-input v-model="confirmText"  ref="confirmText" placeholder="Press enter when finished"
                  class="transparent-input" :hide-footer="true"
                ></b-input>
              </b-modal>
            </div>
          </b-card>
        </b-card>
      </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
// import AddMemberVue from '../components/AddMember.vue'

export default {
  mounted() {
    this.fetchUserTeam()
    this.checkManager()
    document.body.style.backgroundColor = '#232526'
  },
  components: {
    // AddMemberVue
  },
  data() {
    return {
      userID: sessionStorage.getItem('id'),
      team: null,
      teamUnpopulated: null,
      isManager: false,
      edit: false,
      editText: '',
      confirmText: '',
      isEditTeam: false,
      users: [],
      newTeamMembers: [],
      newMember: ''
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
        let response = await Api.get('/teams/' + this.$route.params.id + '?teamPopulate=true')
        console.log(response)
        console.log('hihi: 1', this.team)
        if (response.status === 200) {
          this.team = response.data.team
          console.log('hihi: 2', this.team)
          console.log('this.teams:', this.team)
        }
        response = await Api.get('/teams/' + this.$route.params.id + '?teamPopulate=false')
        console.log(response)
        if (response.status === 200) {
          this.teamUnpopulated = response.data.team
          this.users = this.teamUnpopulated.members
          console.log('this.teamUnpupulate:', this.teamUnpopulated)
        }
      } catch (error) {
        console.log(error)
        alert('User not found in team!')
      }
    },
    async fetchUser(id) {
      try {
        const response = await Api.get('/users/' + this.$route.params.id)
        return response.data.user
      } catch (error) {
        console.log(error)
        alert('User not found!')
      }
    },
    async saveTeamName() {
      const teamName = this.editedText
      try {
        const response = await Api.put('/teams/' + this.$route.params.id, {
          userId: this.userID,
          name: teamName,
          managerUsername: this.team.manager.username,
          newManager: false
        })
        console.log(this.userID)
        console.log('response.data.message', response.data.message)
        this.$router.go()
        return response.data.message
      } catch (error) {
        console.log(error)
        console.log(this.userID)
        alert('Unable to update')
      }
    },
    async deleteTeam() {
      try {
        if (this.confirmText === 'DELETE') {
          const response = await Api.delete('/teams/' + this.$route.params.id)
          console.log('Response', response.message)
        } else {
          alert('Deletion canceled')
        }
      } catch (error) {
        console.log(error)
        alert('Unable to delete')
      }
    },
    async editTeam() {
    },
    openEvent(eventId) {
      this.$router.push(
        '/teams/' + this.$route.params.id + '/events/' + eventId
      )
    },
    addEvent() {
      this.$router.push('/teams/' + this.$route.params.id + '/events/new')
    },
    async checkManager() {
      try {
        console.log('user iD', sessionStorage.getItem('id'))
        console.log('manager iD', this.team.manager)
        if (sessionStorage.getItem('id') === this.team.manager._id) {
          this.isManager = true
        } else {
          this.isManager = false
        }
      } catch {

      }
    },
    addUser(user) {
      this.teamUnpopulated.members.push(user)
    },
    removeUser(user) {
      const index = this.teamUnpopulated.members.indexOf(user)
      if (index !== -1) {
        this.teamUnpopulated.members.splice(index, 1)
      }
    },
    async saveTeamMembers() {
      try {
        const response = await Api.put('/teams/' + this.team._id + '/members', {
          userId: sessionStorage.getItem('id'),
          members: this.newTeamMembers
        })
        console.log(response)
      } catch (error) {
        console.log(error)
        console.log(error.response.data.message)
      }
    },
    addItem() {
      if (this.newMember.trim() !== '') {
        this.newTeamMembers.push(this.newMember)
        this.newMember = ''
      }
    },
    async removeMember(memberID) {
      try {
        const response = await Api.put('/teams/' + this.team._id + '/members/' + memberID, {
          requesterID: sessionStorage.getItem('id')
        })
        console.log(response)
        console.log(response.data.message)
      } catch (error) {
        console.log(error)
        console.log(error.response.data.message)
      }
    },
    async deleteAllMembers() {
      try {
        for (const member of this.team.members) {
          await Api.delete(`/teams/${this.team._id}/members/${member._id}`, {
            data: { requesterID: sessionStorage.getItem('id') }
          })
        }
        alert('Members deleted successfully')
      } catch (error) {
        console.log(error)
        alert(error.response?.data.message || 'Error deleting members')
      }
    },
    async deleteAllEvents() {
      try {
        const response = await Api.delete(`/teams/${this.$route.params.id}/events`)
        alert(response.data.message || 'Events deleted successfully')
        window.location.reload()
      } catch (error) {
        console.log(error)
        alert(error.response?.data.message || 'Error deleting events')
      }
    }

    /*
    onSubmit(event) {
      event.preventDefault()
      console.log(this.teamUnpopulated.members)
      const users = this.teamUnpopulated.members
      console.log(this.team)
      console.log(this.teamUnpopulated)
      Api.put('/teams/' + this.team._id + '/members', {
        userId: sessionStorage.getItem('id'),
        members: users
      })
        .then((response) => {
          if (response.status === 201) {
            this.$router.push('/teams/' + response.data.id)
          }
        })
        .catch((error) => {
          alert(error.response.data.message || 'Team creation failed')
          console.log(error)
        })
    }
    */
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
