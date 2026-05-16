# Especificação de Arquitetura, Lógica e Segurança (Bubble.io)

Este documento detalha as camadas técnicas dos bastidores da aplicação de **Gestão e Auditoria de Orçamentos**, servindo como manual de engenharia do projeto para o GitHub. A implementação foca-se em segurança no lado do servidor (*Server-Side Security*) e integridade operacional de fluxos financeiros.

---

## 1. Modelação Base de Dados (Relational Data Schema)

O banco de dados nativo do Bubble foi estruturado seguindo os princípios de normalização de dados para sistemas relacionais, garantindo integridade transacional e histórico auditável.

```text
  ┌───────────┐             ┌──────────────┐
  │   User    │             │    Client    │
  └─────┬─────┘             └──────┬───────┘
        │ 1                        │ 1
        │                          │
        │ 1:N                      │ 1:N
  ┌─────▼──────────────────────────▼───────┐
  │                 Budget                 │
  └─────┬──────────────────────────┬───────┘
        │ 1                        │ 1
        │                          │
        │ 1:N                      │ 1:N
  ┌─────▼──────────────────┐ ┌─────▼───────┐
  │    BudgetActivityLog   │ │  BudgetItem │
  └────────────────────────┘ └─────────────┘
