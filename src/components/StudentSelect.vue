<template>
<div>
  <h1>HRATX{{$route.params.cohortid}}</h1>
  <div v-if='$route.params.cohortid >= 2'>
    <p>Cohort Status Update</p>
    <select name='New Status' v-model='newCohortStatus'>
      <option value="incoming">Incoming</option>
      <option value="graduated">Graduated</option>
      <option value="current">Current</option>
    </select>
    <button @click='updateCohortStatus'>Update Cohort Status</button>
  </div>
  <hr>
  <div v-for='student in students' :key='student.slack_id'>
    <StudentSelectItem class='student' :name='student.name'
    :status='student.status' :id='student.slack_id' :cohort='student.cohort_id'/>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import StudentSelectItem from './StudentSelectItem.vue';

export default {
  name: 'StudentSelect',
  data() {
    return {
      students: [],
      newCohortStatus: '',
    };
  },
  methods: {
    updateCohortStatus() {
      const options = {
        method: 'POST',
        url: `/api/dash/cohorts/${this.$route.params.cohortid}/${this.newCohortStatus}`,
      };
      try {
        axios(options);
      } catch (error) {
        if (error.toString().includes('403')) this.$router.push('/403');
        else this.$router.push('/error');
      };
    },
  },
  components: { StudentSelectItem },
  async created() {
    const options = {
      method: 'GET',
      url: `/api/dash/cohorts/${this.$route.params.cohortid}`,
    };

    try {
      const students = await axios(options);
      this.students = students.data.students;
    } catch (error) {
      if (error.toString().includes('403')) this.$router.push('/403');
      else this.$router.push('/error');
    }
  },
};

</script>

<style scoped>
.student{
  margin-bottom: 10px;
}
</style>
