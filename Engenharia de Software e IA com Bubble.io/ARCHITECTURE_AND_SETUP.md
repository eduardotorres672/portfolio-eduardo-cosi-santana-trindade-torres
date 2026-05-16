# Arquitetura de Software e Guia de Configuração (Setup)

Este documento detalha a infraestrutura técnica, a modelação do banco de dados no Firestore e os passos para configurar e executar o ambiente de desenvolvimento local do **Sabado Gerador de Qr Virtual**.

---

## 1. Stack Tecnológica & Dependências Core

A aplicação foi projetada utilizando as versões mais recentes e performáticas do ecossistema de desenvolvimento Web:

* **UI Framework:** React 19.0.0 (Utilização de Hooks nativos para gestão de estado global).
* **Styling Engine:** Tailwind CSS v4.0 (Arquitetura baseada em variáveis CSS nativas, sem necessidade de ficheiros de configuração pesados).
* **Build Tool:** Vite v6.2 (Garante Hot Module Replacement ultra-rápido).
* **Core Engine:** `qr-code-styling` (Biblioteca utilizada para a renderização vetorial e customização granular dos códigos QR).
* **Componentes Gráficos:** `lucide-react` (Pacote de ícones minimalistas e otimizados).
* **Animações:** `motion` / Framer Motion (Transições fluidas e efeitos de profundidade na UI).

---

## 2. Estrutura do Banco de Dados (Cloud Firestore Schema)

Os dados são persistidos de forma estruturada no Cloud Firestore. Abaixo está o blueprint da entidade principal que governa o histórico de criações:

### Coleção: `/qrcodes`
Cada documento dentro desta coleção representa um código QR gerado e salvo por um utilizador, contendo a seguinte estrutura JSON:

```json
{
  "id": "string (Identificador único gerado por hash)",
  "name": "string (Nome atribuído pelo utilizador para identificação)",
  "url": "string (O link ou texto cifrado dentro do código QR)",
  "userId": "string (ID do utilizador autenticado via Firebase Auth)",
  "createdAt": "timestamp (Data e hora exata da persistência)",
  "config": {
    "color1": "string (Hexadecimal da cor primária ou início do gradiente)",
    "color2": "string (Hexadecimal da cor secundária para o gradiente)",
    "bgColor": "string (Hexadecimal do fundo do QR)",
    "cornerSquareColor": "string (Hexadecimal dos cantos externos)",
    "cornerDotColor": "string (Hexadecimal dos pontos internos dos cantos)",
    "dotType": "string (Enum: 'rounded', 'dots', 'classy', etc.)",
    "cornerSquareType": "string (Enum de estilo do quadrado do canto)",
    "cornerDotType": "string (Enum de estilo do ponto do canto)"
  }
}
