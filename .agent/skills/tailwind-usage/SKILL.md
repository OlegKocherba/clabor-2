---
name: tailwind-usage
description: Best practices for configuring and using Tailwind CSS v4, including variable overriding and theming.
---

# Tailwind CSS v4 Usage Guide

This skill details how to manage styles, overrides, and theming in the project.

## Configuration (v4)

This project uses Tailwind CSS v4. Configuration is primarily done in CSS, not `tailwind.config.js`.

### 1. Theming & Overrides (`@theme`)

To customize the theme (colors, fonts, breakpoints), use the `@theme` directive in `src/style.css` (or your main entry CSS).

```css
@import 'tailwindcss';

@theme {
  /* Override or extend existing utilities */

  /* 1. Custom Colors */
  --color-brand-50: #f0f9ff;
  --color-brand-500: #0ea5e9;
  --color-brand-900: #0c4a6e;

  /* 2. Custom Fonts */
  --font-display: 'Inter', sans-serif;

  /* 3. Custom Spacing */
  --spacing-128: 32rem;

  /* 4. Overriding PrimeVue Semantic Colors (if needed) */
  /* These map to what you defined in main.ts preset */
  --p-primary-500: var(--color-indigo-500);
}
```

### 2. Arbitrary Values

Use `[]` syntax for one-off values that don't belong in the theme.

```html
<div class="top-[117px] w-[300px]"></div>
```

## Integration with PrimeVue

PrimeVue components (Aura theme) use `--p-*` CSS variables.
To change the look of PrimeVue components globally, override these variables in `:root` or `@theme`.

```css
:root {
  --p-primary-color: var(--color-blue-500);
  --p-primary-contrast-color: #ffffff;
}
```

## Best Practices

1.  **Utility-First**: Use classes for everything possible (layout, spacing, typography).
2.  **No `@apply`**: Avoid using `@apply` in `.vue` files. It breaks the utility-first paradigm and increases bundle size.
3.  **Ordering**: Classes should be logically ordered (though the linter/formatter usually handles this).
4.  **Responsive Design**: Use `md:`, `lg:` prefixes consistently. Mobile-first approach.

## How to "Rewrite Variables for Other Styles"

If the user asks to "change the primary color to red":

1.  Open `src/style.css`.
2.  Find or create the `@theme` block or `:root` selector.
3.  Update the relevant variables:

```css
:root {
  --p-primary-500: var(--color-red-500);
  /* ... update other shades if necessary */
}
```
