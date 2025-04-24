
import React, { useState } from "react";
import SpellCard from "@/components/SpellCard";
import { SpellTabContentWrapper, useTabContext } from "@/components/TabLayout";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

// Define the SpellCategory type for reuse
export type SpellCategory = "Ataque" | "Defesa" | "Cura" | "Passiva";
export interface Spell {
  id: string;
  name: string;
  description?: string;
  category?: SpellCategory;
}

interface SpellsTabContentProps {
  spells: Spell[];
  onAdd: (spell: Spell) => void;
  onUpdate: (id: string, spell: { name: string; description?: string; category?: SpellCategory }) => void;
  onDelete: (id: string) => void;
}

const SpellsTabContent: React.FC<SpellsTabContentProps> = ({
  spells,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const { activeSpellTab } = useTabContext();

  const handleAddSpell = () => {
    const newSpell: Spell = {
      id: `spell-${uuidv4()}`,
      name: "Nova Magia",
      description: "",
      category: "Ataque"
    };
    onAdd(newSpell);
    toast({
      title: "Magia adicionada",
      description: "Nova magia adicionada com sucesso!",
      duration: 2000,
    });
  };

  const filteredSpells = spells.filter(spell => {
    if (activeSpellTab === 'all') return true;
    if (activeSpellTab === 'attack') return spell.category === 'Ataque';
    if (activeSpellTab === 'defense') return spell.category === 'Defesa';
    if (activeSpellTab === 'healing') return spell.category === 'Cura';
    if (activeSpellTab === 'passive') return spell.category === 'Passiva';
    return true;
  });

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-cinzel text-white">Magias</h2>
        <button 
          onClick={handleAddSpell}
          className="px-3 py-1 bg-necro hover:bg-necro-light text-white rounded-md flex items-center gap-1 text-sm"
        >
          Nova Magia
        </button>
      </div>
      <SpellTabContentWrapper value={activeSpellTab}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpells.map(spell => (
            <SpellCard 
              key={spell.id}
              id={spell.id}
              name={spell.name}
              description={spell.description}
              category={spell.category}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SpellTabContentWrapper>
    </>
  );
};

export default SpellsTabContent;
