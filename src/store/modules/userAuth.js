import axios from 'axios';
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
    const options = {
      method: 'POST',
      url: '/api/auth/logout',
    };
    axios(options);
    router.push('/');
  },
  checkAuth: async ({ commit }) => {
    const options = {
      method: 'GET',
      url: '/api/auth/checkAuth',
    };
    try {
      const isLoggedIn = await axios(options);
      commit('setLoggedIn', isLoggedIn.data.loggedIn);
    } catch (error) {
      router.push('/login');
    }
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
