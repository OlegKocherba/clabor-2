import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);

  const login = () => {
    isLoggedIn.value = true;
  };

  const logout = () => {
    isLoggedIn.value = false;
  };

  const toggleAuth = () => {
    isLoggedIn.value = !isLoggedIn.value;
  };

  return { isLoggedIn, login, logout, toggleAuth };
});
