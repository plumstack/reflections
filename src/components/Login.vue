<template>
<div>
    <form :action='url' method='POST'>
        <button @click='login'>Login</button>
    </form>
</div>
</template>

<script>
import { mapActions } from 'vuex'; 

export default {
    name: 'Login',
    methods: mapActions(['login']), 
    computed: {
        url: () => `${process.env.VUE_APP_URL}/auth/login`,
    },
};

</script>

<style scoped>

</style>