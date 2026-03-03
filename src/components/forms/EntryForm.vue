<template>
  <div class="fixed inset-0 z-[300] flex items-center justify-center p-4">
    <!-- Backdrop with blur -->
    <div class="absolute inset-0 bg-ue-text/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
      <!-- Header -->
      <header :class="[type === 'glucose' ? 'bg-ue-red-800' : 'bg-blue-900']" class="p-6 text-white relative">
        <button @click="$emit('close')" class="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-full transition-colors">
          <X class="w-5 h-5" />
        </button>
        <h3 class="text-xl font-black uppercase tracking-tight">
          {{ type === 'glucose' ? 'Registrar Glucemia' : 'Registrar Insulina' }}
        </h3>
        <p class="text-[9px] font-bold uppercase tracking-[0.2em] opacity-70 mt-1">Registro manual</p>
      </header>

      <!-- Form Body -->
      <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <!-- Value Input -->
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-ue-muted">Valor (mg/dL)</label>
          <div class="relative items-center flex">
            <input 
              v-model.number="value" 
              type="number" 
              class="w-full text-5xl font-black p-4 bg-ue-gray-200/50 rounded-2xl border-2 border-transparent focus:border-ue-red-500 focus:bg-white transition-all outline-none"
              placeholder="0"
            />
            <div :class="[type === 'glucose' ? 'text-ue-red-500' : 'text-blue-500']" class="absolute right-4 opacity-40">
              <Droplets v-if="type === 'glucose'" class="w-8 h-8" />
              <Syringe v-else class="w-8 h-8" />
            </div>
          </div>
        </div>

        <!-- Moment Selection -->
        <div class="space-y-3">
          <label class="text-[10px] font-black uppercase tracking-widest text-ue-muted">Momento del Registro</label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              v-for="opt in moments" 
              :key="opt"
              @click="moment = opt"
              :class="[moment === opt ? (type === 'glucose' ? 'bg-ue-red-500 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg') : 'bg-white border border-ue-border text-ue-text']"
              class="py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              {{ opt }}
            </button>
          </div>
        </div>

        <!-- Comments -->
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-ue-muted">Comentarios</label>
          <textarea 
            v-model="notes"
            rows="3"
            class="w-full p-4 bg-ue-gray-200/50 rounded-2xl border-2 border-transparent focus:border-ue-red-500 focus:bg-white transition-all outline-none text-xs font-medium"
            placeholder="Opcional: ejercicio, enfermedad, raciones de HC..."
          ></textarea>
        </div>
      </div>

      <!-- Footer Action -->
      <div class="p-6 pt-0">
        <button 
          @click="submit"
          :class="[type === 'glucose' ? 'bg-ue-red-500' : 'bg-blue-600']"
          class="w-full py-4 rounded-2xl text-white font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all"
        >
          Guardar Registro
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, Droplets, Syringe } from 'lucide-vue-next';

const props = defineProps<{
  type: 'glucose' | 'insulin'
}>();

const emit = defineEmits(['close', 'save']);

const value = ref(0);
const notes = ref('');
const moment = ref('OTROS');

const moments = ['AYUNAS', 'ANTES DE COMER', 'POST-PRANDIAL', 'OTROS'];

const submit = () => {
  if (value.value <= 0) return;
  emit('save', {
    type: props.type,
    value: value.value,
    notes: notes.value,
    moment: moment.value
  });
};
</script>
