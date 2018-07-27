<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link v-if='!getLoggedIn' to="/login">Login</router-link>
      <a v-else @click='logout'>Logout</a>
    </div>
    <router-view/>
    <!-- <MeetingPage /> -->
  </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import MeetingPage from '@/components/MeetingPage.vue';

export default {
  name: 'App',
  computed: mapGetters(['getLoggedIn']),
  methods: mapActions(['logout', 'checkAuth']),
  components: {
    MeetingPage,
  },
  created() {
    this.checkAuth();
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
