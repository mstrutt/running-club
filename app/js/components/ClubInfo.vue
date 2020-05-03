<script>
  export default {
    created() {
      this.$store.dispatch('getClubInfo');
    },
    computed: {
      club() {
        return this.$store.state.club_info;
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
      margin-right: .25em;
    }
  }
</style>

<template>
  <div v-if="club.id" class="club">
    <img class="club__logo" :src="club.profile" :alt="club.name" />
    <h2 class="club__name">{{ club.name }}</h2>
    <ul class="club__details h-unstyled-list">
      <li><img class="club__detail-icon icon icon--inline" src="../../icons/location_city.svg" alt="location" /> {{ club.city }}, {{ club.country }}</li>
      <li><img class="club__detail-icon icon icon--inline" src="../../icons/group.svg" alt="members" /> {{ club.member_count }}</li>
    </ul>
    <p class="club__description">{{ club.description }}</p>
  </div>
</template>