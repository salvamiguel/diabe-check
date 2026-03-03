import { ref } from 'vue';
import CryptoJS from 'crypto-js';
import type { Entry, UserProfile } from '../types';

const STORAGE_KEY = 'diabecheck_data_v1.1';
const ENCRYPTION_SECRET = import.meta.env.VITE_ENCRYPTION_KEY || 'ue-diabecheck-secret-dev';

export function useStorage() {
  const entries = ref<Entry[]>([]);
  const userProfile = ref<UserProfile>({
    name: 'Usuario',
    lastName: 'Apellido',
    age: null,
    sex: null,
    settings: {
      glucoseMin: 70,
      glucoseMax: 180
    }
  });

  const loadData = () => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEY);
      if (encrypted) {
        const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_SECRET);
        const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
        
        if (!decryptedStr) throw new Error('Decryption failed');
        
        const parsed = JSON.parse(decryptedStr);
        entries.value = parsed.entries || [];
        if (parsed.profile) userProfile.value = parsed.profile;
        console.log('useStorage: Datos cargados del paciente.');
      }
    } catch (e) {
      console.warn('useStorage: Error cargando datos, reiniciando...', e);
      saveData();
    }
  };

  const saveData = () => {
    const dataToSave = {
      entries: entries.value,
      profile: userProfile.value
    };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(dataToSave), ENCRYPTION_SECRET).toString();
    localStorage.setItem(STORAGE_KEY, encrypted);
  };

  const addEntry = (entry: Omit<Entry, 'id' | 'timestamp'>) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    } as Entry;
    entries.value = [newEntry, ...entries.value];
    saveData();
  };

  const updateProfile = (newProfile: UserProfile) => {
    userProfile.value = { ...newProfile };
    saveData();
  };

  loadData();

  return {
    entries,
    userProfile,
    addEntry,
    updateProfile,
    saveData
  };
}
