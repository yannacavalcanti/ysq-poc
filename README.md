# Questionário de Esquemas de Young (YSQ-S3) online — protótipo

A psicóloga envia um link para o paciente. O paciente aceita o termo LGPD,
responde as 90 frases (com o progresso salvo no próprio aparelho) e envia.
O resultado **não aparece para o paciente**: o site manda, pelo serviço gratuito
[FormSubmit](https://formsubmit.co), um e-mail para a psicóloga com o resumo dos
esquemas sinalizados e um link para o relatório completo:

1. gráfico da média de cada esquema (1 a 6), agrupado pelos 5 domínios;
2. tabela de indicadores: média, itens 4–6, itens 5–6, soma 4–6, faixa;
3. rascunho de plano de ação para os esquemas sinalizados;
4. respostas item a item;
5. botão para baixar tudo em PDF.

O site é 100% estático: não há servidor nem banco de dados. As respostas viajam
dentro do link do relatório (depois do `#`) e o PDF é gerado no navegador.

**Configuração:** nome e CRP em `src/config.ts`; o e-mail vem da variável
`PSYCHOLOGIST_EMAIL` do GitHub (ou `NEXT_PUBLIC_PSYCHOLOGIST_EMAIL` no `.env.local`).
Na primeira resposta, o FormSubmit manda um e-mail para ela pedindo **Activate**;
depois de ativar, os resultados passam a chegar.

> ⚠️ **Os itens atuais são exemplos inventados, não os do YSQ-S3.** Para usar com
> pacientes é preciso autorização por escrito para o uso digital da versão
> brasileira (GAAPCC/PUCRS) e substituir `ITEMS` em `src/lib/items.ts` pelos
> itens oficiais, com a numeração e o mapeamento item → esquema da folha de
> correção. Depois, troque `ITEMS_ARE_PLACEHOLDERS` para `false`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000/ysq-poc/?p=CODIGO`. O parâmetro `p` identifica o paciente
no relatório sem precisar do nome completo (o nome é opcional no formulário).

`npm run sample-report` gera `.outbox/relatorio-exemplo.pdf` com respostas aleatórias.

## Onde ajustar

| O quê | Arquivo |
|---|---|
| Itens e escala de resposta | `src/lib/items.ts` |
| Esquemas e domínios | `src/lib/schemas.ts` |
| Faixas (moderado/alto/muito alto) e critério de sinalização | `src/lib/scoring.ts` (`THRESHOLDS`) |
| Planos de ação por esquema | `src/lib/action-plans.ts` |
| Layout do PDF | `src/lib/report-pdf.ts` |
| Nome, CRP e e-mail da psicóloga | `src/config.ts` |
| Conteúdo do e-mail | `submit()` em `src/app/questionnaire.tsx` |
| Termo de consentimento e telas | `src/app/questionnaire.tsx` |

## Publicar (GitHub Pages)

Igual ao `defensoria-poc`: cada push na branch `main` gera o site estático e
publica pelo GitHub Actions (`.github/workflows/deploy.yml`).

1. Crie um repositório **público** chamado `ysq-poc` no GitHub e faça o push.
   Se usar outro nome, troque o `basePath` em `next.config.ts`.
2. No repositório: **Settings → Pages → Source: GitHub Actions**.
3. Em **Settings → Secrets and variables → Actions → aba Variables**, crie a
   variável `PSYCHOLOGIST_EMAIL` com o e-mail que recebe os resultados. Ele fica
   fora do código (a política de DLP bloqueia e-mails reais no repositório).
4. Em alguns minutos o site fica em `https://<usuário>.github.io/ysq-poc/`.

Para testar o build localmente: `npm run build` gera a pasta `out/`.

Limitações conhecidas (aceitáveis para a PoC):
- Redes corporativas podem bloquear o FormSubmit. Nesse caso o paciente vê o
  botão "Enviar por e-mail", que abre o app de e-mail já preenchido.
- Quem tiver o link do relatório consegue abri-lo: ele só vai no e-mail da psicóloga.
- As respostas passam pelo FormSubmit (serviço de terceiros) a caminho do e-mail.
- Se o paciente não terminar, as respostas parciais ficam no `localStorage`
  daquele navegador até ele enviar.
