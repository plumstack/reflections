<template>
<div class=''>
    <h2>New meeting with ${student}</h2>
    <form class='pure-form pure-form-aligned meeting-form'>

    <fieldset class='pure-group '>
        <textarea type='text' class='pure-input-3-4' placeholder='Notes'></textarea>
        <textarea type='text' class='pure-input-3-4' placeholder='Reflections'></textarea>
        <input type='text' class='pure-input-3-4' placeholder='Respond by (ex: next thursday at noon)'>
    </fieldset>

    <button type='submit' class='pure-button pure-input-1-2 pure-button-primary'>Submit</button>


</form>
</div>
</template>

<script>

export default {
    name: 'MeetingPage',
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