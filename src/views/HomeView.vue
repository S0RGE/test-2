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
const newUsers = ref<(IUserWithStringMark & { id: string })[]>([]);

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
  ...users.value.map((user) => ({ ...user, mark: user.mark?.join(";"), id: user.login || Date.now().toString() })),
  ...newUsers.value
].map(({ id, ...user }) => user));

const uploadUser = (user: IUserWithStringMark, userIndex: number) => {
  if (!user.login) return;

  const preparedUser = prepareUserToUpload(user);
  
  // Check if this is a new user by finding it in the combined array
  const allUsers = [
    ...users.value.map((user) => ({ ...user, mark: user.mark?.join(";"), id: user.login || Date.now().toString() })),
    ...newUsers.value
  ];
  
  const currentUser = allUsers[userIndex];
  if (currentUser && 'id' in currentUser && currentUser.id && !users.value.find(u => u.login === currentUser.id)) {
    // This is a new user, remove from newUsers
    const newUserIndex = newUsers.value.findIndex(u => u.id === currentUser.id);
    if (newUserIndex >= 0) {
      newUsers.value.splice(newUserIndex, 1);
    }
  }
  
  // Add or update in store
  const existingIndex = users.value.findIndex(
    (u) => u.login === preparedUser.login
  );
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
    id: Date.now().toString() + Math.random().toString(36),
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
        @upload="(userData) => uploadUser(userData, index)"
        @remove-user="() => removeUserFromStore(user)"
      />
    </div>
    <div>
      <pre>
        userToShow: {{ userToShow }}
      </pre>
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
