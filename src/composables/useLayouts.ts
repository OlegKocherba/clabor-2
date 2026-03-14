import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const LAYOUTS = {
  AppLayout: defineAsyncComponent(() => import('@/layouts/AppLayout.vue')),
  AuthLayout: defineAsyncComponent(() => import('@/layouts/AuthLayout.vue')),
  EmptyLayout: defineAsyncComponent(() => import('@/layouts/EmptyLayout.vue')),
} as const;

const DEFAULT_LAYOUT = LAYOUTS.AppLayout;

export const useLayouts = () => {
  const route = useRoute();

  const currentLayout = computed(() => {
    const { layout } = route.meta;
    if (layout && layout in LAYOUTS) {
      return LAYOUTS[layout];
    }
    return DEFAULT_LAYOUT;
  });

  return { currentLayout, LAYOUTS };
};

export { LAYOUTS };
