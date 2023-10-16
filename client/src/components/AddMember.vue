<template>
  <div>
    <b-form-group
      id="team-members-group"
      label="Team Members:"
      label-for="input-1"
      class="form-group"
    >
      <b-form-tags
        id="input-1"
        v-model="selectedUsers"
        no-outer-focus
        class="mb-2"
      >
        <template v-slot="{ tags, disabled, addTag, removeTag }">
          <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
            <li v-for="tag in tags" :key="tag" class="list-inline-item">
              <b-form-tag
                @remove="onRemoveTag({ tag, removeTag })"
                :title="tag"
                :disabled="disabled"
                variant="info"
                >{{ tag }}</b-form-tag
              >
            </li>
          </ul>

          <b-dropdown
            size="sm"
            variant="outline-secondary"
            block
            menu-class="w-100"
          >
            <template #button-content>
              <b-icon icon="tag-fill"></b-icon> Choose members
            </template>
            <b-dropdown-form @submit.stop.prevent="() => {}">
              <b-form-group
                label="Search tags"
                label-for="tag-search-input"
                label-cols-md="auto"
                class="mb-0"
                label-size="sm"
                :description="searchDesc"
                :disabled="disabled"
              >
                <b-form-input
                  v-model="search"
                  id="tag-search-input"
                  type="search"
                  size="sm"
                  autocomplete="off"
                ></b-form-input>
              </b-form-group>
            </b-dropdown-form>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button
              v-for="option in availableOptions"
              :key="option"
              @click="onOptionClick({ option, addTag })"
            >
              {{ option }}
            </b-dropdown-item-button>
            <b-dropdown-text v-if="availableOptions.length === 0">
              There are no users available to select
            </b-dropdown-text>
          </b-dropdown>
        </template>
      </b-form-tags>
    </b-form-group>
  </div>
</template>

<script>
import { Api } from '@/Api'
export default {
  data() {
    return {
      search: '',
      users: [],
      selectedUsers: []
    }
  },
  created() {
    Api.get('/users').then((response) => {
      this.users = response.data.users.filter(
        (user) => user._id !== sessionStorage.getItem('id')
      )
    })
  },
  computed: {
    criteria() {
      return this.search.trim().toLowerCase()
    },
    availableOptions() {
      const criteria = this.criteria
      const options = this.users.filter(
        (user) => !this.selectedUsers.includes(user.username)
      ).map((user) => user.username)
      console.log(options)
      console.log(this.selectedUsers)
      console.log(this.users)
      if (criteria) {
        return options
          .filter((username) => username.toLowerCase().indexOf(criteria) > -1)
      }
      return options
    },
    searchDesc() {
      if (this.criteria && this.availableOptions.length === 0) {
        return 'There are no users matching your search criteria'
      }
      return ''
    }
  },
  methods: {
    onOptionClick({ option, addTag }) {
      addTag(option)
      const userId = this.users.find((user) => user.username === option)._id
      this.$emit('userSelected', userId)
      this.search = ''
    },
    onRemoveTag({ tag, removeTag }) {
      removeTag(tag)
      const userId = this.users.find((user) => user.username === tag)._id
      this.$emit('userRemoved', userId)
    }
  }
}
</script>
