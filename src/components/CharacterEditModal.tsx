
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CharacterEditModalProps {
  open: boolean;
  character: {
    name: string;
    classe: string;
    raca: string;
    level: number;
    xp: number;
    hp: { current: number; max: number };
    mp: { current: number; max: number };
  };
  onClose: () => void;
  onSave: (data: {
    name: string;
    classe: string;
    raca: string;
    level: number;
    xp: number;
    hp: { current: number; max: number };
    mp: { current: number; max: number };
  }) => void;
}

const CharacterEditModal: React.FC<CharacterEditModalProps> = ({ open, character, onClose, onSave }) => {
  const [form, setForm] = useState(character);

  React.useEffect(() => {
    setForm(character);
  }, [character, open]);

  const handleInput = (field: string, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumber = (group: "hp"|"mp", field: "current"|"max", value: number) => {
    setForm(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Personagem</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <Input value={form.name} onChange={e => handleInput("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Classe</label>
            <Input value={form.classe} onChange={e => handleInput("classe", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Raça</label>
            <Input value={form.raca} onChange={e => handleInput("raca", e.target.value)} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm mb-1">Nível</label>
              <Input
                type="number"
                value={form.level}
                min={1}
                onChange={e => handleInput("level", Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">XP</label>
              <Input
                type="number"
                value={form.xp}
                min={0}
                onChange={e => handleInput("xp", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm mb-1">HP Atual</label>
              <Input
                type="number"
                value={form.hp.current}
                min={0}
                onChange={e => handleNumber("hp", "current", Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">HP Máximo</label>
              <Input
                type="number"
                value={form.hp.max}
                min={1}
                onChange={e => handleNumber("hp", "max", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm mb-1">MP Atual</label>
              <Input
                type="number"
                value={form.mp.current}
                min={0}
                onChange={e => handleNumber("mp", "current", Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">MP Máximo</label>
              <Input
                type="number"
                value={form.mp.max}
                min={1}
                onChange={e => handleNumber("mp", "max", Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
          <Button onClick={() => onSave(form)} type="button">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterEditModal;
