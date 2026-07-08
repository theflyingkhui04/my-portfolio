import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '../utils/supabase';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'portfolio',
      component: () => import('../PortfolioApp.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../features/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../features/admin/Dashboard.vue'),
        },
      ]
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../features/admin/Login.vue'),
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      next('/admin/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
