<template>
  <b-button
    style="bottom: 2%; right: 2%; position: fixed; background-color: #0f817a"
    id="home-button"
    variant="primary"
    @click="goHome()"
    ><b-icon icon="house"
  /></b-button>
</template>

<script>
export default {
  name: 'home-button',
  data() {
    return {}
  },
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>
