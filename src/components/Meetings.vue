<template>
<div>
  <h2>Meeting from {{meeting.meeting_date.slice(0,10)}}</h2>
  <h3>Notes</h3>
  <p>{{meeting.meeting_notes}}</p>
  <h3>Reflections</h3>
  <p>{{meeting.reflection_text}}</p>
  <h3>Responses</h3>
    <p v-for="response in meeting.responses"
    :key='response.response_text'>{{response.response_text}}</p>
    <hr class='between-meetings'>
</div>
</template>

<script>

export default {
  name: 'Meetings',
  props: {
    meeting: Object,
  },
};

</script>

<style scoped>

hr.between-meetings{
    overflow: visible; /* For IE */
    height: 30px;
    border-style: solid;
    border-color: black;
    border-width: 1px 0 0 0;
    border-radius: 20px;
}
hr.between-meetings.before{ /* Not really supposed to work, but does */
    display: block;
    content: "";
    height: 30px;
    margin-top: -31px;
    border-style: solid;
    border-color: black;
    border-width: 0 0 1px 0;
    border-radius: 20px;
}

</style>
