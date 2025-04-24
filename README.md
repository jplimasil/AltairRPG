# 🌟 Altair RPG - Grimório Digital

Um grimório digital interativo para o sistema Altair RPG, desenvolvido com React e TypeScript. Esta aplicação permite aos jogadores gerenciar suas fichas de personagem de forma prática e imersiva.

## ✨ Funcionalidades

- 📝 Criação e gerenciamento de fichas de personagem
- 🎭 Sistema completo de atributos e status
- 📚 Gerenciamento de magias e habilidades
- 🎒 Inventário interativo com sistema de moedas
- 💫 Sistema de recursos (HP, MP, Energia, Cosmos)
- 📊 Perfil detalhado do personagem
- 🎯 Sistema de vantagens e desvantagens
- 🏆 Registro de conquistas
- 📄 Exportação de ficha para PDF
- 💾 Salvamento automático das alterações
- 🌙 Interface temática dark mode

## 🛠️ Tecnologias Utilizadas

- React
- TypeScript
- Firebase (Firestore)
- TailwindCSS
- Shadcn/ui
- jsPDF
- html2canvas

## 🚀 Como Iniciar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/AltairRPG.git
cd AltairRPG
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com suas credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📱 Recursos do Personagem

### Atributos Principais
- HP (Pontos de Vida)
- MP (Pontos de Mana)
- Energia
- Cosmos
- Popularidade

### Status
- Status de Requisitos (17 atributos)
- Status de Rolagem (4 atributos)

### Inventário
- Sistema de moedas (Ouro, Aço, Astéri)
- Mochila com slots configuráveis
- Equipamentos (Armas, Armaduras, Acessórios)

### Características
- Habilidades
- Magias
- Passivas
- Vantagens/Desvantagens
- Conquistas

## 🎨 Personalização

O projeto utiliza TailwindCSS para estilização e inclui um tema personalizado dark mode com cores inspiradas em necromancia. As principais classes de estilo incluem:

- `.card-necro`: Cards com efeito de vidro e borda brilhante
- `.bg-necro-pattern`: Padrão de fundo temático
- Fonte Cinzel para títulos
- Fonte Roboto Mono para texto

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, leia as [diretrizes de contribuição](CONTRIBUTING.md) antes de submeter um pull request.

---

Desenvolvido com 💜 por [Jao](https://github.com/seu-usuario)

