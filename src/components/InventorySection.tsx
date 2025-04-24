import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Pocket, Sword, Edit, Save, X, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  type?: 'weapon' | 'armor' | 'item' | 'custom';
  slot?: string;
}

interface InventorySectionProps {
  equipment: Record<string, InventoryItem | null>;
  backpack: InventoryItem[];
  onUpdateEquipment?: (slot: string, item: InventoryItem | null) => void;
  onUpdateBackpack?: (items: InventoryItem[]) => void;
}

const InventorySection: React.FC<InventorySectionProps> = ({
  equipment: initialEquipment,
  backpack: initialBackpack,
  onUpdateEquipment,
  onUpdateBackpack
}) => {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [backpack, setBackpack] = useState(initialBackpack);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [addingToBackpack, setAddingToBackpack] = useState(false);
  const [addingToEquipment, setAddingToEquipment] = useState(false);
  const [inventoryCapacity, setInventoryCapacity] = useState(12);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tab, setTab] = useState("equipment");
  const [addingEquipmentSlot, setAddingEquipmentSlot] = useState(false);
  const [newSlotName, setNewSlotName] = useState("");

  const handleEquipmentClick = (slot: string, item: InventoryItem | null) => {
    if (item) {
      setEditingItem(item);
      setEditingSlot(slot);
      setEditingName(item.name);
      setEditingDescription(item.description || "");
      setAddingToEquipment(false);
    } else {
      setEditingItem(null);
      setEditingSlot(slot);
      setEditingName("");
      setEditingDescription("");
      setAddingToEquipment(true);
    }
  };

  const handleBackpackItemClick = (item: InventoryItem) => {
    setEditingItem(item);
    setEditingSlot(null);
    setEditingName(item.name);
    setEditingDescription(item.description || "");
    setAddingToEquipment(false);
  };

  const handleSaveItem = () => {
    if (!editingName.trim()) return;
    
    if (editingSlot !== null) {
      const updatedItem: InventoryItem = editingItem 
        ? { 
            ...editingItem, 
            name: editingName, 
            description: editingDescription 
          }
        : { 
            id: `equip-${Date.now()}`, 
            name: editingName, 
            description: editingDescription,
            slot: editingSlot
          };
      
      const newEquipment = {
        ...equipment,
        [editingSlot]: updatedItem
      };
      
      setEquipment(newEquipment);
      onUpdateEquipment?.(editingSlot, updatedItem);
      
      toast({
        title: editingItem ? "Item atualizado" : "Item equipado",
        description: `${updatedItem.name} foi ${editingItem ? "atualizado" : "equipado"} com sucesso.`,
        duration: 2000,
      });
    } else if (editingItem) {
      const updatedItem = {
        ...editingItem,
        name: editingName,
        description: editingDescription
      };
      
      const newBackpack = backpack.map(item => 
        item.id === editingItem.id ? updatedItem : item
      );
      
      setBackpack(newBackpack);
      onUpdateBackpack?.(newBackpack);
      
      toast({
        title: "Item atualizado",
        description: `${updatedItem.name} foi atualizado com sucesso.`,
        duration: 2000,
      });
    }
    
    setEditingItem(null);
    setEditingSlot(null);
    setAddingToEquipment(false);
  };

  const handleAddToBackpack = () => {
    if (!editingName.trim()) {
      setAddingToBackpack(false);
      return;
    }
    
    const newItem: InventoryItem = {
      id: `item-${Date.now()}`,
      name: editingName,
      description: editingDescription,
      type: 'item'
    };
    
    const newBackpack = [...backpack, newItem];
    setBackpack(newBackpack);
    onUpdateBackpack?.(newBackpack);
    
    toast({
      title: "Item adicionado",
      description: `${newItem.name} foi adicionado à mochila.`,
      duration: 2000,
    });
    
    setEditingName("");
    setEditingDescription("");
    setAddingToBackpack(false);
  };

  const handleRemoveFromBackpack = (id: string) => {
    const itemToRemove = backpack.find(item => item.id === id);
    const newBackpack = backpack.filter(item => item.id !== id);
    setBackpack(newBackpack);
    onUpdateBackpack?.(newBackpack);
    
    toast({
      title: "Item removido",
      description: `${itemToRemove?.name || 'Item'} foi removido da mochila.`,
      duration: 2000,
    });
  };

  const handleRemoveFromEquipment = (slot: string) => {
    const itemToRemove = equipment[slot];
    
    const newEquipment = {
      ...equipment,
      [slot]: null
    };
    
    setEquipment(newEquipment);
    onUpdateEquipment?.(slot, null);
    
    toast({
      title: "Item removido",
      description: `${itemToRemove?.name || 'Item'} foi removido do equipamento.`,
      duration: 2000,
    });
  };

  const handleSaveCapacity = () => {
    if (inventoryCapacity < backpack.length) {
      toast({
        title: "Atenção",
        description: `Você tem ${backpack.length} itens na mochila. Remova alguns itens antes de diminuir a capacidade.`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    toast({
      title: "Capacidade atualizada",
      description: `A capacidade da mochila foi alterada para ${inventoryCapacity} itens.`,
      duration: 2000,
    });
    
    setIsSettingsOpen(false);
  };

  const handleAddEquipmentSlot = () => {
    if (!newSlotName.trim()) {
      setAddingEquipmentSlot(false);
      return;
    }

    const slotKey = newSlotName.toLowerCase().replace(/\s+/g, '_');
    
    if (equipment[slotKey]) {
      toast({
        title: "Erro",
        description: "Já existe um slot com este nome.",
        variant: "destructive",
      });
      return;
    }

    const newEquipment = {
      ...equipment,
      [slotKey]: null
    };

    setEquipment(newEquipment);
    onUpdateEquipment?.(slotKey, null);

    toast({
      title: "Slot adicionado",
      description: `Novo slot de equipamento "${newSlotName}" foi adicionado.`,
      duration: 2000,
    });

    setNewSlotName("");
    setAddingEquipmentSlot(false);
  };

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="equipment" className="w-1/2">Equipamentos</TabsTrigger>
          <TabsTrigger value="backpack" className="w-1/2">Mochila</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {tab === "equipment" && (
        <Card className="card-necro">
          <CardHeader className="bg-necro-dark/60 py-2 px-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-cinzel text-necro-light flex items-center">
                <Sword className="mr-2" size={16} />
                Equipamentos
              </CardTitle>
              <button
                onClick={() => setAddingEquipmentSlot(true)}
                className="text-necro-light hover:text-necro transition-colors"
                title="Adicionar novo slot de equipamento"
              >
                <Plus size={16} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(equipment).map(([slot, item]) => (
                <div 
                  key={slot}
                  className="bg-necro-darker/40 p-2 rounded border border-necro/20 hover:border-necro/40 transition-colors cursor-pointer group relative"
                >
                  <div className="text-xs text-necro-light mb-1">{slot}</div>
                  <div 
                    className="font-medium"
                    onClick={() => handleEquipmentClick(slot, item)}
                  >
                    {item ? (
                      <div>{item.name}</div>
                    ) : (
                      <div className="text-muted-foreground italic text-sm">Vazio</div>
                    )}
                  </div>
                  
                  {item && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromEquipment(slot);
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {tab === "backpack" && (
        <Card className="card-necro">
          <CardHeader className="bg-necro-dark/60 py-2 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-cinzel text-necro-light flex items-center">
              <Package className="mr-2" size={16} />
              Mochila ({backpack.length}/{inventoryCapacity})
            </CardTitle>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="text-necro-light hover:text-necro transition-colors"
              >
                <Settings size={16} />
              </button>
              <button 
                onClick={() => {
                  setEditingItem(null);
                  setEditingName("");
                  setEditingDescription("");
                  setAddingToBackpack(true);
                }}
                className="text-necro-light hover:text-necro transition-colors"
                disabled={backpack.length >= inventoryCapacity}
              >
                <Pocket size={16} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {backpack.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {backpack.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-necro-darker/40 p-2 rounded border border-necro/20 hover:border-necro/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div 
                        className="font-medium overflow-hidden text-ellipsis"
                        onClick={() => handleBackpackItemClick(item)}
                      >
                        {item.name}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromBackpack(item.id);
                        }}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-1 overflow-hidden text-ellipsis">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground italic">Mochila vazia</div>
            )}
          </CardContent>
        </Card>
      )}
      
      {(editingItem || addingToBackpack || addingToEquipment) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-necro-dark border border-necro rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-necro-dark">
              <h3 className="font-cinzel text-xl text-necro-light">
                {addingToBackpack ? "Adicionar Item à Mochila" : 
                 addingToEquipment ? `Adicionar Item ao Slot: ${editingSlot}` :
                 editingSlot ? `Editar Item de Equipamento: ${editingSlot}` :
                 "Editar Item"}
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="bg-necro-darker/60 border border-necro/30 rounded w-full px-3 py-2"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Descrição</label>
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  className="bg-necro-darker/60 border border-necro/30 rounded w-full px-3 py-2 h-24 resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-necro-dark flex justify-end gap-2">
              <button 
                onClick={() => {
                  setEditingItem(null);
                  setEditingSlot(null);
                  setAddingToBackpack(false);
                  setAddingToEquipment(false);
                }}
                className="px-4 py-2 bg-necro-darker hover:bg-necro-dark rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={
                  addingToBackpack ? handleAddToBackpack : 
                  handleSaveItem
                }
                className="px-4 py-2 bg-necro hover:bg-necro-light rounded text-white"
                disabled={!editingName.trim()}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-necro-dark border border-necro rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-necro-dark">
              <h3 className="font-cinzel text-xl text-necro-light">
                Configurações da Mochila
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">Capacidade da Mochila</label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={inventoryCapacity}
                  onChange={(e) => setInventoryCapacity(Math.max(1, Math.min(36, parseInt(e.target.value) || 12)))}
                  className="bg-necro-darker/60 border border-necro/30 rounded w-full px-3 py-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Itens atuais: {backpack.length} / {inventoryCapacity}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-necro-dark flex justify-end gap-2">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-necro-darker hover:bg-necro-dark rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveCapacity}
                className="px-4 py-2 bg-necro hover:bg-necro-light rounded text-white"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {addingEquipmentSlot && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-necro-dark border border-necro rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-necro-dark">
              <h3 className="font-cinzel text-xl text-necro-light">
                Adicionar Novo Slot de Equipamento
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">Nome do Slot</label>
                <input
                  value={newSlotName}
                  onChange={(e) => setNewSlotName(e.target.value)}
                  className="bg-necro-darker/60 border border-necro/30 rounded w-full px-3 py-2"
                  placeholder="Ex: Anel, Colar, Botas..."
                  autoFocus
                />
              </div>
            </div>
            <div className="p-4 border-t border-necro-dark flex justify-end gap-2">
              <button 
                onClick={() => {
                  setAddingEquipmentSlot(false);
                  setNewSlotName("");
                }}
                className="px-4 py-2 bg-necro-darker hover:bg-necro-dark rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddEquipmentSlot}
                className="px-4 py-2 bg-necro hover:bg-necro-light rounded text-white"
                disabled={!newSlotName.trim()}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventorySection;
