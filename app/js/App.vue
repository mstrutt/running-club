<script>
  import Vue from 'vue';

  import ClubInfo from './components/ClubInfo';
  import Header from './components/Header';

  export default {
    components: {
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
      <ul class="main h-unstyled-list" id="strava">
        <br>
      </ul>
      <ClubInfo class="sideber" />
    </main>
  </div>
</template>