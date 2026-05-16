# Experiência 03 - Batalha de Modelos & Engenharia de Prompt (XML)

![Estudo](https://img.shields.io/badge/Estudo-Engenharia%20de%20Prompt-red.svg?style=for-the-badge)
![Estrutura](https://img.shields.io/badge/Formato-XML%20Tags-black.svg?style=for-the-badge)
![LLMs](https://img.shields.io/badge/Modelos-ChatGPT%20%7C%20Gemini%20%7C%20Claude%20%7C%20DeepSeek-purple.svg?style=for-the-badge)

Este repositório documenta um projeto de **Engenharia de Prompt Avançada**, focado no desenvolvimento de prompts estruturados através de tags XML e na análise comparativa de desempenho (*benchmarking*) entre os principais modelos de linguagem do mercado (LLMs).

O objetivo principal consiste em avaliar a capacidade de interpretação de restrições de design, obrigatoriedades técnicas e eficiência de consumo de tokens ao gerar uma aplicação web *Single Page* completa.

---

## 🎯 O Desafio Técnico

A tarefa consistiu em criar um prompt utilizando uma sintaxe semântica rigorosa baseada em blocos XML. O prompt instrui os modelos a gerar uma página única (HTML5 + CSS3 integrado) com foco no ecossistema de **Jogos Competitivos**, obedecendo a critérios restritos de usabilidade, paleta de cores e métricas específicas de dados.

### A Estrutura do Prompt (XML)

```xml
<tarefa>
  <objetivo>Criar uma página HTML5 única com CSS3 interno (single page).</objetivo>
  <tema>Usuários de jogos competitivos</tema>
  
  <diretrizes_design>
    <layout>Responsivo e minimalista.</layout>
    <paleta_cores>Preto, vermelho e branco</paleta_cores>
    <tipografia>Sans-serif para títulos, Serif para corpo.</tipografia>
  </diretrizes_design>
  
  <obrigatoriedades_tecnicas>
    <item>Menu de navegação funcional (âncoras).</item>
    <item>Seção de portfólio ou galeria.</item>
    <item>Rodapé com informações de contato simuladas.</item>
    <item>Formulário de cadastro.</item>
    <item>Quantidade de jogadores por país.</item>
    <item>Países mais ativos competitivamente.</item>
    <item>Quais os jogos mais jogados do cenário.</item>
  </obrigatoriedades_tecnicas>
  
  <metrica_obrigatoria>
    Ao final da resposta, informe uma estimativa de quantos tokens foram gastos.
  </metrica_obrigatoria>
</tarefa>
