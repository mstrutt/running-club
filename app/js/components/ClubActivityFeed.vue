<script>
  import { formatDistance, formatTime } from '../utils/formatting';

  export default {
    created() {
      this.$store.dispatch('getClubActivities');
    },
    computed: {
      activities() {
        return this.$store.state.club_activities;
      },
    },
    methods: {
      getIcon(activityType) {
        const icons = {
          'Ride': 'directions_bike',
          'Row': 'rowing',
          'Run': 'directions_run',
          'Strength Training': 'fitness_center',
          'Swim': 'pool',
          'Yoga': 'spa',
          default: 'accessibility_new',
        };
        return icons[activityType] || icons.default;
      },
      formatDistance,
      formatTime,
    },
  }
</script>

<style lang="scss">
  .card__description {
    display: flex;
    justify-content: space-between;

    > li {
      flex: 1;
      text-align: center;

      &:first-child {
        text-align: left;
      }

      &:last-child {
        text-align: right;
      }
    }
  }
</style>

<template>
  <ul class="h-unstyled-list">
    <li class="card" v-for="activity in activities" :key="activity.$index">
      <div class="card__header">
        <h3 class="card__title">
          <img
            class="icon icon--inline"
            :src="'./icons/' + getIcon(activity.type) + '.svg'"
            :title="activity.type"
            :alt="activity.type"
            height="24"
            width="24" />
          {{ activity.name }} - {{ activity.athlete.firstname }} {{ activity.athlete.lastname }}
        </h3>
      </div>
      <div class="card__detail">
        <ul class="card__description h-unstyled-list">
          <li>Distance: {{ formatDistance(activity.distance) }}</li>
          <li>Elevation: {{ formatDistance(activity.total_elevation_gain) }}</li>
          <li>Time: {{ formatTime(activity.moving_time) }}</li>
        </ul>
      </div>
    </li>
  </ul>
</template>