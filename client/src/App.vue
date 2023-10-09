<template>
  <div id="app">
    <!-- Render the content of the current page view -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    document.body.style.backgroundColor = '#232526'
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.logo {
  font-size: 3rem;
  color: #fff;
  margin-top: 35px;
}
.form-group {
  color: #fff;
}
#submit-button {
  background-color: #0f817a;
  color: #cff4f4;
}
.heading {
  font-size: 2rem;
  color: #0f817a;
  margin-top: 35px;
  margin-bottom: 15px;
}
</style>
