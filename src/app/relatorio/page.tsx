import type { Metadata } from "next";
import { Suspense } from "react";
import styles from "../questionnaire.module.css";
import Report from "./report";

export const metadata: Metadata = { title: "Relatório YSQ-S3" };

export default function Page() {
  return (
    <main className={`${styles.main} ${styles.wide}`}>
      <Suspense fallback={<p className={styles.muted}>Gerando relatório…</p>}>
        <Report />
      </Suspense>
    </main>
  );
}
