
import React from "react";
import StatusSection from "@/components/StatusSection";

interface StatusTabContentProps {
  requisitos: any[];
  rolagem: any[];
  onUpdateAttribute: (category: "requisitos" | "rolagem", id: number, value: number) => void;
}

const StatusTabContent: React.FC<StatusTabContentProps> = ({
  requisitos,
  rolagem,
  onUpdateAttribute
}) => (
  <div className="grid grid-cols-1 gap-6">
    <StatusSection 
      title="Status - Requisitos" 
      attributes={requisitos} 
      onUpdateAttribute={(id, value) => onUpdateAttribute('requisitos', id, value)}
    />
    <StatusSection 
      title="Status - Rolagem" 
      attributes={rolagem} 
      onUpdateAttribute={(id, value) => onUpdateAttribute('rolagem', id, value)}
    />
  </div>
);

export default StatusTabContent;
