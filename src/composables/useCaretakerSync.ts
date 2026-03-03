import { ref, watch, type Ref, onUnmounted } from 'vue';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import type { Entry, UserProfile, PatientConnection } from '../types';

export function useCaretakerSync(entriesRef?: Ref<Entry[]>, profileRef?: Ref<UserProfile>) {
  const isCaretakerMode = ref(false);
  const caretakerData = ref<Entry[]>([]);
  const activePatientProfile = ref<(UserProfile & { id: string }) | null>(null);
  const patientList = ref<PatientConnection[]>(JSON.parse(localStorage.getItem('diabecheck_patient_list') || '[]'));
  
  const peer = ref<Peer | null>(null);
  const conn = ref<DataConnection | null>(null);
  const myPeerId = ref<string>('');
  const connectionStatus = ref<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const savePatientList = () => {
    localStorage.setItem('diabecheck_patient_list', JSON.stringify(patientList.value));
  };

  const removePatient = (id: string) => {
    patientList.value = patientList.value.filter(p => p.id !== id);
    savePatientList();
    if (activePatientProfile.value && activePatientProfile.value.id === id) {
      exitCaretakerMode();
    }
  };

  const sendDataToCaretaker = (c: DataConnection) => {
    if (entriesRef && profileRef) {
      try {
        c.send({ 
          type: 'SYNC_FULL', 
          data: JSON.parse(JSON.stringify(entriesRef.value)),
          profile: { ...JSON.parse(JSON.stringify(profileRef.value)), id: myPeerId.value }
        });
      } catch (e) {
        console.error('Sync: Error de serialización:', e);
      }
    }
  };

  const initPatientSession = () => {
    if (peer.value && !peer.value.destroyed) return;
    const savedId = localStorage.getItem('diabecheck_peer_id');
    peer.value = savedId ? new Peer(savedId) : new Peer();
    
    peer.value.on('open', (id) => {
      myPeerId.value = id;
      localStorage.setItem('diabecheck_peer_id', id);
    });

    peer.value.on('connection', (connection) => {
      conn.value = connection;
      connection.on('open', () => {
        connectionStatus.value = 'connected';
        sendDataToCaretaker(connection);
      });
      connection.on('data', (msg: any) => {
        if (msg.type === 'REQUEST_SYNC') sendDataToCaretaker(connection);
      });
      connection.on('close', () => {
        connectionStatus.value = 'disconnected';
      });
    });
  };

  const initCaretakerSession = (targetPeerId: string) => {
    isCaretakerMode.value = true;
    connectionStatus.value = 'connecting';
    
    if (!peer.value || peer.value.destroyed) peer.value = new Peer();
    
    const connectToTarget = () => {
      const connection = peer.value!.connect(targetPeerId, { reliable: true });
      conn.value = connection;

      connection.on('open', () => {
        connectionStatus.value = 'connected';
        connection.send({ type: 'REQUEST_SYNC' });
      });

      connection.on('data', (payload: any) => {
        if (payload.type === 'SYNC_FULL') {
          caretakerData.value = payload.data;
          activePatientProfile.value = payload.profile;
          
          const existing = patientList.value.findIndex(p => p.id === targetPeerId);
          const patientInfo: PatientConnection = {
            id: targetPeerId,
            name: payload.profile.name,
            lastName: payload.profile.lastName,
            lastSync: Date.now()
          };
          
          if (existing !== -1) {
            patientList.value[existing] = patientInfo;
          } else {
            patientList.value.push(patientInfo);
          }
          savePatientList();
        }
      });

      connection.on('close', () => {
        connectionStatus.value = 'disconnected';
      });
    };

    if (peer.value.open) connectToTarget();
    else peer.value.on('open', connectToTarget);
  };

  const exitCaretakerMode = () => {
    if (conn.value) conn.value.close();
    isCaretakerMode.value = false;
    caretakerData.value = [];
    activePatientProfile.value = null;
    const url = new URL(window.location.origin + window.location.pathname);
    window.history.replaceState({}, '', url.toString());
  };

  if (entriesRef && !isCaretakerMode.value) {
    watch(entriesRef, () => {
      if (conn.value?.open) sendDataToCaretaker(conn.value);
    }, { deep: true });
  }

  onUnmounted(() => {
    if (conn.value) conn.value.close();
    if (peer.value) peer.value.destroy();
  });

  return {
    isCaretakerMode,
    caretakerData,
    activePatientProfile,
    patientList,
    myPeerId,
    connectionStatus,
    initPatientSession,
    initCaretakerSession,
    exitCaretakerMode,
    removePatient,
    generateSyncLink: () => {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('peer', myPeerId.value);
      return url.toString();
    }
  };
}
