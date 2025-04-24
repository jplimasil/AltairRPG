
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusAttribute {
  id: number;
  name: string;
  value: number;
  description?: string;
}

interface StatusSectionProps {
  title: string;
  attributes: StatusAttribute[];
  onUpdateAttribute: (id: number, newValue: number) => void;
}

const StatusSection: React.FC<StatusSectionProps> = ({ 
  title, 
  attributes,
  onUpdateAttribute 
}) => {
  return (
    <Card className="card-necro mb-6">
      <CardHeader className="bg-necro-dark/60 py-2 px-4">
        <CardTitle className="text-lg font-cinzel text-necro-light">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="attribute-grid">
          {attributes.map((attr) => (
            <AttributeItem 
              key={attr.id} 
              attribute={attr} 
              onUpdate={(newValue) => onUpdateAttribute(attr.id, newValue)} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface AttributeItemProps {
  attribute: StatusAttribute;
  onUpdate: (newValue: number) => void;
}

const AttributeItem: React.FC<AttributeItemProps> = ({ attribute, onUpdate }) => {
  const [value, setValue] = useState(attribute.value);
  const [editing, setEditing] = useState(false);

  const handleValueChange = (newValue: number) => {
    if (newValue < 0) return;
    setValue(newValue);
    onUpdate(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    setValue(newValue);
  };

  const handleBlur = () => {
    setEditing(false);
    onUpdate(value);
  };

  const getColor = (val: number) => {
    if (val >= 40) return "text-green-400";
    if (val >= 25) return "text-green-600";
    if (val >= 15) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="stat-container bg-necro-darker/40 p-2 rounded-md border border-necro/20 hover:border-necro/40 transition-colors">
            <div className="stat-label">{attribute.name}</div>
            <div className="stat-value">
              <button 
                className="bg-necro-dark hover:bg-necro/30 transition-colors" 
                onClick={() => handleValueChange(value - 1)}
              >
                <Minus size={12} />
              </button>
              
              {editing ? (
                <input
                  type="number"
                  className="bg-transparent w-10 text-center outline-none font-bold"
                  value={value}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => e.key === "Enter" && handleBlur()}
                  autoFocus
                />
              ) : (
                <span 
                  className={cn("font-bold flex-1 text-center cursor-pointer", getColor(value))}
                  onClick={() => setEditing(true)}
                >
                  {value}
                </span>
              )}
              
              <button 
                className="bg-necro-dark hover:bg-necro/30 transition-colors" 
                onClick={() => handleValueChange(value + 1)}
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        </TooltipTrigger>
        {attribute.description && (
          <TooltipContent className="bg-necro-dark border border-necro/50 text-sm max-w-xs">
            <p>{attribute.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusSection;
