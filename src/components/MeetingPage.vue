<template>
<div class=''>
  <Modal v-if='showModal' @close='showModal=false' />
  <div v-if='loading'>
    Loading...
  </div>
  <div v-else>
    <h2>Status Page: {{info.name}}</h2>
    <h3>Latest Meeting Status: {{info.status.toUpperCase()}}</h3>
    <div>
      <h3>Cohort: {{info.cohort_id}}</h3>
      <input type='number' v-model.number='newCohort'/>
      <button @click='updateCohort'>Update Cohort</button>
      <p>0 = unassigned, 1 = staff</p>
    </div>
          <button @click='showModal=true'>Search Tags</button>
    <form class='pure-form pure-form-aligned meeting-form'>
      <fieldset class='pure-group '>
          <textarea type='text' class='pure-input-3-4' v-model='meetingNotes'
          placeholder='Notes'></textarea>
          <textarea type='text' class='pure-input-3-4' v-model='reflectionText'
          placeholder='Reflections'></textarea>
          <input type='text' class='pure-input-3-4' v-model='respondBy'
          placeholder='Respond by (ex: next thursday at noon)' />
          <input type='text' class='pure-input-3-4'
          placeholder='Tags, seperated by commas and no spaces (ex: "sleep,code,eat")'
          v-model='tags' />
          <button @click='newReflection' type='submit'
          class='pure-button pure-input-1-2 pure-button-primary'>Submit</button>
      </fieldset>

    </form>
    <h2 v-if="submitted">Submitted!</h2>
  </div>
  <div>
    <div v-for='meeting in meetings' :key='meeting.id'><Meetings :meeting='meeting'/></div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import Meetings from './Meetings.vue';
import Modal from './Modal.vue';

export default {
  name: 'MeetingPage',
  components: { Meetings, Modal },
  data() {
    return {
      info: {},
      meetings: [],
      loading: true,
      newCohort: Number,
      meetingNotes: '',
      reflectionText: '',
      respondBy: '',
      tags: '',
      showModal: false,
      submitted: false,
    };
  },
  methods: {
    updateCohort() {
      const options = {
        method: 'POST',
        url: `/api/dash/student/${this.info.slack_id}/${this.newCohort}`,
      };
      axios(options);
      this.info.cohort_id = this.newCohort;
    },
    newReflection() {
      const options = {
        method: 'POST',
        url: `/api/dash/reflection/${this.info.slack_id}`,
        data: {
          meetingNotes: this.meetingNotes,
          reflectionText: this.reflectionText,
          respondBy: this.respondBy,
          tags: this.tags.split(','),
        },
      };
      axios(options);
      this.meetingNotes = '';
      this.reflectionText = '';
      this.respondBy = '';
      this.tags = '';
      this.submitted = true;
    },
  },
  async created() {
    const options = {
      method: 'GET',
      url: `/api/dash/student/${this.$route.params.studentid}`,
    };
    try {
      const meetings = await axios(options);
      this.meetings = meetings.data.meetings.reverse();
      this.info = meetings.data.info;
      this.loading = false;
      this.newCohort = this.info.cohort_id;
    } catch (error) {
      if (error.toString().includes('403')) this.$router.push('/403');
      else this.$router.push('/error');
    }
  },
};

</script>

<style scoped>
  .meeting-form{
      margin-left: 35%;
      margin-right: auto;
      max-width: 768px;
  }
</style>
