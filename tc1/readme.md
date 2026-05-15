**Trabalho Computacional I - Método Simplex**

Implementação e Resolução de Problemas de Programação Linear

# **Introdução**

Este relatório descreve a implementação do Método Simplex no formato tabular, desenvolvida em Python, e apresenta a resolução dos dois problemas propostos. Para obtenção da Solução Básica Viável (SBV) inicial, foi adotada a Opção A: o Método das Duas Fases.

Na Fase I, variáveis artificiais são adicionadas às restrições que não possuem variável de folga somada (restrições do tipo = ou >=). O objetivo é minimizar a soma dessas variáveis artificiais. Se o valor mínimo for zero, uma SBV viável para o problema original foi encontrada; caso contrário, o problema é inviável. Na Fase II, as variáveis artificiais são removidas e o Simplex é executado sobre a função objetivo original.

# **Problema 1**

## **Formulação**

O problema consiste em:

min −x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub>

s.a x<sub>1</sub> − 2x<sub>2</sub> + x<sub>3</sub> ≤ 11

−2x<sub>1</sub> + x<sub>3</sub> = 1

x<sub>1</sub>, x<sub>2</sub>, x<sub>3</sub> ≥ 0

## **Obtenção da SBV Inicial - Método das Duas Fases**

A restrição de igualdade (−2x₁ + x₃ = 1) não possui variável de folga somada. Por isso, foi adicionada uma variável artificial a₁. A restrição ≤ recebe a variável de folga f₁.

A função objetivo da Fase I é: min a₁.

## **Fase I**

**Iteração 1 - pivot: x3, linha 2**

| **Base** | **x1** | **x2** | **x3** | **f1** | **f2** | **a1** | **b** |
| -------- | ------ | ------ | ------ | ------ | ------ | ------ | ----- |
| **f1**   | 3      | \-2    | 0      | 1      | 0      | \-1    | 10    |
| **x3**   | \-2    | 0      | 1      | 0      | 0      | 1      | 1     |
| **obj**  | 0      | 0      | 0      | 0      | 0      | 1      | 0     |

Após 1 iteração, a variável artificial a₁ saiu da base com valor zero. O problema é viável.

## **Fase II**

As colunas artificiais são removidas e a função objetivo original é restaurada. Após canonizar a linha objetivo, a tabela já está ótima - não há coeficientes negativos na linha obj.

**Tableau Final (Fase II)**

| **Base** | **x1** | **x2** | **x3** | **f1** | **f2** | **b** |
| -------- | ------ | ------ | ------ | ------ | ------ | ----- |
| **f1**   | 3      | \-2    | 0      | 1      | 0      | 10    |
| **x3**   | \-2    | 0      | 1      | 0      | 0      | 1     |
| **obj**  | 1      | 1      | 0      | 0      | 0      | \-1   |

## **Resposta**

| **Variável** | **Valor** |
| ------------ | --------- |
| **x₁**       | 0         |
| **x₂**       | 0         |
| **x₃**       | 1         |

**Valor ótimo da função objetivo:** z\* = −(0) + 0 + 1 = **−1**

# **Problema 2 - Distribuição de Sangue**

## **Descrição e Modelagem**

Sete pacientes precisam de transfusões. O objetivo é minimizar o custo de reposição do estoque de sangue, respeitando a compatibilidade entre tipos e as demandas individuais.

As variáveis de decisão xᵢⱼ representam a quantidade de bolsas do tipo sanguíneo i enviada ao paciente j. A seguir, a tabela de compatibilidade e custo utilizada:

| **Variável** | **Tipo** | **Paciente** | **Custo (R\$/bolsa)** |
| ------------ | -------- | ------------ | --------------------- |
| **x1**       | A        | 1 (tipo A)   | 1                     |
| **x2**       | O        | 1 (tipo A)   | 4                     |
| **x3**       | A        | 2 (tipo AB)  | 1                     |
| **x4**       | AB       | 2 (tipo AB)  | 2                     |
| **x5**       | B        | 2 (tipo AB)  | 4                     |
| **x6**       | O        | 2 (tipo AB)  | 4                     |
| **x7**       | B        | 3 (tipo B)   | 4                     |
| **x8**       | O        | 3 (tipo B)   | 4                     |
| **x9**       | O        | 4 (tipo O)   | 4                     |
| **x10**      | A        | 5 (tipo A)   | 1                     |
| **x11**      | O        | 5 (tipo A)   | 4                     |
| **x12**      | B        | 6 (tipo B)   | 4                     |
| **x13**      | O        | 6 (tipo B)   | 4                     |
| **x14**      | A        | 7 (tipo AB)  | 1                     |
| **x15**      | AB       | 7 (tipo AB)  | 2                     |
| **x16**      | B        | 7 (tipo AB)  | 4                     |
| **x17**      | O        | 7 (tipo AB)  | 4                     |

## **Função Objetivo**

min x₁ + 4x₂ + x₃ + 2x₄ + 4x₅ + 4x₆ + 4x₇ + 4x₈ + 4x₉ + x₁₀ + 4x₁₁ + 4x₁₂ + 4x₁₃ + x₁₄ + 2x₁₅ + 4x₁₆ + 4x₁₇

## **Restrições**

**Demanda (igualdades - cada paciente deve receber exatamente o que necessita):**

| **Restrição**       | **Expressão**         | **Demanda** |
| ------------------- | --------------------- | ----------- |
| **Paciente 1 (A)**  | x1 + x2               | \= 7        |
| **Paciente 2 (AB)** | x3 + x4 + x5 + x6     | \= 8        |
| **Paciente 3 (B)**  | x7 + x8               | \= 2        |
| **Paciente 4 (O)**  | x9                    | \= 6        |
| **Paciente 5 (A)**  | x10 + x11             | \= 9        |
| **Paciente 6 (B)**  | x12 + x13             | \= 5        |
| **Paciente 7 (AB)** | x14 + x15 + x16 + x17 | \= 3        |

**Estoque (desigualdades - não se pode usar mais do que o disponível):**

| **Tipo** | **Expressão**                       | **Estoque** |
| -------- | ----------------------------------- | ----------- |
| **A**    | x1 + x3 + x10 + x14                 | <= 15       |
| **AB**   | x4 + x15                            | <= 12       |
| **B**    | x5 + x7 + x12 + x16                 | <= 10       |
| **O**    | x2 + x6 + x8 + x9 + x11 + x13 + x17 | <= 12       |

## **Obtenção da SBV Inicial - Método das Duas Fases**

As 7 restrições de demanda são igualdades, portanto não possuem variável de folga somada. Foram adicionadas 7 variáveis artificiais (a₁ a a₇). As 4 restrições de estoque são ≤ e receberam variáveis de folga f₈ a f₁₁.

A função objetivo da Fase I é: min a₁ + a₂ + a₃ + a₄ + a₅ + a₆ + a₇.

A Fase I executou 9 iterações até que todas as variáveis artificiais deixaram a base com valor zero, confirmando a viabilidade do problema. As tabelas da Fase I são extensas (35 colunas) e estão omitidas aqui por questão de espaço - foram impressas integralmente pelo programa durante a execução.

## **Fase II**

As colunas artificiais são removidas. O Simplex é executado sobre a função objetivo original. A Fase II convergiu em 3 iterações.

**Fase II - Iteração 1 (pivot: x8, linha 2)**

| **Base** | **x1** | **x2** | **x3** | **x4** | **x5** | **x6** | **x7** | **x8** | **x9** | **x10** | **x11** | **x12** | **x13** | **x14** | **x15** | **x16** | **x17** | **f1** | **f2** | **f3** | **f4** | **f5** | **f6** | **f7** | **f8** | **f9** | **f10** | **f11** | **b** |
| -------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- | ----- |
| **x1**   | 1      | 0      | 1      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | \-1     | 0       | 0       | 0       | \-1     | \-1     | \-1     | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0      | 0       | 0       | 3     |
| **x8**   | 0      | 0      | 1      | 0      | 0      | 1      | 0      | 1      | 0      | 0       | 0       | 0       | 1       | 0       | \-1     | \-1     | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0      | 0       | 1       | 2     |
| **x7**   | 0      | 0      | \-1    | 0      | 0      | \-1    | 1      | 0      | 0      | 0       | 0       | 0       | \-1     | 0       | 1       | 1       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | \-1    | 0      | 0       | \-1     | 0     |
| **x9**   | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 6     |
| **x4**   | 0      | 0      | 1      | 1      | 1      | 1      | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 8     |
| **x12**  | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 1       | 1       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 5     |
| **x14**  | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 1       | 1       | 1       | 1       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 3     |
| **x10**  | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1       | 1       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 9     |
| **f9**   | 0      | 0      | \-1    | 0      | \-1    | \-1    | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 0       | 1       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0       | 0       | 4     |
| **f10**  | 0      | 0      | 1      | 0      | 1      | 1      | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 0       | \-1     | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0      | 1       | 1       | 5     |
| **x2**   | 0      | 1      | \-1    | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 1       | 0       | 0       | 0       | 1       | 1       | 1       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | \-1    | 0      | 0       | 0       | 4     |
| **obj**  | 0      | 0      | 2      | 0      | 2      | 2      | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 0       | \-2     | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 3      | 0      | 0       | 0       | \-99  |

**Fase II - Iteração 2 (pivot: x15, linha 3)**

| **Base** | **x1** | **x2** | **x3** | **x4** | **x5** | **x6** | **x7** | **x8** | **x9** | **x10** | **x11** | **x12** | **x13** | **x14** | **x15** | **x16** | **x17** | **f1** | **f2** | **f3** | **f4** | **f5** | **f6** | **f7** | **f8** | **f9** | **f10** | **f11** | **b** |
| -------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- | ----- |
| **x1**   | 1      | 0      | 0      | 0      | 0      | \-1    | 1      | 0      | 0      | 0       | \-1     | 0       | \-1     | 0       | 0       | 0       | \-1     | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | \-1     | 3     |
| **x8**   | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 1      | 0      | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 2     |
| **x15**  | 0      | 0      | \-1    | 0      | 0      | \-1    | 1      | 0      | 0      | 0       | 0       | 0       | \-1     | 0       | 1       | 1       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | \-1    | 0      | 0       | \-1     | 0     |
| **x9**   | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 6     |
| **x4**   | 0      | 0      | 1      | 1      | 1      | 1      | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 8     |
| **x12**  | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 1       | 1       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 5     |
| **x14**  | 0      | 0      | 1      | 0      | 0      | 1      | \-1    | 0      | 0      | 0       | 0       | 0       | 1       | 1       | 0       | 0       | 1       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0      | 0       | 1       | 3     |
| **x10**  | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1       | 1       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 9     |
| **f9**   | 0      | 0      | 0      | 0      | \-1    | 0      | \-1    | 0      | 0      | 0       | 0       | 0       | 1       | 0       | 0       | \-1     | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 1      | 0       | 1       | 4     |
| **f10**  | 0      | 0      | 1      | 0      | 1      | 1      | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 1       | 0       | 1       | 1       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0      | 1       | 1       | 8     |
| **x2**   | 0      | 1      | 0      | 0      | 0      | 1      | \-1    | 0      | 0      | 0       | 1       | 0       | 1       | 0       | 0       | 0       | 1       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 1       | 4     |
| **obj**  | 0      | 0      | 0      | 0      | 2      | 0      | 2      | 0      | 0      | 0       | 0       | 0       | \-2     | 0       | 0       | 2       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0      | 0       | \-2     | \-99  |

**Fase II - Iteração 3 / Tableau Final (pivot: x13, linha 7)**

| **Base** | **x1** | **x2** | **x3** | **x4** | **x5** | **x6** | **x7** | **x8** | **x9** | **x10** | **x11** | **x12** | **x13** | **x14** | **x15** | **x16** | **x17** | **f1** | **f2** | **f3** | **f4** | **f5** | **f6** | **f7** | **f8** | **f9** | **f10** | **f11** | **b** |
| -------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- | ----- |
| **x1**   | 1      | 0      | 1      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | \-1     | 0       | 0       | 1       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0      | 0       | 0       | 6     |
| **x8**   | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 1      | 0      | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 2     |
| **x15**  | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 1       | 1       | 1       | 1       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 3     |
| **x9**   | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 6     |
| **x4**   | 0      | 0      | 1      | 1      | 1      | 1      | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 8     |
| **x12**  | 0      | 0      | \-1    | 0      | 0      | \-1    | 1      | 0      | 0      | 0       | 0       | 1       | 0       | \-1     | 0       | 0       | \-1     | 0      | 0      | 0      | 0      | 0      | 0      | 0      | \-1    | 0      | 0       | \-1     | 2     |
| **x13**  | 0      | 0      | 1      | 0      | 0      | 1      | \-1    | 0      | 0      | 0       | 0       | 0       | 1       | 1       | 0       | 0       | 1       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0      | 0       | 1       | 3     |
| **x10**  | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1       | 1       | 0       | 0       | 0       | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 0       | 9     |
| **f9**   | 0      | 0      | \-1    | 0      | \-1    | \-1    | 0      | 0      | 0      | 0       | 0       | 0       | 0       | \-1     | 0       | \-1     | \-1     | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0       | 0       | 1     |
| **f10**  | 0      | 0      | 1      | 0      | 1      | 1      | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 1       | 0       | 1       | 1       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 1      | 0      | 1       | 1       | 8     |
| **x2**   | 0      | 1      | \-1    | 0      | 0      | 0      | 0      | 0      | 0      | 0       | 1       | 0       | 0       | \-1     | 0       | 0       | 0       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | \-1    | 0      | 0       | 0       | 1     |
| **obj**  | 0      | 0      | 2      | 0      | 2      | 2      | 0      | 0      | 0      | 0       | 0       | 0       | 0       | 2       | 0       | 2       | 2       | 0      | 0      | 0      | 0      | 0      | 0      | 0      | 3      | 0      | 0       | 0       | \-93  |

## **Resposta**

| **Paciente** | **Tipo** | **De A** | **De AB** | **De B** | **De O** | **Total** |
| ------------ | -------- | -------- | --------- | -------- | -------- | --------- |
| **1 (A)**    | A        | 6        | -         | -        | 1        | 7         |
| **2 (AB)**   | AB       | -        | 8         | -        | -        | 8         |
| **3 (B)**    | B        | -        | -         | -        | 2        | 2         |
| **4 (O)**    | O        | -        | -         | -        | 6        | 6         |
| **5 (A)**    | A        | 9        | -         | -        | -        | 9         |
| **6 (B)**    | B        | -        | -         | 2        | 3        | 5         |
| **7 (AB)**   | AB       | -        | 3         | -        | -        | 3         |

**Verificação de estoques usados:** A = 15/15 | AB = 11/12 | B = 2/10 | O = 12/12

**Valor ótimo da função objetivo:** z\* = **R\$ 93,00**

Observação: o programa exibe −93 na linha obj porque internamente minimiza −z para problemas de minimização na representação adotada. O valor correto é z\* = 93.
