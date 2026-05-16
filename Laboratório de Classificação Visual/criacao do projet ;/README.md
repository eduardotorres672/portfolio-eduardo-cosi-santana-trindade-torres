# Mitigação de Viés em Modelos de Inteligência Artificial

> **Status do Projeto:** Concluído 🚀  
> **Tecnologia Utilizada:** Teachable Machine (Google)  
> **Área de Estudo:** Ética em IA, Aprendizado de Máquina Supervisionado, Governança de Dados

---

## 📋 Descrição do Projeto

Este projeto foi desenvolvido com o objetivo de investigar, de forma prática e empírica, como o **viés algorítmico** se manifesta em sistemas de aprendizado de máquina e como a intervenção humana estratégica pode mitigar essas distorções. 

Utilizando a plataforma *Teachable Machine* do Google, o modelo foi treinado para analisar e classificar entradas de dados. O foco principal desta iniciativa vai além da acurácia técnica: busca-se entender e documentar os impactos sociais e psicológicos gerados quando decisões automatizadas perpetuam exclusões ou erros de categorização de indivíduos.

> 💡 *"O viés em algoritmos surge quando eles aprendem a partir de dados limitados ou desbalanceados. É como tentar entender o mundo olhando por uma janela muito pequena: o que aparece ali parece ser tudo o que existe."*

---

## ⚠️ O Problema: O Impacto do Viés Algorítmico

Quando uma inteligência artificial é alimentada com um conjunto de dados homogêneo, restrito ou que reflete preconceitos históricos, ela passa a replicar esses padrões de forma automatizada e escalável. 

Esse fenômeno resulta em erros sistêmicos que afetam diretamente a dignidade humana:
* **Invisibilização:** Falha em reconhecer a existência ou as características de determinados grupos minorizados.
* **Classificação Incorreta:** Rotulação errônea baseada em amostras limitantes.
* **Impacto Pessoal e Profundo:** Quando um sistema invisibiliza ou classifica alguém de forma errada, a pessoa afetada pode se sentir ignorada, desvalorizada e injustiçada, como se não fosse reconhecida de verdade.

---

## 🛠️ A Solução: Curadoria Humana de Dados

Para quebrar o ciclo de reaprendizado do viés, este projeto propõe e documenta a metodologia de **Curadoria Humana** antes e durante a fase de treinamento do modelo.

O processo consiste em uma revisão crítica estruturada em três frentes:
1. **Auditoria Preventiva:** Uma equipe revisa e ajusta o conjunto de dados antes de treinar o modelo.
2. **Correção de Desequilíbrios:** Identificação e eliminação de falhas estatísticas e ausência de diversidade na base de dados original.
3. **Representatividade:** Inclusão ativa de novas amostras para garantir que o algoritmo aprenda a partir de uma base mais justa e representativa da realidade.

---

## 🔗 Link do Modelo

O modelo treinado e validado pode ser testado publicamente através da interface disponibilizada pelo ecossistema do Google no seguinte endereço:

👉 [Acesse o modelo no Teachable Machine](https://teachablemachine.withgoogle.com/models/ZTuOxbPfz/)

---

## 📂 Como este projeto está estruturado no repositório

```text
.
└── inteligencia-artificial-01/
    ├── dataset/               # Amostra das imagens/dados de áudio utilizados
    ├── README.md              # Este arquivo com as diretrizes do projeto
    └── (Demais assets/links do modelo)
