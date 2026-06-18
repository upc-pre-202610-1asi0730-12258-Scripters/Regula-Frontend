<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { SignInCommand } from '../../domain/sign-in.command.js';
import useIamStore from '../../application/iam.store.js';

import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

const router = useRouter();
const iamStore = useIamStore();

const username = ref('');
const password = ref('');
const submitted = ref(false);
const loading = ref(false);

const handleSignIn = async () => {
  submitted.value = true;
  if (username.value && password.value) {
    loading.value = true;
    try {
      const signInCommand = new SignInCommand(username.value, password.value);
      iamStore.signIn(signInCommand, router);
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
          <h2>Sign In to REGULA</h2>
          <p class="auth-subtitle">Intelligent Gas Cylinder Monitoring System</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleSignIn" class="p-fluid">
          <div class="field p-float-label">
            <InputText id="username" v-model.trim="username" :class="{'p-invalid': submitted && !username}" />
            <label for="username">Username</label>
          </div>
          <small v-if="submitted && !username" class="p-error">Username is required.</small>

          <div class="field p-float-label p-mt-4">
            <Password id="password" v-model.trim="password" :toggleMask="true" :feedback="false" :class="{'p-invalid': submitted && !password}" />
            <label for="password">Password</label>
          </div>
          <small v-if="submitted && !password" class="p-error">Password is required.</small>

          <Message v-if="iamStore.errors.length > 0" severity="error" class="p-mt-3" :closable="false">
            Authentication failed. Please check your credentials.
          </Message>

          <div class="p-mt-4">
            <Button type="submit" label="Sign In" class="btn-primary-auth" :loading="loading" />
          </div>
        </form>
      </template>

      <template #footer>
        <div class="auth-footer">
          <span>Don't have an account? </span>
          <router-link :to="{ name: 'iam-sign-up' }" class="auth-link">Create an account</router-link>
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