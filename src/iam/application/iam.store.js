import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { IamApi } from "../infrastructure/iam-api.js";
import { SignInAssembler } from "../infrastructure/sign-in.assembler.js";
import { SignUpAssembler } from "../infrastructure/sign-up.assembler.js";
import { UserAssembler } from "../infrastructure/user.assembler.js";
import { User } from "../domain/model/user.entity.js";
import { useBillingStore } from "@/billing/application/billing.store.js";

const iamApi = new IamApi();

/**
 * Extracts a human-readable message from a failed axios call.
 * The backend currently has no global exception-handling middleware, so
 * error responses may not carry a JSON body — fall back to a generic message.
 */
function extractErrorMessage(error, fallback) {
    return error?.response?.data?.message
        || error?.response?.data?.title
        || (typeof error?.response?.data === 'string' ? error.response.data : null)
        || fallback;
}

export const useIamStore = defineStore('iam', () => {
    const errors = ref([]);

    // Hydrate session synchronously from localStorage so a page refresh
    // doesn't silently drop an otherwise-valid session.
    const storedToken = localStorage.getItem('token');
    const isSignedIn = ref(!!storedToken);
    const currentUsername = ref(localStorage.getItem('regula_username'));
    const currentUserId = ref(Number(localStorage.getItem('regula_user_id')) || 0);
    const currentUserEntity = ref(
        storedToken
            ? new User({ id: currentUserId.value, username: currentUsername.value, roles: [] })
            : null,
    );

    const currentToken = computed(() => localStorage.getItem('token'));

    function persistSession(userEntity, token) {
        localStorage.setItem('token', token);
        localStorage.setItem('regula_username', userEntity.username);
        localStorage.setItem('regula_user_id', String(userEntity.id));
    }

    function clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('regula_username');
        localStorage.removeItem('regula_user_id');
    }

    // The backend's SignUpResource/AuthenticatedUserResource don't carry a role
    // (Iam.User has no Role column), and this app is scoped to a single role
    // (Distribuidor) — no picker needed.

    function signIn(signInCommand, router) {
        return iamApi.signIn(signInCommand)
            .then(response => {
                const signInResource = SignInAssembler.toResourceFromResponse(response);
                if (!signInResource?.token) {
                    throw new Error('Sign-in failed');
                }

                const userEntity = UserAssembler.toEntityFromResource(signInResource);

                currentUserEntity.value = userEntity;
                currentUsername.value = userEntity.username;
                currentUserId.value = userEntity.id;

                persistSession(userEntity, signInResource.token);
                isSignedIn.value = true;
                errors.value = [];

                // Sesión nueva: el estado de suscripción del usuario anterior (si lo
                // hubo, en la misma pestaña) ya no aplica — que el guard lo vuelva a pedir.
                useBillingStore().reset();

                router.push({ name: 'dashboard' });
            })
            .catch(error => {
                isSignedIn.value = false;
                clearSession();
                console.error(error);
                errors.value.push(new Error(extractErrorMessage(error, 'Invalid username or password.')));
            });
    }

    function signUp(signUpCommand, router) {
        return iamApi.signUp(signUpCommand)
            .then(response => {
                const signUpResource = SignUpAssembler.toResourceFromResponse(response);
                errors.value = [];
                console.log(signUpResource?.message ?? 'User registered');
                router.push({ name: 'iam-sign-in' });
            })
            .catch(error => {
                console.error(error);
                errors.value.push(new Error(extractErrorMessage(error, 'The username might already be taken.')));
            });
    }

    function signOut(router) {
        currentUsername.value = null;
        currentUserId.value = 0;
        currentUserEntity.value = null;
        clearSession();
        isSignedIn.value = false;
        errors.value = [];
        useBillingStore().reset();
        if (router) {
            router.push({ name: 'iam-sign-in' });
        }
    }

    return {
        errors,
        currentUsername,
        currentUserId,
        currentUserEntity,
        currentToken,
        isSignedIn,
        signIn,
        signUp,
        signOut,
    };
});

export default useIamStore;
