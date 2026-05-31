import SignInForm from "@/iam/presentation/views/sign-in-form.vue";
import SignUpForm from "@/iam/presentation/views/sign-up-form.vue";

export const IamRoutes = [
    {
        path: '/sign-in',
        name: 'iam-sign-in',
        component: SignInForm,
        meta: { title: 'Sign In - Regula'}
    },
    {
        path: '/sign-up',
        name: 'iam-sign-up',
        component: SignUpForm,
        meta: { title: 'Sign Up - Regula' }
    }
]