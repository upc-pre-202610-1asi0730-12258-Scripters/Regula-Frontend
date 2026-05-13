# REGULA Frontend

REGULA is a comprehensive management platform for the gas distribution sector. This repository contains the Frontend of the application, developed as a Single Page Application (SPA) using modern technologies to ensure high performance, scalability, and an excellent user experience (UX).

The platform allows managing the entire business cycle, from plant inventory to last-mile distribution, supporting multiple user profiles (Enterprise and Distributor).

## 🚀 Main Technologies

- **[Vue.js 3](https://vuejs.org/)**: Progressive framework for building user interfaces. The Composition API with `<script setup>` is used for cleaner and reusable component logic.
- **[Vite](https://vitejs.dev/)**: Extremely fast build tool that offers an agile development experience with instant Hot Module Replacement (HMR).
- **[Vue Router](https://router.vuejs.org/)**: Official router for Vue.js, configured to handle SPA navigation (`createWebHistory`) and manage role-based access.
- **[Pinia](https://pinia.vuejs.org/)**: Official state management library for Vue, used to centralize and reactively share data across components (e.g., inventory, sales cart, alerts).
- **[PrimeVue](https://primevue.org/)**: Feature-rich UI component library providing ready-to-use elements (tables, forms, modals, etc.) with customizable theme support.
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client for consuming the platform's backend API.
- **[Vue I18n](https://vue-i18n.intlify.dev/)**: Internationalization plugin to handle multiple languages (Spanish and English) and adapt the platform to different regions.

## 🏗️ Project Structure (Modular Architecture)

The project adopts an architecture based on **business modules (Bounded Contexts)**. This means that the code is grouped by functionality (domain) rather than file type, facilitating maintenance and scalability.

```text
src/
├── commercional-management/          # Commercial Module (Sales, Debts, Collections)
├── distribution-logistics-management/# Logistics Distribution Module (Routes, Map, Deliveries)
├── inventory-management/             # Inventory Module (Stock, Movements, Audits)
├── operational-analytics/            # Analytics Module (Reports)
├── operational-security-management/  # Security Module (Sensor Alerts)
├── shared/                           # Shared components, composables, and utilities
├── presentation/                     # Main Layouts (AppShellLayout, Sidebar, etc.)
├── router/                           # Main Vue Router configuration
├── i18n/                             # Internationalization configuration and resources
├── locales/                          # Global translation JSON files
└── main.ts                           # Application entry point
```

## 👥 Supported User Profiles

The application adapts its interface (menu, colors, routes, components) based on the connected user's role:

1.  **Enterprise (`enterprise`)**: Global view of the business. Management of stock across multiple locations, fleet supervision, audits, and general metrics.
2.  **Distributor (`distributor`)**: Focused on daily operations. Control of their assigned stock (vehicle), direct sales, collections management (credit/debt), and scheduled deliveries.

## 🛠️ Setup and Execution

### Prerequisites

- Node.js (version 18 or higher recommended).
- npm (Node package manager).

### Installation

1.  Clone the repository.
2.  Navigate to the project directory: `cd Regula-Frontend`
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Development Environment (Mock API)

The project includes a local development environment that simulates the backend using `json-server`.

1.  **Populate the mock database**:
    Run the script to generate test data in `src/inventory-management/infrastructure/fixtures/db.json`.
    ```bash
    npm run seed:inventory
    ```

2.  **Start the Mock API**:
    Start the `json-server` on port 3001.
    ```bash
    npm run api
    ```

3.  **Start the development server (Vite)**:
    In a separate terminal, start the Vue application.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Build and Deployment (Production)

To compile the application for production, run:

```bash
npm run build
```

This will generate a `dist` folder with optimized (minified) files.

#### Deployment on Firebase Hosting

This project is pre-configured to be deployed on Firebase Hosting as an SPA.

1.  Ensure you have Firebase CLI installed: `npm install -g firebase-tools`.
2.  Log in to Firebase: `firebase login`.
3.  Deploy the `dist` folder:
    ```bash
    firebase deploy
    ```

## 🧩 Additional Notes

- **Role Management (Mocked)**: Currently, the user role is saved in the `sessionStorage` under the key `regula_role` (values: `enterprise` or `distributor`). Role selection is done on the root route (`/`).
- **Nested Routes**: Vue Router heavily uses nested routes to inject components into the `AppShellLayout`, keeping the navigation sidebar intact between module changes.
- **Internationalization**: Translations are merged dynamically (`mergeDeep` in `i18n.js`), combining global files with module-specific dictionaries to avoid unnecessary dependencies and reduce bundle size.