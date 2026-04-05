import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import SelectButton from 'primevue/selectbutton';
import ToggleSwitch from 'primevue/toggleswitch';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import App from './App.vue';
import router from './router';
import './style.css';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
  },
});

// Enable MSW in development mode
const enableMocking = async () => {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  if (import.meta.env.VITE_USE_MSW === 'true') {
    console.log('Starting MSW...');
    const { worker } = await import('./mocks/browser');

    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true,
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('MSW started successfully');
  }
};

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.dark',
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);

app.component('ToastComponent', Toast);
app.component('ConfirmDialog', ConfirmDialog);
// eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
app.component('Dialog', Dialog);
// eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
app.component('Button', Button);
app.component('InputText', InputText);
app.component('SelectButton', SelectButton);
app.component('ToggleSwitch', ToggleSwitch);

// Enable mocking and then mount the app
enableMocking()
  .then(() => {
    app.mount('#app');
  })
  .catch((error) => {
    console.error('MSW setup failed:', error);
    app.mount('#app');
  });
