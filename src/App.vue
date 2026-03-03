<template>
  <div class="min-h-screen bg-ue-white font-sans text-ue-text selection:bg-ue-red-500 selection:text-white pb-32 transition-colors duration-500">
    <!-- Main Top Navigation -->
    <header class="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-ue-border px-4 py-3 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2">
        <div class="bg-ue-red-800 p-1.5 rounded-lg shadow-lg">
          <Droplets class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="font-black text-lg tracking-tighter uppercase leading-none">Diabe<span class="text-ue-red-500">Check</span></h1>
          <p class="text-[8px] font-bold text-ue-muted uppercase tracking-[0.2em] leading-none mt-1">Universidad Europea</p>
        </div>
      </div>
      <div class="flex items-center gap-3">

        <button @click="currentTab = 'settings'" class="bg-ue-red-800 text-white w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border-2 border-white shadow-lg overflow-hidden uppercase">
          {{ userInitials }}
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="max-w-md mx-auto p-4 pt-6">
      <Dashboard v-if="currentTab === 'dashboard'" />
      <Reminders v-if="currentTab === 'reminders'" />
      <AccessibilitySettings v-if="currentTab === 'settings'" />
      
      <!-- Views placeholders -->
      <div v-if="currentTab === 'history'" class="animate-in fade-in py-12 text-center">
        <Activity class="w-16 h-16 text-ue-muted mx-auto mb-4 opacity-20" />
        <h2 class="text-lg font-black uppercase tracking-widest text-ue-muted opacity-50">Historial Próximamente</h2>
      </div>
    </main>

    <!-- Navigation Bar (Mobile First) -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-ue-border px-6 py-4 flex items-center justify-between z-[150] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <button 
        @click="currentTab = 'dashboard'" 
        :class="[currentTab === 'dashboard' ? 'text-ue-red-500' : 'text-ue-muted']"
        class="flex flex-col items-center gap-1 transition-all active:scale-90"
        aria-label="Inicio"
      >
        <LayoutDashboard class="w-6 h-6" :class="{'fill-ue-red-500/10': currentTab === 'dashboard'}" />
        <span class="text-[9px] font-black uppercase tracking-widest">Inicio</span>
      </button>
      
      <button 
        @click="currentTab = 'history'" 
        :class="[currentTab === 'history' ? 'text-ue-red-500' : 'text-ue-muted']"
        class="flex flex-col items-center gap-1 transition-all active:scale-90"
        aria-label="Historial"
      >
        <History class="w-6 h-6" />
        <span class="text-[9px] font-black uppercase tracking-widest">Historial</span>
      </button>

      <button 
        @click="currentTab = 'reminders'" 
        :class="[currentTab === 'reminders' ? 'text-ue-red-500' : 'text-ue-muted']"
        class="flex flex-col items-center gap-1 transition-all active:scale-90"
        aria-label="Alertas"
      >
        <div class="relative">
          <Bell class="w-6 h-6" :class="{'fill-ue-red-500/10': currentTab === 'reminders'}" />
          <div v-if="activeRemindersCount > 0" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-ue-red-500 border-2 border-white rounded-full"></div>
        </div>
        <span class="text-[9px] font-black uppercase tracking-widest">Alertas</span>
      </button>

      <button 
        @click="currentTab = 'settings'" 
        :class="[currentTab === 'settings' ? 'text-ue-red-500' : 'text-ue-muted']"
        class="flex flex-col items-center gap-1 transition-all active:scale-90"
        aria-label="Perfil y Accesibilidad"
      >
        <User class="w-6 h-6" :class="{'fill-ue-red-500/10': currentTab === 'settings'}" />
        <span class="text-[9px] font-black uppercase tracking-widest">Perfil</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Droplets, 
  LayoutDashboard, 
  History, 
  Bell, 
  User, 
  Activity
} from 'lucide-vue-next';
import Dashboard from './components/Dashboard.vue';
import Reminders from './components/Reminders.vue';
import AccessibilitySettings from './components/AccessibilitySettings.vue';
import { useNotifications } from './composables/useNotifications';
import { useAccessibility } from './composables/useAccessibility';
import { useStorage } from './composables/useStorage';

const currentTab = ref('dashboard');
const { reminders } = useNotifications();
const { userProfile } = useStorage();
// Inicializamos accesibilidad globalmente
useAccessibility();

const userInitials = computed(() => {
  const name = userProfile.value.name || '';
  const lastName = userProfile.value.lastName || '';
  return (name.charAt(0) + lastName.charAt(0)) || 'U';
});

const activeRemindersCount = computed(() => {
  return reminders.value.filter(r => r.enabled).length;
});
</script>

<style>
/* Ocultar scrollbar pero mantener funcionalidad */
::-webkit-scrollbar {
  display: none;
}
* {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Estilos Globales de Alto Contraste */
.high-contrast {
  --ue-white: #000000 !important;
  --ue-surface: #000000 !important;
  --ue-text: #ffffff !important;
  --ue-muted: #ffff00 !important;
  --ue-red-800: #ff0000 !important;
  --ue-red-500: #ff0000 !important;
  --ue-border: #ffffff !important;
  --ue-gray-200: #333333 !important;
}

.high-contrast body {
  background-color: #000 !important;
  color: #fff !important;
}

.high-contrast .bg-white,
.high-contrast .bg-ue-white,
.high-contrast section,
.high-contrast div[class*="bg-white"] {
  background-color: #000 !important;
  color: #fff !important;
  border-color: #fff !important;
}

.high-contrast .text-ue-text, 
.high-contrast h1, 
.high-contrast h2, 
.high-contrast h3, 
.high-contrast span { 
  color: #fff !important; 
}

.high-contrast .text-ue-muted { 
  color: #ffff00 !important; 
}

.high-contrast button {
  border: 2px solid #fff !important;
  background-color: #000 !important;
  color: #fff !important;
}

.high-contrast .bg-ue-red-500,
.high-contrast .bg-ue-red-800,
.high-contrast .bg-blue-600 {
  background-color: #ff0000 !important;
  color: #fff !important;
}

.high-contrast .bg-ue-white {
  background-color: #000 !important;
  border-color: #fff !important;
}

.high-contrast .text-ue-text { color: #fff !important; }
.high-contrast .text-ue-muted { color: #ffff00 !important; }

/* Global Transitions */
.fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
