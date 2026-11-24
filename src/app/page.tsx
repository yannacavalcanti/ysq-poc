import { Suspense } from "react";
import Questionnaire from "./questionnaire";
import styles from "./questionnaire.module.css";

export default function Page() {
  return (
    <main className={styles.main}>
      {/* O questionário lê o código do paciente da URL (?p=...), então roda no navegador. */}
      <Suspense fallback={<p className={styles.muted}>Carregando…</p>}>
        <Questionnaire />
      </Suspense>
    </main>
  );
}
