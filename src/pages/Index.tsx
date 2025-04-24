import React, { useState, useEffect } from "react";
import CharacterHeader from "@/components/CharacterHeader";
import { CharacterTabs, TabContentWrapper } from "@/components/TabLayout";
import { toast } from "@/components/ui/use-toast";
import { Download, Save } from "lucide-react";
import generateCharacterPDF from "@/utils/pdfGenerator";
import { Button } from "@/components/ui/button";

import SpellsTabContent, { Spell, SpellCategory } from "@/components/SpellsTabContent";
import ProfileTabContent from "@/components/ProfileTabContent";
import SkillsTabContent from "@/components/SkillsTabContent";
import InventoryTabContent from "@/components/InventoryTabContent";
import StatusTabContent from "@/components/StatusTabContent";
import NotesSection from "@/components/NotesSection";
import CharacterSelector from "@/components/CharacterSelector";
import CharacterEditModal from "@/components/CharacterEditModal";
import { CharacterData, CharacterStatus, StatusAttribute } from "@/types/character";
import {
  getCharacterById,
  createCharacter,
  updateCharacter,
  getCharacterStatus,
  saveCharacterStatus
} from "@/services/characterService";
import { v4 as uuidv4 } from "uuid";

const defaultCharacterData: Omit<CharacterData, "id"> = {
  name: "Novo Personagem",
  classe: "Necromante",
  raca: "Humano",
  level: 1,
  xp: 0,
  hp: { current: 10, max: 10 },
  mp: { current: 20, max: 20 },
  energia: { current: 10, max: 10 },
  cosmos: { current: 5, max: 5 },
  popularidade: { current: 0, max: 100 },
  perfil: {
    idade: "25",
    peso: "70",
    altura: "1.75",
    porteFisico: "Médio"
  },
  moedas: {
    ouro: 100,
    aco: 0,
    asteri: 0
  },
  equipment: {
    weapon: { name: "Cajado", description: "Um simples cajado de madeira" },
    armor: { name: "Túnica", description: "Túnica simples de pano" },
    accessory: { name: "Amuleto", description: "Amuleto de proteção básico" }
  },
  backpack: [
    { name: "Poção de Cura", quantity: 3, description: "Recupera 5 pontos de vida" },
    { name: "Poção de Mana", quantity: 2, description: "Recupera 5 pontos de mana" }
  ],
  habilidades: ["Invocar Esqueleto", "Toque da Morte"],
  slots: ["Slot de Habilidade 1", "Slot de Habilidade 2"],
  passivas: ["Resistência a Morte", "Comunicação com Mortos"],
  buffs: ["Armadura de Ossos: +5 DEF"],
  debuffs: ["Maldição: -3 para todos os atributos"],
  vantagens: ["Visão no Escuro", "Resistência a doenças"],
  desvantagens: ["Temido por NPCs", "Vulnerável a magia sagrada"],
  conquistas: ["Primeiros Passos"],
  spells: [
    {
      id: `spell-${uuidv4()}`,
      name: "Drenar Vida",
      description: "Drena 5 pontos de vida do alvo",
      category: "Ataque"
    }
  ],
  notes: "Anotações sobre o personagem..."
};

const defaultRequisitosStatus: StatusAttribute[] = [
  { id: 1, name: "Força", value: 28, description: "Força física bruta" },
  { id: 2, name: "Agilidade", value: 23, description: "Destreza em movimentos ágeis" },
  { id: 3, name: "Velocidade", value: 23, description: "Rapidez de movimentos" },
  { id: 4, name: "Equilíbrio", value: 23, description: "Capacidade de manter-se estável" },
  { id: 5, name: "Técnica", value: 25, description: "Habilidade geral em técnicas" },
  { id: 6, name: "Técnica com arma", value: 33, description: "Domínio no uso de armas" },
  { id: 7, name: "Técnica com magia", value: 50, description: "Domínio em magia" },
  { id: 8, name: "Sapiência", value: 50, description: "Conhecimento amplo, sabedoria" },
  { id: 9, name: "Raciocínio", value: 50, description: "Facilidade de pensar e deduzir" },
  { id: 10, name: "Coragem", value: 14, description: "Capacidade de resistir ao medo" },
  { id: 11, name: "Carisma", value: 22, description: "Poder de influência e liderança" },
  { id: 12, name: "Mira", value: 19, description: "Precisão em ataques à distância" },
  { id: 13, name: "Precisão", value: 19, description: "Exatidão em ações delicadas" },
  { id: 14, name: "Constituição Mágica", value: 40, description: "Resistência à magia" },
  { id: 15, name: "Molde de Magia", value: 50, description: "Capacidade de moldar magias" },
  { id: 16, name: "Consistência de Magia", value: 43, description: "Estabilidade em magias lançadas" },
  { id: 17, name: "Constituição", value: 27, description: "Resistência física e saúde" },
];

const defaultRolagemStatus: StatusAttribute[] = [
  { id: 1, name: "Intuição", value: 21, description: "Instinto e pressentimento" },
  { id: 2, name: "Percepção", value: 20, description: "Atenção aos detalhes, sentidos" },
  { id: 3, name: "Força de Vontade", value: 20, description: "Determinação" },
  { id: 4, name: "Furtividade", value: 17, description: "Discrição e silêncio" },
];

const Index = () => {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [status, setStatus] = useState<CharacterStatus>({
    requisitos: defaultRequisitosStatus,
    rolagem: defaultRolagemStatus
  });
  const [showSelector, setShowSelector] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const loadCharacter = async (characterId: string) => {
    try {
      const characterData = await getCharacterById(characterId);
      if (!characterData) {
        toast({
          title: "Personagem não encontrado",
          description: "Não foi possível encontrar os dados deste personagem.",
          variant: "destructive"
        });
        return;
      }
      
      setCharacter(characterData);
      
      const statusData = await getCharacterStatus(characterId);
      if (statusData) {
        setStatus(statusData);
      } else {
        setStatus({
          requisitos: defaultRequisitosStatus,
          rolagem: defaultRolagemStatus
        });
      }
      
      toast({
        title: "Personagem carregado",
        description: `${characterData.name} foi carregado com sucesso!`,
      });
      
      setShowSelector(false);
    } catch (error) {
      console.error("Erro ao carregar personagem:", error);
      toast({
        title: "Erro ao carregar",
        description: "Ocorreu um erro ao carregar os dados do personagem.",
        variant: "destructive"
      });
    }
  };

  const handleSelectCharacter = (selectedCharacter: CharacterData) => {
    loadCharacter(selectedCharacter.id);
  };

  const handleCreateNewCharacter = async () => {
    try {
      const newCharacterId = await createCharacter(defaultCharacterData);
      
      await saveCharacterStatus(newCharacterId, {
        requisitos: defaultRequisitosStatus,
        rolagem: defaultRolagemStatus
      });
      
      loadCharacter(newCharacterId);
      
      toast({
        title: "Personagem criado",
        description: "Um novo personagem foi criado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao criar personagem:", error);
      toast({
        title: "Erro ao criar personagem",
        description: "Ocorreu um erro ao criar um novo personagem.",
        variant: "destructive"
      });
    }
  };

  const saveCurrentCharacter = async () => {
    if (!character) return;
    
    try {
      setIsSaving(true);
      
      await updateCharacter(character);
      
      const statusWithDescriptions: CharacterStatus = {
        requisitos: status.requisitos.map(attr => ({
          ...attr,
          description: attr.description || ''
        })),
        rolagem: status.rolagem.map(attr => ({
          ...attr,
          description: attr.description || ''
        }))
      };
      
      await saveCharacterStatus(character.id, statusWithDescriptions);
      
      toast({
        title: "Personagem salvo",
        description: `${character.name} foi salvo com sucesso!`,
      });
    } catch (error) {
      console.error("Erro ao salvar personagem:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados do personagem.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToSelector = () => {
    setShowSelector(true);
  };

  const handleUpdateStatus = (category: 'requisitos' | 'rolagem', id: number, newValue: number) => {
    setStatus(prev => ({
      ...prev,
      [category]: prev[category].map(attr => 
        attr.id === id ? { ...attr, value: newValue } : attr
      )
    }));
  };

  const handleUpdateNotes = (notes: string) => {
    if (!character) return;
    
    setCharacter(prev => {
      if (!prev) return prev;
      return { ...prev, notes };
    });
  };

  const handleUpdateArray = (field: string, items: string[]) => {
    if (!character) return;
    
    setCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: items
      };
    });
    
    toast({
      title: "Atualizado",
      description: `${field} atualizado com sucesso!`,
      duration: 2000,
    });
  };

  const handleUpdateProfile = (field: string, value: any) => {
    if (!character) return;
    
    setCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
    
    toast({
      title: "Atualizado",
      description: `${field} atualizado com sucesso!`,
      duration: 2000,
    });
  };

  const handleUpdateMoedas = (field: string, value: number) => {
    if (!character) return;
    
    setCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        moedas: {
          ...prev.moedas,
          [field]: value
        }
      };
    });
    
    toast({
      title: "Moedas atualizadas",
      description: `${field} atualizado com sucesso!`,
      duration: 2000,
    });
  };

  const handleUpdateBackpack = (items: any[]) => {
    if (!character) return;
    
    setCharacter(prev => {
      if (!prev) return prev;
      return { ...prev, backpack: items };
    });
  };

  const handleUpdateEquipment = (slot: string, item: any) => {
    if (!character) return;
    
    setCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        equipment: {
          ...prev.equipment,
          [slot]: item
        }
      };
    });
    
    toast({
      title: item ? "Equipamento atualizado" : "Equipamento removido",
      description: `Slot ${slot} foi ${item ? "atualizado" : "esvaziado"} com sucesso!`,
      duration: 2000,
    });
  };

  const handleGeneratePDF = () => {
    if (!character) return;
    generateCharacterPDF(character, status);
  };

  const handleAddSpell = (spell: Spell) => {
    if (!character) return;
    
    setCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        spells: [...prev.spells, spell]
      };
    });
  };

  const handleUpdateSpell = (id: string, spellUpdate: { name: string; description?: string; category?: SpellCategory }) => {
    if (!character) return;
    
    setCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        spells: prev.spells.map(s => 
          s.id === id ? { ...s, ...spellUpdate } : s
        )
      };
    });
    
    toast({
      title: "Magia atualizada",
      description: `${spellUpdate.name} foi atualizada com sucesso!`,
      duration: 2000,
    });
  };

  const handleDeleteSpell = (id: string) => {
    if (!character) return;
    
    setCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        spells: prev.spells.filter(s => s.id !== id)
      };
    });
    
    toast({
      title: "Magia removida",
      description: "A magia foi removida com sucesso!",
      duration: 2000,
    });
  };

  const handleEditCharacter = (data: {
    name: string;
    classe: string;
    raca: string;
    level: number;
    xp: number;
    hp: { current: number; max: number };
    mp: { current: number; max: number };
  }) => {
    setCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        name: data.name,
        classe: data.classe,
        raca: data.raca,
        level: data.level,
        xp: data.xp,
        hp: { ...data.hp },
        mp: { ...data.mp }
      };
    });
    setEditModalOpen(false);
    toast({
      title: "Personagem atualizado!",
      description: "Informações editadas com sucesso.",
      duration: 2000,
    });
  };

  useEffect(() => {
    if (character) {
      const autoSaveTimer = setTimeout(() => {
        saveCurrentCharacter();
      }, 2000);
      
      return () => clearTimeout(autoSaveTimer);
    }
  }, [character, status]);

  return (
    <div className="min-h-screen bg-necro-darker text-foreground font-mono">
      <div className="container mx-auto py-6 px-4">
        {showSelector ? (
          <CharacterSelector
            onSelectCharacter={handleSelectCharacter}
            onCreateNewCharacter={handleCreateNewCharacter}
            currentCharacterId={character?.id}
          />
        ) : character ? (
          <>
            <CharacterEditModal
              open={editModalOpen}
              character={{
                name: character.name,
                classe: character.classe,
                raca: character.raca,
                level: character.level,
                xp: character.xp,
                hp: character.hp,
                mp: character.mp
              }}
              onClose={() => setEditModalOpen(false)}
              onSave={handleEditCharacter}
            />
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <CharacterHeader 
                  name={character.name}
                  classe={character.classe}
                  raca={character.raca}
                  level={character.level}
                  xp={character.xp}
                  currentHp={character.hp.current}
                  maxHp={character.hp.max}
                  currentMp={character.mp.current}
                  maxMp={character.mp.max}
                />
                <Button variant="secondary" onClick={() => setEditModalOpen(true)} className="ml-2">
                  Editar
                </Button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handleBackToSelector}
                  className="bg-necro-dark hover:bg-necro text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300"
                >
                  Voltar à Seleção
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={saveCurrentCharacter}
                    disabled={isSaving}
                    className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button 
                    onClick={handleGeneratePDF}
                    className="bg-necro hover:bg-necro-light text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg hover:shadow-necro/30 transition-all duration-300"
                  >
                    <Download size={18} />
                    Exportar PDF
                  </button>
                </div>
              </div>
            </div>
            <CharacterTabs>
              <TabContentWrapper value="profile">
                <ProfileTabContent
                  character={character}
                  onUpdateNotes={handleUpdateNotes}
                  onUpdateArray={handleUpdateArray}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateMoedas={handleUpdateMoedas}
                />
              </TabContentWrapper>
              <TabContentWrapper value="skills">
                <SkillsTabContent
                  character={character}
                  onUpdateArray={handleUpdateArray}
                />
              </TabContentWrapper>
              <TabContentWrapper value="inventory">
                <InventoryTabContent
                  equipment={character.equipment}
                  backpack={character.backpack}
                  onUpdateBackpack={handleUpdateBackpack}
                  onUpdateEquipment={handleUpdateEquipment}
                />
              </TabContentWrapper>
              <TabContentWrapper value="spells">
                <SpellsTabContent
                  spells={character.spells}
                  onAdd={handleAddSpell}
                  onUpdate={handleUpdateSpell}
                  onDelete={handleDeleteSpell}
                />
              </TabContentWrapper>
              <TabContentWrapper value="status">
                <StatusTabContent
                  requisitos={status.requisitos}
                  rolagem={status.rolagem}
                  onUpdateAttribute={handleUpdateStatus}
                />
              </TabContentWrapper>
              <TabContentWrapper value="notes">
                <div className="space-y-6">
                  <NotesSection 
                    notes={character.notes} 
                    onUpdateNotes={handleUpdateNotes}
                  />
                </div>
              </TabContentWrapper>
            </CharacterTabs>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Nenhum personagem selecionado</p>
            <button
              onClick={handleCreateNewCharacter}
              className="px-4 py-2 bg-necro hover:bg-necro-light text-white rounded-md"
            >
              Criar Novo Personagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
