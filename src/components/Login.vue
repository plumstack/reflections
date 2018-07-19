<template>
<div>
<li class="menu-item main-menu-item host-button" @click="login">
<form id="loginForm" action="http://localhost:8085/api/auth/google" method="GET">
    Host a Room
</form>
</li>
</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  methods: {
    ...mapActions(['login']),
    login() {
      document.getElementById('loginForm').submit();
    },
  },
  computed: {
    url: () => `${process.env.VUE_APP_URL}/auth/login`,
  },
};

</script>

<style scoped>

</style>
