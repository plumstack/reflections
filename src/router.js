import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import StudentSelect from '@/components/StudentSelect.vue';
import MeetingPage from '@/components/MeetingPage.vue';
import Unauthorized from '@/components/Unauthorized.vue';
import ErrorPage from '@/components/Error.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/cohort/:cohortid',
      name: 'cohort',
      component: StudentSelect,
    },
    {
      path: '/meeting/:studentid',
      name: 'meeting',
      component: MeetingPage,
    },
    {
      path: '/403',
      name: '403',
      component: Unauthorized,
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorPage,
    },
  ],
});
