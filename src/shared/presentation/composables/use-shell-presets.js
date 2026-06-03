import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useShellPresets() {
    const route = useRoute()
    const { t } = useI18n()

    const preset = computed(() => {
        if (route.meta?.shellPreset) {
            return route.meta.shellPreset
        }
        if (route.name === 'inventory-distributor') {
            return 'distributor'
        }
        return 'enterprise'
    })

    const navigationItems = computed(() => {
        const enterpriseNav = [
            { label: 'Dashboard', icon: 'pi pi-th-large', to: '#' },
            { label: t('security.shell.main_link'), icon: 'pi pi-shield', to: '/seguridad/empresa/active-alerts', matchPrefix: '/seguridad' },
            { label: 'Incidencias', icon: 'pi pi-exclamation-circle', to: '#' },
            { label: 'Inventario', icon: 'pi pi-box', to: '/inventario/empresa', matchPrefix: '/inventario/empresa' },
            { label: 'Distribución', icon: 'pi pi-truck', to: '#' },
            { label: 'Reportes', icon: 'pi pi-chart-bar', to: '#' },
            { label: 'Mantenimiento', icon: 'pi pi-wrench', to: '#' },
            { label: 'Administración', icon: 'pi pi-cog', to: '#' },
        ]

        const distributorNav = [
            { label: 'Dashboard', icon: 'pi pi-th-large', to: '#' },
            { label: t('security.shell.main_link'), icon: 'pi pi-shield', to: '/seguridad/distribuidor/active-alerts', matchPrefix: '/seguridad' },
            { label: 'Inventario', icon: 'pi pi-box', to: '/inventario/distribuidor', matchPrefix: '/inventario/distribuidor' },
            { label: 'Distribución / Entregas', icon: 'pi pi-truck', to: '#' },
            { label: 'Ventas', icon: 'pi pi-shopping-cart', to: '#' },
            { label: 'Fiados y Cobranzas', icon: 'pi pi-wallet', to: '#' },
            { label: 'Reportes y Análisis', icon: 'pi pi-chart-line', to: '#' },
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
