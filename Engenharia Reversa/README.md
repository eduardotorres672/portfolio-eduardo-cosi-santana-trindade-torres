# Sabado Gerador de Qr Virtual

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20Storage-FFCA28?style=for-the-badge&logo=firebase)

Uma aplicação Full-Stack premium e minimalista para geração, gestão avançada e persistência em nuvem de códigos QR estruturados. Desenvolvido sobre os padrões arquiteturais modernos da Web (React 19 e Tailwind CSS 4), o ecossistema oferece controlo granular estético, inteligência por voz e inclusão por acessibilidade.

---

## 🚀 Funcionalidades Principais

### 🎨 Customização de Design Granular
* **Gradientes Dinâmicos:** Suporte para preenchimento com gradiente linear customizável em duas tonalidades independentes (`color1` e `color2`).
* **Modulação de Elementos:** Ajuste isolado para os formatos geométricos dos pontos centrais (`dotType`), cantos externos (`cornerSquareType`) e internos (`cornerDotType`).
* **Logótipos de Marca:** Injeção inteligente de logótipos personalizados no baricentro do código QR via Cloud Storage, com cálculo automático de margem de erro.

### ☁️ Ecossistema em Nuvem (Firebase)
* **Autenticação Segura:** Restrição de acesso ao painel de administração através de autenticação via Google Sign-In.
* **Histórico Persistente:** Gravação assíncrona do estado de estilização no Cloud Firestore, viabilizando o carregamento imediato de configurações antigas com um único clique.

### 🧠 Acessibilidade e Interface Inteligente
* **Controlo por Voz:** Integração de captura de microfone para comandos em linguagem natural (alteração de esquemas cromáticos e acionamento de downloads).
* **Modo Monocromático:** Ajuste de contraste e saturação adaptados a utilizadores com sensibilidade visual extrema ou daltonismo.
* **Destaque Interativo:** Sistema assistido de destaque visual para áreas e componentes focados na navegação por teclado ou periféricos.

---

## 🛠️ Arquitetura e Engenharia de Dados

A persistência do estado estético do código QR foi estruturada no Cloud Firestore seguindo uma forte tipagem corporativa, definida no esquema global do sistema:

### Estrutura do Documento (`/qrcodes/{qrcodeId}`)

| Campo | Tipo | Descrição / Restrição |
| :--- | :--- | :--- |
| `id` | String | Identificador único do documento (Máximo de 128 caracteres, regex validado). |
| `url` | String | O conteúdo de dados codificado no QR (Limite seguro de 2048 caracteres). |
| `userId` | String | Vínculo imutável com o utilizador criador (`request.auth.uid`). |
| `createdAt` | Server Timestamp | Carimbo temporal nativo gerado no servidor durante a gravação. |
| `config` | Map (Objeto) | Sub-esquema com os parâmetros visuais: `bgColor`, `color1`, `color2`, `dotType`, etc. |

### 🔥 Regras de Segurança (Firestore Rules)
O acesso à base de dados obedece estritamente ao princípio do menor privilégio:
* **Leitura:** Permitida única e exclusivamente se o utilizador estiver autenticado e for o proprietário do documento (`resource.data.userId == request.auth.uid`).
* **Criação e Atualização:** Sujeitas a validação do formato do ID, integridade de dados e verificação se o carimbo temporal de requisição bate com o relógio interno do servidor.

---

## 📂 Organização do Projeto

```text
src/
├── components/
│   ├── layout/       # Componentização estrutural (Header, Footer, Acessibilidade)
│   └── qrcode/       # Painel reativo, motor de renderização e histórico
├── lib/
│   └── firebase.ts   # Inicialização e exportação de serviços Cloud
├── App.tsx           # Componente raiz e controlo reativo de estado global
├── index.css         # Configuração de variáveis de tema e utilitários Tailwind 4
└── main.tsx          # Ponto de entrada do ecossistema React
