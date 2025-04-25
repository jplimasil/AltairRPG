
import { db } from "@/config/firebase";
import { CharacterData, CharacterStatus } from "@/types/character";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

const CHARACTERS_COLLECTION = "characters";
const CHARACTER_STATUS_COLLECTION = "characterStatus";

// Obter todos os personagens
export const getAllCharacters = async (): Promise<CharacterData[]> => {
  try {
    const charactersQuery = query(
      collection(db, CHARACTERS_COLLECTION),
      orderBy("name")
    );
    const querySnapshot = await getDocs(charactersQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<CharacterData, "id">;
      return { ...data, id: doc.id };
    });
  } catch (error) {
    console.error("Erro ao buscar personagens:", error);
    throw error;
  }
};

// Obter um personagem específico por ID
export const getCharacterById = async (characterId: string): Promise<CharacterData | null> => {
  try {
    const docRef = doc(db, CHARACTERS_COLLECTION, characterId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<CharacterData, "id">;
      // Garantir que os dados das magias sejam sempre um array mesmo que não exista no documento
      if (!data.spells) {
        data.spells = [];
      }
      return { ...data, id: docSnap.id };
    }
    
    return null;
  } catch (error) {
    console.error(`Erro ao buscar personagem com ID ${characterId}:`, error);
    throw error;
  }
};

// Salvar um personagem novo
export const createCharacter = async (character: Omit<CharacterData, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, CHARACTERS_COLLECTION), character);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar personagem:", error);
    throw error;
  }
};

// Atualizar um personagem existente
export const updateCharacter = async (character: CharacterData): Promise<void> => {
  try {
    const { id, ...characterData } = character;
    
    // Garantir que os dados estão no formato correto antes de salvar
    // Especialmente importante para os itens aninhados como magias
    const sanitizedData = JSON.parse(JSON.stringify(characterData));
    
    await updateDoc(doc(db, CHARACTERS_COLLECTION, id), sanitizedData);
    console.log("Personagem atualizado com sucesso:", character.name);
  } catch (error) {
    console.error(`Erro ao atualizar personagem com ID ${character.id}:`, error);
    throw error;
  }
};

// Deletar um personagem
export const deleteCharacter = async (characterId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, CHARACTERS_COLLECTION, characterId));
    // Também deletar o status do personagem, se existir
    await deleteDoc(doc(db, CHARACTER_STATUS_COLLECTION, characterId));
  } catch (error) {
    console.error(`Erro ao deletar personagem com ID ${characterId}:`, error);
    throw error;
  }
};

// Obter o status de um personagem
export const getCharacterStatus = async (characterId: string): Promise<CharacterStatus | null> => {
  try {
    const docRef = doc(db, CHARACTER_STATUS_COLLECTION, characterId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as CharacterStatus;
    }
    
    return null;
  } catch (error) {
    console.error(`Erro ao buscar status do personagem com ID ${characterId}:`, error);
    throw error;
  }
};

// Salvar o status de um personagem
export const saveCharacterStatus = async (characterId: string, status: CharacterStatus): Promise<void> => {
  try {
    await setDoc(doc(db, CHARACTER_STATUS_COLLECTION, characterId), status);
  } catch (error) {
    console.error(`Erro ao salvar status do personagem com ID ${characterId}:`, error);
    throw error;
  }
};
