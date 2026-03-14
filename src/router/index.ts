import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'AppLayout' | 'AuthLayout' | 'EmptyLayout';
    requiresAuth?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/MainPage.vue'),
      meta: { layout: 'AppLayout', requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue'),
      meta: { layout: 'AuthLayout', requiresAuth: false },
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestPage.vue'),
      meta: { layout: 'EmptyLayout', requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundPage.vue'),
      meta: { layout: 'AppLayout', requiresAuth: false },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login');
  } else if (to.path === '/login' && authStore.isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
