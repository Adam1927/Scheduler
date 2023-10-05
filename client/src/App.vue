<template>
  <div id="app">
    <b-nav tabs>
      <b-nav-item href="/login" style="margin-left:auto;display:flex;justify-content:center;">Login</b-nav-item>
      <b-nav-item href="/signup" style="margin-right:auto;display:flex;justify-content:center;">Sign up</b-nav-item>
    </b-nav>
    <!-- Render the content of the current page view -->
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
