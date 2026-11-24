"use client";

import { use, useEffect, useState } from "react";
import { browser } from "react-dom";
import { decodeReport } from "@/lib/report-link";
import { buildReportPdf } from "@/lib/report-pdf";
import { scoreAnswers } from "@/lib/scoring";
import styles from "../questionnaire.module.css";

export default function Report() {
  use(browser("As respostas estão no endereço da página, depois do #."));
  const [data] = useState(() => decodeReport(window.location.hash));
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (!data) return;
    let url = "";
    buildReportPdf({
      scores: scoreAnswers(data.answers),
      answers: data.answers,
      patientCode: data.code,
      patientName: data.name,
      submittedAt: data.submittedAt,
    }).then((bytes) => {
      url = URL.createObjectURL(new Blob([bytes.slice()], { type: "application/pdf" }));
      setPdfUrl(url);
    });
    return () => URL.revokeObjectURL(url);
  }, [data]);

  if (!data) {
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>Link inválido</h1>
        <p>Abra o relatório pelo link completo recebido no e-mail.</p>
      </div>
    );
  }

  const who = data.name || (data.code ? `Paciente ${data.code}` : "Paciente não identificado");
  const fileName = `ysq-s3-${(data.code || "sem-codigo").replace(/[^\w-]+/g, "_")}.pdf`;

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Relatório YSQ-S3 — {who}</h1>
      <p className={styles.muted}>
        Respondido em {data.submittedAt.toLocaleString("pt-BR")}. Este relatório não fica salvo em nenhum servidor: ele é
        gerado a partir do link. Baixe o PDF para guardar.
      </p>
      {pdfUrl ? (
        <>
          <a className={styles.primary} href={pdfUrl} download={fileName}>
            Baixar PDF
          </a>
          <iframe className={styles.pdf} src={pdfUrl} title="Relatório em PDF" />
        </>
      ) : (
        <p className={styles.muted}>Gerando relatório…</p>
      )}
    </div>
  );
}
