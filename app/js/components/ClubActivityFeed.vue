<script>
  export default {
    created() {
      this.getClubInfo();
    },
    data() {
      return {
        activities: [],
      };
    },
    methods: {
      getClubInfo() {
        const tokens = new URLSearchParams({
          access_token: this.$store.state.tokens.access,
          refresh_token: this.$store.state.tokens.refresh,
        });
        return fetch(`./strava/clubs/${this.$store.state.club}/activities?&${tokens.toString()}`)
          .then(response => response.json())
          .then((data) => {
            this.activities = Object.assign({}, data);
          });
      }
    },
  }
</script>

<template>
  <ul class="h-unstyled-list">
    <li v-for="activity in activities" :key="activity.$index">
      <h3>{{ activity.name }}</h3>
    </li>
  </ul>
</template>