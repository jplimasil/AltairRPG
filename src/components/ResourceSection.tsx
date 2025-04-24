
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResourceProps {
  title: string;
  current: number;
  max: number;
  color?: string;
  onUpdate?: (current: number, max: number) => void;
}

const ResourceSection: React.FC<ResourceProps> = ({ 
  title, 
  current: initialCurrent, 
  max: initialMax, 
  color = "bg-necro",
  onUpdate
}) => {
  const [current, setCurrent] = useState(initialCurrent);
  const [max, setMax] = useState(initialMax);
  const [editing, setEditing] = useState(false);
  
  useEffect(() => {
    setCurrent(initialCurrent);
    setMax(initialMax);
  }, [initialCurrent, initialMax]);
  
  const percentage = (current / max) * 100;
  
  const handleSave = () => {
    setEditing(false);
    if (onUpdate) {
      onUpdate(current, max);
    }
  };
  
  return (
    <Card className="card-necro mb-6">
      <CardHeader className="bg-necro-dark/60 py-2 px-4">
        <CardTitle className="text-lg font-cinzel text-necro-light">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {editing ? (
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              value={current}
              onChange={(e) => setCurrent(parseInt(e.target.value) || 0)}
              className="bg-necro-darker/30 border border-necro/30 rounded px-2 py-1 w-20 text-center"
              autoFocus
            />
            <span>/</span>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              className="bg-necro-darker/30 border border-necro/30 rounded px-2 py-1 w-20 text-center"
            />
            <button 
              onClick={handleSave}
              className="bg-necro hover:bg-necro-light text-white px-2 py-1 rounded ml-auto"
            >
              Save
            </button>
          </div>
        ) : (
          <div 
            className="flex justify-between items-center mb-2 cursor-pointer" 
            onClick={() => setEditing(true)}
          >
            <span className="text-sm font-bold">Current</span>
            <span className="text-sm font-semibold">{current} / {max}</span>
          </div>
        )}
        <Progress 
          value={percentage} 
          className="h-3 bg-necro-darker" 
          indicatorClassName={color}
        />
      </CardContent>
    </Card>
  );
};

export default ResourceSection;
