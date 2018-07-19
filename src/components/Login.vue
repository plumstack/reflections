<template>
<div>
<form id="loginForm" action="http://localhost:8085/api/auth/google" method="GET">
   <button class='pure-button'>Login</button>
</form>
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
