
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skull, Edit, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SpellCategory } from './SpellsTabContent';

interface SpellProps {
  id: string;
  name: string;
  description?: string;
  damage?: number;
  healing?: number;
  cost?: {
    type: 'mana' | 'energia';
    value: number;
  };
  category?: SpellCategory;
  onUpdate?: (id: string, spell: {
    name: string;
    description?: string;
    category?: SpellCategory;
    damage?: number;
    healing?: number;
    cost?: {
      type: 'mana' | 'energia';
      value: number;
    };
  }) => void;
  onDelete?: (id: string) => void;
}

const SpellCard: React.FC<SpellProps> = ({
  id,
  name,
  description,
  damage,
  healing,
  cost,
  category = "Ataque",
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description || "");
  const [editCategory, setEditCategory] = useState<SpellCategory>(category);
  const [editDamage, setEditDamage] = useState<number | undefined>(damage);
  const [editHealing, setEditHealing] = useState<number | undefined>(healing);
  const [editCostType, setEditCostType] = useState<'mana' | 'energia'>(cost?.type || 'mana');
  const [editCostValue, setEditCostValue] = useState<number>(cost?.value || 0);
  
  const handleSave = () => {
    onUpdate?.(id, {
      name: editName,
      description: editDescription,
      category: editCategory,
      damage: editDamage,
      healing: editHealing,
      cost: {
        type: editCostType,
        value: editCostValue
      }
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditName(name);
    setEditDescription(description || "");
    setEditCategory(category);
    setEditDamage(damage);
    setEditHealing(healing);
    setEditCostType(cost?.type || 'mana');
    setEditCostValue(cost?.value || 0);
    setIsEditing(false);
  };
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      "border border-necro/30 bg-necro-darker/70 hover:border-necro/50",
      "group relative"
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
      
      <CardContent className="p-3 space-y-3">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="bg-necro-darker/40 border border-necro/30 rounded w-full p-2 h-20 resize-none"
              placeholder="Descrição da magia..."
            />
            
            <div className="grid grid-cols-1 gap-2">
              <div>
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
              
              {editCategory === "Ataque" && (
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Dano:</label>
                  <Input
                    type="number"
                    value={editDamage || ""}
                    onChange={(e) => setEditDamage(Number(e.target.value))}
                    className="bg-necro-darker/40 border border-necro/30"
                    min={0}
                  />
                </div>
              )}
              
              {editCategory === "Cura" && (
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Cura:</label>
                  <Input
                    type="number"
                    value={editHealing || ""}
                    onChange={(e) => setEditHealing(Number(e.target.value))}
                    className="bg-necro-darker/40 border border-necro/30"
                    min={0}
                  />
                </div>
              )}
              
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Custo:</label>
                <div className="flex gap-2">
                  <select
                    value={editCostType}
                    onChange={(e) => setEditCostType(e.target.value as 'mana' | 'energia')}
                    className="bg-necro-darker/40 border border-necro/30 rounded p-2 text-sm"
                  >
                    <option value="mana">Mana</option>
                    <option value="energia">Energia</option>
                  </select>
                  <Input
                    type="number"
                    value={editCostValue}
                    onChange={(e) => setEditCostValue(Number(e.target.value))}
                    className="bg-necro-darker/40 border border-necro/30 flex-grow"
                    min={0}
                  />
                </div>
              </div>
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
          <div className="space-y-3">
            <div className="mb-1 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-necro/20 text-necro-light inline-block">
                {category}
              </span>
              {cost && cost.value > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 inline-block">
                  Custo: {cost.value} {cost.type === 'mana' ? 'Mana' : 'Energia'}
                </span>
              )}
              {damage && damage > 0 && category === "Ataque" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 inline-block">
                  Dano: {damage}
                </span>
              )}
              {healing && healing > 0 && category === "Cura" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 inline-block">
                  Cura: {healing}
                </span>
              )}
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
