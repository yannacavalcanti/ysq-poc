import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import { ACTION_PLANS } from "./action-plans";
import { ITEMS, ITEMS_ARE_PLACEHOLDERS, SCALE } from "./items";
import { DOMAINS, SCHEMA_BY_ID, type DomainId } from "./schemas";
import { THRESHOLDS, prioritized, type SchemaScore } from "./scoring";

export type ReportInput = {
  scores: SchemaScore[];
  answers: number[];
  patientCode?: string;
  patientName?: string;
  submittedAt: Date;
};

// A4 em pontos.
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

const hex = (h: string): RGB =>
  rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);

const INK = hex("#0b0b0b");
const INK_2 = hex("#52514e");
const MUTED = hex("#898781");
const GRID = hex("#e1e0d9");
const AXIS = hex("#c3c2b7");
const BAND = hex("#f4f3ef");

// Uma cor por domínio, na ordem fixa da paleta categórica de referência.
const DOMAIN_COLOR: Record<DomainId, RGB> = {
  desconexao: hex("#2a78d6"),
  autonomia: hex("#eb6834"),
  limites: hex("#1baf7a"),
  "orientacao-outro": hex("#eda100"),
  supervigilancia: hex("#e87ba4"),
};

// As fontes padrão do PDF usam WinAnsi: troca caracteres fora dessa tabela.
function safe(text: string): string {
  return text.replace(/≥/g, ">=").replace(/≤/g, "<=").replace(/→/g, "->").replace(/[^\x00-\xFF–—‘’“”•…]/g, "?");
}

type Ctx = {
  doc: PDFDocument;
  page: PDFPage;
  y: number;
  regular: PDFFont;
  bold: PDFFont;
};

function newPage(ctx: Ctx) {
  ctx.page = ctx.doc.addPage([PAGE_W, PAGE_H]);
  ctx.y = PAGE_H - MARGIN;
}

function ensureSpace(ctx: Ctx, height: number) {
  if (ctx.y - height < MARGIN) newPage(ctx);
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of safe(text).split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function paragraph(
  ctx: Ctx,
  text: string,
  { size = 10, font = ctx.regular, color = INK, indent = 0, gap = 4 }: Partial<{
    size: number;
    font: PDFFont;
    color: RGB;
    indent: number;
    gap: number;
  }> = {},
) {
  const lineH = size * 1.35;
  for (const line of wrap(text, font, size, CONTENT_W - indent)) {
    ensureSpace(ctx, lineH);
    ctx.page.drawText(line, { x: MARGIN + indent, y: ctx.y - size, size, font, color });
    ctx.y -= lineH;
  }
  ctx.y -= gap;
}

function heading(ctx: Ctx, text: string, size = 14) {
  ensureSpace(ctx, size * 3);
  ctx.y -= size * 0.6;
  paragraph(ctx, text, { size, font: ctx.bold, gap: 6 });
}

function bullets(ctx: Ctx, title: string, items: string[]) {
  paragraph(ctx, title, { size: 9.5, font: ctx.bold, color: INK_2, gap: 1 });
  for (const item of items) paragraph(ctx, `•  ${item}`, { size: 9.5, indent: 8, gap: 1 });
  ctx.y -= 4;
}

function fmt(n: number) {
  return n.toFixed(1).replace(".", ",");
}

function drawHeader(ctx: Ctx, input: ReportInput) {
  paragraph(ctx, "Questionário de Esquemas de Young (YSQ-S3) — Relatório", { size: 16, font: ctx.bold, gap: 2 });
  const who = [input.patientName && `Paciente: ${input.patientName}`, input.patientCode && `Código: ${input.patientCode}`]
    .filter(Boolean)
    .join("   ");
  const when = input.submittedAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  paragraph(ctx, `${who || "Paciente não identificado"}   •   Respondido em ${when}`, { size: 9.5, color: INK_2, gap: 6 });
  if (ITEMS_ARE_PLACEHOLDERS) {
    paragraph(ctx, "PROTÓTIPO: itens de exemplo, não são os itens oficiais do YSQ-S3. Não use clinicamente.", {
      size: 9.5,
      font: ctx.bold,
      color: hex("#d03b3b"),
      gap: 4,
    });
  }
  paragraph(
    ctx,
    `Faixas indicativas (sem nota de corte validada no Brasil): média < ${THRESHOLDS.moderate} baixo; ` +
      `${THRESHOLDS.moderate}–${THRESHOLDS.high} moderado; ${THRESHOLDS.high}–${THRESHOLDS.veryHigh} alto; ` +
      `>= ${THRESHOLDS.veryHigh} muito alto. Esquemas sinalizados (*) têm média >= ${THRESHOLDS.high} ` +
      `ou ${THRESHOLDS.extremeCount}+ itens com nota 5–6. Interpretar sempre junto da entrevista clínica.`,
    { size: 8.5, color: INK_2, gap: 10 },
  );
}

/** Barras horizontais da média por esquema (1 a 6), agrupadas por domínio. */
function drawChart(ctx: Ctx, scores: SchemaScore[]) {
  const labelW = 190;
  const statsW = 90;
  const plotX = MARGIN + labelW;
  const plotW = CONTENT_W - labelW - statsW;
  const rowH = 15;
  const barH = 9;
  const groupGap = 20;
  const xFor = (v: number) => plotX + ((v - 1) / 5) * plotW;
  const { page, regular, bold } = ctx;

  heading(ctx, "Perfil de esquemas — média por esquema (escala 1 a 6)", 12);

  const chartTop = ctx.y;
  const chartH = scores.length * rowH + DOMAINS.length * groupGap + 4;
  const chartBottom = chartTop - chartH;

  // Faixa "alto ou mais" no fundo + linhas de grade em cada ponto da escala.
  page.drawRectangle({
    x: xFor(THRESHOLDS.high),
    y: chartBottom,
    width: xFor(6) - xFor(THRESHOLDS.high),
    height: chartH,
    color: BAND,
  });
  for (let v = 1; v <= 6; v++) {
    const x = xFor(v);
    const isThreshold = v === THRESHOLDS.high;
    page.drawLine({
      start: { x, y: chartTop },
      end: { x, y: chartBottom },
      thickness: isThreshold ? 1 : 0.5,
      color: isThreshold ? MUTED : v === 1 ? AXIS : GRID,
      dashArray: isThreshold ? [3, 2] : undefined,
    });
    const label = String(v);
    page.drawText(label, {
      x: x - regular.widthOfTextAtSize(label, 8) / 2,
      y: chartBottom - 11,
      size: 8,
      font: regular,
      color: MUTED,
    });
  }
  page.drawText(safe(`alto (>= ${THRESHOLDS.high})`), {
    x: xFor(THRESHOLDS.high) + 3,
    y: chartTop + 3,
    size: 7.5,
    font: regular,
    color: MUTED,
  });
  page.drawText("itens 5–6", { x: plotX + plotW + 30, y: chartTop + 3, size: 7.5, font: regular, color: MUTED });

  let y = chartTop;
  for (const domain of DOMAINS) {
    const color = DOMAIN_COLOR[domain.id];
    y -= groupGap;
    page.drawRectangle({ x: MARGIN, y: y + 4, width: 8, height: 8, color });
    page.drawText(safe(domain.name), { x: MARGIN + 12, y: y + 5, size: 9, font: bold, color: INK });

    for (const score of scores.filter((s) => s.schema.domain === domain.id)) {
      const rowY = y - rowH;
      const barY = rowY + (rowH - barH) / 2;
      const name = safe(`${score.flagged ? "* " : ""}${score.schema.name}`);
      const nameFont = score.flagged ? bold : regular;
      // Reduz a fonte até o nome caber antes do início das barras.
      let nameSize = 8.5;
      while (nameSize > 6 && nameFont.widthOfTextAtSize(name, nameSize) > labelW - 18) nameSize -= 0.25;
      page.drawText(name, { x: MARGIN + 12, y: barY + 1.5, size: nameSize, font: nameFont, color: INK });

      const barW = Math.max(xFor(score.mean) - plotX, 1.5);
      page.drawRectangle({ x: plotX, y: barY, width: barW, height: barH, color });
      page.drawText(fmt(score.mean), {
        x: plotX + barW + 4,
        y: barY + 1.5,
        size: 8,
        font: regular,
        color: INK_2,
      });
      page.drawText(`${score.extremeCount}/5`, {
        x: plotX + plotW + 30,
        y: barY + 1.5,
        size: 8,
        font: score.extremeCount >= THRESHOLDS.extremeCount ? bold : regular,
        color: INK_2,
      });
      y = rowY;
    }
  }
  ctx.y = chartBottom - 26;
}

function drawTable(ctx: Ctx, scores: SchemaScore[]) {
  newPage(ctx);
  heading(ctx, "Indicadores por esquema (ordenados pela média)", 12);
  const cols = [
    { title: "Esquema", x: 0 },
    { title: "Média", x: 250 },
    { title: "Itens 4–6", x: 300 },
    { title: "Itens 5–6", x: 360 },
    { title: "Soma 4–6", x: 420 },
    { title: "Faixa", x: 470 },
  ];
  const rowH = 14;
  const drawRow = (cells: string[], font: PDFFont, color = INK) => {
    ensureSpace(ctx, rowH);
    cells.forEach((cell, i) =>
      ctx.page.drawText(safe(cell), { x: MARGIN + cols[i].x, y: ctx.y - 10, size: 8.5, font, color }),
    );
    ctx.y -= rowH;
    ctx.page.drawLine({
      start: { x: MARGIN, y: ctx.y + 1 },
      end: { x: MARGIN + CONTENT_W, y: ctx.y + 1 },
      thickness: 0.4,
      color: GRID,
    });
  };
  drawRow(cols.map((c) => c.title), ctx.bold, INK_2);
  for (const s of [...scores].sort((a, b) => b.mean - a.mean)) {
    drawRow(
      [
        `${s.flagged ? "* " : ""}${s.schema.code} — ${s.schema.name}`,
        fmt(s.mean),
        `${s.elevatedCount}/5`,
        `${s.extremeCount}/5`,
        String(s.elevatedSum),
        s.level,
      ],
      s.flagged ? ctx.bold : ctx.regular,
    );
  }
  ctx.y -= 10;
}

function drawActionPlans(ctx: Ctx, scores: SchemaScore[]) {
  ensureSpace(ctx, 160);
  heading(ctx, "Rascunho de plano de ação — esquemas sinalizados", 14);
  paragraph(
    ctx,
    "Sugestões gerais de Terapia do Esquema para apoiar o planejamento da sessão. Revisar e adaptar ao caso.",
    { size: 9, color: INK_2, gap: 8 },
  );
  const flagged = prioritized(scores);
  if (flagged.length === 0) {
    paragraph(ctx, "Nenhum esquema atingiu os critérios de sinalização.", { size: 10 });
    return;
  }
  for (const s of flagged) {
    const plan = ACTION_PLANS[s.schema.id];
    ensureSpace(ctx, 120);
    heading(ctx, `${s.schema.name}  (média ${fmt(s.mean)}, ${s.extremeCount}/5 itens 5–6)`, 11.5);
    paragraph(ctx, `Necessidade central: ${plan.need}`, { size: 9.5, font: ctx.bold, gap: 2 });
    paragraph(ctx, plan.summary, { size: 9.5, gap: 4 });
    bullets(ctx, "Gatilhos comuns", plan.triggers);
    bullets(ctx, "Estratégias cognitivas", plan.cognitive);
    bullets(ctx, "Estratégias experienciais", plan.experiential);
    bullets(ctx, "Estratégias comportamentais", plan.behavioral);
    paragraph(ctx, `Tarefa entre sessões: ${plan.homework}`, { size: 9.5, gap: 10 });
  }
}

function drawAnswers(ctx: Ctx, answers: number[]) {
  newPage(ctx);
  heading(ctx, "Respostas item a item", 14);
  paragraph(ctx, `Escala: ${SCALE.map((s) => `${s.value} = ${s.label}`).join("; ")}.`, {
    size: 8.5,
    color: INK_2,
    gap: 8,
  });
  ITEMS.forEach((item, i) => {
    const schema = SCHEMA_BY_ID[item.schemaId];
    const prefix = `${item.number}. [${schema.code}] `;
    const suffix = `  ->  ${answers[i]}`;
    paragraph(ctx, `${prefix}${item.text}${suffix}`, {
      size: 8.5,
      font: answers[i] >= 5 ? ctx.bold : ctx.regular,
      gap: 1.5,
    });
  });
}

export async function buildReportPdf(input: ReportInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Relatório YSQ-S3");
  doc.setLanguage("pt-BR");
  const ctx: Ctx = {
    doc,
    page: doc.addPage([PAGE_W, PAGE_H]),
    y: PAGE_H - MARGIN,
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };

  drawHeader(ctx, input);
  drawChart(ctx, input.scores);
  drawTable(ctx, input.scores);
  drawActionPlans(ctx, input.scores);
  drawAnswers(ctx, input.answers);

  return doc.save();
}
