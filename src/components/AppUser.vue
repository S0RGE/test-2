<template>
  <el-form ref="formRef" :model="userModel" :rules="rules" class="user-item">
    <el-form-item prop="mark">
      <el-input
        v-model="userModel.mark"
        placeholder="Значение"
        maxlength="50"
        @blur="validateField('mark')"
      />
    </el-form-item>
    <el-form-item prop="recordType">
      <el-select
        v-model="userModel.recordType"
        placeholder="Select"
        @blur="validateField('recordType')"
      >
        <el-option
          v-for="item in RECORD_TYPE"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      prop="login"
      :class="{ 'login-expanded': userModel.recordType !== RECORD_TYPE.LOCAL }"
    >
      <el-input
        v-model="userModel.login"
        placeholder="Значение"
        maxlength="100"
        @blur="validateField('login')"
      />
    </el-form-item>
    <el-form-item
      v-if="userModel.recordType === RECORD_TYPE.LOCAL"
      prop="password"
    >
      <el-input
        v-model="userModel.password"
        placeholder="Значение"
        maxlength="100"
        show-password
        @blur="validateField('password')"
      />
    </el-form-item>
    <el-icon @click="() => emit('removeUser')"><Delete /></el-icon>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Delete } from "@element-plus/icons-vue";
import { type IUserWithStringMark, RECORD_TYPE } from "@/stores/types";
import type { FormInstance, FormRules } from "element-plus";

interface IProps {
  user?: IUserWithStringMark;
}

const props = defineProps<IProps>();

const formRef = ref<FormInstance>();

const userModel = ref<IUserWithStringMark>(
  props.user || {
    login: "",
    password: null,
    recordType: RECORD_TYPE.LDAP,
    mark: "",
  }
);

const rules = ref<FormRules>({
  login: [{ required: true, message: "Логин обязателен", trigger: "blur" }],
  password: [
    {
      required: true,
      message: "Пароль обязателен",
      trigger: "blur",
      validator: (rule, value, callback) => {
        if (userModel.value.recordType === RECORD_TYPE.LOCAL && !value) {
          callback(new Error("Пароль обязателен"));
        } else {
          callback();
        }
      },
    },
  ],
});

const emit = defineEmits<{
  upload: [data: IUserWithStringMark];
  removeUser: [];
}>();



const validateField = (prop: string) => {
  formRef.value?.validateField(prop).catch(() => {});
  checkAndUpload();
};

watch(
  () => userModel.value.recordType,
  (newType) => {
    if (newType === RECORD_TYPE.LDAP) {
      userModel.value.password = null;
    }
  }
);

const checkAndUpload = () => {
  if (!formRef.value) return;

  const isValid =
    userModel.value.login &&
    userModel.value.recordType &&
    (userModel.value.recordType === RECORD_TYPE.LDAP ||
      userModel.value.password);

  if (isValid) {
    try {
      // Convert reactive object to plain object to avoid circular reference
      const plainUser: IUserWithStringMark = {
        login: userModel.value.login,
        password: userModel.value.password,
        recordType: userModel.value.recordType,
        mark: userModel.value.mark,
      };
      emit("upload", plainUser);
    } catch (error) {
      console.error("Upload error:", error);
    }
  }
};
</script>

<style lang="scss">
.user-item {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.4rem;
  align-items: center;

  .el-form-item {
    margin-bottom: 0;

    &:nth-child(1) {
      width: 150px;
    } // mark
    &:nth-child(2) {
      width: 120px;
    } // recordType
    &:nth-child(3) {
      width: 150px;
    } // login
    &:nth-child(4) {
      width: 150px;
    } // password

    &.login-expanded {
      width: 304px; // 150px + 4px gap + 150px
    }
  }
}
</style>
