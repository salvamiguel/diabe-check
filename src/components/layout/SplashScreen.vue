<template>
  <Transition name="fade-splash">
    <div v-if="show" class="fixed inset-0 z-[1000] bg-ue-red-800 flex flex-col items-center justify-between p-12 overflow-hidden">
      <!-- Decorative background elements -->
      <div class="absolute top-[-10%] right-[-10%] w-64 h-64 bg-ue-red-700 rounded-full blur-3xl opacity-50"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-ue-red-500 rounded-full blur-3xl opacity-30"></div>

      <div></div>

      <!-- Center Logo/Brand -->
      <div class="flex flex-col items-center gap-6 animate-in fade-in zoom-in-75 duration-700">
        <div class="w-24 h-24 bg-white rounded-[24px] flex items-center justify-center shadow-2xl rotate-12">
          <Activity class="w-12 h-12 text-ue-red-500" />
        </div>
        <div class="text-center">
          <h1 class="text-white text-4xl font-black uppercase tracking-tighter leading-none">
            Diabe<span class="text-ue-red-500 bg-white px-2 ml-1 rounded">Check</span>
          </h1>
          <p class="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">
            Universidad Europea
          </p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="flex flex-col items-center gap-4 w-full animate-in slide-in-from-bottom-8 duration-700">
        <div class="h-1 w-12 bg-white/20 rounded-full overflow-hidden">
          <div class="h-full bg-white w-1/3 animate-loading-bar"></div>
        </div>
        <p class="text-white/40 text-[9px] font-black uppercase tracking-widest text-center">
          Tecnología para el Autocontrol Digital
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Activity } from 'lucide-vue-next';

const show = ref(true);

onMounted(() => {
  setTimeout(() => {
    show.value = false;
  }, 2500);
});
</script>

<style scoped>
.fade-splash-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-splash-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

@keyframes loading-bar {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
.animate-loading-bar {
  animation: loading-bar 1.5s infinite linear;
}
</style>
