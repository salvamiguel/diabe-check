export type EntryType = 'glucose' | 'insulin' | 'carbs' | 'exercise';

export interface BaseEntry {
  id: string;
  timestamp: number;
  notes?: string;
  moment?: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'other';
}

export interface GlucoseEntry extends BaseEntry {
  type: 'glucose';
  value: number; // mg/dL
}

export interface InsulinEntry extends BaseEntry {
  type: 'insulin';
  value: number; // units
  insulinType: 'rapid' | 'basal';
}

export type Entry = GlucoseEntry | InsulinEntry;

export interface UserSettings {
  targetRange: {
    min: number;
    max: number;
  };
  correctionFactor: number;
  insulinCarbRatio: number;
  userName: string;
}

export interface UserProfile {
  name: string;
  lastName: string;
  age: number | null;
  sex: 'M' | 'F' | 'O' | null;
  settings: {
    glucoseMin: number;
    glucoseMax: number;
  };
}

export interface PatientConnection {
  id: string; // PeerID
  name: string;
  lastName: string;
  lastSync: number;
}

export interface UserProfileWithId extends UserProfile {
  id: string;
}
