<template>
<div>
  <a class='pure-button'
  :class='{ "button-success" : status === "responded",
            "button-warning" : status === "needs response",
            "button-error" : status === "overdue",
            }'
  @click='studentClicked'>{{name}}</a>
</div>
</template>

<script>

export default {
  name: 'StudentSelectItem',
  props: {
    name: String,
    id: String,
    status: String,
    cohort: Number,
  },
  methods: {
    studentClicked() {
      console.log(this.cohort, this.status, this.id, this.name);
    },
  },
};

</script>

<style scoped>

  .button-success,
  .button-error,
  .button-warning,
  .button-secondary {
      color: white;
      border-radius: 4px;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }

  .button-success {
      background: rgb(28, 184, 65); /* this is a green */
  }

  .button-error {
      background: rgb(202, 60, 60); /* this is a maroon */
  }

  .button-warning {
      background: rgb(223, 117, 20); /* this is an orange */
  }

</style>
