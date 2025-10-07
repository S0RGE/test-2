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

  const addUser = (user: IUser) => {
    users.value.push(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users.value));
  };

  const removeUser = (user: IUser) => {
    console.log("🚀 ~ removeUser ~ user:", user);
    users.value = users.value.filter((u) => u.login !== user.login);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users.value));
  };

  return { users, addUser, removeUser };
});
