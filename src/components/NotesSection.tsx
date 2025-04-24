
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Save } from "lucide-react";

interface NotesSectionProps {
  notes: string;
  onUpdateNotes?: (notes: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes: initialNotes,
  onUpdateNotes
}) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = () => {
    setIsEditing(false);
    onUpdateNotes?.(notes);
  };
  
  return (
    <Card className="card-necro mb-6">
      <CardHeader className="bg-necro-dark/60 py-2 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-cinzel text-necro-light flex items-center">
          <ScrollText className="mr-2" size={16} />
          Lembretes
        </CardTitle>
        {isEditing && (
          <button 
            onClick={handleSave}
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            <Save size={16} />
          </button>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {isEditing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-40 bg-necro-darker/40 border border-necro/30 rounded p-3 focus:border-necro outline-none resize-none"
            placeholder="Escreva suas anotações aqui..."
            autoFocus
          />
        ) : (
          <div 
            className="w-full h-40 overflow-auto cursor-text p-3 bg-necro-darker/20 rounded"
            onClick={() => setIsEditing(true)}
          >
            {notes ? (
              <div className="whitespace-pre-wrap">{notes}</div>
            ) : (
              <div className="text-muted-foreground italic text-center mt-12">
                Clique para adicionar lembretes...
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesSection;
