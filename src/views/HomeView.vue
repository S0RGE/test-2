<script setup lang="ts">
import AppUser from "@/components/AppUser.vue";
import {
  type IUserWithStringMark,
  type IUser,
  RECORD_TYPE,
} from "@/stores/types";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const userStore = useUserStore();

const { addUser, removeUser } = userStore;
const { users } = storeToRefs(userStore);
const newUsers = ref<IUserWithStringMark[]>([]);

const prepareUserToUpload = (user: IUserWithStringMark): IUser => {
  const mark = user.mark?.split(";");
  return {
    ...user,
    mark,
  };
};

const removeUserFromStore = (user: IUserWithStringMark) => {
  removeUser(prepareUserToUpload(user));
};

const userToShow = computed(() => [
  ...users.value.map((user) => ({ ...user, mark: user.mark?.join(";") })),
  ...newUsers.value
]);

const uploadUser = (user: IUserWithStringMark) => {
  if (!user.login) return;

  const preparedUser = prepareUserToUpload(user);
  
  // Remove from newUsers if it exists there
  const newUserIndex = newUsers.value.findIndex(u => u.login === user.login);
  if (newUserIndex >= 0) {
    newUsers.value.splice(newUserIndex, 1);
  }
  
  // Add or update in store
  const existingIndex = users.value.findIndex(u => u.login === preparedUser.login);
  if (existingIndex >= 0) {
    users.value[existingIndex] = preparedUser;
  } else {
    addUser(preparedUser);
  }
};

const addBlankUser = () => {
  newUsers.value.push({
    login: "",
    password: null,
    recordType: RECORD_TYPE.LDAP,
    mark: "",
  });
};
</script>

<template>
  <main>
    <div>
      <el-button @click="addBlankUser">Add user</el-button>
    </div>
    <div class="main-page__users">
      <app-user
        v-for="(user, index) in userToShow"
        :key="index"
        :user="user"
        @upload="uploadUser"
        @remove-user="() => removeUserFromStore(user)"
      />
    </div>

  </main>
</template>

<style lang="scss">
.main-page__users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
