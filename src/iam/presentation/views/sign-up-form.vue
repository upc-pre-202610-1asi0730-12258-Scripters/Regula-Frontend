<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { SignUpCommand } from '../../domain/sign-up.command.js';
import useIamStore from '../../application/iam.store.js';

import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import SelectButton from 'primevue/selectbutton';

const router = useRouter();
const iamStore = useIamStore();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const selectedRole = ref('ROLE_DISTRIBUTOR');
const submitted = ref(false);
const loading = ref(false);

const roleOptions = ref([
  { label: 'Distributor (Minorista)', value: 'ROLE_DISTRIBUTOR' },
  { label: 'Gas Company (Envasadora)', value: 'ROLE_COMPANY' }
]);

const passwordConfirmInvalid = computed(() => !confirmPassword.value || password.value !== confirmPassword.value);

const handleSignUp = async () => {
  submitted.value = true;
  if (username.value.trim() && password.value.trim() && !passwordConfirmInvalid.value) {
    loading.value = true;
    try {
      const signUpCommand = new SignUpCommand(username.value, password.value, selectedRole.value);
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
          <h2>Create an Account</h2>
          <p class="auth-subtitle">Join REGULA to optimize your gas operation</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleSignUp" class="p-fluid">
          <div class="field p-mt-2 text-center">
            <label class="block p-mb-2 font-bold" style="color: #172D40;">Select Business Type</label>
            <SelectButton v-model="selectedRole" :options="roleOptions" optionLabel="label" optionValue="value" />
          </div>

          <div class="field p-float-label p-mt-4">
            <InputText id="username" v-model="username" :class="{'p-invalid': submitted && !username}" />
            <label for="username">Username or Corporate Email</label>
          </div>
          <small v-if="submitted && !username" class="p-error">Username is required.</small>

          <div class="field p-float-label p-mt-4">
            <Password id="password" v-model="password" :toggleMask="true" :class="{'p-invalid': submitted && !password}" />
            <label for="password">Password</label>
          </div>
          <small v-if="submitted && !password" class="p-error">Password is required.</small>

          <div class="field p-float-label p-mt-4">
            <Password id="confirmPassword" v-model="confirmPassword" :toggleMask="true" :feedback="false" :class="{'p-invalid': submitted && passwordConfirmInvalid}" />
            <label for="confirmPassword">Confirm Password</label>
          </div>
          <small v-if="submitted && passwordConfirmInvalid" class="p-error">Passwords do not match.</small>

          <Message v-if="iamStore.errors.length > 0" severity="error" class="p-mt-3" :closable="false">
            Registration failed. The username might already be taken.
          </Message>

          <div class="p-mt-4">
            <Button type="submit" label="Register Platform" class="btn-primary-auth" :loading="loading" />
          </div>
        </form>
      </template>

      <template #footer>
        <div class="auth-footer">
          <span>Already have an account? </span>
          <router-link :to="{ name: 'iam-sign-in' }" class="auth-link">Sign In</router-link>
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