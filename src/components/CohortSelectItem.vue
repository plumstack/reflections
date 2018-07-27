<template>
<div>
  <a v-if='status === "staff"' class='pure-button staff'
  @click='cohortClicked'>Staff</a>
  <a v-else-if='status === "unassigned"' class='pure-button'
  @click='cohortClicked'>Unassigned</a>
  <a v-else class='pure-button'
  @click='cohortClicked'>HRATX{{cohort.id}}</a>
</div>
</template>

<script>

export default {
  name: 'CohortSelectItem',
  props: {
    cohort: Object,
    status: String,
  },
  methods: {
    cohortClicked() { this.$router.push(`/cohort/${this.cohort.id}`); },
  },
};

</script>

<style scoped>

</style>
