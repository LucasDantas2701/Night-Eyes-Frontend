export const EVENT_CONFIG = {
  fadiga: { label: 'Evento de Fadiga', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: 'eyeOff' },
  'uso de celular': { label: 'Uso de Celular', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: 'phone' },
  'distração': { label: 'Evento de Distração', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'eye' },
  'rosto não detectado': { label: 'Rosto não detectado', color: 'bg-red-100 text-red-700 border-red-200', icon: 'alert' },
} as const;

export type TipoEvento = keyof typeof EVENT_CONFIG;

export interface Evento {
  id: number;
  tipo: TipoEvento;
  horario: string;
  localizacao: string;
}

export interface Funcionario {
  funcionario_id: number;
  nome: string;
  cargo: string | null;
}

export interface Percentual { texto: string; cor: string; }
