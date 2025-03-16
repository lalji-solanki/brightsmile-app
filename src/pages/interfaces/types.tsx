// interfaces/types.ts
export interface Slot {
  id: string;
  date: string;
  time: string;
  displayTime: string;
}

export interface Appointment {
  id: number;
  patientName: string;
  gender: string;
  age: number | undefined;
  mobile: string;
  slot: Slot;
}