import { SpellCategory } from "@/components/SpellsTabContent";

export interface CharacterData {
  id: string;
  name: string;
  classe: string;
  raca: string;
  level: number;
  xp: number;
  hp: {
    current: number;
    max: number;
  };
  mp: {
    current: number;
    max: number;
  };
  energia: {
    current: number;
    max: number;
  };
  cosmos: {
    current: number;
    max: number;
  };
  popularidade: {
    current: number;
    max: number;
  };
  perfil: {
    idade: string;
    peso: string;
    altura: string;
    porteFisico: string;
  };
  moedas: {
    ouro: number;
    aco?: number;
    asteri?: number;
  };
  equipment: Record<string, {
    name: string;
    description?: string;
    type?: 'weapon' | 'armor' | 'accessory' | 'custom';
    slot?: string;
  }>;
  backpack: any[];
  habilidades: string[];
  slots: string[];
  passivas: string[];
  buffs: string[];
  debuffs: string[];
  vantagens: string[];
  desvantagens: string[];
  conquistas: string[];
  spells: Array<{
    id: string;
    name: string;
    description?: string;
    category?: SpellCategory;
    damage?: number;
    healing?: number;
    cost?: {
      type: 'mana' | 'energia';
      value: number;
    };
  }>;
  notes: string;
}

export interface StatusAttribute {
  id: number;
  name: string;
  value: number;
  description: string; // This is required
}

export interface CharacterStatus {
  requisitos: StatusAttribute[];
  rolagem: StatusAttribute[];
}
