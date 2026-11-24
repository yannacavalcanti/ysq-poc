import { ITEMS } from "./items";

// O relatório não fica salvo em lugar nenhum: as respostas viajam dentro do
// próprio link (depois do "#", que o navegador não envia ao servidor).

export type ReportData = {
  answers: number[];
  code: string;
  name: string;
  submittedAt: Date;
};

export function encodeReport({ answers, code, name, submittedAt }: ReportData): string {
  const params = new URLSearchParams({ r: answers.join(""), p: code, n: name, t: String(submittedAt.getTime()) });
  return params.toString();
}

export function decodeReport(hash: string): ReportData | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const raw = params.get("r") ?? "";
  if (raw.length !== ITEMS.length || !/^[1-6]+$/.test(raw)) return null;
  const time = Number(params.get("t"));
  return {
    answers: raw.split("").map(Number),
    code: params.get("p") ?? "",
    name: params.get("n") ?? "",
    submittedAt: Number.isFinite(time) && time > 0 ? new Date(time) : new Date(),
  };
}
