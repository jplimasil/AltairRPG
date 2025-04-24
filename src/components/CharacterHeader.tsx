
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface CharacterHeaderProps {
  name: string;
  classe: string;
  raca: string;
  level: number;
  xp: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
}

const CharacterHeader: React.FC<CharacterHeaderProps> = ({
  name,
  classe,
  raca,
  level,
  xp,
  currentHp,
  maxHp,
  currentMp,
  maxMp
}) => {
  const hpPercentage = (currentHp / maxHp) * 100;
  const mpPercentage = (currentMp / maxMp) * 100;
  
  // Define color for HP bar based on percentage
  const getHpColor = () => {
    if (hpPercentage < 25) return 'bg-red-600';
    if (hpPercentage < 50) return 'bg-yellow-500';
    return 'bg-green-600';
  };
  
  return (
    <div className="card-necro mb-6 overflow-hidden">
      <div className="bg-necro-dark/80 px-4 py-4 border-b border-necro/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-cinzel font-semibold text-white mb-1">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="text-necro-light">{classe}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{raca}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-necro-dark/80 border border-necro/40 px-3 py-1 rounded-md text-center">
              <div className="text-xs text-muted-foreground">Nível</div>
              <div className="text-xl text-necro-light font-semibold">{level}</div>
            </div>
            <div className="bg-necro-dark/80 border border-necro/40 px-3 py-1 rounded-md text-center">
              <div className="text-xs text-muted-foreground">XP</div>
              <div className="text-xl text-necro-light font-semibold">{xp.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* HP Bar */}
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span className="font-semibold">HP</span>
            <span>{currentHp} / {maxHp}</span>
          </div>
          <Progress 
            value={hpPercentage} 
            className="h-4 bg-necro-dark/50"
            indicatorClassName={getHpColor()}
          />
        </div>
        
        {/* MP Bar */}
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span className="font-semibold">MP</span>
            <span>{currentMp} / {maxMp}</span>
          </div>
          <Progress 
            value={mpPercentage} 
            className="h-4 bg-necro-dark/50"
            indicatorClassName="bg-necro"
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterHeader;
