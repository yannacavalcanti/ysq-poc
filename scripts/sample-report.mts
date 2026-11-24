// Gera um relatório de exemplo com respostas aleatórias: npm run sample-report
import { mkdir, writeFile } from "node:fs/promises";
import { ITEMS } from "../src/lib/items";
import { buildReportPdf } from "../src/lib/report-pdf";
import { scoreAnswers } from "../src/lib/scoring";

// Respostas mais altas em alguns esquemas para o exemplo ter itens sinalizados.
const answers = ITEMS.map((item) =>
  ["abandono", "defectividade-vergonha", "padroes-inflexiveis", "autossacrificio"].includes(item.schemaId)
    ? 4 + Math.floor(Math.random() * 3)
    : 1 + Math.floor(Math.random() * 4),
);

const pdf = await buildReportPdf({
  scores: scoreAnswers(answers),
  answers,
  patientCode: "EXEMPLO-01",
  patientName: "Paciente Exemplo",
  submittedAt: new Date(),
});
await mkdir(".outbox", { recursive: true });
await writeFile(".outbox/relatorio-exemplo.pdf", pdf);
console.log("PDF gerado em .outbox/relatorio-exemplo.pdf");
