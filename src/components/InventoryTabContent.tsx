
import React from "react";
import InventorySection from "@/components/InventorySection";

interface InventoryTabContentProps {
  equipment: any;
  backpack: any[];
  onUpdateBackpack: (items: any[]) => void;
  onUpdateEquipment?: (slot: string, item: any) => void;
}

const InventoryTabContent: React.FC<InventoryTabContentProps> = ({
  equipment,
  backpack,
  onUpdateBackpack,
  onUpdateEquipment
}) => (
  <InventorySection 
    equipment={equipment}
    backpack={backpack}
    onUpdateBackpack={onUpdateBackpack}
    onUpdateEquipment={onUpdateEquipment}
  />
);

export default InventoryTabContent;
