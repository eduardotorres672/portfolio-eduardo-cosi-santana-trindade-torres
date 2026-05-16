# Análise de Viés em Modelos Preditivos e Estratégias de Mitigação

Este documento apresenta o estudo de caso, a fundamentação teórica e as diretrizes de engenharia ética aplicadas ao modelo de classificação desenvolvido no **Teachable Machine**. O foco desta análise está na identificação de vieses algorítmicos decorrentes de dados desbalanceados e na implementação de metodologias de curadoria humana para assegurar a equidade do sistema.

---

## 🌐 Link do Modelo Computacional

O protótipo funcional para validação, testes de inferência e auditoria de matriz de confusão pode ser acessado diretamente na plataforma de experimentação:

👉 [Acessar App no Teachable Machine](https://teachablemachine.withgoogle.com/models/ZTuOxbPfz/)

---

## ⚠️ A Gênese do Viés Algorítmico (Algorithmic Bias)

O viés em modelos de aprendizado de máquina (*Machine Learning*) não é uma falha intrínseca do código, mas sim o reflexo direto de um ecossistema de dados limitado, enviesado ou estatisticamente desbalanceado.

> 🪟 **Analogia da Janela:** Treinar um algoritmo com um dataset restrito é o equivalente a tentar compreender a complexidade do mundo olhando através de uma janela extremamente pequena. O modelo assume que a amostragem visual contida naquele espaço estrito representa a totalidade da realidade existente, gerando generalizações incorretas para qualquer dado exógeno.

### O Impacto Humano do Falso Positivo/Negativo
Quando um sistema de IA invisibiliza, desclassifica ou categoriza incorretamente um indivíduo devido a falhas de representatividade no treino, o impacto ultrapassa a métrica de erro de software:
* **Erosão de Confiança:** O usuário experimenta uma sensação profunda de injustiça e desvalorização institucional.
* **Exclusão Sistêmica:** Falhas em ambientes de produção (como sistemas de reconhecimento facial ou triagem de perfis) perpetuam discriminações históricas sob o manto de uma neutralidade tecnológica inexistente.

---

## 🛠️ Pipeline de Mitigação: Curadoria de Dados (*Human-in-the-Loop*)

Para neutralizar o viés e garantir que o modelo aprenda a partir de uma base estatisticamente justa, representativa e simétrica, este projeto adota o framework de **Curadoria e Auditoria Humana Pré-Treino**:

```text
 ┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐      ┌────────────────┐
 │ Dados Brutos    ├─────►│ Revisão por      ├─────►│ Ajuste de       ├─────►│ Treino do      │
 │ (Desbalanceados)│      │ Equipe Humana    │      │ Representação   │      │ Algoritmo Justo│
 └─────────────────┘      └──────────────────┘      └─────────────────┘      └────────────────┘
