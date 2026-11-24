import { ITEMS } from "./items";
import { SCHEMAS, type Schema } from "./schemas";

// Não há notas de corte validadas para o YSQ-S3 no Brasil. As faixas abaixo são
// INDICATIVAS e ficam centralizadas aqui para a psicóloga poder ajustar.
export const THRESHOLDS = {
  /** Média a partir da qual o esquema é "moderado". */
  moderate: 3,
  /** Média a partir da qual o esquema é "alto". */
  high: 4,
  /** Média a partir da qual o esquema é "muito alto". */
  veryHigh: 5,
  /** Quantidade de itens com nota 5 ou 6 que já indica relevância clínica. */
  extremeCount: 2,
};

export type Level = "baixo" | "moderado" | "alto" | "muito alto";

export type SchemaScore = {
  schema: Schema;
  /** Respostas deste esquema, na ordem dos itens. */
  answers: number[];
  /** Média dos itens (1 a 6). */
  mean: number;
  /** Itens com nota 5 ou 6. */
  extremeCount: number;
  /** Itens com nota 4, 5 ou 6. */
  elevatedCount: number;
  /** Soma só das notas 4, 5 e 6 (critério de Young & Brown; 1-3 contam zero). */
  elevatedSum: number;
  level: Level;
  /** Esquema que merece atenção: média alta OU itens extremos suficientes. */
  flagged: boolean;
};

export function levelFor(mean: number): Level {
  if (mean >= THRESHOLDS.veryHigh) return "muito alto";
  if (mean >= THRESHOLDS.high) return "alto";
  if (mean >= THRESHOLDS.moderate) return "moderado";
  return "baixo";
}

/** `answers[i]` é a resposta (1-6) do item `ITEMS[i]`. */
export function scoreAnswers(answers: number[]): SchemaScore[] {
  return SCHEMAS.map((schema) => {
    const values = ITEMS.flatMap((item, i) => (item.schemaId === schema.id ? [answers[i]] : []));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const extremeCount = values.filter((v) => v >= 5).length;
    const elevated = values.filter((v) => v >= 4);
    return {
      schema,
      answers: values,
      mean,
      extremeCount,
      elevatedCount: elevated.length,
      elevatedSum: elevated.reduce((a, b) => a + b, 0),
      level: levelFor(mean),
      flagged: mean >= THRESHOLDS.high || extremeCount >= THRESHOLDS.extremeCount,
    };
  });
}

/** Esquemas sinalizados, do mais intenso para o menos intenso. */
export function prioritized(scores: SchemaScore[]): SchemaScore[] {
  return scores
    .filter((s) => s.flagged)
    .sort((a, b) => b.mean - a.mean || b.extremeCount - a.extremeCount);
}

export function isValidAnswers(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === ITEMS.length &&
    value.every((v) => Number.isInteger(v) && v >= 1 && v <= 6)
  );
}
