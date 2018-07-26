<template>
<div>
    <div>
        <h2>Current</h2>
        <div class="pure-button-group" role="group"
        v-for="cohort in current" :key="cohort.id">
            <a class='pure-button'>HRATX{{cohort.id}}</a>
        </div>
    </div>
    <div>
      <h2>Incoming</h2>
        <div class="pure-button-group" role="group"
        v-for="cohort in incoming" :key="cohort.id">
            <a class='pure-button'>HRATX{{cohort.id}}</a>
        </div>
    </div>
    <div>
      <h2>Staff</h2>
        <div class="pure-button-group" role="group"
        v-for="cohort in staff" :key="cohort.id">
            <a class='pure-button'>Staff</a>
        </div>
    </div>
    <div>
        <h2>Unassigned</h2>
        <div class="pure-button-group" role="group"
        v-for="cohort in unassigned" :key="cohort.id">
            <a class='pure-button'>Unassigned</a>
        </div>
    </div>
    <div>
        <h2>Graduated</h2>
        <div class="pure-button-group" role="group"
        v-for="cohort in graduated" :key="cohort.id">
            <a class='pure-button'>HRATX{{cohort.id}}</a>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CohortSelect',
  data() {
    return {
      cohorts: [],
    };
  },
  computed: {
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
