<template>
  <div class="space-y-6 pb-6 animate-in fade-in duration-500">
    
    <!-- MODO CUIDADOR: Cabecera con selector de pacientes -->
    <div v-if="isCaretakerMode" class="space-y-4">
      <div class="bg-blue-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Users class="w-6 h-6" />
          <div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] block opacity-70">Monitorizando a:</span>
            <span class="text-lg font-black uppercase tracking-tight">
              {{ activePatientProfile ? `${activePatientProfile.name} ${activePatientProfile.lastName}` : 'Conectando...' }}
            </span>
          </div>
        </div>
        <button @click="handleExitCaretaker" class="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
          Salir
        </button>
      </div>

      <!-- Listado de pacientes escaneados para el cuidador -->
      <div class="bg-white border border-ue-border rounded-2xl p-4 shadow-sm" v-if="patientList.length > 1">
        <h3 class="text-[10px] font-black uppercase tracking-widest text-ue-muted mb-3 flex items-center gap-2">
          <History class="w-3 h-3" /> Pacientes Recientes
        </h3>
        <div class="flex gap-2 overflow-x-auto pb-2 noscroll">
          <div 
            v-for="p in patientList" 
            :key="p.id"
            class="relative flex-shrink-0 group"
          >
            <button 
              @click="initCaretakerSession(p.id)"
              class="px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 pr-10"
              :class="[activePatientProfile && activePatientProfile.id === p.id ? 'bg-blue-600 border-transparent text-white shadow-md' : 'bg-ue-gray-200/50 border-ue-border text-ue-text']"
            >
              {{ p.name }}
            </button>
            <button 
              @click="handleRemovePatient(p.id, $event)"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-red-500 text-ue-muted transition-colors"
            >
              <X class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ESTATUS ACTUAL / HERO CARD -->
    <section :class="[isCaretakerMode ? 'bg-blue-900' : 'bg-ue-red-800']" class="text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden transition-all duration-700">
      <div class="relative z-10 space-y-6">
        <header class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h2 class="text-xs font-black uppercase tracking-[0.2em] opacity-60">Glucemia Actual</h2>
            <div v-if="connectionStatus === 'connected'" class="flex items-center gap-1.5 px-2 py-0.5 bg-green-400/20 text-green-400 rounded-full border border-green-400/30">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span class="text-[8px] font-black uppercase">Live</span>
            </div>
          </div>
          <span class="text-[10px] font-bold opacity-40 uppercase tracking-widest">{{ updateLabel }}</span>
        </header>

        <div class="flex items-baseline gap-2">
          <span class="text-7xl font-black tracking-tighter leading-none">{{ lastGlucose }}</span>
          <span class="text-xl font-bold opacity-60 uppercase tracking-widest">mg/dL</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xl">
             <div class="w-2.5 h-2.5 rounded-full" :class="statusColor"></div>
             <span class="text-xs font-black uppercase tracking-widest">{{ statusLabel }}</span>
          </div>
          <div class="text-[10px] font-bold opacity-50 uppercase tracking-widest" v-if="activePatientProfile">
             Rango: {{ activePatientProfile.settings.glucoseMin }} - {{ activePatientProfile.settings.glucoseMax }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/5 p-4 rounded-3xl border border-white/10">
            <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Insulina Rápida</p>
            <p class="text-xl font-black">{{ lastInsulin }} <span class="text-xs font-bold opacity-40">u.</span></p>
          </div>
          <div class="bg-white/10 p-4 rounded-3xl border border-white/10">
            <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Tiempo en Rango</p>
            <p class="text-xl font-black text-white">{{ timeInRange }}<span class="text-xs font-bold opacity-40">%</span></p>
          </div>
        </div>
      </div>
      <div class="absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-[100px] opacity-30" :class="[isCaretakerMode ? 'bg-blue-400' : 'bg-ue-red-500']"></div>
    </section>

    <!-- ACCIONES: Registrar o Vincular -->
    <section v-if="!isCaretakerMode" class="grid grid-cols-2 gap-4">
      <button @click="openForm('glucose')" class="bg-white border-2 border-ue-border p-6 rounded-[32px] flex flex-col items-center gap-4 active:scale-95 transition-all hover:border-ue-red-500 shadow-sm">
        <div class="bg-ue-red-500 p-4 rounded-2xl text-white shadow-lg shadow-ue-red-500/30"><Droplets class="w-8 h-8" /></div>
        <span class="font-black text-[11px] text-ue-text uppercase tracking-widest">Glucemia</span>
      </button>
      <button @click="openForm('insulin')" class="bg-white border-2 border-ue-border p-6 rounded-[32px] flex flex-col items-center gap-4 active:scale-95 transition-all hover:border-blue-600 shadow-sm">
        <div class="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-600/30"><Syringe class="w-8 h-8" /></div>
        <span class="font-black text-[11px] text-ue-text uppercase tracking-widest">Insulina</span>
      </button>
    </section>

    <div v-if="!isCaretakerMode" class="bg-white border-2 border-ue-border p-5 rounded-[32px] flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all" @click="handleShare">
      <div class="flex items-center gap-4">
        <div class="bg-blue-100 p-3 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
          <Share2 class="w-6 h-6" />
        </div>
        <div>
          <h4 class="text-xs font-black uppercase tracking-widest mb-1">Sincronizar Cuidador</h4>
          <p class="text-[9px] font-bold text-ue-muted uppercase tracking-widest">Comparte tu estatus en vivo</p>
        </div>
      </div>
      <div class="w-10 h-10 rounded-full border border-ue-border flex items-center justify-center text-ue-muted group-hover:bg-ue-red-500 group-hover:text-white transition-colors">
        <Users class="w-4 h-4" />
      </div>
    </div>

    <!-- GRÁFICA -->
    <section class="bg-white border-2 border-ue-border rounded-[32px] overflow-hidden shadow-sm">
      <div class="p-6 border-b border-ue-border flex items-center justify-between bg-ue-gray-200/30">
        <h3 class="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity class="w-4 h-4 text-ue-red-500" /> Tendencia
        </h3>
        <button @click="generatePDF(displayEntries, currentProfile)" class="text-ue-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-all">
          <FileDown class="w-3.5 h-3.5" /> PDF
        </button>
      </div>
      <div class="p-6">
        <GlucoseChart :entries="displayEntries" />
      </div>
    </section>

    <!-- Modales -->
    <EntryForm v-if="showingForm" :type="formType" @close="showingForm = false" @save="handleSave" />
    
    <div v-if="showingShareDialog" class="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 z-[500]" @click.self="showingShareDialog = false">
      <div class="bg-white w-full max-w-sm rounded-[44px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div class="text-center space-y-6">
          <div class="bg-blue-100 w-20 h-20 rounded-[24px] flex items-center justify-center text-blue-600 mx-auto transform rotate-12">
            <Share2 class="w-10 h-10" />
          </div>
          <div class="space-y-2">
            <h3 class="text-2xl font-black uppercase tracking-tight">Monitorización P2P</h3>
            <p class="text-[10px] font-bold text-ue-muted uppercase tracking-widest px-8">Escanea este código para vincular a un cuidador en tiempo real.</p>
          </div>
          
          <div class="bg-ue-gray-200/50 p-6 rounded-[32px] border-2 border-ue-border relative group flex flex-col items-center justify-center min-h-[250px]">
             <qrcode-vue v-if="!connectionStatus || connectionStatus !== 'connected'" :value="syncLink" :size="200" level="M" render-as="svg" foreground="#131819" />
             
             <div v-if="connectionStatus === 'connected'" class="flex flex-col items-center animate-in zoom-in duration-300">
                <div class="bg-green-100 p-6 rounded-full text-green-600 mb-4 shadow-inner">
                  <Users class="w-12 h-12" />
                </div>
                <span class="bg-green-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl border-2 border-white mb-2">
                  ¡Cuidador Conectado!
                </span>
                <p class="text-[9px] font-bold text-ue-muted uppercase tracking-widest">Ya puedes cerrar esta ventana</p>
             </div>
          </div>

          <div class="space-y-3 pt-4">
            <button @click="copyLink" class="w-full bg-ue-red-800 text-white font-black text-[11px] uppercase py-4 rounded-2xl tracking-[0.2em] shadow-lg active:scale-95 transition-all">
              Copiar Enlace
            </button>
            <button @click="showingShareDialog = false" class="w-full text-ue-muted font-black text-[10px] uppercase py-2 tracking-widest">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Droplets, Syringe, Activity, FileDown, Share2, Users, History, X } from 'lucide-vue-next';
import QrcodeVue from 'qrcode.vue';
import EntryForm from './forms/EntryForm.vue';
import GlucoseChart from './charts/GlucoseChart.vue';
import { useStorage } from '../composables/useStorage';
import { useReporting } from '../composables/useReporting';
import { useCaretakerSync } from '../composables/useCaretakerSync';

const { entries, userProfile, addEntry } = useStorage();
const { generatePDF } = useReporting();
const { 
  isCaretakerMode, 
  caretakerData, 
  myPeerId, 
  connectionStatus, 
  generateSyncLink, 
  initPatientSession,
  initCaretakerSession,
  exitCaretakerMode,
  removePatient,
  activePatientProfile,
  patientList
} = useCaretakerSync(entries, userProfile);

const handleRemovePatient = (id: string, event: Event) => {
  event.stopPropagation(); // Evitar que al borrar se intente conectar
  if (confirm('¿Deseas eliminar a este paciente de tu lista de monitorización?')) {
    removePatient(id);
    if (patientList.value.length === 0) {
      handleExitCaretaker();
    }
  }
};

const showingForm = ref(false);
const formType = ref<'glucose' | 'insulin'>('glucose');
const showingShareDialog = ref(false);
const syncLink = ref('');

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const peer = params.get('peer');
  if (peer) {
    initCaretakerSession(peer);
  } else {
    initPatientSession();
  }
});

const displayEntries = computed(() => isCaretakerMode.value ? caretakerData.value : entries.value);

const handleShare = () => {
  syncLink.value = generateSyncLink();
  showingShareDialog.value = true;
};

const copyLink = () => {
  navigator.clipboard.writeText(syncLink.value);
};

const handleExitCaretaker = () => {
  window.location.href = window.location.origin + window.location.pathname;
};

const openForm = (type: 'glucose' | 'insulin') => {
  formType.value = type;
  showingForm.value = true;
};

const handleSave = (entry: any) => {
  addEntry(entry);
  showingForm.value = false;
};

// Lógica de visualización basada en el perfil del paciente
const currentProfile = computed(() => isCaretakerMode.value ? activePatientProfile.value : userProfile.value);

const lastGlucose = computed(() => {
  const g = displayEntries.value.find(e => e.type === 'glucose');
  return g ? g.value : '--';
});

const lastInsulin = computed(() => {
  const i = displayEntries.value.find(e => e.type === 'insulin');
  return i ? i.value : '--';
});

const statusLabel = computed(() => {
  const g = displayEntries.value.find(e => e.type === 'glucose');
  if (!g) return 'SIN DATOS';
  const profile = currentProfile.value;
  if (profile && g.value < profile.settings.glucoseMin) return 'HIPOGLUCEMIA';
  if (profile && g.value > profile.settings.glucoseMax) return 'HIPERGLUCEMIA';
  return 'EN RANGO';
});

const statusColor = computed(() => {
  const g = displayEntries.value.find(e => e.type === 'glucose');
  if (!g) return 'bg-gray-400';
  const profile = currentProfile.value;
  if (profile && g.value < profile.settings.glucoseMin) return 'bg-yellow-400';
  if (profile && g.value > profile.settings.glucoseMax) return 'bg-red-500';
  return 'bg-green-400';
});

const timeInRange = computed(() => {
  const gEntries = displayEntries.value.filter(e => e.type === 'glucose');
  if (gEntries.length === 0) return 0;
  const profile = currentProfile.value;
  if (!profile) return 0;
  const inRange = gEntries.filter(e => e.value >= profile.settings.glucoseMin && e.value <= profile.settings.glucoseMax);
  return Math.round((inRange.length / gEntries.length) * 100);
});

const updateLabel = computed(() => {
  if (displayEntries.value.length === 0) return 'Sin registros';
  const diff = Math.floor((Date.now() - displayEntries.value[0].timestamp) / 60000);
  return diff < 1 ? 'Ahora' : `Hace ${diff} min`;
});
</script>

<style scoped>
.animate-in {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.noscroll::-webkit-scrollbar { display: none; }
</style>
