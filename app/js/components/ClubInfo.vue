<script>
  export default {
    created() {
      this.getClubInfo();
    },
    data() {
      return {
        club: {},
      };
    },
    methods: {
      getClubInfo() {
        const tokens = new URLSearchParams({
          access_token: this.$store.state.tokens.access,
          refresh_token: this.$store.state.tokens.refresh,
        });
        return fetch(`./strava/clubs/${this.$store.state.club}?${tokens.toString()}`)
          .then(response => response.json())
          .then((data) => {
            this.club = Object.assign({}, data);
          });
      }
    },
  }
</script>

<style lang="scss">
  .club {
    &__logo {
      display: block;
      margin: 0 auto;
    }

    &__detail-icon {
      display: inline-block;
      margin-right: .25em;
      vertical-align: text-bottom;
    }
  }
</style>

<template>
  <div v-if="club.id" class="club">
    <img class="club__logo" :src="club.profile" :alt="club.name" />
    <h2 class="club__name">{{ club.name }}</h2>
    <ul class="club__details h-unstyled-list">
      <li><img class="club__detail-icon" src="../../icons/location_city.svg" alt="location" /> {{ club.city }}, {{ club.country }}</li>
      <li><img class="club__detail-icon" src="../../icons/group.svg" alt="members" /> {{ club.member_count }}</li>
    </ul>
    <p class="club__description">{{ club.description }}</p>
  </div>
</template>