import router from '../../router';

const state = {
  loggedIn: false,
};

const getters = {
  getLoggedIn: (s) => s.loggedIn,
};

const actions = {
  login: ({ commit }) => {
    commit('setLoggedIn', true);
    router.push('/');
  },
  logout: ({ commit }) => {
    commit('setLoggedIn', false);
    router.push('/');
  },
};

const mutations = {
  setLoggedIn(s, newLoggedInState) {
    s.loggedIn = newLoggedInState;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
