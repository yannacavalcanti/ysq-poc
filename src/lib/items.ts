import { SCHEMAS, type SchemaId } from "./schemas";

// ATENÇÃO: itens PROVISÓRIOS, escritos só para testar o fluxo.
// NÃO são os itens do YSQ-S3. Antes de usar com pacientes, substitua `ITEMS`
// pelos 90 itens oficiais da versão brasileira (com autorização por escrito
// do GAAPCC/PUCRS), respeitando a numeração e o mapeamento item -> esquema
// da folha de correção oficial.

export type Item = {
  /** Número do item no questionário (1..N). */
  number: number;
  schemaId: SchemaId;
  text: string;
};

export const ITEMS_ARE_PLACEHOLDERS = true;

// Uma frase ilustrativa por esquema, usada para gerar 5 itens de exemplo cada.
const PLACEHOLDER_TEXT: Record<SchemaId, string> = {
  "privacao-emocional": "sinto que ninguém me oferece carinho ou compreensão de verdade",
  abandono: "tenho medo de que as pessoas importantes para mim vão embora",
  "desconfianca-abuso": "fico com o pé atrás, esperando que me prejudiquem",
  "isolamento-social": "sinto que não me encaixo nos grupos de que faço parte",
  "defectividade-vergonha": "acho que, se me conhecessem de verdade, não gostariam de mim",
  fracasso: "sinto que sou menos capaz do que as pessoas ao meu redor",
  "dependencia-incompetencia": "preciso de ajuda para resolver problemas do dia a dia",
  vulnerabilidade: "tenho a sensação de que algo ruim está prestes a acontecer",
  emaranhamento: "é difícil saber o que eu quero separado do que minha família quer",
  "arrogo-grandiosidade": "acho que as regras comuns não deveriam valer para mim",
  "autocontrole-insuficiente": "desisto de tarefas chatas mesmo quando são importantes",
  subjugacao: "deixo os outros decidirem por mim para evitar conflito",
  autossacrificio: "cuido tanto dos outros que sobra pouco tempo para mim",
  "busca-aprovacao": "o que os outros pensam de mim guia muitas das minhas escolhas",
  "negativismo-pessimismo": "costumo focar no que pode dar errado",
  "inibicao-emocional": "evito demonstrar o que sinto, mesmo para quem é próximo",
  "padroes-inflexiveis": "nada do que faço parece bom o suficiente para mim",
  "postura-punitiva": "acho que quem erra merece ser punido, inclusive eu",
};

// O YSQ-S3 intercala os esquemas (item 1 = esquema 1, item 2 = esquema 2, ...),
// então os itens de exemplo seguem o mesmo padrão: 5 rodadas pelos 18 esquemas.
export const ITEMS: Item[] = Array.from({ length: 5 }, (_, round) =>
  SCHEMAS.map((schema) => ({ round, schema })),
)
  .flat()
  .map(({ round, schema }, index) => ({
    number: index + 1,
    schemaId: schema.id,
    text: `(Exemplo ${round + 1}/5) Às vezes ${PLACEHOLDER_TEXT[schema.id]}.`,
  }));

export const SCALE = [
  { value: 1, label: "Completamente falso" },
  { value: 2, label: "Falso na maioria das vezes" },
  { value: 3, label: "Mais verdadeiro do que falso" },
  { value: 4, label: "Moderadamente verdadeiro" },
  { value: 5, label: "Verdadeiro na maioria das vezes" },
  { value: 6, label: "Me descreve perfeitamente" },
] as const;
