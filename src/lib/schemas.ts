// Os 18 esquemas iniciais desadaptativos de Young, agrupados nos 5 domínios
// usados na folha de correção do YSQ-S3.

export type DomainId =
  | "desconexao"
  | "autonomia"
  | "limites"
  | "orientacao-outro"
  | "supervigilancia";

export type Domain = {
  id: DomainId;
  name: string;
};

export type SchemaId =
  | "privacao-emocional"
  | "abandono"
  | "desconfianca-abuso"
  | "isolamento-social"
  | "defectividade-vergonha"
  | "fracasso"
  | "dependencia-incompetencia"
  | "vulnerabilidade"
  | "emaranhamento"
  | "subjugacao"
  | "autossacrificio"
  | "inibicao-emocional"
  | "padroes-inflexiveis"
  | "arrogo-grandiosidade"
  | "autocontrole-insuficiente"
  | "busca-aprovacao"
  | "negativismo-pessimismo"
  | "postura-punitiva";

export type Schema = {
  id: SchemaId;
  /** Sigla usada na folha de correção (ex.: "PE" para Privação Emocional). */
  code: string;
  name: string;
  domain: DomainId;
};

export const DOMAINS: Domain[] = [
  { id: "desconexao", name: "Desconexão e Rejeição" },
  { id: "autonomia", name: "Autonomia e Desempenho Prejudicados" },
  { id: "limites", name: "Limites Prejudicados" },
  { id: "orientacao-outro", name: "Orientação para o Outro" },
  { id: "supervigilancia", name: "Supervigilância e Inibição" },
];

// A ordem aqui é a ordem em que os esquemas aparecem no relatório (por domínio).
export const SCHEMAS: Schema[] = [
  { id: "privacao-emocional", code: "PE", name: "Privação Emocional", domain: "desconexao" },
  { id: "abandono", code: "AB", name: "Abandono / Instabilidade", domain: "desconexao" },
  { id: "desconfianca-abuso", code: "DA", name: "Desconfiança / Abuso", domain: "desconexao" },
  { id: "isolamento-social", code: "IS", name: "Isolamento Social / Alienação", domain: "desconexao" },
  { id: "defectividade-vergonha", code: "DV", name: "Defectividade / Vergonha", domain: "desconexao" },
  { id: "fracasso", code: "FR", name: "Fracasso", domain: "autonomia" },
  { id: "dependencia-incompetencia", code: "DI", name: "Dependência / Incompetência", domain: "autonomia" },
  { id: "vulnerabilidade", code: "VU", name: "Vulnerabilidade ao Dano ou à Doença", domain: "autonomia" },
  { id: "emaranhamento", code: "EM", name: "Emaranhamento / Self Subdesenvolvido", domain: "autonomia" },
  { id: "arrogo-grandiosidade", code: "AG", name: "Arrogo / Grandiosidade", domain: "limites" },
  { id: "autocontrole-insuficiente", code: "AI", name: "Autocontrole / Autodisciplina Insuficientes", domain: "limites" },
  { id: "subjugacao", code: "SB", name: "Subjugação", domain: "orientacao-outro" },
  { id: "autossacrificio", code: "AS", name: "Autossacrifício", domain: "orientacao-outro" },
  { id: "busca-aprovacao", code: "BA", name: "Busca de Aprovação / Reconhecimento", domain: "orientacao-outro" },
  { id: "negativismo-pessimismo", code: "NP", name: "Negativismo / Pessimismo", domain: "supervigilancia" },
  { id: "inibicao-emocional", code: "IE", name: "Inibição Emocional", domain: "supervigilancia" },
  { id: "padroes-inflexiveis", code: "PI", name: "Padrões Inflexíveis / Hipercrítica", domain: "supervigilancia" },
  { id: "postura-punitiva", code: "PP", name: "Postura Punitiva", domain: "supervigilancia" },
];

export const SCHEMA_BY_ID = Object.fromEntries(SCHEMAS.map((s) => [s.id, s])) as Record<SchemaId, Schema>;
export const DOMAIN_BY_ID = Object.fromEntries(DOMAINS.map((d) => [d.id, d])) as Record<DomainId, Domain>;
