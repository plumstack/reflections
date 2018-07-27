<template>
<div>
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
    };
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
