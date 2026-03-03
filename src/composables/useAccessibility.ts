import { ref, onMounted, watch } from 'vue';

export function useAccessibility() {
  const isHighContrast = ref(localStorage.getItem('high-contrast') === 'true');
  const fontScale = ref(Number(localStorage.getItem('font-scale')) || 1.0);

  const toggleHighContrast = () => {
    isHighContrast.value = !isHighContrast.value;
    localStorage.setItem('high-contrast', String(isHighContrast.value));
    applyToBody();
  };

  const applyToBody = () => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    
    // Alto contraste
    if (isHighContrast.value) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Tamaño de fuente: Aplicamos al root para que rem/em escalen
    root.style.fontSize = `${fontScale.value * 100}%`;
  };

  // Observamos cambios en fontScale para persistir y aplicar
  watch(fontScale, (newVal) => {
    localStorage.setItem('font-scale', String(newVal));
    applyToBody();
  });

  onMounted(() => {
    applyToBody();
  });

  return {
    isHighContrast,
    fontScale,
    toggleHighContrast,
    applyToBody
  };
}
