import { describe, it, expect, beforeEach } from 'vitest';

// Mocks
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import { useStorage } from '../composables/useStorage';

describe('useStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe inicializar con valores por defecto si el storage está vacío', () => {
    const { userProfile, entries } = useStorage();
    expect(userProfile.value.name).toBe('Usuario');
    expect(entries.value).toEqual([]);
  });

  it('debe guardar y cargar una entrada correctamente', () => {
    const { addEntry, entries } = useStorage();
    const entry = {
      id: '1',
      timestamp: Date.now(),
      type: 'glucose',
      value: 120,
      moment: 'fasting'
    };
    
    // @ts-ignore
    addEntry(entry);
    expect(entries.value.length).toBe(1);
    expect(entries.value[0]?.value).toBe(120);
  });
});
