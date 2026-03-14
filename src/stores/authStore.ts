import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);

  function login() {
    isLoggedIn.value = true;
  }

  function logout() {
    isLoggedIn.value = false;
  }

  function toggleAuth() {
    isLoggedIn.value = !isLoggedIn.value;
  }

  return { isLoggedIn, login, logout, toggleAuth };
});
