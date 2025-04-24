
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skull, Edit, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SpellCategory = "Ataque" | "Defesa" | "Cura" | "Passiva";

interface SpellProps {
  id: string;
  name: string;
  description?: string;
  level?: number;
  type?: string;
  category?: SpellCategory;
  onUpdate?: (id: string, spell: { name: string; description?: string; category?: SpellCategory }) => void;
  onDelete?: (id: string) => void;
}

const SpellCard: React.FC<SpellProps> = ({
  id,
  name,
  description,
  level = 1,
  type = "Necromancia",
  category = "Ataque",
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description || "");
  const [editCategory, setEditCategory] = useState<SpellCategory>(category);
  
  const handleSave = () => {
    onUpdate?.(id, {
      name: editName,
      description: editDescription,
      category: editCategory
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditName(name);
    setEditDescription(description || "");
    setEditCategory(category);
    setIsEditing(false);
  };
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      "border border-necro/30 bg-necro-darker/70 hover:border-necro/50",
      "group relative animate-pulse"
    )}>
      {!isEditing && (
        <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 bg-necro-darker/80 rounded p-1">
          <button 
            onClick={() => setIsEditing(true)}
            className="text-necro-light hover:text-necro"
          >
            <Edit size={14} />
          </button>
          {onDelete && (
            <button 
              onClick={() => onDelete(id)}
              className="text-red-500 hover:text-red-400"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
      
      <div className={cn(
        "p-3 text-white flex items-center gap-2",
        "bg-gradient-to-r from-necro-dark to-necro"
      )}>
        <Skull size={16} className="text-white" />
        
        {isEditing ? (
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="bg-necro-darker/40 rounded px-2 py-1 w-full outline-none"
            autoFocus
          />
        ) : (
          <h3 className="font-cinzel font-semibold">{name}</h3>
        )}
      </div>
      
      <CardContent className="p-3">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="bg-necro-darker/40 border border-necro/30 rounded w-full p-2 h-20 resize-none"
              placeholder="Descrição da magia..."
            />
            
            <div className="mb-3">
              <label className="text-sm text-muted-foreground block mb-1">Categoria:</label>
              <select 
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as SpellCategory)}
                className="bg-necro-darker/40 border border-necro/30 rounded w-full p-2 text-sm"
              >
                <option value="Ataque">Ataque</option>
                <option value="Defesa">Defesa</option>
                <option value="Cura">Cura</option>
                <option value="Passiva">Passiva</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={handleCancel}
                className="px-2 py-1 text-sm bg-necro-darker hover:bg-necro-dark rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-2 py-1 text-sm bg-necro hover:bg-necro-light rounded text-white"
              >
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-20">
            <div className="mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-necro/20 text-necro-light inline-block">
                {category}
              </span>
            </div>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sem descrição</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpellCard;
