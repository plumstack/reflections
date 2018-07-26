<template>
<div>
    <div>
        <h2>Current</h2>
        <div class="pure-button-group" role="group"
        v-for="cohort in current" :key="cohort.id">
            <CohortSelectItem :cohort='cohort' :status='cohort.cohort_status'/>
        </div>
    </div>
    <div>
      <h2>Incoming</h2>
        <div class="pure-button-group" role="group"
        v-for="cohort in incoming" :key="cohort.id">
            <CohortSelectItem :cohort='cohort' :status='cohort.cohort_status'/>
        </div>
    </div>
    <div>
      <h2>Staff</h2>
        <div class="pure-button-group" role="group"
        v-for="cohort in staff" :key="cohort.id">
            <CohortSelectItem :cohort='cohort' :status='cohort.cohort_status'/>
        </div>
    </div>
    <div>
        <h2>Unassigned</h2>
        <div class="pure-button-group" role="group"
        v-for="cohort in unassigned" :key="cohort.id">
            <CohortSelectItem :cohort='cohort' :status='cohort.cohort_status'/>
        </div>
    </div>
    <div>
        <h2>Graduated</h2>
        <div class="pure-button-group" role="group"
        v-for="cohort in graduated" :key="cohort.id">
            <CohortSelectItem :cohort='cohort' :status='cohort.cohort_status'/>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import CohortSelectItem from './CohortSelectItem.vue';

export default {
  name: 'CohortSelect',
  data() {
    return {
      cohorts: [],
    };
  },
  components: {
    CohortSelectItem,
  },
  computed: {
    // TODO redo filtering to be more efficient
    current() { return this.cohorts.filter((cohort) => cohort.cohort_status === 'current'); },
    graduated() { return this.cohorts.filter((cohort) => cohort.cohort_status === 'graduated'); },
    incoming() { return this.cohorts.filter((cohort) => cohort.cohort_status === 'incoming'); },
    staff() { return this.cohorts.filter((cohort) => cohort.cohort_status === 'staff'); },
    unassigned() { return this.cohorts.filter((cohort) => cohort.cohort_status === 'unassigned'); },
  },
  async created() {
    const options = {
      method: 'GET',
      url: '/api/dash/cohorts/',
    };
    const cohorts = await axios(options);
    this.cohorts = cohorts.data.cohorts;
  },
};

</script>

<style scoped>
</style>
