---
name: refactor-to-composable
description: Extract logic from Vue components into reusable composables.
---

# Refactor to Composable

Extract business logic from components to keep `src/views` clean.

## When to Refactor

- Component `script setup` exceeds 100 lines.
- Logic is reused in multiple components.
- Logic is complex and needs isolation (e.g., form validation, complex state management).

## Procedure

1.  **Analyze and Propose**:
    - Identify the logic to extract (state, computed, methods).
    - Determine the destination file path (`src/composables/use<LogicName>.ts`).
    - **CRITICAL**: Ask the user for confirmation before proceeding. Describe exactly:
      - Which component is being modified.
      - What logic is being moved.
      - The name of the new composable.
2.  **Create File**: `src/composables/use<LogicName>.ts`.
3.  **Structure**:

```typescript
// src/composables/useCounter.ts
import { ref, computed } from 'vue';

export const useCounter = (initialValue = 0) => {
  // State
  const count = ref(initialValue);

  // Computed
  const doubleCount = computed(() => count.value * 2);

  // Actions
  function increment() {
    count.value++;
  }

  return {
    count,
    doubleCount,
    increment,
  };
};
```

4.  **Use in Component**:

```vue
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter';

const { count, increment } = useCounter(10);
</script>
```
