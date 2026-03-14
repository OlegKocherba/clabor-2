import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'AppLayout' | 'AuthLayout' | 'EmptyLayout';
    requiresAuth?: boolean;
  }
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Game routes ──────────────────────────────────────────────────────────
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/game/LandingPage.vue'),
      meta: { layout: 'EmptyLayout', requiresAuth: false },
    },
    {
      path: '/setup',
      name: 'setup',
      component: () => import('../views/game/SetupPage.vue'),
      meta: { layout: 'EmptyLayout', requiresAuth: false },
    },
    {
      path: '/round',
      name: 'round-entry',
      component: () => import('../views/game/RoundEntryPage.vue'),
      meta: { layout: 'EmptyLayout', requiresAuth: false },
    },
    {
      path: '/scoreboard',
      name: 'scoreboard',
      component: () => import('../views/game/ScoreboardPage.vue'),
      meta: { layout: 'EmptyLayout', requiresAuth: false },
    },
    // ── Dev / legacy routes ──────────────────────────────────────────────────
    {
      path: '/dev',
      name: 'main',
      component: () => import('../views/MainPage.vue'),
      meta: { layout: 'AppLayout', requiresAuth: true },
    },
    {
      path: '/dev/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue'),
      meta: { layout: 'AuthLayout', requiresAuth: false },
    },
    {
      path: '/dev/test',
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
