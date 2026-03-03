import { ref, onMounted } from 'vue';

export interface Reminder {
  id: string;
  title: string;
  time: string; // HH:mm
  type: 'glucose' | 'insulin';
  enabled: boolean;
  days: number[]; // 0-6 (dom-lun)
}

const STORAGE_KEY = 'diabecheck_reminders';

export function useNotifications() {
  const reminders = ref<Reminder[]>([]);
  const hasPermission = ref(false);

  const loadReminders = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      reminders.value = JSON.parse(saved);
    } else {
      // Default reminders
      reminders.value = [
        { id: '1', title: 'Glucemia Desayuno', time: '08:00', type: 'glucose', enabled: true, days: [0,1,2,3,4,5,6] },
        { id: '2', title: 'Insulina Comida', time: '14:00', type: 'insulin', enabled: true, days: [0,1,2,3,4,5,6] },
        { id: '3', title: 'Glucemia Cena', time: '21:00', type: 'glucose', enabled: true, days: [0,1,2,3,4,5,6] },
      ];
      saveReminders();
    }
  };

  const saveReminders = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders.value));
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    hasPermission.value = permission === 'granted';
    return hasPermission.value;
  };

  const checkPermission = () => {
    if (!('Notification' in window)) return;
    hasPermission.value = Notification.permission === 'granted';
  };

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder = { ...reminder, id: crypto.randomUUID() };
    reminders.value.push(newReminder);
    saveReminders();
  };

  const toggleReminder = (id: string) => {
    const r = reminders.value.find(rem => rem.id === id);
    if (r) {
      r.enabled = !r.enabled;
      saveReminders();
    }
  };

  const deleteReminder = (id: string) => {
    reminders.value = reminders.value.filter(r => r.id !== id);
    saveReminders();
  };

  // Visual Alert Simulator (fallback for Web Notifications)
  const activeAlert = ref<Reminder | null>(null);

  const startChecking = () => {
    setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = now.getDay();

      reminders.value.forEach(r => {
        if (r.enabled && r.time === currentTime && r.days.includes(currentDay)) {
          // Trigger Notification
          triggerNotification(r);
        }
      });
    }, 60000); // Check every minute
  };

  const triggerNotification = (reminder: Reminder) => {
    if (hasPermission.value) {
      new Notification('DiabeCheck: Recordatorio', {
        body: `Es hora de: ${reminder.title}`,
        icon: '/favicon.ico'
      });
    } else {
      // Internal App Alert
      activeAlert.value = reminder;
    }
  };

  onMounted(() => {
    loadReminders();
    checkPermission();
    startChecking();
  });

  return {
    reminders,
    hasPermission,
    activeAlert,
    requestPermission,
    addReminder,
    toggleReminder,
    deleteReminder
  };
}
