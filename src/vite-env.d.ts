/// <reference types="vite/client" />

import 'vue-router'

interface ImportMetaEnv {
  // Intentionally empty: frontend-only build.
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string
    descriptionKey?: string
  }
}
