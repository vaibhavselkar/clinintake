import { IntakePhase, PHASE_ORDER } from '../types/clinical.types';

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });
}

export function getPhaseProgress(phase: IntakePhase): number {
  const idx = PHASE_ORDER.indexOf(phase);
  return Math.round(((idx + 1) / PHASE_ORDER.length) * 100);
}

export function formatPatientAge(age: number, sex: 'male' | 'female'): string {
  return `${age}yo ${sex === 'male' ? 'M' : 'F'}`;
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}
