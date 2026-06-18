import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { IamApi } from "../infrastructure/iam-api.js";
import { SignInAssembler } from "../infrastructure/sign-in.assembler.js";
import { SignUpAssembler } from "../infrastructure/sign-up.assembler.js";
import { UserAssembler } from "../infrastructure/user.assembler.js";

const iamApi = new IamApi();

export const useIamStore = defineStore('iam', () => {
    const users = ref([]);
    const errors = ref([]);
    const usersLoaded = ref(false);
    const isSignedIn = ref(false);
    const currentUsername = ref(null);
    const currentUserId = ref(0);
    const currentUserEntity = ref(null);

    const currentToken = computed(() => isSignedIn.value ? localStorage.getItem('token') : null);

    function signIn(signInCommand, router) {
        console.log('Executing SignInCommand:', signInCommand);
        iamApi.signIn(signInCommand)
            .then(response => {
                let signInResource = SignInAssembler.toResourceFromResponse(response);
                if (signInResource) {
                    let userEntity = UserAssembler.toEntityFromResource(signInResource);

                    currentUserEntity.value = userEntity;
                    currentUsername.value = userEntity.username;
                    currentUserId.value = userEntity.id;

                    localStorage.setItem('token', signInResource.token);
                    isSignedIn.value = true;
                    errors.value = [];

                    console.log(`Authenticated: ${currentUsername.value}`);
                    router.push({ name: 'home' });
                } else {
                    isSignedIn.value = false;
                    errors.value.push(new Error('Sign-in failed'));
                    router.push({ name: 'iam-sign-in' });
                }
            })
            .catch(error => {
                isSignedIn.value = false;
                console.error(error);
                errors.value.push(error);
                router.push({ name: 'iam-sign-in' });
            });
    }

    function signUp(signUpCommand, router) {
        console.log('Executing SignUpCommand:', signUpCommand);
        iamApi.signUp(signUpCommand)
            .then(response => {
                let signUpResource = SignUpAssembler.toResourceFromResponse(response);
                if (signUpResource) {
                    console.log(`Registered: ${signUpResource.message}`);
                    errors.value = [];
                    router.push({ name: 'iam-sign-in' });
                } else {
                    errors.value.push(new Error('Sign-up failed'));
                    router.push({ name: 'iam-sign-up' });
                }
            })
            .catch(error => {
                console.error(error);
                errors.value.push(error);
                router.push({ name: 'iam-sign-up' });
            });
    }

    function signOut() {
        currentUsername.value = null;
        currentUserId.value = 0;
        currentUserEntity.value = null;
        localStorage.removeItem('token');
        isSignedIn.value = false;
        errors.value = [];
    }

    function fetchUsers() {
        iamApi.getUsers()
            .then(response => {
                users.value = UserAssembler.toEntitiesFromResponse(response);
                usersLoaded.value = true;
                errors.value = [];
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    return {
        users,
        errors,
        usersLoaded,
        currentUsername,
        currentUserId,
        currentUserEntity,
        currentToken,
        isSignedIn,
        signIn,
        signUp,
        signOut,
        fetchUsers
    };
});

export default useIamStore;