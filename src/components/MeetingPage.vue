<template>
<div class=''>
  <div v-if='loading'>
    Loading...
  </div>
  <div v-else>
    <h2>New meeting with {{info.employee_name}}</h2>
    <form class='pure-form pure-form-aligned meeting-form'>

    <fieldset class='pure-group '>
        <textarea type='text' class='pure-input-3-4' placeholder='Notes'></textarea>
        <textarea type='text' class='pure-input-3-4' placeholder='Reflections'></textarea>
        <input type='text' class='pure-input-3-4'
        placeholder='Respond by (ex: next thursday at noon)' />
        <input type='text' class='pure-input-3-4' placeholder='Tags' />
    </fieldset>

    <button type='submit' class='pure-button pure-input-1-2 pure-button-primary'>Submit</button>


</form>
</div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MeetingPage',
  data() {
    return {
      info: {},
      meetings: [],
      loading: true,
    }
  },
  async created() {
    const options = {
      method: 'GET',
      url: `/api/dash/employee/${this.$route.params.studentid}`,
    };
    const meetings = await axios(options);
    this.meetings = meetings.data.meetings;
    this.info = meetings.data.info;
    this.loading = false;
  },
};

</script>

<style scoped>
.meeting-form{
    position: absolute;
    left: 55%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    height: 50%;
    padding: 20px;
    text-align: center;
}

</style>
