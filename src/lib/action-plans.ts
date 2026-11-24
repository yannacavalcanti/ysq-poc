import type { SchemaId } from "./schemas";

// RASCUNHO para revisão da psicóloga. Conteúdo psicoeducativo geral, baseado na
// literatura de Terapia do Esquema (Young, Klosko & Weishaar, 2003). Serve como
// ponto de partida para a sessão, não como orientação direta ao paciente.

export type ActionPlan = {
  /** Necessidade emocional central que não foi atendida. */
  need: string;
  /** Como o esquema costuma aparecer no dia a dia. */
  summary: string;
  /** Situações que costumam ativar o esquema. */
  triggers: string[];
  /** Intervenções sugeridas, por tipo de estratégia. */
  cognitive: string[];
  experiential: string[];
  behavioral: string[];
  /** Tarefa curta entre sessões. */
  homework: string;
};

export const ACTION_PLANS: Record<SchemaId, ActionPlan> = {
  "privacao-emocional": {
    need: "Cuidado, empatia e proteção emocional.",
    summary:
      "Expectativa de que ninguém vai oferecer acolhimento, compreensão ou orientação de forma suficiente. Costuma vir com sensação de vazio e de não ser visto.",
    triggers: ["Parceiro ou amigos distraídos", "Momentos de cansaço ou doença", "Datas comemorativas"],
    cognitive: [
      "Identificar evidências de cuidado recebido que costumam ser desconsideradas.",
      "Diferenciar 'ninguém me entende' de 'esta pessoa não percebeu agora'.",
    ],
    experiential: [
      "Imagens mentais da criança que não teve cuidado e reparentalização da necessidade.",
      "Carta (não enviada) às figuras de cuidado expressando o que faltou.",
    ],
    behavioral: [
      "Praticar pedir apoio de forma explícita em vez de esperar que adivinhem.",
      "Selecionar relações com pessoas capazes de oferecer reciprocidade.",
    ],
    homework: "Registrar diariamente um momento em que pediu ou recebeu cuidado e como se sentiu.",
  },
  abandono: {
    need: "Vínculos estáveis e previsíveis.",
    summary:
      "Percepção de que as pessoas importantes vão embora, morrer ou trocar por alguém melhor. Gera ciúme, controle ou afastamento preventivo.",
    triggers: ["Demora para responder mensagens", "Viagens ou separações temporárias", "Mudanças no vínculo"],
    cognitive: [
      "Cartão-lembrete: 'distância temporária não é abandono'.",
      "Examinar a escolha de parceiros instáveis ou indisponíveis.",
    ],
    experiential: [
      "Imagens de cenas de perda precoce e acolhimento da criança vulnerável.",
      "Diálogo de cadeiras entre o lado que teme e o adulto saudável.",
    ],
    behavioral: [
      "Tolerar a espera antes de buscar confirmação (ex.: adiar checagens).",
      "Reduzir comportamentos de controle e testes de lealdade.",
    ],
    homework: "Quando o medo de abandono surgir, anotar a situação, o pensamento e a evidência real antes de agir.",
  },
  "desconfianca-abuso": {
    need: "Segurança e confiança nos outros.",
    summary:
      "Expectativa de ser magoado, enganado, humilhado ou explorado. Leva a hipervigilância, desconfiança ou a ataques preventivos.",
    triggers: ["Ambiguidade nas intenções do outro", "Críticas", "Situações de intimidade"],
    cognitive: [
      "Graduar a confiança em um contínuo em vez de 'confio/não confio'.",
      "Revisar evidências de pessoas confiáveis no presente.",
    ],
    experiential: [
      "Imagens com proteção da criança diante do agressor (com segurança e ritmo adequados).",
      "Expressar raiva ao agressor em imagem ou cadeira vazia.",
    ],
    behavioral: [
      "Experimentos de confiança graduais com pessoas de baixo risco.",
      "Estabelecer limites claros em relações que de fato são abusivas.",
    ],
    homework: "Escolher uma pequena situação para confiar em alguém e registrar o resultado.",
  },
  "isolamento-social": {
    need: "Pertencimento a grupos.",
    summary:
      "Sensação de ser diferente e de não fazer parte de nenhum grupo. Gera retraimento em contextos sociais.",
    triggers: ["Eventos em grupo", "Ambientes novos", "Conversas em que se sente de fora"],
    cognitive: [
      "Listar semelhanças com outras pessoas, não só diferenças.",
      "Questionar a leitura de rejeição em situações neutras.",
    ],
    experiential: ["Imagens de experiências de exclusão na infância/adolescência e acolhimento."],
    behavioral: [
      "Participar de grupos com interesse em comum (curso, esporte, voluntariado).",
      "Hierarquia de exposição social, do mais fácil ao mais difícil.",
    ],
    homework: "Iniciar uma interação curta em grupo por semana e anotar o que aconteceu.",
  },
  "defectividade-vergonha": {
    need: "Aceitação incondicional e valor próprio.",
    summary:
      "Crença de ser falho, inferior ou indigno de amor. Vem com vergonha intensa, sensibilidade à crítica e esconder partes de si.",
    triggers: ["Críticas ou comparações", "Intimidade e exposição pessoal", "Ser avaliado"],
    cognitive: [
      "Separar comportamentos (que podem melhorar) de valor pessoal.",
      "Revisar a origem das mensagens críticas internalizadas.",
    ],
    experiential: [
      "Diálogo de cadeiras com o crítico interno, fortalecendo o adulto saudável.",
      "Imagens de reparentalização com mensagens de aceitação.",
    ],
    behavioral: [
      "Compartilhar aos poucos aspectos pessoais com pessoas seguras.",
      "Reduzir hábitos de autodepreciação e de evitar elogios.",
    ],
    homework: "Diário de qualidades: anotar diariamente algo que fez ou é, sem desqualificar.",
  },
  fracasso: {
    need: "Senso de competência e realização.",
    summary: "Crença de que vai fracassar ou de que é menos capaz que os outros em estudos, trabalho e conquistas.",
    triggers: ["Avaliações e prazos", "Comparação com colegas", "Novos desafios"],
    cognitive: [
      "Levantar evidências de competências e conquistas reais.",
      "Reavaliar padrões de comparação injustos.",
    ],
    experiential: ["Imagens de experiências precoces de humilhação ou comparação e acolhimento."],
    behavioral: [
      "Definir metas pequenas e graduais, reduzindo a procrastinação por medo.",
      "Desenvolver habilidades onde há déficit real.",
    ],
    homework: "Escolher uma tarefa adiada, dividi-la em passos e concluir o primeiro.",
  },
  "dependencia-incompetencia": {
    need: "Autonomia e confiança na própria capacidade.",
    summary:
      "Crença de não conseguir lidar com responsabilidades do dia a dia sem ajuda considerável dos outros.",
    triggers: ["Decisões sozinho", "Tarefas novas", "Ausência de pessoas de referência"],
    cognitive: ["Revisar situações em que resolveu algo sozinho.", "Questionar a previsão de catástrofe ao decidir."],
    experiential: ["Diálogo entre o lado dependente e o adulto saudável competente."],
    behavioral: [
      "Hierarquia de tarefas para fazer sem ajuda, aumentando a dificuldade.",
      "Reduzir gradualmente pedidos de confirmação.",
    ],
    homework: "Tomar uma decisão pequena por dia sem consultar ninguém e registrar o resultado.",
  },
  vulnerabilidade: {
    need: "Segurança e senso de proteção.",
    summary:
      "Medo exagerado de catástrofes iminentes (doenças, acidentes, crimes, ruína financeira), com muita precaução e preocupação.",
    triggers: ["Sintomas físicos", "Notícias", "Situações incertas"],
    cognitive: [
      "Estimar probabilidades reais em vez de possibilidades.",
      "Identificar o custo das precauções excessivas.",
    ],
    experiential: ["Imagens de origem do medo (ex.: cuidador ansioso) e acolhimento."],
    behavioral: ["Exposição gradual a situações evitadas.", "Reduzir checagens e comportamentos de segurança."],
    homework: "Adiar uma checagem ou precaução por um tempo combinado e observar a ansiedade baixar.",
  },
  emaranhamento: {
    need: "Identidade própria e individuação.",
    summary:
      "Envolvimento emocional excessivo com figuras próximas (geralmente pais), com dificuldade de ter identidade e direção próprias.",
    triggers: ["Decisões importantes", "Discordar da família", "Ficar distante dos pais"],
    cognitive: ["Diferenciar desejos próprios dos da família.", "Revisar crenças de culpa ligadas à separação."],
    experiential: ["Diálogo de cadeiras com a figura emaranhada, afirmando a própria posição."],
    behavioral: ["Fazer escolhas próprias em áreas pequenas.", "Construir atividades e relações fora do núcleo familiar."],
    homework: "Listar três preferências pessoais que diferem das da família e agir sobre uma.",
  },
  "arrogo-grandiosidade": {
    need: "Limites realistas e reciprocidade.",
    summary:
      "Crença de ser superior ou de ter direitos especiais, com dificuldade de aceitar regras e considerar as necessidades alheias.",
    triggers: ["Ser contrariado", "Regras e filas", "Não ser reconhecido"],
    cognitive: ["Examinar custos do comportamento para relações e metas.", "Praticar a perspectiva do outro."],
    experiential: ["Imagens com a criança que pode ter vivido privação ou excesso de permissividade."],
    behavioral: ["Combinar limites concretos e consequências.", "Praticar reciprocidade em relações próximas."],
    homework: "Registrar uma situação por dia em que considerou ativamente a necessidade de outra pessoa.",
  },
  "autocontrole-insuficiente": {
    need: "Tolerância à frustração e autodisciplina.",
    summary:
      "Dificuldade de tolerar frustração, controlar impulsos ou manter esforço em tarefas tediosas para atingir metas.",
    triggers: ["Tarefas monótonas", "Tédio ou desconforto", "Recompensas imediatas disponíveis"],
    cognitive: ["Vantagens e desvantagens de ceder ao impulso no curto e longo prazo."],
    experiential: ["Diálogo entre a criança impulsiva/indisciplinada e o adulto saudável."],
    behavioral: [
      "Técnicas de autorregulação (ex.: blocos curtos de tempo, recompensa ao fim).",
      "Estruturar rotina e reduzir o acesso a distrações.",
    ],
    homework: "Manter uma tarefa pouco prazerosa por um tempo combinado diariamente e registrar.",
  },
  subjugacao: {
    need: "Liberdade para expressar necessidades e emoções.",
    summary:
      "Submissão excessiva ao controle dos outros por medo de raiva, retaliação ou abandono. Costuma gerar raiva acumulada.",
    triggers: ["Conflitos", "Pedidos dos outros", "Figuras de autoridade"],
    cognitive: ["Reconhecer os próprios direitos e necessidades como legítimos.", "Avaliar o risco real de discordar."],
    experiential: ["Expressar, em imagem ou cadeira, o que não pôde dizer às figuras controladoras."],
    behavioral: ["Treino de assertividade com situações graduais.", "Dizer 'não' em situações de baixo risco."],
    homework: "Expressar uma preferência ou discordância por semana e anotar a reação real.",
  },
  autossacrificio: {
    need: "Reciprocidade e espaço para as próprias necessidades.",
    summary:
      "Foco excessivo em atender às necessidades dos outros à custa das próprias, para evitar culpa ou o sofrimento alheio.",
    triggers: ["Alguém precisando de ajuda", "Momentos de descanso", "Pedidos de favor"],
    cognitive: ["Questionar a responsabilidade exclusiva pelo bem-estar alheio.", "Avaliar o custo pessoal do sacrifício."],
    experiential: ["Imagens de origem (ex.: cuidar de um cuidador frágil) e acolher a criança sobrecarregada."],
    behavioral: ["Reservar tempo para si na agenda.", "Pedir ajuda e aceitar receber."],
    homework: "Fazer uma atividade só para si por semana sem justificar ou compensar.",
  },
  "busca-aprovacao": {
    need: "Senso de identidade com base em valores próprios.",
    summary:
      "Ênfase excessiva em obter aprovação, reconhecimento e atenção, em detrimento do próprio sentido de si.",
    triggers: ["Redes sociais", "Avaliações e status", "Ausência de retorno dos outros"],
    cognitive: ["Identificar valores próprios em vez de expectativas externas.", "Examinar a dependência de elogios."],
    experiential: ["Imagens de origem (amor condicionado a desempenho/aparência) e acolhimento."],
    behavioral: ["Tomar decisões coerentes com os próprios valores, mesmo sem aplauso.", "Reduzir exposição a comparações."],
    homework: "Fazer algo de que gosta sem contar ou postar, e observar como se sente.",
  },
  "negativismo-pessimismo": {
    need: "Espontaneidade e esperança realista.",
    summary:
      "Foco persistente nos aspectos negativos da vida (dor, perdas, erros), minimizando os positivos. Muita preocupação.",
    triggers: ["Decisões", "Planos futuros", "Momentos bons (que 'vão acabar')"],
    cognitive: ["Treinar a atenção para aspectos neutros e positivos.", "Avaliar previsões negativas que não se confirmaram."],
    experiential: ["Diálogo entre o lado pessimista e o adulto saudável."],
    behavioral: ["Reduzir tempo de preocupação (ex.: 'horário da preocupação').", "Planejar atividades prazerosas."],
    homework: "Diário de três coisas boas por dia, sem desqualificar.",
  },
  "inibicao-emocional": {
    need: "Expressão emocional e espontaneidade.",
    summary:
      "Inibição excessiva de ações, sentimentos e comunicação espontâneos para evitar desaprovação, vergonha ou perda de controle.",
    triggers: ["Situações de intimidade", "Conflitos", "Momentos de brincadeira ou celebração"],
    cognitive: ["Examinar crenças sobre o perigo de expressar emoções."],
    experiential: ["Exercícios de expressão emocional em sessão (imagens, cadeiras)."],
    behavioral: ["Nomear emoções em conversas com pessoas seguras.", "Atividades lúdicas e espontâneas."],
    homework: "Contar a alguém próximo, uma vez por semana, como se sentiu em uma situação.",
  },
  "padroes-inflexiveis": {
    need: "Equilíbrio entre desempenho, descanso e prazer.",
    summary:
      "Crença de que é preciso atingir padrões muito altos para evitar crítica. Gera pressão, perfeccionismo e pouco descanso.",
    triggers: ["Prazos", "Erros pequenos", "Momentos de lazer"],
    cognitive: ["Custo-benefício dos padrões atuais.", "Definir 'bom o suficiente' para tarefas específicas."],
    experiential: ["Diálogo com o lado exigente, dando voz à criança cansada."],
    behavioral: ["Experimentos de fazer tarefas a 80%.", "Agendar descanso como compromisso."],
    homework: "Entregar uma tarefa 'boa o suficiente' e registrar as consequências reais.",
  },
  "postura-punitiva": {
    need: "Autocompaixão e tolerância a erros.",
    summary:
      "Crença de que as pessoas, inclusive a própria, devem ser punidas com severidade pelos erros. Dificuldade de perdoar.",
    triggers: ["Erros próprios ou alheios", "Injustiças percebidas"],
    cognitive: ["Diferenciar responsabilidade de punição.", "Considerar circunstâncias atenuantes."],
    experiential: ["Diálogo de cadeiras confrontando o lado punitivo e oferecendo compaixão."],
    behavioral: ["Práticas de autocompaixão após erros.", "Reparação em vez de punição."],
    homework: "Após um erro, escrever o que diria a um amigo na mesma situação.",
  },
};
