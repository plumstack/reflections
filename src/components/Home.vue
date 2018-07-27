<template>
  <div class="home">
    <div v-if='getLoggedIn'>
      <h1>Reflections Home</h1>
      <CohortSelect />
    </div>
    <div v-else>
      <h1>Please login to view this page.</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CohortSelect from '@/components/CohortSelect.vue';

export default {
  name: 'Home',
  components: {
    CohortSelect,
  },
  computed: mapGetters(['getLoggedIn']),
};
</script>
