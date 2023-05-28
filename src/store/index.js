import * as Vuex from 'vuex';
import Vue from 'vue';
// Create a new store instance.
Vue.use(Vuex);
export default new Vuex.Store({
  state () {
    return {
      access_token: null,
      refresh_token: null,
      username: null,
      role: null,
      uid: null,
    }
  },
  mutations: {
    changeToken (state, token) {
      state.access_token = token;
    },
    changeRefresh (state,token) {
      state.refresh_token = token;
    },
    changeUsername (state, username) {
      state.username = username;
    },
    changeRole (state, role) {
      state.role = role;
    },
    changeUid (state, Uid) {
      state.uid = Uid;
    }
  },
  getters: {
    getToken: state => state.access_token,
    getRefresh: state => state.refresh_token,
    getUsername: state => state.username,
    getRole: state => state.role,
    getUid : state => state.uid
  },
});