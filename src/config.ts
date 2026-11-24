// Única configuração da PoC: quem recebe os resultados.
// Na primeira resposta, o FormSubmit manda um e-mail para PSYCHOLOGIST_EMAIL
// pedindo "Activate"; depois de ativar, os resultados passam a chegar.
export const CONFIG = {
  PSYCHOLOGIST_NAME: "Thaise Brandão",
  PSYCHOLOGIST_CRP: "",
  // Vem de fora do código: variável PSYCHOLOGIST_EMAIL do repositório no GitHub
  // (Settings → Secrets and variables → Actions → Variables) ou .env.local no dev.
  PSYCHOLOGIST_EMAIL: process.env.NEXT_PUBLIC_PSYCHOLOGIST_EMAIL ?? "",
};
