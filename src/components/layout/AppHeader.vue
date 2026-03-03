<template>
  <header class="bg-ue-surface border-b border-ue-border sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-ue-red-500 rounded flex items-center justify-center">
        <span class="text-white font-bold text-lg leading-none">D</span>
      </div>
      <h1 class="text-ue-text font-bold text-xl tracking-tight">DiabeCheck</h1>
    </div>
    <div class="flex items-center gap-4 text-ue-muted">
      <button class="p-1" aria-label="Notificaciones">
        <Bell class="w-6 h-6" />
      </button>
      <button class="p-1" aria-label="Perfil">
        <User class="w-6 h-6" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bell, User } from 'lucide-vue-next'
</script>
