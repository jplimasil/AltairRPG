
import React from "react";
import SectionCard from "@/components/SectionCard";

interface SkillsTabContentProps {
  character: any;
  onUpdateArray: (field: string, items: string[]) => void;
}

const SkillsTabContent: React.FC<SkillsTabContentProps> = ({ character, onUpdateArray }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <SectionCard
        title="Habilidades"
        items={character.habilidades}
        editable={true}
        onUpdate={(items) => onUpdateArray("habilidades", items)}
      />
      <SectionCard
        title="Slots de Habilidades"
        items={character.slots}
        editable={true}
        onUpdate={(items) => onUpdateArray("slots", items)}
      />
    </div>
    <div>
      <SectionCard
        title="Passivas"
        items={character.passivas}
        editable={true}
        onUpdate={(items) => onUpdateArray("passivas", items)}
      />
      <SectionCard
        title="Buff"
        items={character.buffs}
        editable={true}
        onUpdate={(items) => onUpdateArray("buffs", items)}
      />
      <SectionCard
        title="Debuff"
        items={character.debuffs}
        editable={true}
        onUpdate={(items) => onUpdateArray("debuffs", items)}
      />
    </div>
  </div>
);

export default SkillsTabContent;
