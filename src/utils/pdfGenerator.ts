
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from "@/components/ui/use-toast";

export interface CharacterData {
  name: string;
  classe: string;
  raca: string;
  level: number;
  xp: number;
  hp: {
    current: number;
    max: number;
  };
  mp: {
    current: number;
    max: number;
  };
  energia: {
    current: number;
    max: number;
  };
  cosmos: {
    current: number;
    max: number;
  };
  popularidade: {
    current: number;
    max: number;
  };
  perfil: {
    idade: string;
    peso: string;
    altura: string;
    porteFisico: string;
  };
  moedas: {
    ouro: number;
    aco?: number;
    asteri?: number;
  };
  spells: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  habilidades: string[];
  slots: string[];
  passivas: string[];
  vantagens: string[];
  desvantagens: string[];
  buffs: string[];
  debuffs: string[];
  conquistas: string[];
  equipment: Record<string, any>;
  backpack: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  notes: string;
}

interface StatusData {
  requisitos: Array<{
    id: number;
    name: string;
    value: number;
    description: string;
  }>;
  rolagem: Array<{
    id: number;
    name: string;
    value: number;
    description: string;
  }>;
}

const generateCharacterPDF = async (character: CharacterData, status: StatusData) => {
  try {
    toast({
      title: "Gerando PDF...",
      description: "Isso pode levar alguns segundos.",
      duration: 5000,
    });

    // Criar um elemento temporário para renderizar o PDF
    const element = document.createElement('div');
    element.className = 'pdf-container';
    element.style.width = '210mm';
    element.style.padding = '20mm';
    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';
    element.style.fontFamily = 'Arial, sans-serif';
    
    // Adicionar o conteúdo do personagem
    element.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 24px; margin-bottom: 5px;">${character.name}</h1>
        <div style="font-size: 16px;">${character.raca} | ${character.classe}</div>
        <div style="font-size: 14px;">Nível ${character.level} | XP: ${character.xp}</div>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="width: 48%;">
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between;">
              <span>HP:</span>
              <span>${character.hp.current}/${character.hp.max}</span>
            </div>
            <div style="height: 10px; background-color: #eee; border-radius: 5px; overflow: hidden;">
              <div style="height: 100%; width: ${(character.hp.current / character.hp.max) * 100}%; background-color: #4caf50;"></div>
            </div>
          </div>
          
          <div>
            <div style="display: flex; justify-content: space-between;">
              <span>MP:</span>
              <span>${character.mp.current}/${character.mp.max}</span>
            </div>
            <div style="height: 10px; background-color: #eee; border-radius: 5px; overflow: hidden;">
              <div style="height: 100%; width: ${(character.mp.current / character.mp.max) * 100}%; background-color: #2196f3;"></div>
            </div>
          </div>
        </div>
        
        <div style="width: 48%;">
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between;">
              <span>Energia:</span>
              <span>${character.energia.current}/${character.energia.max}</span>
            </div>
            <div style="height: 10px; background-color: #eee; border-radius: 5px; overflow: hidden;">
              <div style="height: 100%; width: ${(character.energia.current / character.energia.max) * 100}%; background-color: #ffc107;"></div>
            </div>
          </div>
          
          <div>
            <div style="display: flex; justify-content: space-between;">
              <span>Cosmos:</span>
              <span>${character.cosmos.current}/${character.cosmos.max}</span>
            </div>
            <div style="height: 10px; background-color: #eee; border-radius: 5px; overflow: hidden;">
              <div style="height: 100%; width: ${(character.cosmos.current / character.cosmos.max) * 100}%; background-color: #9c27b0;"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Informações Pessoais</h2>
        <div style="display: flex; flex-wrap: wrap;">
          <div style="width: 50%; margin-bottom: 5px;"><strong>Idade:</strong> ${character.perfil.idade}</div>
          <div style="width: 50%; margin-bottom: 5px;"><strong>Peso:</strong> ${character.perfil.peso} kg</div>
          <div style="width: 50%; margin-bottom: 5px;"><strong>Altura:</strong> ${character.perfil.altura} m</div>
          <div style="width: 50%; margin-bottom: 5px;"><strong>Porte Físico:</strong> ${character.perfil.porteFisico}</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Moedas</h2>
        <div><strong>Ouro:</strong> ${character.moedas.ouro}</div>
        <div><strong>Aço:</strong> ${character.moedas.aco || 0}</div>
        <div><strong>Astéri:</strong> ${character.moedas.asteri || 0}</div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Status - Requisitos</h2>
        <div style="display: flex; flex-wrap: wrap;">
          ${status.requisitos.map(stat => `
            <div style="width: 50%; margin-bottom: 5px;">
              <strong>${stat.name}:</strong> ${stat.value}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Status - Rolagem</h2>
        <div style="display: flex; flex-wrap: wrap;">
          ${status.rolagem.map(stat => `
            <div style="width: 50%; margin-bottom: 5px;">
              <strong>${stat.name}:</strong> ${stat.value}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Magias</h2>
        <div>
          ${character.spells.map(spell => `
            <div style="margin-bottom: 10px;">
              <div style="font-weight: bold;">${spell.name}</div>
              ${spell.description ? `<div style="font-size: 14px;">${spell.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Habilidades e Passivas</h2>
        <div style="margin-bottom: 10px;">
          <strong>Habilidades:</strong>
          <ul>
            ${character.habilidades.length ? character.habilidades.map(h => `<li>${h}</li>`).join('') : '<li>Nenhuma habilidade</li>'}
          </ul>
        </div>
        <div>
          <strong>Passivas:</strong>
          <ul>
            ${character.passivas.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Vantagens e Desvantagens</h2>
        <div style="display: flex; flex-wrap: wrap;">
          <div style="width: 50%;">
            <strong>Vantagens:</strong>
            <ul>
              ${character.vantagens.map(v => `<li>${v}</li>`).join('')}
            </ul>
          </div>
          <div style="width: 50%;">
            <strong>Desvantagens:</strong>
            <ul>
              ${character.desvantagens.map(d => `<li>${d}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Equipamentos</h2>
        <div style="display: flex; flex-wrap: wrap;">
          ${Object.entries(character.equipment).map(([slot, item]) => `
            <div style="width: 50%; margin-bottom: 5px;">
              <strong>${slot}:</strong> ${item ? item.name : 'Vazio'}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Mochila</h2>
        ${character.backpack.length ? `
          <div style="display: flex; flex-wrap: wrap;">
            ${character.backpack.map(item => `
              <div style="width: 50%; margin-bottom: 5px;">
                <div style="font-weight: bold;">${item.name}</div>
                ${item.description ? `<div style="font-size: 12px;">${item.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : '<div>Mochila vazia</div>'}
      </div>
      
      ${character.notes ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Anotações</h2>
          <div style="white-space: pre-line;">${character.notes}</div>
        </div>
      ` : ''}
    `;
    
    // Adicionar ao documento
    document.body.appendChild(element);
    
    try {
      // Gerar o PDF
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // Remover o elemento
      document.body.removeChild(element);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let position = 0;
      
      while (position < imgHeight) {
        pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
        position += 297;
        
        if (position < imgHeight) {
          pdf.addPage();
        }
      }
      
      pdf.save(`${character.name}_ficha.pdf`);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: `Ficha de ${character.name} salva como PDF.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      document.body.removeChild(element);
      
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o PDF. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Erro:', error);
    
    toast({
      title: "Erro ao gerar PDF",
      description: "Ocorreu um erro ao gerar o PDF. Tente novamente.",
      variant: "destructive",
      duration: 3000,
    });
  }
};

export default generateCharacterPDF;
