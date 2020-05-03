import {LS_KEYS} from '../config';

const store = {
  state: {
    tokens: {
      access: null,
      refresh: null,
      maps: null,
    },
    club: 'potato',
  },
  mutations: {
    saveTokens(state, newTokens) {
      Object.assign(state.tokens, newTokens);

      localStorage.setItem(LS_KEYS.ACCESS_TOKEN, newTokens.access);
      localStorage.setItem(LS_KEYS.REFRESH_TOKEN, newTokens.refresh);
      localStorage.setItem(LS_KEYS.MAPS_KEY, newTokens.maps);
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
  }
};

export default store;
