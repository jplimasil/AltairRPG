
import React from "react";
import ResourceSection from "@/components/ResourceSection";
import SectionCard from "@/components/SectionCard";
import NotesSection from "@/components/NotesSection";

interface ProfileTabContentProps {
  character: any;
  onUpdateNotes: (notes: string) => void;
  onUpdateArray: (field: string, items: string[]) => void;
  onUpdateProfile: (field: string, value: any) => void;
  onUpdateMoedas: (field: string, value: number) => void;
}

const ProfileTabContent: React.FC<ProfileTabContentProps> = ({ 
  character, 
  onUpdateNotes, 
  onUpdateArray,
  onUpdateProfile,
  onUpdateMoedas
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <ResourceSection 
        title="Energia" 
        current={character.energia.current} 
        max={character.energia.max} 
        color="bg-yellow-500"
        onUpdate={(current, max) => {
          onUpdateProfile("energia", { current, max });
        }}
      />
      <ResourceSection 
        title="Cosmos" 
        current={character.cosmos.current} 
        max={character.cosmos.max} 
        color="bg-blue-500"
        onUpdate={(current, max) => {
          onUpdateProfile("cosmos", { current, max });
        }}
      />
      <ResourceSection 
        title="Popularidade" 
        current={character.popularidade.current} 
        max={character.popularidade.max} 
        color="bg-green-500"
        onUpdate={(current, max) => {
          onUpdateProfile("popularidade", { current, max });
        }}
      />
      <SectionCard
        title="Informações Pessoais"
        items={[
          `Idade: ${character.perfil.idade}`,
          `Peso: ${character.perfil.peso} kg`,
          `Altura: ${character.perfil.altura} m`,
          `Porte Físico: ${character.perfil.porteFisico}`
        ]}
        editable={true}
        onUpdate={(items) => {
          const updatedPerfil = {
            idade: items[0].split(': ')[1],
            peso: items[1].split(': ')[1].replace(' kg', ''),
            altura: items[2].split(': ')[1].replace(' m', ''),
            porteFisico: items[3].split(': ')[1]
          };
          onUpdateProfile("perfil", updatedPerfil);
        }}
      />
      <SectionCard
        title="Moedas"
        items={[
          `Ouro: ${character.moedas.ouro}`,
          `Aço: ${character.moedas.aco || "0"}`,
          `Astéri: ${character.moedas.asteri || "0"}`
        ]}
        editable={true}
        onUpdate={(items) => {
          const ouro = Number(items[0].split(': ')[1]);
          const aco = Number(items[1].split(': ')[1]);
          const asteri = Number(items[2].split(': ')[1]);
          
          onUpdateMoedas("ouro", ouro);
          onUpdateMoedas("aco", aco);
          onUpdateMoedas("asteri", asteri);
        }}
      />
    </div>
    <div>
      <NotesSection 
        notes={character.notes} 
        onUpdateNotes={onUpdateNotes}
      />
      <SectionCard
        title="Vantagens"
        items={character.vantagens}
        editable={true}
        onUpdate={(items) => onUpdateArray("vantagens", items)}
      />
      <SectionCard
        title="Desvantagens"
        items={character.desvantagens}
        editable={true}
        onUpdate={(items) => onUpdateArray("desvantagens", items)}
      />
      <SectionCard
        title="Conquistas"
        items={character.conquistas}
        editable={true}
        onUpdate={(items) => onUpdateArray("conquistas", items)}
      />
    </div>
  </div>
);

export default ProfileTabContent;
