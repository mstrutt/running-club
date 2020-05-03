import {LS_KEYS} from '../config';

const store = {
  state: {
    tokens: {
      access: null,
      refresh: null,
      maps: null,
    },
    club: 'potato',
    club_activities: [],
    club_info: {},
  },
  mutations: {
    saveTokens(state, newTokens) {
      Object.assign(state.tokens, newTokens);

      localStorage.setItem(LS_KEYS.ACCESS_TOKEN, newTokens.access);
      localStorage.setItem(LS_KEYS.REFRESH_TOKEN, newTokens.refresh);
      localStorage.setItem(LS_KEYS.MAPS_KEY, newTokens.maps);
    },
    updateClubActivities(state, activities) {
      state.club_activities = activities;
    },
    updateClubInfo(state, info) {
      state.club_info = info;
    }
  },
  actions: {
    getAccessTokens(context) {
      const tokens = {};

      const accessMatch = window.location.hash.match(/access_token=([^&]+)(&|$)/);
      tokens.access = (accessMatch && accessMatch[1]) || localStorage.getItem(LS_KEYS.ACCESS_TOKEN);
      const refreshMatch = window.location.hash.match(/refresh_token=([^&]+)(&|$)/);
      tokens.refresh = (refreshMatch && refreshMatch[1]) || localStorage.getItem(LS_KEYS.REFRESH_TOKEN);
      const mapsMatch = window.location.hash.match(/maps_key=([^&]+)(&|$)/);
      tokens.maps = (mapsMatch && mapsMatch[1]) || localStorage.getItem(LS_KEYS.MAPS_KEY);
  
      context.commit('saveTokens', tokens);
    },
    getClubActivities(context) {
      const tokens = new URLSearchParams({
        access_token: context.state.tokens.access,
        refresh_token: context.state.tokens.refresh,
      });
      return fetch(`./strava/clubs/${context.state.club}/activities?&${tokens.toString()}`)
        .then(response => response.json())
        .then((data) => {
          context.commit('updateClubActivities', data)
        });
    },
    getClubInfo(context) {
      const tokens = new URLSearchParams({
        access_token: context.state.tokens.access,
        refresh_token: context.state.tokens.refresh,
      });
      return fetch(`./strava/clubs/${context.state.club}?${tokens.toString()}`)
        .then(response => response.json())
        .then((data) => {
          context.commit('updateClubInfo', data);
        });
    },
  }
};

export default store;
