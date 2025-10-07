import { ref, watch } from "vue";
import { defineStore } from "pinia";
import type { IUser } from "./types";

const STORAGE_KEY = "users";

export const useUserStore = defineStore("user", () => {
  const loadUsersFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const users = ref<IUser[]>(loadUsersFromStorage());

  // Auto-save to localStorage when users change
  watch(users, (newUsers) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
  }, { deep: true });

  const addUser = (user: IUser) => {
    users.value.push(user);
  };

  const removeUser = (user: IUser) => {
    users.value = users.value.filter((u) => u.login !== user.login);
  };

  return { users, addUser, removeUser };
});
