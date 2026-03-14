---
name: primeview-usage
description: Best practices for using PrimeVue components with Tailwind CSS and Aura theme.
---

# PrimeVue Usage Guide

This skill ensures consistent usage of PrimeVue components in the `vue-base` project.

## Core Principles

0.  **Documentation First**:
    - **MANDATORY**: Before using any component, read its documentation by appending `.md` to the URL.
    - Example: To use a Button, read `https://primevue.org/button.md`.
    - Check for: correct prop names (e.g., `loading` vs `isLoading`), events, and slots.

1.  **Imports**:
    - **Components**: Import mostly globally (already configured in `main.ts` or via auto-imports if enabled). If manual import is needed, use `import Button from 'primevue/button';`.
    - **Directives**: `import Tooltip from 'primevue/tooltip';`.
    - **Services**: `import { useToast } from 'primevue/usetoast';`.

2.  **Styling (Tailwind + Aura)**:
    - **Do NOT** use `<style scoped>` for Overrides unless absolutely necessary.
    - Use **Tailwind Utility Classes** in the `class` prop for layout and spacing.
    - Use the `!important` modifier (e.g., `!w-full`) _only_ if PrimeVue's default specificity is too high (rare with Aura).
    - **PassThrough (PT)**: For deep customization of inner elements, use the `pt` prop with Tailwind classes.

    ```vue
    <DataTable
      :pt="{
        header: { class: 'bg-indigo-50 border-none' },
        bodyRow: { class: 'hover:bg-indigo-100' },
      }"
    />
    ```

3.  **Icons**:
    - Use **PrimeIcons** classes (e.g., `pi pi-check`) in `icon` props.
    - Or use slot templates for custom SVG icons.

4.  **Form Inputs**:
    - Always use `v-model` (or `v-model:modelValue`).
    - Combine with `FloatLabel` or `IftaLabel` for modern UI.

## Common Patterns

### Buttons

```vue
<Button label="Submit" icon="pi pi-check" :loading="loading" />
<Button label="Cancel" severity="secondary" outlined />
```

### Data Loading

```vue
<DataTable :value="items" :loading="loading" responsiveLayout="scroll">
```

### Toast Notifications

Always use the wrapper composable `useMessages` instead of `useToast` directly, to ensure consistent behavior.

```typescript
import { useMessages } from '@/composables/useMessages';
const { showSuccess } = useMessages();
showSuccess({ title: 'Saved', message: 'Item created' });
```

## Documentation Reference

When in doubt about props or slots, refer to `https://primevue.org/<component>.md` (e.g., `https://primevue.org/button.md`).
