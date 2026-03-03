<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-ue-surface border-t border-ue-border pb-safe pt-2 px-6 flex items-center justify-between z-50 safari-bottom-padding">
    <NavigationItem to="/" icon="Home" label="Inicio" :active="isRouteActive('/')" />
    <NavigationItem to="/registros" icon="Clipboard" label="Registros" :active="isRouteActive('/registros')" />
    <button class="bg-ue-red-500 text-white rounded-full p-3 shadow-lg -mt-8 flex items-center justify-center border-4 border-ue-white active:scale-95 transition-transform" aria-label="Nuevo Registro">
      <Plus class="w-7 h-7" />
    </button>
    <NavigationItem to="/informes" icon="BarChart3" label="Informes" :active="isRouteActive('/informes')" />
    <NavigationItem to="/configuracion" icon="Settings" label="Ajustes" :active="isRouteActive('/configuracion')" />
  </nav>
</template>

<script setup lang="ts">
import { Home, Clipboard, BarChart3, Settings, Plus } from 'lucide-vue-next'

// Mock de navegación hasta que instalemos vue-router
const isRouteActive = (path: string) => path === '/'

// Componente inline simple para los items del nav
const NavigationItem = {
  props: ['to', 'icon', 'label', 'active'],
  components: { Home, Clipboard, BarChart3, Settings },
  template: `
    <button class="flex flex-col items-center gap-1 min-w-[3.5rem] p-1" :class="active ? 'text-ue-red-500' : 'text-ue-muted'">
      <component :is="icon" class="w-6 h-6" />
      <span class="text-[10px] uppercase font-bold tracking-tight">{{ label }}</span>
    </button>
  `
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0.5rem);
}
.safari-bottom-padding {
  min-height: calc(4rem + env(safe-area-inset-bottom, 0px));
}
</style>
