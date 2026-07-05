<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SignUpCommand } from '../../domain/sign-up.command.js';
import useIamStore from '../../application/iam.store.js';

import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

const { t } = useI18n();
const router = useRouter();
const iamStore = useIamStore();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const submitted = ref(false);
const loading = ref(false);

const passwordConfirmInvalid = computed(() => !confirmPassword.value || password.value !== confirmPassword.value);

const handleSignUp = async () => {
  submitted.value = true;
  if (username.value.trim() && password.value.trim() && !passwordConfirmInvalid.value) {
    loading.value = true;
    try {
      const signUpCommand = new SignUpCommand(username.value, password.value);
      iamStore.signUp(signUpCommand, router);
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div class="auth-container">
    <Card class="auth-card">
      <template #title>
        <div class="auth-header">
          <h2>{{ t('iam.signUp.title') }}</h2>
          <p class="auth-subtitle">{{ t('iam.signUp.subtitle') }}</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleSignUp" class="p-fluid">
          <div class="field p-float-label">
            <InputText id="username" v-model="username" :class="{'p-invalid': submitted && !username}" />
            <label for="username">{{ t('iam.fields.usernameOrEmail') }}</label>
          </div>
          <small v-if="submitted && !username" class="p-error">{{ t('iam.errors.usernameRequired') }}</small>

          <div class="field p-float-label p-mt-4">
            <Password id="password" v-model="password" :toggleMask="true" :class="{'p-invalid': submitted && !password}" />
            <label for="password">{{ t('iam.fields.password') }}</label>
          </div>
          <small v-if="submitted && !password" class="p-error">{{ t('iam.errors.passwordRequired') }}</small>

          <div class="field p-float-label p-mt-4">
            <Password id="confirmPassword" v-model="confirmPassword" :toggleMask="true" :feedback="false" :class="{'p-invalid': submitted && passwordConfirmInvalid}" />
            <label for="confirmPassword">{{ t('iam.fields.confirmPassword') }}</label>
          </div>
          <small v-if="submitted && passwordConfirmInvalid" class="p-error">{{ t('iam.errors.passwordsDoNotMatch') }}</small>

          <Message v-if="iamStore.errors.length > 0" severity="error" class="p-mt-3" :closable="false">
            {{ iamStore.errors[iamStore.errors.length - 1].message }}
          </Message>

          <div class="p-mt-4">
            <Button type="submit" :label="t('iam.signUp.submit')" class="btn-primary-auth" :loading="loading" />
          </div>
        </form>
      </template>

      <template #footer>
        <div class="auth-footer">
          <span>{{ t('iam.signUp.hasAccount') }} </span>
          <router-link :to="{ name: 'iam-sign-in' }" class="auth-link">{{ t('iam.signUp.signInLink') }}</router-link>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #F8F8FB; padding: 1rem; }
.auth-card { width: 100%; max-width: 420px; border-radius: 12px; box-shadow: 0 4px 12px rgba(23, 45, 64, 0.08); }
.auth-header { text-align: center; padding-bottom: 1rem; }
.auth-logo { width: 65px; height: auto; margin-bottom: 1rem; }
.auth-header h2 { color: #172D40; font-family: 'Inter', sans-serif; font-weight: 700; margin: 0; }
.auth-subtitle { color: #555F6E; font-size: 0.875rem; margin-top: 0.5rem; }
.field { margin-bottom: 1.5rem; }
.btn-primary-auth { background-color: #F26E22 !important; border: none !important; font-family: 'Inter', sans-serif; font-weight: 700; padding: 0.75rem; border-radius: 8px; }
.btn-primary-auth:hover { background-color: #F25922 !important; }
.auth-footer { text-align: center; font-size: 0.875rem; color: #555F6E; }
.auth-link { color: #F26E22; text-decoration: none; font-weight: 600; }
</style>