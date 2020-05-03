import Vue from 'vue';
import Vuex from 'vuex';

import App from './App';

import store from './store/index';

Vue.use(Vuex);

new Vue({
  render(createElement) {
    return createElement(App);
  },
  store: new Vuex.Store(store),
}).$mount('#app');
