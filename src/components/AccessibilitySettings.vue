<template>
  <div class="space-y-8 pb-32 animate-in slide-in-from-bottom-8 duration-500">
    <header>
      <h2 class="text-2xl font-black uppercase tracking-tight text-ue-text">Perfil y Configuración</h2>
      <p class="text-[10px] font-bold text-ue-muted uppercase tracking-[0.2em] mt-1">Personaliza tu experiencia DiabeCheck</p>
    </header>

    <!-- Perfil de Usuario -->
    <section class="bg-white border-2 border-ue-border rounded-[32px] p-6 space-y-6 shadow-sm">
      <div class="flex items-center gap-4 border-b border-ue-border pb-4">
        <div class="bg-ue-red-800 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl">
          {{ userProfile.name.charAt(0) }}{{ userProfile.lastName.charAt(0) }}
        </div>
        <div>
          <h3 class="text-sm font-black uppercase tracking-widest text-ue-text">Datos del Paciente</h3>
          <p class="text-[10px] font-bold text-ue-muted uppercase tracking-widest">Información Básica</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-[9px] font-black uppercase tracking-widest text-ue-muted">Nombre</label>
          <input v-model="profileForm.name" type="text" class="w-full bg-ue-gray-200/50 border-2 border-transparent p-3 rounded-xl text-xs font-bold focus:border-ue-red-500 transition-all outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-black uppercase tracking-widest text-ue-muted">Apellidos</label>
          <input v-model="profileForm.lastName" type="text" class="w-full bg-ue-gray-200/50 border-2 border-transparent p-3 rounded-xl text-xs font-bold focus:border-ue-red-500 transition-all outline-none" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-[9px] font-black uppercase tracking-widest text-ue-muted">Edad</label>
          <input v-model.number="profileForm.age" type="number" class="w-full bg-ue-gray-200/50 border-2 border-transparent p-3 rounded-xl text-xs font-bold focus:border-ue-red-500 transition-all outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-black uppercase tracking-widest text-ue-muted">Sexo</label>
          <select v-model="profileForm.sex" class="w-full bg-ue-gray-200/50 border-2 border-transparent p-3 rounded-xl text-xs font-bold focus:border-ue-red-500 transition-all outline-none appearance-none">
            <option :value="null">Selección</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>
      </div>

      <button @click="handleUpdateProfile" class="w-full bg-ue-text text-white font-black text-[10px] uppercase py-3 rounded-2xl tracking-widest shadow-lg active:scale-95 transition-all">
        Guardar Perfil
      </button>
    </section>

    <!-- Rangos de Alarma -->
    <section class="bg-white border-2 border-ue-border rounded-[32px] p-6 space-y-6 shadow-sm">
      <div class="flex items-center gap-4 border-b border-ue-border pb-4">
        <div class="bg-yellow-400 w-12 h-12 rounded-2xl flex items-center justify-center text-ue-red-800">
          <Activity class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-black uppercase tracking-widest text-ue-text">Rangos de Alarma</h3>
          <p class="text-[10px] font-bold text-ue-muted uppercase tracking-widest">Ajusta tus límites de glucemia</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-[9px] font-black uppercase tracking-widest text-ue-muted">Hipoglucemia (mín)</label>
          <div class="flex items-center gap-2">
            <input v-model.number="profileForm.settings.glucoseMin" type="range" min="40" max="100" step="5" class="w-full accent-yellow-400" />
            <span class="text-xs font-black min-w-[3ch]">{{ profileForm.settings.glucoseMin }}</span>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[9px] font-black uppercase tracking-widest text-ue-muted">Hiperglucemia (máx)</label>
          <div class="flex items-center gap-2">
            <input v-model.number="profileForm.settings.glucoseMax" type="range" min="150" max="300" step="5" class="w-full accent-ue-red-800" />
            <span class="text-xs font-black min-w-[3ch]">{{ profileForm.settings.glucoseMax }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Accesibilidad -->
    <section class="bg-white border-2 border-ue-border rounded-[32px] p-6 shadow-sm">
      <div class="flex items-center gap-4 border-b border-ue-border pb-4 mb-6">
        <div class="bg-ue-gray-200 w-12 h-12 rounded-2xl flex items-center justify-center text-ue-text">
          <User class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-black uppercase tracking-widest text-ue-text">Visibilidad</h3>
          <p class="text-[10px] font-bold text-ue-muted uppercase tracking-widest">Opciones de Accesibilidad</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-ue-gray-200/30 rounded-2xl border border-ue-border">
          <div>
            <span class="text-xs font-black uppercase tracking-widest block">Alto Contraste</span>
            <span class="text-[9px] font-bold text-ue-muted uppercase tracking-widest">Optimizado para legibilidad</span>
          </div>
          <button 
            @click="toggleHighContrast" 
            :class="[isHighContrast ? 'bg-ue-red-500 border-ue-red-500' : 'bg-ue-gray-500 border-ue-border']"
            class="w-12 h-6 rounded-full border-2 p-0.5 transition-all flex items-center"
          >
            <div :class="{'translate-x-6': isHighContrast}" class="w-4 h-4 bg-white rounded-full transition-transform shadow-sm"></div>
          </button>
        </div>

        <div class="p-4 bg-ue-gray-200/30 rounded-2xl border border-ue-border space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black uppercase tracking-widest">Tamaño de Texto</span>
            <span class="text-[10px] font-black uppercase text-ue-red-500 bg-white px-2 py-1 rounded-lg border border-ue-border shadow-sm">{{ fontScale.toFixed(1) }}x</span>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="fontScale = Math.max(0.8, fontScale - 0.1)"
              class="flex-1 bg-white border-2 border-ue-border py-3 rounded-xl font-black text-xl hover:bg-ue-gray-200 active:scale-95 transition-all"
            >
              A-
            </button>
            <button 
              @click="fontScale = 1.0"
              class="px-4 bg-ue-gray-200 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Reset
            </button>
            <button 
              @click="fontScale = Math.min(1.5, fontScale + 0.1)"
              class="flex-1 bg-white border-2 border-ue-border py-3 rounded-xl font-black text-xl hover:bg-ue-gray-200 active:scale-95 transition-all"
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Información del Sistema -->
    <div class="text-center px-12">
      <p class="text-[8px] font-bold text-ue-muted uppercase tracking-[0.3em] leading-relaxed">
        DiabeCheck v1.1.0 • Universidad Europea • Protección de datos sanitarios cifrada bajo norma AES-256
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Activity, User } from 'lucide-vue-next';
import { useAccessibility } from '../composables/useAccessibility';
import { useStorage } from '../composables/useStorage';

const { isHighContrast, toggleHighContrast, fontScale } = useAccessibility();
const { userProfile, updateProfile } = useStorage();

const profileForm = ref(JSON.parse(JSON.stringify(userProfile.value)));

const handleUpdateProfile = () => {
  updateProfile(profileForm.value);
  alert('Perfil actualizado correctamente');
};
</script>
