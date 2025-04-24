
import React, { createContext, useContext, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skull, Book, Scroll, User, Briefcase, Sparkles, Sword, Shield, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSpellTab: string;
  setActiveSpellTab: (tab: string) => void;
}

const TabContext = createContext<TabContextType>({
  activeTab: 'profile',
  setActiveTab: () => {},
  activeSpellTab: 'all',
  setActiveSpellTab: () => {}
});

export const useTabContext = () => useContext(TabContext);

interface TabContentWrapperProps {
  children: React.ReactNode;
  value: string;
}

export const TabContentWrapper: React.FC<TabContentWrapperProps> = ({ 
  children, 
  value 
}) => {
  const { activeTab } = useTabContext();
  if (value !== activeTab) return null;
  return <div className="py-4">{children}</div>;
};

export const SpellTabContentWrapper: React.FC<TabContentWrapperProps> = ({ 
  children, 
  value 
}) => {
  const { activeSpellTab } = useTabContext();
  if (value !== activeSpellTab) return null;
  return <div className="mt-4">{children}</div>;
};

interface CharacterTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

export const CharacterTabs: React.FC<CharacterTabsProps> = ({ 
  children, 
  defaultValue = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const [activeSpellTab, setActiveSpellTab] = useState('all');
  
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab, activeSpellTab, setActiveSpellTab }}>
      <div className="space-y-4">
        <div className="sticky top-0 z-10 bg-necro-darker/95 backdrop-blur-md pt-2 pb-4 -mx-4 px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-between h-auto p-1 bg-necro-dark/40 flex-wrap">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 py-3 px-4 min-w-[70px]"
              >
                <User size={18} />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="status" 
                className="flex items-center gap-2 py-3 px-4 min-w-[70px]"
              >
                <Skull size={18} />
                <span className="hidden sm:inline">Status</span>
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="flex items-center gap-2 py-3 px-4 min-w-[70px]"
              >
                <Sparkles size={18} />
                <span className="hidden sm:inline">Habilidades</span>
              </TabsTrigger>
              <TabsTrigger 
                value="spells" 
                className="flex items-center gap-2 py-3 px-4 min-w-[70px]"
              >
                <Book size={18} />
                <span className="hidden sm:inline">Magias</span>
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="flex items-center gap-2 py-3 px-4 min-w-[70px]"
              >
                <Briefcase size={18} />
                <span className="hidden sm:inline">Inventário</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notes" 
                className="flex items-center gap-2 py-3 px-4 min-w-[70px]"
              >
                <Scroll size={18} />
                <span className="hidden sm:inline">Notas</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {activeTab === 'spells' && (
            <>
              <Separator className="my-3 bg-necro/20" />
              <Tabs value={activeSpellTab} onValueChange={setActiveSpellTab} className="w-full">
                <TabsList className="w-full justify-start h-auto p-1 bg-necro-dark/40 flex-wrap gap-1">
                  <TabsTrigger 
                    value="all" 
                    className="flex items-center gap-1 py-2 px-3 text-xs"
                  >
                    <Book size={14} />
                    <span>Todas</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="attack" 
                    className="flex items-center gap-1 py-2 px-3 text-xs"
                  >
                    <Sword size={14} />
                    <span>Ataque</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="defense" 
                    className="flex items-center gap-1 py-2 px-3 text-xs"
                  >
                    <Shield size={14} />
                    <span>Defesa</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="healing" 
                    className="flex items-center gap-1 py-2 px-3 text-xs"
                  >
                    <Heart size={14} />
                    <span>Cura</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="passive" 
                    className="flex items-center gap-1 py-2 px-3 text-xs"
                  >
                    <Sparkles size={14} />
                    <span>Passiva</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </>
          )}
        </div>
        {children}
      </div>
    </TabContext.Provider>
  );
};
