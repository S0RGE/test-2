import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { IUser } from "./types";

export const useUserStore = defineStore("user", () => {
  const users = ref<IUser[]>([]);

  const addUser = (user: IUser) => users.value.push(user);

  return { users, addUser };
});
