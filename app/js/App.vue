<script>
  import Vue from 'vue';

  import ClubActivityFeed from './components/ClubActivityFeed';
  import ClubInfo from './components/ClubInfo';
  import Header from './components/Header';

  export default {
    components: {
      ClubActivityFeed,
      ClubInfo,
      Header,
    },
    beforeCreate() {
      this.$store.dispatch('getAccessTokens');
    },
  }
</script>


<template>
  <div>
    <Header/>
    <main>
      <ClubActivityFeed class="main" />
      <ClubInfo class="sideber" />
    </main>
  </div>
</template>