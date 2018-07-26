import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import StudentSelect from '@/components/StudentSelect.vue';

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
  ],
});
