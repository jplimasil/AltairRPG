
import React, { useEffect, useState } from 'react';
import { getAllCharacters, deleteCharacter } from '@/services/characterService';
import { CharacterData } from '@/types/character';
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, Edit3 } from "lucide-react";
import { toast } from '@/components/ui/use-toast';

interface CharacterSelectorProps {
  onSelectCharacter: (character: CharacterData) => void;
  onCreateNewCharacter: () => void;
  currentCharacterId?: string;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  onSelectCharacter,
  onCreateNewCharacter,
  currentCharacterId
}) => {
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const data = await getAllCharacters();
      setCharacters(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar personagens",
        description: "Ocorreu um erro ao buscar os personagens no banco de dados.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleDeleteCharacter = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita.")) {
      try {
        await deleteCharacter(id);
        toast({
          title: "Personagem excluído",
          description: "O personagem foi excluído com sucesso.",
        });
        fetchCharacters();
      } catch (error) {
        toast({
          title: "Erro ao excluir personagem",
          description: "Ocorreu um erro ao excluir o personagem.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-cinzel text-white">Meus Personagens</h2>
        <button
          onClick={onCreateNewCharacter}
          className="px-4 py-2 bg-necro hover:bg-necro-light text-white rounded-md flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Novo Personagem
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando personagens...</div>
      ) : characters.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-necro/30 rounded-md">
          <p className="text-muted-foreground mb-4">Nenhum personagem encontrado.</p>
          <button
            onClick={onCreateNewCharacter}
            className="px-4 py-2 bg-necro hover:bg-necro-light text-white rounded-md flex items-center gap-2 mx-auto"
          >
            <PlusCircle size={16} />
            Criar Personagem
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map(character => (
            <Card
              key={character.id}
              className={`cursor-pointer border border-necro/30 hover:border-necro transition-colors ${
                currentCharacterId === character.id ? "border-necro bg-necro/10" : "bg-necro-darker/70"
              }`}
              onClick={() => onSelectCharacter(character)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-cinzel text-lg font-semibold">{character.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {character.raca} • {character.classe} • Nível {character.level}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-necro-light hover:text-necro p-1 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCharacter(character);
                    }}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-400 p-1 rounded-full"
                    onClick={(e) => handleDeleteCharacter(character.id, e)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterSelector;
