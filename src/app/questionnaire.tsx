"use client";

import { useSearchParams } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { browser } from "react-dom";
import { CONFIG } from "@/config";
import { ITEMS, ITEMS_ARE_PLACEHOLDERS, SCALE } from "@/lib/items";
import { encodeReport } from "@/lib/report-link";
import { prioritized, scoreAnswers } from "@/lib/scoring";
import styles from "./questionnaire.module.css";

const PAGE_SIZE = 10;
const PAGE_COUNT = Math.ceil(ITEMS.length / PAGE_SIZE);

type Step = { kind: "intro" } | { kind: "items"; page: number } | { kind: "done" };


type Saved = { answers: number[]; name: string };

// Progresso salvo só neste aparelho, para a pessoa poder continuar depois.
function loadSaved(key: string): Saved | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "null");
    if (Array.isArray(parsed?.answers) && parsed.answers.length === ITEMS.length) {
      return { answers: parsed.answers, name: typeof parsed.name === "string" ? parsed.name : "" };
    }
  } catch {
    localStorage.removeItem(key);
  }
  return null;
}

const psychologistName = CONFIG.PSYCHOLOGIST_NAME;
const psychologistCrp = CONFIG.PSYCHOLOGIST_CRP;

const fmt = (n: number) => n.toFixed(1).replace(".", ",");

export default function Questionnaire() {
  use(browser("O progresso das respostas fica salvo no localStorage."));
  const code = (useSearchParams().get("p") ?? "").slice(0, 40);
  const storageKey = `ysq-progresso:${code}`;

  const [step, setStep] = useState<Step>({ kind: "intro" });
  // 0 = ainda não respondido.
  const [answers, setAnswers] = useState<number[]>(() => loadSaved(storageKey)?.answers ?? ITEMS.map(() => 0));
  const [name, setName] = useState(() => loadSaved(storageKey)?.name ?? "");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [missing, setMissing] = useState<number[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [mailto, setMailto] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step.kind === "items") localStorage.setItem(storageKey, JSON.stringify({ answers, name }));
  }, [answers, name, step, storageKey]);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const answered = answers.filter((a) => a > 0).length;

  function answer(index: number, value: number) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
    setMissing((prev) => prev.filter((i) => i !== index));
  }

  function goToPage(page: number) {
    if (step.kind === "items" && page > step.page) {
      const start = step.page * PAGE_SIZE;
      const unanswered = ITEMS.slice(start, start + PAGE_SIZE).flatMap((_, i) => (answers[start + i] ? [] : [start + i]));
      if (unanswered.length) {
        setMissing(unanswered);
        document.getElementById(`item-${unanswered[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    setMissing([]);
    setStep({ kind: "items", page });
  }

  async function submit() {
    const unanswered = answers.flatMap((a, i) => (a ? [] : [i]));
    if (unanswered.length) {
      // Volta para a primeira página com frase sem resposta e destaca as pendentes.
      setStep({ kind: "items", page: Math.floor(unanswered[0] / PAGE_SIZE) });
      setMissing(unanswered);
      return;
    }
    setSending(true);
    setError("");
    setMailto("");
    const who = name.trim() || (code ? `Paciente ${code}` : "Paciente não identificado");
    const flagged = prioritized(scoreAnswers(answers));
    const reportUrl =
      `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/relatorio/#` +
      encodeReport({ answers, code, name: name.trim(), submittedAt: new Date() });
    const subject = `YSQ-S3 respondido — ${who}`;
    const summary = flagged.length
      ? flagged.map((s) => `${s.schema.name}: média ${fmt(s.mean)}, ${s.extremeCount}/5 itens 5–6`).join("\n")
      : "Nenhum esquema atingiu os critérios de sinalização.";
    // Plano B se o envio automático falhar: abre o app de e-mail já preenchido.
    const mailtoHref =
      `mailto:${CONFIG.PSYCHOLOGIST_EMAIL}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(`${who} respondeu o questionário.\n\nEsquemas sinalizados:\n${summary}\n\nRelatório completo:\n${reportUrl}`)}`;
    try {
      if (!CONFIG.PSYCHOLOGIST_EMAIL) throw new Error("E-mail da psicóloga não configurado (variável PSYCHOLOGIST_EMAIL).");
      // FormSubmit: serviço gratuito que repassa o formulário por e-mail, sem servidor próprio.
      const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.PSYCHOLOGIST_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          _captcha: "false",
          _honey: website,
          Paciente: who,
          Código: code || "—",
          "Esquemas sinalizados": summary.replaceAll("\n", " | "),
          "Relatório completo (gráfico, plano de ação e PDF)": reportUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== "true") {
        throw new Error(
          /activat/i.test(String(data.message))
            ? "O recebimento ainda não foi ativado. Peça para a psicóloga clicar em “Activate” no e-mail do FormSubmit e envie de novo."
            : "Não foi possível enviar automaticamente.",
        );
      }
      localStorage.removeItem(storageKey);
      setStep({ kind: "done" });
    } catch (e) {
      // "Failed to fetch" = a rede bloqueou o FormSubmit (ex.: rede corporativa).
      const message = e instanceof TypeError || !(e instanceof Error) ? "Não foi possível enviar automaticamente." : e.message;
      setError(`${message} Você pode enviar pelo seu e-mail no botão abaixo.`);
      setMailto(mailtoHref);
    } finally {
      setSending(false);
    }
  }

  if (step.kind === "done") {
    return (
      <div ref={topRef} className={styles.card}>
        <h1 className={styles.title}>Respostas enviadas!</h1>
        <p>
          Suas respostas foram enviadas para {psychologistName}. Vocês vão conversar sobre elas na próxima sessão.
        </p>
        <p className={styles.muted}>Você já pode fechar esta página.</p>
      </div>
    );
  }

  if (step.kind === "intro") {
    return (
      <div ref={topRef} className={styles.card}>
        {ITEMS_ARE_PLACEHOLDERS && (
          <p className={styles.warning}>Protótipo: as perguntas são exemplos e não fazem parte do questionário oficial.</p>
        )}
        <h1 className={styles.title}>Questionário de Esquemas de Young</h1>
        <p>
          Você vai ler {ITEMS.length} frases que as pessoas usam para se descrever. Para cada uma, escolha o quanto ela
          descreve você <b>no último ano</b>. Quando estiver em dúvida, responda pelo que você <b>sente</b>, não pelo
          que acha que é verdade. Leva cerca de 20 a 30 minutos, e seu progresso fica salvo neste aparelho.
        </p>
        <p>Não existem respostas certas ou erradas. O resultado não aparece aqui: ele vai direto para {psychologistName}.</p>

        <label className={styles.field}>
          <span>Seu nome ou iniciais (opcional)</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" />
        </label>

        <div className={styles.consent}>
          <h2>Termo de consentimento</h2>
          <p>
            Suas respostas e o nome informado são dados pessoais sensíveis de saúde (LGPD, art. 11). Ao continuar, você
            autoriza o envio deles por e-mail para {psychologistName}
            {psychologistCrp && ` (CRP ${psychologistCrp})`}, responsável pelo tratamento, com a finalidade exclusiva de
            apoiar o seu acompanhamento psicológico. O envio passa pelo serviço de e-mail FormSubmit, e as respostas não
            ficam armazenadas neste site. Você
            pode pedir acesso, correção ou exclusão dos seus dados diretamente a ela, e pode desistir a qualquer momento
            antes de enviar.
          </p>
          <label className={styles.check}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>Li e concordo com o termo acima.</span>
          </label>
        </div>

        <button className={styles.primary} disabled={!consent} onClick={() => setStep({ kind: "items", page: 0 })}>
          {answered > 0 ? "Continuar de onde parei" : "Começar"}
        </button>
      </div>
    );
  }

  const start = step.page * PAGE_SIZE;
  const pageItems = ITEMS.slice(start, start + PAGE_SIZE);
  const isLast = step.page === PAGE_COUNT - 1;

  return (
    <div ref={topRef} className={styles.card}>
      <div className={styles.sticky}>
        <div className={styles.progressRow}>
          <span>
            Página {step.page + 1} de {PAGE_COUNT}
          </span>
          <span>
            {answered}/{ITEMS.length} respondidas
          </span>
        </div>
        <div className={styles.progress} role="progressbar" aria-valuenow={answered} aria-valuemax={ITEMS.length}>
          <div style={{ width: `${(answered / ITEMS.length) * 100}%` }} />
        </div>
        <ol className={styles.legend}>
          {SCALE.map((s) => (
            <li key={s.value}>
              <b>{s.value}</b> {s.label}
            </li>
          ))}
        </ol>
      </div>

      {pageItems.map((item, i) => {
        const index = start + i;
        return (
          <fieldset
            key={item.number}
            id={`item-${index}`}
            className={`${styles.item} ${missing.includes(index) ? styles.missing : ""}`}
          >
            <legend>
              <span className={styles.number}>{item.number}.</span> {item.text}
            </legend>
            <div className={styles.options}>
              {SCALE.map((s) => (
                <label key={s.value} title={s.label} className={answers[index] === s.value ? styles.selected : ""}>
                  <input
                    type="radio"
                    name={`item-${index}`}
                    value={s.value}
                    checked={answers[index] === s.value}
                    onChange={() => answer(index, s.value)}
                    aria-label={`${s.value} — ${s.label}`}
                  />
                  {s.value}
                </label>
              ))}
            </div>
          </fieldset>
        );
      })}

      {missing.length > 0 && <p className={styles.error}>Responda as frases destacadas para continuar.</p>}
      {error && <p className={styles.error}>{error}</p>}
      {mailto && (
        <a className={styles.primary} href={mailto} onClick={() => localStorage.removeItem(storageKey)}>
          Enviar por e-mail para {psychologistName}
        </a>
      )}

      {/* Campo armadilha para robôs: invisível para pessoas. */}
      <input
        className={styles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      <div className={styles.nav}>
        <button
          className={styles.secondary}
          onClick={() => (step.page === 0 ? setStep({ kind: "intro" }) : goToPage(step.page - 1))}
        >
          Voltar
        </button>
        {isLast ? (
          <button className={styles.primary} disabled={sending} onClick={submit}>
            {sending ? "Enviando…" : "Enviar respostas"}
          </button>
        ) : (
          <button className={styles.primary} onClick={() => goToPage(step.page + 1)}>
            Próxima
          </button>
        )}
      </div>
    </div>
  );
}
