
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Save, X } from "lucide-react";

interface SectionCardProps {
  title: string;
  items: string[];
  editable?: boolean;
  className?: string;
  onUpdate?: (items: string[]) => void;
  onEdit?: (items: string[]) => void; // Added this as an alternative to onUpdate
}

const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  items: initialItems, 
  editable = true,
  className = "",
  onUpdate,
  onEdit
}) => {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState("");
  
  // Use onEdit or onUpdate (whichever is provided)
  const handleUpdateItems = (newItems: string[]) => {
    if (onEdit) {
      onEdit(newItems);
    } else if (onUpdate) {
      onUpdate(newItems);
    }
  };
  
  const handleEdit = (index: number) => {
    setEditValue(items[index]);
    setEditing(index);
  };
  
  const handleSave = () => {
    if (editing !== null) {
      const newItems = [...items];
      newItems[editing] = editValue;
      setItems(newItems);
      setEditing(null);
      handleUpdateItems(newItems);
    }
  };
  
  const handleCancel = () => {
    setEditing(null);
  };
  
  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    handleUpdateItems(newItems);
  };
  
  const handleAdd = () => {
    if (newItem.trim()) {
      const newItems = [...items, newItem.trim()];
      setItems(newItems);
      setNewItem("");
      setAdding(false);
      handleUpdateItems(newItems);
    } else {
      setAdding(false);
    }
  };
  
  return (
    <Card className={`card-necro mb-6 ${className}`}>
      <CardHeader className="bg-necro-dark/60 py-2 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-cinzel text-necro-light">{title}</CardTitle>
        {editable && (
          <button 
            onClick={() => setAdding(true)}
            className="text-necro-light hover:text-necro transition-colors"
          >
            <PlusCircle size={16} />
          </button>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-center justify-between group">
                {editing === index ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-necro-darker/30 border border-necro/30 rounded px-2 py-1 w-full"
                      autoFocus
                    />
                    <button 
                      onClick={handleSave}
                      className="text-green-500 hover:text-green-400"
                    >
                      <Save size={16} />
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="text-red-500 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{item}</span>
                    {editable && (
                      <div className="hidden group-hover:flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(index)}
                          className="text-blue-500 hover:text-blue-400"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-muted-foreground italic">Nenhum item</div>
        )}
        
        {adding && (
          <div className="mt-4 flex items-center gap-2">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Novo item..."
              className="bg-necro-darker/30 border border-necro/30 rounded px-2 py-1 w-full"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button 
              onClick={handleAdd}
              className="text-green-500 hover:text-green-400"
            >
              <Save size={16} />
            </button>
            <button 
              onClick={() => setAdding(false)}
              className="text-red-500 hover:text-red-400"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SectionCard;
