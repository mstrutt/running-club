<script>
  export default {
    computed: {
      loggedIn() {
        return this.$store.state.tokens.access;
      }
    }
  }
</script>

<template>
  <a class="button button--icon" href="/login">
    <img v-if="this.loggedIn" src="../../icons/person.svg" alt="Login" title="Login" height="24" widht="24" />
    <img v-if="!this.loggedIn" src="../../icons/person_outline.svg" alt="Login" title="Login" height="24" widht="24" />
  </a>
</template>
