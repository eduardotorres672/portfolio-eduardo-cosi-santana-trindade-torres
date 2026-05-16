# Sistema No-Code de Gestão e Auditoria de Orçamentos (Bubble)

![Bubble](https://img.shields.io/badge/Platform-Bubble.io-00D2B4.svg?style=for-the-badge&logo=bubble)
![Security](https://img.shields.io/badge/Privacy-Rules%20Enforced-red.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Environment-Development%20%7C%20Test-orange.svg?style=for-the-badge)

Este repositório documenta a engenharia lógica, a modelação de dados e os fluxos de trabalho de governança financeira do **Sistema de Gestão e Auditoria de Orçamentos**. A aplicação foi construída sobre o ecossistema No-Code do **Bubble.io**, focando-se na automação de aprovações comerciais, integridade de logs e segurança rigorosa a nível de base de dados.

---

## 🏗️ Engenharia de Dados (Data Architecture)

A persistência do modelo financeiro baseia-se em tabelas relacionais nativas (Data Types), estruturadas para suportar auditorias completas de modificação:

* **`Budget` (Orçamento):** Entidade central que encapsula os valores financeiros, os itens de linha e o estado (*status*) operacional do pedido.
* **`BudgetActivityLog` (Log de Atividades):** Histórico imutável que regista todas as ações do sistema (Quem aprovou, quando rejeitou e as justificações anexas).
* **`BudgetItem` (Itens do Orçamento):** Desdobramento granular dos custos e insumos vinculados a um orçamento pai.
* **`Client` (Cliente) & `User` (Utilizador):** Entidades de controlo de acessos e categorização comercial.

---

## 🔒 Governação e Regras de Privacidade (Privacy Rules)

Para garantir a conformidade com as diretivas de segurança de dados (LGPD) e o sigilo de dados financeiros de negócio, o sistema implementa políticas rígidas de **Server-Side Security**:

### Regra Aplicada ao Tipo `Budget`
* **Condição:** `When This Budget's Creator is Current User` (Apenas o Criador)
* **Permissões Concedidas ao Proprietário:**
  * Visualização integral de campos (`View all fields`).
  * Indexação em buscas globais (`Find this in searches`).
  * Download e leitura de ficheiros anexos (`View attached files`).
* **Everyone else (Público Geral):** Bloqueio total de visibilidade por defeito (*Default Deny*), protegendo dados sensíveis contra acessos maliciosos ou injeções de API.

---

## ⚡ Automação de Fluxos de Trabalho (Workflows)

O motor lógico do sistema é governado por gatilhos de eventos associados aos estados do ciclo de vida de um orçamento:

```text
[Orçamento Criado (Pending)] 
       │
       ├──► Evento: Button pending-approve click ──► Altera Status para "Approved" + Regista no Log
       │
       └──► Evento: Button pending-reject click  ──► Abre Popup ──► Confirma Rejeição ──► Status "Rejected"
