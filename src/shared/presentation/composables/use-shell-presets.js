import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useShellPresets() {
    const route = useRoute()
    const { t } = useI18n()

    // Este ref almacenará el último shellPreset explícitamente establecido o inferido.
    const lastKnownPreset = ref('enterprise'); // Inicializar con un valor por defecto

    // Observar cambios en la ruta para actualizar lastKnownPreset
    watch(() => route.meta?.shellPreset, (newPreset) => {
        if (newPreset) {
            lastKnownPreset.value = newPreset;
        } else if (route.path.includes('/inventario/distribuidor') || route.path.includes('/comercial/distribuidor') || route.path.includes('/distribucion')) {
            // Si no hay preset explícito, pero la ruta indica distribuidor, se establece.
            lastKnownPreset.value = 'distributor';
        } else if (route.path.includes('/inventario/empresa')) {
            // Si no hay preset explícito, pero la ruta indica empresa, se establece.
            lastKnownPreset.value = 'enterprise';
        }
        // Para rutas como /seguridad que no tienen un shellPreset explícito,
        // lastKnownPreset conservará su valor anterior.
    }, { immediate: true }); // Ejecutar inmediatamente al montar el componente

    // La propiedad computada 'preset' ahora usará lastKnownPreset si no se encuentra un preset explícito en la ruta actual.
    const preset = computed(() => {
        if (route.meta?.shellPreset) {
            return route.meta.shellPreset;
        }
        return lastKnownPreset.value;
    });

    const navigationItems = computed(() => {
        const enterpriseNav = [
            { label: 'Dashboard', icon: 'pi pi-th-large', to: '#' },
            { label: t('security.shell.main_link'), icon: 'pi pi-shield', to: '/seguridad', matchPrefix: '/seguridad' },
            { label: 'Incidencias', icon: 'pi pi-exclamation-circle', to: '#' },
            { label: 'Inventario', icon: 'pi pi-box', to: '/inventario/empresa', matchPrefix: '/inventario/empresa' },
            { label: 'Distribución', icon: 'pi pi-truck', to: '/empresa/distribucion', matchPrefix: '/empresa/distribucion' },            { label: 'Reportes', icon: 'pi pi-chart-bar', to: '/reportes/generar', matchPrefix: '/reportes' },
            { label: 'Mantenimiento', icon: 'pi pi-wrench', to: '#' },
            { label: 'Administración', icon: 'pi pi-cog', to: '#' },
        ]

        const distributorNav = [
            { label: 'Dashboard', icon: 'pi pi-th-large', to: '#' },
            { label: t('security.shell.main_link'), icon: 'pi pi-shield', to: '/seguridad', matchPrefix: '/seguridad' },
            { label: 'Inventario', icon: 'pi pi-box', to: '/inventario/distribuidor', matchPrefix: '/inventario/distribuidor' },
            { label: 'Distribución / Entregas', icon: 'pi pi-truck', to: '/distribucion', matchPrefix: '/distribucion' },
            {
                label: 'Ventas',
                icon: 'pi pi-shopping-cart',
                to: '/comercial/distribuidor/ventas',
                matchPrefix: '/comercial/distribuidor/ventas',
            },
            {
                label: 'Deudas y Cobranzas',
                icon: 'pi pi-wallet',
                to: '/comercial/distribuidor/deudas',
                matchPrefix: '/comercial/distribuidor/deudas',
            },
            { label: 'Reportes y Análisis', icon: 'pi pi-chart-line', to: '/reportes/generar', matchPrefix: '/reportes' },
        ]
        
        return preset.value === 'distributor' ? distributorNav : enterpriseNav;
    })

    const profile = computed(() =>
        preset.value === 'distributor'
            ? {
                name: 'Carlos Mendoza',
                subtitle: 'Distribuidor',
                avatarUrl:
                    'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=e2e8f0&color=0f172a&size=128',
            }
            : {
                name: 'Admin User',
                subtitle: 'admin@regula.com',
                avatarUrl:
                    'https://ui-avatars.com/api/?name=Admin+User&background=e2e8f0&color=0f172a&size=128',
            },
    )

    const brandLabel = 'REGULA'

    return {
        preset,
        navigationItems,
        profile,
        brandLabel,
    }
}