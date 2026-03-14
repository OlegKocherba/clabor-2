---
name: scaffold-feature
description: Create a new feature with View, Store, and Service components following project architecture.
---

# Scaffold New Feature

This skill generates a complete feature skeleton consistent with `vue-base` architecture.

## Usage

When the user asks to "create a new feature" or "add a page for X", follow these steps:

1.  **Identify Feature Name**: Determine the PascalCase name of the feature (e.g., `UserProfile`, `mOrderHistory`).
2.  **Create View Component**:
    - Path: `src/views/<FeatureName>Page.vue` (Suffix `Page.vue` is mandatory).
    - Use `<script setup lang="ts">`.
    - Use `AppLayout` by default unless specified otherwise.
3.  **Create Pinia Store** (if state is needed):
    - Path: `src/stores/<featureName>Store.ts` (camelCase feature name).
    - Use `defineStore` with Setup Syntax (`ref`, `computed`, `function`).
4.  **Create API Service** (if API interaction is needed):
    - Path: `src/composables/services/use<FeatureName>Service.ts`.
    - Import `createApiClient` from `@/services/baseApiService`.
    - Define a composable function `use<FeatureName>Service`.
5.  **Register Route**:
    - Edit `src/router/index.ts`.
    - Add a new route object.
    - Use lazy loading: `component: () => import('../views/<FeatureName>Page.vue')`.
    - Define `meta: { layout: 'AppLayout', requiresAuth: true }` (adjust auth as needed).

## Example: Create "ProductList"

### 1. View (`src/views/ProductListPage.vue`)

```vue
<script setup lang="ts">
import { useProductListStore } from '@/stores/productListStore';

const store = useProductListStore();
</script>

<template>
  <div class="product-list-page">
    <h1>Products</h1>
  </div>
</template>
```

### 2. Store (`src/stores/productListStore.ts`)

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductListStore = defineStore('productList', () => {
  const items = ref([]);

  return { items };
});
```

### 3. Service (`src/composables/services/useProductListService.ts`)

```typescript
import { createApiClient } from '@/services/baseApiService';

export const useProductListService = () => {
  const api = createApiClient();

  const getProducts = () => api.get('/products');

  return { getProducts };
};
```
