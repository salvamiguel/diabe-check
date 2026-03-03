<template>
  <div class="space-y-6 pb-6 animate-in fade-in duration-500 p-1">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-black uppercase tracking-widest text-ue-text">Recordatorios</h2>
        <p class="text-[10px] font-bold text-ue-muted uppercase tracking-widest leading-none mt-1">Gestión de alertas diarias</p>
      </div>
      <button v-if="!hasPermission && !permissionUnsupported" @click="requestPermission" class="bg-ue-red-500/10 text-ue-red-500 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
        <BellRing class="w-4 h-4" /> Activar Notificaciones
      </button>
      <button v-else-if="permissionUnsupported" @click="showPermissionInfo = true" class="bg-ue-red-500/10 text-ue-red-500 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
        <BellRing class="w-4 h-4" /> Notificaciones no soportadas
      </button>
    </header>

    <!-- Permission Info Modal -->
    <div v-if="showPermissionInfo" class="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4" @click.self="showPermissionInfo = false">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full text-ue-text">
        <h3 class="font-black uppercase tracking-wider">Notificaciones en iOS</h3>
        <p class="mt-2 text-sm text-ue-muted">Safari en iOS puede no soportar notificaciones web. La app seguirá mostrando alertas internas en pantalla cuando sea necesario.</p>
        <div class="mt-4 flex gap-2">
          <button @click="showPermissionInfo = false" class="btn-ue-secondary">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Reminders List -->
    <div class="grid gap-4">
      <div v-for="r in reminders" :key="r.id" class="bg-white border border-ue-border p-5 rounded-2xl flex items-center justify-between shadow-sm transition-all hover:border-ue-red-500/20">
        <div class="flex items-center gap-4">
          <div :class="[r.type === 'glucose' ? 'bg-ue-red-500/10 text-ue-red-500' : 'bg-blue-100 text-blue-600']" class="p-3 rounded-xl">
            <Droplets v-if="r.type === 'glucose'" class="w-6 h-6" />
            <Syringe v-else class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-sm font-black uppercase tracking-widest text-ue-text">{{ r.title }}</h4>
            <div class="flex items-center gap-2 mt-1">
              <Clock class="w-3 h-3 text-ue-muted" />
              <span class="text-xl font-bold text-ue-text">{{ r.time }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end gap-3">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" :checked="r.enabled" @change="toggleReminder(r.id)" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ue-red-500"></div>
          </label>
          <button @click="deleteReminder(r.id)" class="text-ue-muted hover:text-red-500 transition-colors">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Alert Modal (Fallback) -->
    <div v-if="activeAlert" class="fixed inset-0 bg-ue-red-800/90 backdrop-blur-xl z-[300] flex items-center justify-center p-6 text-white text-center">
      <div class="max-w-xs w-full space-y-8 animate-bounce-subtle">
        <div class="bg-white/20 p-8 rounded-full inline-block">
          <BellRing class="w-16 h-16" />
        </div>
        <div class="space-y-2">
          <h3 class="text-3xl font-black uppercase tracking-[0.2em]">¡Atención!</h3>
          <p class="text-lg opacity-80 font-bold uppercase tracking-widest">Es hora de:</p>
          <p class="text-4xl font-black uppercase mt-4">{{ activeAlert.title }}</p>
        </div>
        <button @click="activeAlert = null" class="w-full bg-white text-ue-red-800 font-black py-5 rounded-2xl uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
          Entendido
        </button>
      </div>
    </div>

    <!-- Add FAB (Quick Sim) -->
    <button @click="showAddDialog = true" class="fixed bottom-24 right-6 w-14 h-14 bg-ue-red-800 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all border-4 border-white z-[120]">
      <Plus class="w-6 h-6" />
    </button>

    <!-- New Stylish Add Reminder Dialog -->
    <div v-if="showAddDialog" class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[500]" @click.self="showAddDialog = false">
      <div class="bg-white w-full max-w-sm rounded-[44px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div class="text-center space-y-6">
          <div class="bg-ue-red-500/10 w-20 h-20 rounded-[24px] flex items-center justify-center text-ue-red-500 mx-auto">
            <BellRing class="w-10 h-10" />
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-black uppercase tracking-tight">Nueva Alerta</h3>
            
            <div class="space-y-3 text-left">
              <div>
                <label class="text-[10px] font-black uppercase tracking-widest text-ue-muted mb-1 block">Título</label>
                <input v-model="newReminder.title" type="text" class="w-full bg-ue-gray-200/50 border-2 border-ue-border rounded-xl p-3 text-sm font-bold focus:border-ue-red-500 outline-none transition-all" placeholder="Ej: Glucemia Post-Cena">
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-ue-muted mb-1 block">Hora</label>
                  <input v-model="newReminder.time" type="time" class="w-full bg-ue-gray-200/50 border-2 border-ue-border rounded-xl p-3 text-sm font-bold focus:border-ue-red-500 outline-none transition-all">
                </div>
                <div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-ue-muted mb-1 block">Tipo</label>
                  <select v-model="newReminder.type" class="w-full bg-ue-gray-200/50 border-2 border-ue-border rounded-xl p-3 text-sm font-bold focus:border-ue-red-500 outline-none transition-all appearance-none">
                    <option value="glucose">Glucosa</option>
                    <option value="insulin">Insulina</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-3 pt-4">
            <button @click="handleSimpleAdd" class="w-full bg-ue-red-800 text-white font-black text-[11px] uppercase py-4 rounded-2xl tracking-[0.2em] shadow-lg active:scale-95 transition-all">
              Guardar Recordatorio
            </button>
            <button @click="showAddDialog = false" class="w-full text-ue-muted font-black text-[10px] uppercase py-2 tracking-widest">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BellRing, Droplets, Syringe, Clock, Trash2, Plus } from 'lucide-vue-next';
import { useNotifications } from '../composables/useNotifications';

const { 
  reminders, 
  hasPermission, 
  permissionUnsupported,
  activeAlert, 
  requestPermission, 
  addReminder,
  toggleReminder, 
  deleteReminder 
} = useNotifications();

const showPermissionInfo = ref(false);

const showAddDialog = ref(false);
const newReminder = ref({
  title: '',
  time: '08:00',
  type: 'glucose' as 'glucose' | 'insulin'
});

const handleSimpleAdd = () => {
  if (!newReminder.value.title || !newReminder.value.time) return;

  addReminder({
    title: newReminder.value.title,
    time: newReminder.value.time,
    type: newReminder.value.type,
    enabled: true,
    days: [0, 1, 2, 3, 4, 5, 6]
  });
  
  // Reset and close
  newReminder.value = { title: '', time: '08:00', type: 'glucose' };
  showAddDialog.value = false;
};
</script>

<style scoped>
.animate-bounce-subtle {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(-5%); }
  50% { transform: translateY(0); }
}
</style>
