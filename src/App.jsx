import React, { useState, useEffect, useRef } from "react";
import {
  Circle,
  CheckCircle2,
  HelpCircle,
  Layers,
  Link2,
  Compass,
  RotateCcw,
  Flag,
  Cloud,
  X,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Linkedin,
  Github,
  Mail,
  Megaphone,
  BookOpen,
  Zap,
  ArrowLeftRight,
} from "lucide-react";

const STUDY_STORAGE_KEY = "ai-guide:progress";
const EXEC_STORAGE_KEY = "ai-guide:exec-progress";

// TODO: troque os valores abaixo pelos seus links reais antes de publicar
const AUTHOR = {
  name: "Heiji Morimoto",
  role: "IT Product Engineer",
  email: "seu-email@exemplo.com",
  linkedin: "https://www.linkedin.com/in/seu-perfil",
  github: "https://github.com/seu-usuario",
  coffee: "https://www.buymeacoffee.com/seu-usuario",
  shareUrl: "",
};

/* ============================================================================
   NÚCLEO / DOMÍNIO
   Dados puros, sem nenhuma lógica de apresentação. Os dois modos (estudo e
   executivo) leem exatamente os mesmos tópicos — só decidem o que mostrar
   e como mostrar.
   ============================================================================ */

const LEVELS = [
  { id: 1, name: "Fundamentos", subtitle: "A base: o que é IA, como uma máquina aprende, o que é uma rede neural." },
  { id: 2, name: "IA generativa e LLMs", subtitle: "Como modelos passaram a criar conteúdo — e por que eles às vezes inventam coisas." },
  { id: 3, name: "Arquitetura aplicada", subtitle: "Como conectar um modelo a conhecimento real, ferramentas e tarefas de várias etapas." },
  { id: 4, name: "Produção e expert", subtitle: "O que importa quando o sistema precisa rodar de verdade, com gente de verdade usando." },
  { id: 5, name: "Conclusão", subtitle: "Recapitulando a trilha e testando o que ficou." },
];

const TOPICS = [
  {
    id: "o-que-e-ia",
    levelId: 1,
    code: "1.1",
    title: "O que é inteligência artificial",
    mapLabel: "O que é IA",
    oneLiner: "Sistemas que executam tarefas que, até pouco tempo, exigiam alguém pensando — reconhecer, decidir, prever, gerar.",
    everyday: "Quando o Waze escolhe sua rota considerando o trânsito ao vivo, isso é IA: o sistema decide algo que antes só um motorista experiente faria de cabeça.",
    exec: {
      takeaway: "IA nem sempre é machine learning — pode ser só regra fixa disfarçada de “inteligente”.",
      whyItMatters: "Antes de aprovar orçamento pra um projeto de “IA”, pergunte se é aprendizado de máquina de verdade ou um sistema de regras com nome bonito — custo e manutenção são bem diferentes.",
    },
    interview: [
      {
        q: "Todo sistema de IA usa machine learning?",
        a: "Não. Um sistema de regras fixas — escrito à mão, tipo “se isso, então aquilo” — também é IA clássica. Machine learning é quando o sistema aprende os padrões a partir de dados, em vez de alguém programar as regras.",
      },
      {
        q: "Por que a definição de IA muda tanto dependendo de quem você pergunta?",
        a: "Porque “parecer inteligente” é uma régua que se move: o que impressionava em 1990 (um programa que jogava xadrez bem) hoje é trivial. Boa parte da definição é relativa ao que ainda surpreende as pessoas, não uma linha fixa.",
      },
    ],
    deep: {
      paragraphs: [
        "O termo “IA” é guarda-chuva: cobre desde árvores de decisão simples até modelos com bilhões de parâmetros. O que muda é a fonte da inteligência — regras escritas por humanos, ou padrões aprendidos a partir de exemplos.",
      ],
      bullets: [
        {
          label: "IA simbólica (baseada em regras)",
          summary: "comportamento definido manualmente, com “se isso, então aquilo” — previsível, mas rígido.",
          example: {
            text: "Um sistema de aprovação de crédito que segue regras escritas por um analista é IA simbólica pura — decide algo que parece exigir julgamento, mas é 100% regra fixa, sem aprender nada com o tempo.",
            code: 'if (renda_mensal >= 3 * valor_parcela &&\n    score_credito >= 600 &&\n    sem_negativacao) {\n  return "aprovado";\n} else {\n  return "negado";\n}',
            sources: [{ label: "Wikipedia — Symbolic artificial intelligence", url: "https://en.wikipedia.org/wiki/Symbolic_artificial_intelligence" }],
          },
        },
        {
          label: "IA estatística (machine learning)",
          summary: "comportamento aprendido a partir de dados — flexível, mas depende da qualidade dos exemplos.",
          example: {
            text: "O mesmo problema de crédito, resolvido com ML: em vez de alguém escrever as regras, um algoritmo aprende, a partir de milhares de casos passados, quais combinações de renda, score e histórico de fato preveem inadimplência — e pode achar padrões que o analista nunca pensaria em escrever como regra.",
            sources: [{ label: "Wikipedia — Machine learning", url: "https://en.wikipedia.org/wiki/Machine_learning" }],
          },
        },
        {
          label: "Na prática, os dois se misturam",
          summary: "sistemas reais costumam ter regras pra casos críticos e ML pra tudo que tem nuance.",
          example: {
            text: "Bancos reais costumam usar um modelo de ML pra calcular o “score de risco”, e depois aplicar regras fixas de compliance por cima — por exemplo, nunca aprovar acima de um certo valor sem revisão humana, não importa o que o modelo diga.",
          },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Mesmo um sistema de regras fixas hoje normalmente roda como um serviço na nuvem — uma API que recebe uma chamada e devolve uma decisão, igual qualquer outro microsserviço.",
      ],
      bullets: [
        {
          label: "AWS WAF / Cloudflare",
          summary: "regras fixas (IA clássica, sem aprendizado) decidindo bloquear ou liberar tráfego suspeito.",
          links: [
            { name: "AWS WAF", url: "https://aws.amazon.com/waf/" },
            { name: "Cloudflare", url: "https://www.cloudflare.com/" },
          ],
        },
        "Os mesmos provedores também oferecem camadas de ML por cima dessas regras, pra detectar padrões que ninguém programou manualmente.",
      ],
    },
    connects: ["ai-vs-ml"],
  },
  {
    id: "ai-vs-ml",
    levelId: 1,
    code: "1.2",
    title: "IA, ML, deep learning e IA generativa",
    mapLabel: "IA vs ML vs DL",
    oneLiner: "Quatro círculos concêntricos: cada termo é um subconjunto mais específico do anterior.",
    everyday: "É como cozinha → culinária italiana → massa fresca → talharim ao ovo — cada nível mais específico vive dentro do mais geral.",
    exec: {
      takeaway: "ML, deep learning e IA generativa não são sinônimos — são camadas, cada uma com custo e complexidade diferentes.",
      whyItMatters: "Quando alguém propõe “usar IA”, pergunte qual camada específica — isso muda o time necessário, o prazo e o orçamento.",
    },
    interview: [
      {
        q: "Deep learning é a mesma coisa que machine learning?",
        a: "Não exatamente — deep learning é uma subárea de ML que usa redes neurais com muitas camadas. Todo deep learning é ML, mas nem todo ML usa redes profundas (árvores de decisão e regressão linear também são ML).",
      },
      {
        q: "Um modelo de fundação é a mesma coisa que um LLM?",
        a: "Não exatamente — modelo de fundação é o termo mais amplo: um modelo grande, treinado em dados genéricos, adaptável pra várias tarefas. LLM é o caso mais comum, especializado em texto; também existem modelos de fundação pra imagem, áudio e multimodais.",
      },
    ],
    deep: {
      paragraphs: [
        "Vale ler essa cadeia como simplificação didática, não como hierarquia técnica rígida: deep learning existe há décadas fazendo coisas que não são “modelos de fundação”, e IA generativa não nasce só de modelos de fundação.",
      ],
      bullets: [
        {
          label: "IA",
          summary: "qualquer sistema que executa tarefas que pareciam exigir inteligência humana.",
          example: {
            text: "Um chatbot que só segue um fluxograma fixo de perguntas (“digite 1 para...”) já entra nessa categoria, mesmo sem nenhum aprendizado envolvido.",
            sources: [{ label: "Wikipedia — Artificial intelligence", url: "https://en.wikipedia.org/wiki/Artificial_intelligence" }],
          },
        },
        {
          label: "Machine learning",
          summary: "aprende padrões a partir de dados, em vez de seguir regras escritas à mão.",
          example: {
            text: "Um filtro de spam que melhora conforme você corrige seus próprios erros é ML — ninguém escreveu “se contém a palavra X, é spam”, o padrão foi aprendido.",
            sources: [{ label: "Wikipedia — Machine learning", url: "https://en.wikipedia.org/wiki/Machine_learning" }],
          },
        },
        {
          label: "Deep learning",
          summary: "usa redes neurais com muitas camadas; geralmente precisa de mais dado e poder computacional.",
          example: {
            text: "Reconhecer um rosto numa foto é deep learning: a rede aprende sozinha que “bordas” formam “olhos”, que “olhos + nariz + boca” formam “rosto” — sem ninguém definir manualmente o que é um pixel de olho.",
            sources: [{ label: "Wikipedia — Deep learning", url: "https://en.wikipedia.org/wiki/Deep_learning" }],
          },
        },
        {
          label: "IA generativa",
          summary: "modelos (normalmente deep learning) treinados especificamente pra criar conteúdo novo.",
          example: {
            text: "Pedir pro ChatGPT um poema sobre seu cachorro: o modelo não escolhe entre poemas prontos, constrói um texto novo, palavra por palavra.",
            sources: [{ label: "Wikipedia — Generative artificial intelligence", url: "https://en.wikipedia.org/wiki/Generative_artificial_intelligence" }],
          },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Cada camada dessa cadeia tende a rodar em ambientes diferentes — uma decisão de arquitetura, não só de algoritmo.",
      ],
      bullets: [
        {
          label: "Vertex AI Model Garden",
          summary: "(Google Cloud) catálogo com modelos clássicos de ML, deep learning e modelos de fundação lado a lado, deixando essa fronteira bem visível.",
          links: [{ name: "Vertex AI Model Garden", url: "https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/explore-models" }],
        },
        {
          label: "AWS SageMaker",
          summary: "serve tanto uma regressão linear simples quanto um LLM gigante; a infraestrutura por trás muda completamente entre os dois casos.",
          links: [{ name: "AWS SageMaker", url: "https://aws.amazon.com/sagemaker/" }],
        },
      ],
    },
    visual: "nested-circles",
    connects: ["o-que-e-ia", "ml"],
  },
  {
    id: "ml",
    levelId: 1,
    code: "1.3",
    title: "Machine learning: como uma máquina aprende",
    mapLabel: "Machine learning",
    oneLiner: "Aprender uma função a partir de exemplos: dados + algoritmo → modelo treinado → previsão.",
    everyday: "É o Netflix sugerindo séries: ninguém programou linha a linha o seu gosto — o sistema aprendeu olhando padrões de quem assistiu coisas parecidas.",
    exec: {
      takeaway: "Todo modelo de ML precisa ser testado em dados que ele nunca viu — senão o número de acurácia que te mostraram pode ser enganoso.",
      whyItMatters: "Se o time só te mostra a performance no treino, pergunte pelo resultado no conjunto de teste — é o número que importa pra produção.",
    },
    interview: [
      {
        q: "Qual a diferença entre supervised, unsupervised e reinforcement learning?",
        a: "Supervised tem resposta certa pra aprender com (ex: e-mail é spam ou não). Unsupervised procura padrões sem rótulo prévio (ex: agrupar clientes parecidos). Reinforcement learning aprende por tentativa e recompensa (ex: otimizar rotas de entrega).",
      },
      {
        q: "O que é o trade-off entre bias e variância?",
        a: "Um modelo com bias alto é simples demais e erra de forma consistente, sem captar o padrão real. Um modelo com variância alta é complexo demais e “decora” o ruído dos dados de treino, errando de forma instável em dados novos. O objetivo é equilibrar os dois.",
      },
    ],
    deep: {
      paragraphs: [
        "Overfitting é quando o modelo “decora” os exemplos de treino em vez de aprender o padrão geral — acerta muito nos dados que já viu e erra feio em dados novos. Por isso sempre se mede performance num conjunto que o modelo nunca viu.",
      ],
      bullets: [
        {
          label: "Treino",
          summary: "o modelo ajusta parâmetros olhando exemplos com resposta conhecida.",
          example: {
            text: "10.000 e-mails já marcados como spam/não-spam: o algoritmo olha pra esses exemplos e ajusta seus parâmetros internos pra acertar o máximo possível neles.",
            sources: [{ label: "Wikipedia — Training, validation, and test data sets", url: "https://en.wikipedia.org/wiki/Training,_validation,_and_test_data_sets" }],
          },
        },
        {
          label: "Validação",
          summary: "usada durante o desenvolvimento pra escolher entre versões do modelo.",
          example: {
            text: "Antes de lançar, você testa 3 versões do modelo (com configurações diferentes) num conjunto separado de 1.000 e-mails nunca usados no treino, pra escolher qual generaliza melhor.",
            sources: [{ label: "Wikipedia — Training, validation, and test data sets", url: "https://en.wikipedia.org/wiki/Training,_validation,_and_test_data_sets" }],
          },
        },
        {
          label: "Teste",
          summary: "o conjunto que o modelo nunca viu — o que de fato indica como ele vai se comportar.",
          example: {
            text: "Só depois de escolher a versão final, você mede a performance num terceiro conjunto, nunca tocado antes — esse número é o que você reporta como “acurácia”, por ser o mais parecido com e-mails novos de verdade.",
            sources: [{ label: "Wikipedia — Training, validation, and test data sets", url: "https://en.wikipedia.org/wiki/Training,_validation,_and_test_data_sets" }],
          },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Treinar um modelo em produção normalmente é um pipeline, não um script solto — engenharia de dados tanto quanto estatística.",
      ],
      bullets: [
        {
          label: "AWS SageMaker e Vertex AI Pipelines",
          summary: "orquestram o fluxo clássico (dados → treino → modelo versionado → deploy) como um pipeline gerenciado.",
          links: [
            { name: "AWS SageMaker", url: "https://aws.amazon.com/sagemaker/" },
            { name: "Vertex AI Pipelines", url: "https://cloud.google.com/vertex-ai/docs/pipelines/introduction" },
          ],
        },
        {
          label: "Databricks e Snowflake",
          summary: "costumam ser a origem dos dados de treino, antes de chegarem nessas plataformas de ML.",
          links: [
            { name: "Databricks", url: "https://www.databricks.com/" },
            { name: "Snowflake", url: "https://www.snowflake.com/" },
          ],
        },
      ],
    },
    connects: ["ai-vs-ml", "nn"],
  },
  {
    id: "nn",
    levelId: 1,
    code: "1.4",
    title: "Redes neurais",
    mapLabel: "Redes neurais",
    oneLiner: "Camadas de unidades matemáticas que aprendem representações dos dados.",
    everyday: "Pense numa rede neural como um grupo de amigos dando palpite em cadeia: cada um ajusta a opinião com base no anterior, até chegar num veredito final — e quando erram, recalibram pra próxima rodada.",
    exec: {
      takeaway: "Redes neurais aprendem por tentativa e erro, ajustando milhões de parâmetros — não existe uma “regra de negócio” simples que você possa ler.",
      whyItMatters: "Isso explica por que é difícil auditar exatamente “por que” o modelo decidiu algo — vale perguntar como o time pretende explicar decisões pra um cliente ou regulador.",
    },
    interview: [
      {
        q: "O que é backpropagation?",
        a: "É o processo de ajustar os pesos da rede a partir do erro calculado na saída. Em termos simples: o modelo erra, mede o tamanho do erro e ajusta os parâmetros pra errar um pouco menos na próxima vez.",
      },
      {
        q: "Por que redes neurais profundas precisam de tanto dado?",
        a: "Porque cada camada adiciona parâmetros que precisam ser ajustados — com pouco dado, o modelo não tem exemplos suficientes pra aprender um padrão confiável, e acaba decorando em vez de generalizar.",
      },
    ],
    deep: {
      paragraphs: [
        "Embedding, dentro de uma rede, é a representação numérica densa de algo — em vez de tratar uma palavra como texto cru, o modelo transforma em vetor. É a mesma ideia que sustenta busca semântica e RAG, alguns níveis mais adiante.",
      ],
      bullets: [
        {
          label: "Forward pass",
          summary: "os dados atravessam as camadas e geram uma previsão.",
          example: { text: "O tamanho de uma casa entra na rede e, multiplicado e somado camada por camada, sai como um preço estimado.", code: "preco_estimado = camada3(camada2(camada1(tamanho_da_casa)))" },
        },
        {
          label: "Loss function",
          summary: "mede o quão errada está essa previsão.",
          example: {
            text: "Se a casa custava de verdade R$500.000 e o modelo previu R$420.000, o erro é a diferença entre os dois — quanto maior, mais a rede precisa ajustar.",
            code: "erro = (preco_real - preco_previsto) ** 2  # erro quadrático",
            sources: [{ label: "Wikipedia — Loss function", url: "https://en.wikipedia.org/wiki/Loss_function" }],
          },
        },
        {
          label: "Backpropagation",
          summary: "usa essa medida de erro pra calcular o quanto cada peso contribuiu pro erro.",
          example: {
            text: "O erro é “devolvido” da última camada até a primeira, calculando exatamente o quanto cada peso da rede contribuiu pra esse erro específico.",
            sources: [{ label: "Wikipedia — Backpropagation", url: "https://en.wikipedia.org/wiki/Backpropagation" }],
          },
        },
        {
          label: "Gradient descent",
          summary: "ajusta os pesos na direção que reduz o erro, um passo pequeno por vez.",
          example: {
            text: "Repetido milhares de vezes, até o erro parar de cair de forma significativa.",
            code: "peso_novo = peso_atual - taxa_de_aprendizado * gradiente",
            sources: [{ label: "Wikipedia — Gradient descent", url: "https://en.wikipedia.org/wiki/Gradient_descent" }],
          },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Redes grandes treinam em clusters de GPU distribuídos — engenharia de orquestração tanto quanto matemática.",
      ],
      bullets: [
        {
          label: "EC2 P5, Cloud TPU v6 e Azure ND-series",
          summary: "são as opções mais comuns de hardware de treino sob demanda.",
          links: [
            { name: "AWS EC2 P5", url: "https://aws.amazon.com/ec2/instance-types/p5/" },
            { name: "Google Cloud TPU v6", url: "https://cloud.google.com/tpu" },
            { name: "Azure ND-series", url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nd-series" },
          ],
        },
        {
          label: "PyTorch, DeepSpeed ou Megatron",
          summary: "cuidam de dividir o treino entre várias máquinas e sincronizar os gradientes.",
          links: [
            { name: "PyTorch", url: "https://pytorch.org/" },
            { name: "DeepSpeed", url: "https://www.deepspeed.ai/" },
            { name: "Megatron-LM", url: "https://github.com/NVIDIA/Megatron-LM" },
          ],
        },
      ],
    },
    visual: "neural-net",
    connects: ["ml", "embeddings"],
  },
  {
    id: "genai",
    levelId: 2,
    code: "2.1",
    title: "IA generativa",
    mapLabel: "IA generativa",
    oneLiner: "Modelos capazes de criar conteúdo novo — texto, imagem, áudio, código — em vez de só classificar ou prever algo existente.",
    everyday: "ChatGPT escrevendo um e-mail, Midjourney criando uma imagem pro post, um app clonando uma voz pra narrar um vídeo — tudo isso é gerar algo que não existia, não escolher entre opções prontas.",
    exec: {
      takeaway: "IA generativa cria conteúdo novo — e isso inclui erros novos, não só os de antes.",
      whyItMatters: "Todo recurso que usa geração de conteúdo precisa de um plano pra quando o modelo “inventar” algo errado na frente do cliente.",
    },
    interview: [
      {
        q: "IA generativa é a mesma coisa que LLM?",
        a: "Não — LLM é uma categoria dentro de IA generativa, especializada em texto. Imagem usa diffusion models, áudio tem arquiteturas próprias. “Generativa” descreve o que o modelo faz; “LLM” descreve um tipo específico de modelo.",
      },
      {
        q: "Por que modelos de imagem usam diffusion em vez de gerar pixel por pixel direto?",
        a: "Gerar a imagem inteira de uma vez é instável — pequenos erros se acumulam rápido. Diffusion quebra o problema em muitos passos pequenos de “remover um pouco de ruído”, o que é mais fácil de aprender e mais estável de treinar.",
      },
    ],
    deep: {
      paragraphs: [
        "A maior parte dos modelos de imagem hoje usa diffusion: começam com ruído aleatório e vão “limpando” esse ruído em etapas até formar a imagem, guiados pelo texto do prompt.",
      ],
      bullets: [
        {
          label: "Texto",
          summary: "modelos autoregressivos (LLMs) gerando token a token.",
          example: {
            text: "GPT e Claude geram texto token por token — cada nova palavra escolhida com base em tudo que veio antes, como um autocomplete bem mais sofisticado.",
            sources: [{ label: "Wikipedia — Large language model", url: "https://en.wikipedia.org/wiki/Large_language_model" }],
          },
        },
        {
          label: "Imagem",
          summary: "diffusion models, removendo ruído passo a passo.",
          example: {
            text: "Pedir “um gato astronauta”: o modelo começa com um campo de ruído puro e, em ~20-50 passos, vai revelando a imagem, sempre checando se o resultado parcial ainda combina com o texto do prompt.",
            sources: [{ label: "Wikipedia — Diffusion model", url: "https://en.wikipedia.org/wiki/Diffusion_model" }],
          },
        },
        {
          label: "Áudio",
          summary: "arquiteturas próprias pra voz, música e efeitos; algumas também usam diffusion.",
          example: { text: "Clonar uma voz treina o modelo a partir de poucos minutos de áudio de uma pessoa, e depois gera frases novas que ela nunca disse de fato, na voz dela." },
        },
        {
          label: "Multimodal",
          summary: "um único modelo lidando com mais de um tipo de conteúdo ao mesmo tempo.",
          example: { text: "Mandar uma foto de uma geladeira vazia e perguntar “o que eu cozinho com isso” exige um modelo multimodal: ele processa imagem e texto juntos, na mesma “cabeça”." },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Servir IA generativa em produção parece muito com servir qualquer API — só que com uma chamada que pode custar caro e demorar segundos em vez de milissegundos.",
      ],
      bullets: [
        {
          label: "AWS Bedrock, Vertex AI e Azure AI Foundry",
          summary: "expõem modelos generativos de texto, imagem e código como serviço gerenciado, sem você precisar hospedar nada.",
          links: [
            { name: "AWS Bedrock", url: "https://aws.amazon.com/bedrock/" },
            { name: "Google Vertex AI", url: "https://cloud.google.com/vertex-ai" },
            { name: "Azure AI Foundry", url: "https://azure.microsoft.com/en-us/products/ai-foundry" },
          ],
        },
        "Cada provedor tem um catálogo diferente: Bedrock inclui modelos da Anthropic, Meta e Mistral; Azure tem acesso a modelos exclusivos da OpenAI; Vertex AI é o ambiente nativo do Gemini.",
      ],
    },
    connects: ["ai-vs-ml", "llm"],
  },
  {
    id: "llm",
    levelId: 2,
    code: "2.2",
    title: "LLMs: large language models",
    mapLabel: "LLMs",
    oneLiner: "Modelos treinados para prever e gerar sequências de tokens — a próxima palavra mais provável, dado tudo que veio antes.",
    everyday: "É o autocomplete do teclado do seu celular, só que turbinado: ele não “sabe” fatos como um banco de dados — ele prevê a continuação mais provável do texto, com base em padrões que viu durante o treino.",
    exec: {
      takeaway: "Um LLM não consulta uma base de dados por padrão — ele prevê texto plausível, com ou sem certeza.",
      whyItMatters: "Se o seu produto promete “informação precisa”, pergunte se tem RAG ou alguma verificação por trás — sem isso, é risco de informação inventada.",
    },
    interview: [
      {
        q: "Fine-tuning e RAG resolvem o mesmo problema?",
        a: "Não. Fine-tuning muda o comportamento e os pesos do modelo — bom pra ensinar um estilo ou formato. RAG injeta conhecimento externo no contexto, sem alterar os pesos — melhor pra fatos que mudam com frequência.",
      },
      {
        q: "O que é attention, numa frase?",
        a: "É o mecanismo que deixa o modelo decidir, pra cada token, quais outros tokens da frase merecem mais peso na hora de prever o próximo — em vez de tratar todo o texto anterior com a mesma importância.",
      },
      {
        q: "Temperature alta é sempre pior?",
        a: "Não — depende da tarefa. Pra resposta factual ou código, temperature baixa é melhor (mais previsível). Pra brainstorm ou criação, temperature mais alta ajuda a variar mais as opções.",
      },
    ],
    deep: {
      paragraphs: [
        "Conceitos que valem memorizar pra entender o que está acontecendo por trás de cada resposta:",
      ],
      bullets: [
        {
          label: "Token",
          summary: "a unidade que o modelo realmente processa, geralmente um pedaço de palavra.",
          example: {
            text: "Em geral, 1 token equivale a cerca de 4 caracteres em inglês (um pouco menos em português). Uma palavra pode virar vários tokens.",
            code: '"Eu gosto de IA" → ["Eu", " gost", "o", " de", " IA"]\n# 4 palavras → 5 tokens',
            sources: [{ label: "Wikipedia — Large language model", url: "https://en.wikipedia.org/wiki/Large_language_model" }],
          },
        },
        {
          label: "Transformer e attention",
          summary: "o mecanismo que decide o que “prestar atenção” em cada token.",
          example: {
            text: "Na frase “o gato que estava com fome comeu a ração”, ao processar “comeu”, attention deixa o modelo “olhar” com mais força pra “gato” (quem comeu) e “ração” (o que foi comido) do que pra “estava” ou “com”.",
            code: 'atenção de "comeu" →\n  o:0.05  gato:0.42  que:0.02  estava:0.03\n  com:0.02  fome:0.08  ração:0.38',
            sources: [{ label: "Vaswani et al. — Attention Is All You Need (arXiv)", url: "https://arxiv.org/abs/1706.03762" }],
          },
        },
        {
          label: "Context window",
          summary: "quanto texto cabe na memória de curto prazo da conversa.",
          example: {
            text: "Um modelo com janela de 128 mil tokens consegue “ver” cerca de 300 páginas de texto numa única conversa — passar disso significa que o início começa a ser esquecido ou cortado.",
            sources: [{ label: "Wikipedia — Large language model", url: "https://en.wikipedia.org/wiki/Large_language_model" }],
          },
        },
        {
          label: "Temperature e top-p",
          summary: "controlam o quanto a resposta varia ou arrisca.",
          example: {
            text: "Pedindo pro modelo completar “o céu é”, o mesmo prompt pode gerar respostas bem diferentes dependendo da temperature:",
            code: 'temperature 0.1 → "o céu é azul."\ntemperature 1.2 → "o céu é um mar invertido de possibilidades."',
            sources: [{ label: "Hugging Face — How to generate text", url: "https://huggingface.co/blog/how-to-generate" }],
          },
        },
        {
          label: "Structured output",
          summary: "forçar o modelo a responder num formato específico, útil quando outro sistema vai ler a resposta.",
          example: {
            text: "Em vez de pedir “me dê o nome e a idade da pessoa” e receber uma frase, você define um schema e força o modelo a devolver exatamente isso:",
            code: '{\n  "nome": "Maria Silva",\n  "idade": 34\n}',
            sources: [{ label: "JSON Schema — site oficial", url: "https://json-schema.org/" }],
          },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Provedores de LLM expõem o modelo como uma API HTTP comum — a engenharia entra no design dessa integração.",
      ],
      bullets: [
        {
          label: "AWS Bedrock, Vertex AI e Azure AI Foundry",
          summary: "são os três caminhos mais comuns hoje pra chamar um LLM gerenciado, cada um com seu próprio catálogo de modelos.",
          links: [
            { name: "AWS Bedrock", url: "https://aws.amazon.com/bedrock/" },
            { name: "Google Vertex AI", url: "https://cloud.google.com/vertex-ai" },
            { name: "Azure AI Foundry", url: "https://azure.microsoft.com/en-us/products/ai-foundry" },
          ],
        },
        {
          label: "LangChain e LangGraph",
          summary: "ajudam a padronizar essa chamada entre provedores diferentes, com retry e fallback automático quando um modelo falha ou demora.",
          links: [
            { name: "LangChain", url: "https://www.langchain.com/" },
            { name: "LangGraph", url: "https://www.langchain.com/langgraph" },
          ],
        },
      ],
    },
    connects: ["genai", "embeddings", "rag"],
  },
  {
    id: "embeddings",
    levelId: 2,
    code: "2.3",
    title: "Embeddings",
    mapLabel: "Embeddings",
    oneLiner: "Transformam texto, imagem ou outros dados em vetores, pra buscar por significado — e não só por palavra exata.",
    everyday: "“Quero cancelar minha assinatura” e “quero encerrar meu plano” são frases diferentes pra um buscador de palavra-chave — mas pra embeddings, ficam quase no mesmo ponto de um mapa de significado.",
    exec: {
      takeaway: "Busca por significado encontra muito mais do que busca por palavra-chave — é o que torna um chatbot de busca/suporte realmente útil.",
      whyItMatters: "Se o seu produto de busca ou suporte ainda é só palavra-chave, há aí uma melhoria de baixo risco e alto impacto.",
    },
    interview: [
      {
        q: "Por que embeddings importam tanto pra busca?",
        a: "Porque busca por palavra-chave exige bater a palavra exata. Busca por embedding compara significado — o que deixa o sistema tolerante a sinônimos, gírias e jeitos diferentes de perguntar a mesma coisa.",
      },
      {
        q: "Dois embeddings de provedores diferentes são compatíveis entre si?",
        a: "Geralmente não. Cada modelo de embedding cria seu próprio espaço vetorial — comparar um vetor do provedor A com um vetor do provedor B não tem significado, mesmo que ambos representem o mesmo texto.",
      },
    ],
    deep: {
      paragraphs: [
        "Duas frases parecidas geram vetores próximos nesse espaço de significado; a distância entre vetores (geralmente similaridade de cosseno) é o que mede quão parecidas duas coisas são.",
      ],
      bullets: [
        {
          label: "Centenas ou milhares de dimensões",
          summary: "“distância”, aqui, é matemática, não geográfica.",
          example: {
            text: "Modelos populares de embedding usam entre 384 e 3072 números por vetor — “cancelar assinatura” não é 2 números, são centenas deles, cada um capturando um aspecto sutil do significado.",
            sources: [{ label: "Wikipedia — Word embedding", url: "https://en.wikipedia.org/wiki/Word_embedding" }],
          },
        },
        {
          label: "Mais dimensões, mais custo",
          summary: "mais nuance capturada, mas também mais espaço e tempo de busca.",
          example: {
            text: "Dobrar as dimensões de um embedding pode melhorar a qualidade da busca, mas também dobra (ou mais) o espaço de armazenamento e o tempo de busca num índice com milhões de vetores.",
            sources: [{ label: "Wikipedia — Word embedding", url: "https://en.wikipedia.org/wiki/Word_embedding" }],
          },
        },
      ],
    },
    snippet: "\u201Cquero cancelar minha conta\u201D \u2192 [0.12, -0.44, 0.91, \u2026]",
    bridge: {
      paragraphs: [
        "Embeddings raramente vivem soltos — quase sempre dentro de algum tipo de banco de vetores.",
      ],
      bullets: [
        {
          label: "Pinecone, Weaviate, Qdrant e pgvector",
          summary: "os três primeiros são bancos de vetores dedicados; pgvector faz a mesma coisa dentro de um Postgres comum.",
          links: [
            { name: "Pinecone", url: "https://www.pinecone.io/" },
            { name: "Weaviate", url: "https://weaviate.io/" },
            { name: "Qdrant", url: "https://qdrant.tech/" },
            { name: "pgvector", url: "https://github.com/pgvector/pgvector" },
          ],
        },
        {
          label: "Bedrock Knowledge Bases e Azure AI Search",
          summary: "já embutem indexação vetorial gerenciada, escondendo o vector database por trás de uma única API.",
          links: [
            { name: "Bedrock Knowledge Bases", url: "https://aws.amazon.com/bedrock/knowledge-bases/" },
            { name: "Azure AI Search", url: "https://azure.microsoft.com/en-us/products/ai-services/ai-search" },
          ],
        },
      ],
    },
    visual: "embedding-cluster",
    connects: ["nn", "llm", "rag"],
  },
  {
    id: "rlhf",
    levelId: 2,
    code: "2.4",
    title: "RLHF, alinhamento e alucinação",
    mapLabel: "RLHF",
    oneLiner: "Por que modelos “inventam” coisas com confiança — e como o treinamento tenta alinhar respostas às preferências humanas.",
    everyday: "É tipo aquele amigo que, quando não sabe a resposta, em vez de admitir, inventa algo plausível com a maior cara de pau. O modelo não está mentindo de propósito — está completando o texto da forma mais fluente possível, com ou sem certeza real.",
    exec: {
      takeaway: "Os modelos são treinados pra parecer confiantes, não pra admitir incerteza — isso é uma escolha de design, não um bug.",
      whyItMatters: "Em qualquer feature voltada pro cliente, pergunte como o time mede e reduz invenções do modelo — “ele parece confiante” não é prova de nada.",
    },
    interview: [
      {
        q: "Por que um LLM alucina mesmo “parecendo confiante”?",
        a: "Porque ele gera a sequência estatisticamente mais provável dado o contexto, sem checar fatos contra uma base externa. RLHF e outras técnicas de alinhamento reduzem esse comportamento, mas não eliminam — por isso RAG e citações ajudam tanto na prática.",
      },
      {
        q: "RLHF elimina o viés do modelo?",
        a: "Não elimina — pode até introduzir viés novo, já que reflete as preferências de quem deu o feedback. RLHF ajusta o modelo na direção das preferências humanas coletadas, que também têm seus próprios pontos cegos.",
      },
    ],
    deep: {
      paragraphs: [
        "RLHF (reinforcement learning from human feedback) treina um modelo de recompensa a partir de comparações humanas entre respostas, e usa esse modelo de recompensa pra ajustar o LLM a preferir respostas mais alinhadas.",
      ],
      bullets: [
        {
          label: "Coleta de preferências",
          summary: "pessoas comparam duas respostas e dizem qual preferem.",
          example: {
            text: "Duas respostas diferentes pra “explique juros compostos” são mostradas a uma pessoa, que marca qual prefere — repetido milhares de vezes, com pessoas diferentes.",
            sources: [{ label: "Wikipedia — Reinforcement learning from human feedback", url: "https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback" }],
          },
        },
        {
          label: "Modelo de recompensa",
          summary: "aprende a prever essa preferência humana.",
          example: {
            text: "Funciona como um “crítico automático”, treinado nas preferências coletadas, capaz de prever sozinho qual resposta um humano provavelmente prefere.",
            sources: [{ label: "Wikipedia — Reinforcement learning from human feedback", url: "https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback" }],
          },
        },
        {
          label: "Ajuste do LLM",
          summary: "usa o modelo de recompensa como sinal pra reforçar respostas parecidas com as preferidas.",
          example: {
            text: "O LLM original é ajustado repetidamente pra gerar respostas que o modelo de recompensa pontuaria bem, até o comportamento mudar de fato.",
            sources: [
              { label: "Wikipedia — Reinforcement learning from human feedback", url: "https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback" },
              { label: "Ouyang et al. — Training language models to follow instructions (InstructGPT, arXiv)", url: "https://arxiv.org/abs/2203.02155" },
            ],
          },
        },
        {
          label: "Limite conhecido",
          summary: "alinha tom e formato; não garante que o conteúdo seja factualmente correto.",
          example: {
            text: "Um modelo pode aprender a “parecer” mais confiável e bem-formatado sem necessariamente estar mais correto — por isso RLHF não substitui verificação factual.",
            sources: [{ label: "Wikipedia — Reinforcement learning from human feedback", url: "https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback" }],
          },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Coletar feedback humano em escala é, na prática, um produto de software, não um detalhe de treino.",
      ],
      bullets: [
        {
          label: "Scale AI e Surge AI",
          summary: "organizam o trabalho humano que alimenta o RLHF de grandes modelos.",
          links: [
            { name: "Scale AI", url: "https://scale.com/" },
            { name: "Surge AI", url: "https://www.surgehq.ai/" },
          ],
        },
        {
          label: "Bedrock Guardrails",
          summary: "e ferramentas parecidas tentam capturar parte do que o alinhamento não resolveu sozinho, filtrando a saída depois que o modelo já respondeu.",
          links: [{ name: "Bedrock Guardrails", url: "https://aws.amazon.com/bedrock/guardrails/" }],
        },
      ],
    },
    connects: ["llm", "rag", "evals"],
  },
  {
    id: "rag",
    levelId: 3,
    code: "3.1",
    title: "RAG: retrieval augmented generation",
    mapLabel: "RAG",
    oneLiner: "Conecta um LLM a uma base de conhecimento externa, buscando o trecho relevante antes de responder.",
    everyday: "Em vez do modelo “decorar” tudo, é como dar pra ele abrir o manual certo na hora da pergunta — ele busca o trecho relevante e responde com base nisso, igual você consultando a documentação antes de responder algo no trabalho.",
    exec: {
      takeaway: "RAG é a forma mais barata e rápida de conectar um modelo a informação que muda com frequência — sem retreinar nada.",
      whyItMatters: "Se alguém propõe fine-tuning pra “ensinar fatos novos” ao modelo, pergunte por que RAG não resolveria mais rápido e mais barato.",
    },
    interview: [
      {
        q: "Quais são os problemas mais comuns de um RAG mal feito?",
        a: "Chunking ruim (pedaços de texto cortados sem sentido), baixa recuperação, contexto demais ou irrelevante, falta de re-ranking, ausência de avaliação e falta de citação da fonte usada.",
      },
      {
        q: "RAG garante que o modelo não vai alucinar?",
        a: "Reduz bastante, mas não garante. Se a recuperação trouxer o trecho errado, ou se o modelo ignorar o contexto fornecido e responder “de memória”, a alucinação ainda pode acontecer.",
      },
    ],
    deep: {
      paragraphs: [
        "Sistemas mais maduros combinam busca por palavra-chave (BM25) com busca vetorial — “busca híbrida” — e usam um passo de re-ranking antes de montar o contexto final.",
      ],
      bullets: [
        {
          label: "Chunking",
          summary: "dividir o documento em pedaços; cortar errado quebra o sentido do trecho.",
          example: {
            text: "Cortar um manual de 50 páginas em pedaços de ~500 palavras, tentando não cortar no meio de uma seção, é chunking. Cortar no meio de uma frase importante é o erro mais comum.",
            sources: [{ label: "Wikipedia — Retrieval-augmented generation", url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" }],
          },
        },
        {
          label: "Indexação",
          summary: "transformar cada pedaço em vetor e guardar num índice de busca.",
          example: {
            text: "Cada pedaço de 500 palavras se transforma num vetor e é guardado, junto com o texto original, num índice que permite achar os vetores mais parecidos rapidamente.",
            sources: [{ label: "Wikipedia — Retrieval-augmented generation", url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" }],
          },
        },
        {
          label: "Busca híbrida",
          summary: "combinar busca exata (BM25) com busca por significado (vetorial).",
          example: {
            text: "Buscar “erro 403” por palavra-chave acha o trecho exato que menciona “403”; buscar por vetor acha trechos sobre “acesso negado” mesmo sem a palavra “403” aparecer — busca híbrida faz as duas e combina os resultados.",
            sources: [{ label: "Wikipedia — Okapi BM25", url: "https://en.wikipedia.org/wiki/Okapi_BM25" }],
          },
        },
        {
          label: "Re-ranking",
          summary: "reordenar os resultados antes de montar o contexto final.",
          example: {
            text: "A busca inicial pode trazer 50 trechos candidatos; um segundo modelo, mais lento mas mais preciso, reordena esses 50 e só os top 5 entram de fato no contexto do LLM.",
            sources: [{ label: "Wikipedia — Retrieval-augmented generation", url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" }],
          },
        },
        {
          label: "Citação",
          summary: "mostrar de onde veio cada trecho usado na resposta.",
          example: { text: "Em vez de só responder, o sistema mostra “de acordo com o manual, seção 4.2” — permitindo a pessoa verificar a fonte, em vez de confiar de olhos fechados." },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Um pipeline de RAG decente parece uma arquitetura de dados clássica, só que o “banco de dados” agora também entende significado.",
      ],
      bullets: [
        {
          label: "Bedrock Knowledge Bases e Azure AI Search",
          summary: "(RAG nativo do Azure AI Foundry) eliminam boa parte do trabalho de montar um vector database à mão.",
          links: [
            { name: "Bedrock Knowledge Bases", url: "https://aws.amazon.com/bedrock/knowledge-bases/" },
            { name: "Azure AI Search", url: "https://azure.microsoft.com/en-us/products/ai-services/ai-search" },
          ],
        },
        {
          label: "LangChain, LlamaIndex ou Haystack",
          summary: "cuidam do chunking, da busca híbrida e do re-ranking quando o RAG é feito na mão.",
          links: [
            { name: "LangChain", url: "https://www.langchain.com/" },
            { name: "LlamaIndex", url: "https://www.llamaindex.ai/" },
            { name: "Haystack", url: "https://haystack.deepset.ai/" },
          ],
        },
      ],
    },
    visual: "rag-flow",
    connects: ["embeddings", "llm", "agents"],
  },
  {
    id: "agents",
    levelId: 3,
    code: "3.2",
    title: "Agents",
    mapLabel: "Agents",
    oneLiner: "Um agent usa um modelo para decidir os próximos passos, chamar ferramentas e completar tarefas em várias etapas.",
    everyday: "É a diferença entre pedir “leia esse contrato e me diga se tem problema” (um passo fixo) e pedir “resolve esse problema com o cliente” (um agent) — no segundo caso, alguém decide os passos: talvez precise consultar um sistema, ligar pro financeiro, tentar de novo se algo falhar.",
    exec: {
      takeaway: "Um agent decide os próprios passos — o que dá flexibilidade, mas também tira previsibilidade.",
      whyItMatters: "Pra qualquer tarefa com caminho conhecido e repetitivo, um workflow fixo é mais barato e mais fácil de auditar do que um agent.",
    },
    interview: [
      {
        q: "Quando vale usar um agent em vez de um workflow tradicional?",
        a: "Quando o caminho da tarefa não é totalmente previsível de antemão. Se o processo é sempre o mesmo, um workflow fixo costuma ser mais barato, mais controlável e mais fácil de depurar.",
      },
      {
        q: "Qual o maior risco de um agent mal limitado?",
        a: "Ficar em loop chamando ferramentas sem progredir — ou, pior, tomar uma ação irreversível (apagar, enviar, comprar) baseado numa decisão errada, sem um humano revisando antes.",
      },
    ],
    deep: {
      paragraphs: [
        "O loop básico de um agent: objetivo → raciocínio → ação com uma ferramenta → observação do resultado → próxima ação → repete até concluir ou desistir.",
      ],
      bullets: [
        {
          label: "Custo e risco por chamada",
          summary: "cada chamada de ferramenta custa tempo, talvez dinheiro, e tem risco real.",
          example: {
            text: "Cada vez que um agent chama uma API de envio de e-mail, isso custa tempo, talvez dinheiro (se a API for paga), e tem risco real — mandar o e-mail errado pra pessoa errada, por exemplo.",
            sources: [{ label: "Wikipedia — Intelligent agent", url: "https://en.wikipedia.org/wiki/Intelligent_agent" }],
          },
        },
        {
          label: "Limites claros",
          summary: "número máximo de tentativas, timeout, e uma saída segura quando algo dá errado.",
          example: { text: "Um agent bem desenhado, depois de 5 tentativas falhas de resolver algo, para e devolve “não consegui resolver, aqui está o que tentei” — em vez de ficar girando indefinidamente." },
        },
        {
          label: "Padrão ReAct",
          summary: "raciocínio + ação é o esqueleto mais comum por trás desse loop.",
          example: {
            text: "Um agent respondendo “quanto custa o produto X” usando esse padrão:",
            code: "Pensamento: preciso saber o preço atual do produto\nAção: chamar_api_precos(produto_id=123)\nObservação: preço = R$89,90\nPensamento: agora posso responder\nResposta final: o produto custa R$89,90",
            sources: [{ label: "Yao et al. — ReAct: Synergizing Reasoning and Acting in Language Models (arXiv)", url: "https://arxiv.org/abs/2210.03629" }],
          },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Orquestrar um agent em produção se parece com orquestrar microsserviços — só que quem decide a próxima chamada é o próprio modelo.",
      ],
      bullets: [
        {
          label: "Vertex AI Agent Builder e Azure AI Foundry (Semantic Kernel)",
          summary: "são versões gerenciadas desse loop, com o ADK do Google como kit de desenvolvimento de agents.",
          links: [
            { name: "Vertex AI Agent Builder", url: "https://cloud.google.com/products/agent-builder" },
            { name: "Agent Development Kit (ADK)", url: "https://google.github.io/adk-docs/" },
            { name: "Semantic Kernel", url: "https://github.com/microsoft/semantic-kernel" },
          ],
        },
        {
          label: "Protocolo A2A (agent-to-agent)",
          summary: "anunciado pelo Google em 2025 e hoje sob governança da Linux Foundation, foi pensado pra agents de provedores diferentes conseguirem conversar entre si.",
          links: [{ name: "A2A Protocol", url: "https://a2a-protocol.org" }],
        },
      ],
    },
    visual: "agent-loop",
    connects: ["llm", "context", "tools"],
  },
  {
    id: "context",
    levelId: 3,
    code: "3.3",
    title: "Context engineering",
    mapLabel: "Context eng.",
    oneLiner: "A disciplina de montar o melhor contexto possível pra um modelo antes de pedir uma tarefa.",
    everyday: "É organizar a mesa de trabalho do modelo antes de pedir uma tarefa: que instruções deixar à mão, que histórico trazer, que documentos abrir, que ferramentas deixar ao alcance. Um modelo brilhante com a mesa desorganizada erra; um modelo simples com contexto bem montado acerta.",
    exec: {
      takeaway: "O que você coloca no contexto do modelo importa tanto quanto qual modelo você usa.",
      whyItMatters: "Antes de trocar de modelo pra resolver um problema de qualidade, pergunte se o problema não é no que está (ou não está) sendo passado pro modelo.",
    },
    interview: [
      {
        q: "Context engineering é só um nome chique pra “escrever um bom prompt”?",
        a: "É mais do que isso. Prompt é só uma das quatro peças — as outras são memória (preferências e histórico relevantes), ferramentas disponíveis e contexto recuperado de uma busca. Context engineering decide o que entra, o que fica de fora, e em que ordem.",
      },
      {
        q: "Mais contexto é sempre melhor?",
        a: "Não — contexto demais ou irrelevante pode confundir o modelo e custa mais tokens. O objetivo é o contexto certo, não o contexto máximo.",
      },
    ],
    deep: {
      paragraphs: [
        "Como o context window é limitado e caro, parte do trabalho é decidir o que cortar: resumir histórico antigo, priorizar os trechos mais relevantes de uma busca, evitar repetir instruções já seguidas.",
      ],
      bullets: [
        {
          label: "Prompt",
          summary: "a instrução explícita da tarefa.",
          example: {
            text: "“Resuma esse contrato em 3 bullets, focando em valores e prazos” é o prompt — a instrução explícita da tarefa.",
            sources: [{ label: "Wikipedia — Prompt engineering", url: "https://en.wikipedia.org/wiki/Prompt_engineering" }],
          },
        },
        {
          label: "Memory",
          summary: "preferências e histórico relevante da pessoa ou da conversa.",
          example: { text: "O sistema lembrar que você prefere respostas curtas, ou que mencionou “sou advogado” 10 mensagens atrás, é memory." },
        },
        {
          label: "Tools",
          summary: "quais ferramentas o modelo pode acionar nessa tarefa.",
          example: { text: "Permitir que o modelo chame uma calculadora ou consulte um CRM, em vez de só responder com o que já sabe, é dar tools." },
        },
        {
          label: "Retrieved context",
          summary: "documentos ou dados trazidos por uma busca, geralmente via RAG.",
          example: {
            text: "Os 3 trechos de um manual técnico que voltaram de uma busca, pra responder uma pergunta específica, são retrieved context.",
            sources: [{ label: "Wikipedia — Retrieval-augmented generation", url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" }],
          },
        },
        {
          label: "Compactação",
          summary: "resumir ou descartar partes do contexto quando ele cresce demais.",
          example: { text: "Numa conversa de 2 horas, resumir as primeiras 50 mensagens num parágrafo, em vez de mandar tudo de novo a cada chamada, é compactação." },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Montar contexto bem geralmente significa integrar várias fontes — um problema de integração de sistemas, não só de IA.",
      ],
      bullets: [
        {
          label: "Salesforce, HubSpot, SharePoint, Google Drive e Notion",
          summary: "são as fontes mais comuns de contexto recuperado num produto real (CRMs e bases de documentos).",
          links: [
            { name: "Salesforce", url: "https://www.salesforce.com/" },
            { name: "HubSpot", url: "https://www.hubspot.com/" },
            { name: "SharePoint", url: "https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration" },
            { name: "Google Drive", url: "https://www.google.com/drive/" },
            { name: "Notion", url: "https://www.notion.com/" },
          ],
        },
        {
          label: "Azure AI Foundry e AWS Bedrock",
          summary: "têm conectores nativos pro SharePoint e pro S3, respectivamente — onde seus documentos já vivem chega a influenciar a escolha de provedor.",
          links: [
            { name: "Azure AI Foundry", url: "https://azure.microsoft.com/en-us/products/ai-foundry" },
            { name: "AWS Bedrock", url: "https://aws.amazon.com/bedrock/" },
          ],
        },
      ],
    },
    visual: "context-quadrant",
    connects: ["llm", "rag", "agents"],
  },
  {
    id: "tools",
    levelId: 3,
    code: "3.4",
    title: "Tools, function calling e MCP",
    mapLabel: "Tools / MCP",
    oneLiner: "Dar ao modelo acesso a sistemas externos — uma API, um banco, uma calculadora — em vez de pedir pra ele adivinhar a resposta.",
    everyday: "É dar uma calculadora pro modelo em vez de pedir pra ele “fazer conta de cabeça”: ele aciona uma ferramenta real, recebe o resultado certo, e usa isso na resposta — em vez de chutar um número que parece plausível.",
    exec: {
      takeaway: "Dar ferramentas certas ao modelo é mais barato do que esperar que ele “saiba” tudo de cabeça.",
      whyItMatters: "Se um modelo está errando contas ou dados que já existem em algum sistema seu, a resposta costuma ser conectar uma ferramenta, não trocar de modelo.",
    },
    interview: [
      {
        q: "O que é o MCP (model context protocol)?",
        a: "É um protocolo padrão pra conectar modelos a ferramentas e fontes de dados externas, em vez de cada aplicação inventar sua própria integração do zero. Pense nele como um plugue universal entre modelos e ferramentas.",
      },
      {
        q: "O que pode dar errado se o schema de uma ferramenta for mal descrito?",
        a: "O modelo chama a ferramenta certa com o argumento errado, ou chama a ferramenta errada pra tarefa — porque ele decide com base na descrição, não no código por trás.",
      },
    ],
    deep: {
      paragraphs: [
        "Function calling funciona assim: você descreve as ferramentas disponíveis (nome, parâmetros, o que cada uma faz); o modelo decide qual chamar e com quais argumentos; o resultado real volta pro modelo continuar a tarefa.",
      ],
      bullets: [
        {
          label: "Schema da ferramenta",
          summary: "nome, descrição e parâmetros; quanto mais claro, menos o modelo erra.",
          example: {
            text: "Quanto mais clara a descrição e os parâmetros, menos o modelo erra ao decidir chamar essa ferramenta:",
            code: '{\n  "name": "buscar_pedido",\n  "description": "Busca o status de um pedido pelo número",\n  "parameters": { "numero_pedido": "string" }\n}',
            sources: [{ label: "JSON Schema — site oficial", url: "https://json-schema.org/" }],
          },
        },
        {
          label: "Validação",
          summary: "nunca confiar 100% no argumento gerado pelo modelo.",
          example: { text: "Se o modelo chamar buscar_pedido com um valor estranho no número do pedido, o backend ainda precisa validar isso como faria com input de usuário — nunca assumir que o modelo só vai mandar valores “limpos”." },
        },
        {
          label: "MCP",
          summary: "um jeito padronizado de expor ferramentas, em vez de cada produto inventar sua própria integração.",
          example: {
            text: "Em vez de escrever uma integração específica pra cada combinação de modelo e ferramenta, o MCP define um formato padrão — parecido com o que o USB fez pros periféricos: um conector universal.",
            sources: [{ label: "Model Context Protocol — site oficial", url: "https://modelcontextprotocol.io/" }],
          },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Function calling expõe sua API interna pro modelo decidir usar — toda boa prática de design de API ainda importa, só que agora quem chama pode ser um modelo.",
      ],
      bullets: [
        {
          label: "MCP",
          summary: "virou o padrão mais comum pra conectar um modelo a ferramentas externas sem reinventar a integração a cada projeto.",
          links: [{ name: "Model Context Protocol", url: "https://modelcontextprotocol.io/" }],
        },
        {
          label: "Protocolo A2A (agent-to-agent)",
          summary: "anunciado em 2025, resolve um problema vizinho: agents de empresas ou provedores diferentes conseguirem se comunicar entre si.",
          links: [{ name: "A2A Protocol", url: "https://a2a-protocol.org" }],
        },
      ],
    },
    connects: ["agents", "context"],
  },
  {
    id: "evals",
    levelId: 4,
    code: "4.1",
    title: "Evaluation e harness engineering",
    mapLabel: "Evaluation",
    oneLiner: "Sem avaliação sistemática, desenvolvimento de produto com IA vira tentativa e erro.",
    everyday: "É o controle de qualidade de uma fábrica: sem inspeção, você só descobre o defeito quando o cliente reclama. Avaliação automatizada é testar antes de cada mudança ir pro ar.",
    exec: {
      takeaway: "Sem avaliação automatizada, cada mudança de prompt é um chute às escuras.",
      whyItMatters: "Pergunte ao time como eles sabem que uma mudança melhorou as coisas — “parece melhor” não é uma métrica.",
    },
    interview: [
      {
        q: "Que tipo de coisa um harness de avaliação mede, além de “a resposta tá certa”?",
        a: "Qualidade (groundedness, completude), operação (custo, latência, tokens), segurança (vazamento de dados, prompt injection) e comparação entre experimentos (prompt A vs B, modelo X vs Y, chunking diferente).",
      },
      {
        q: "Por que “parece melhor” não é uma forma confiável de avaliar um modelo?",
        a: "Porque é subjetivo, não é repetível, e não escala — duas pessoas podem discordar, e ninguém consegue testar centenas de casos “no olho” a cada mudança.",
      },
    ],
    deep: {
      paragraphs: [
        "Um bom harness roda automaticamente a cada mudança relevante — não “parece melhor pro meu olho”, mas um conjunto de casos de teste com critério objetivo, repetível, comparável ao longo do tempo.",
      ],
      bullets: [
        {
          label: "Qualidade",
          summary: "groundedness, completude, factualidade.",
          example: { text: "Rodar 200 perguntas conhecidas e medir quantas respostas citam corretamente a fonte, em vez de inventar." },
        },
        {
          label: "Operação",
          summary: "custo, latência, taxa de erro.",
          example: { text: "Medir que o custo médio por chamada subiu de R$0,02 pra R$0,08 depois de uma mudança de prompt — antes que isso vire surpresa na fatura do mês." },
        },
        {
          label: "Segurança",
          summary: "vazamento de dados, suscetibilidade a prompt injection.",
          example: {
            text: "Testar deliberadamente frases de prompt injection conhecidas, pra ver se o sistema ainda obedece instruções escondidas num documento.",
            sources: [{ label: "OWASP Top 10 for LLM Applications", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/" }],
          },
        },
        {
          label: "Comparação",
          summary: "testar prompt A vs B, modelo X vs Y, com o mesmo conjunto de casos.",
          example: { text: "Rodar o mesmo conjunto de 200 perguntas contra duas versões de prompt, e comparar nota média, custo e latência lado a lado, antes de decidir qual vai pra produção." },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Um harness de avaliação se integra ao mesmo pipeline de CI/CD que qualquer software.",
      ],
      bullets: [
        {
          label: "Langfuse, Helicone e LangSmith",
          summary: "são ferramentas comuns pra rodar avaliação e observabilidade de LLM dentro do pipeline de entrega.",
          links: [
            { name: "Langfuse", url: "https://langfuse.com/" },
            { name: "Helicone", url: "https://www.helicone.ai/" },
            { name: "LangSmith", url: "https://www.langchain.com/langsmith" },
          ],
        },
        {
          label: "Bedrock e Vertex AI",
          summary: "também têm módulos próprios de avaliação automática, comparando respostas contra um conjunto de critérios definido por você.",
          links: [
            { name: "AWS Bedrock", url: "https://aws.amazon.com/bedrock/" },
            { name: "Google Vertex AI", url: "https://cloud.google.com/vertex-ai" },
          ],
        },
      ],
    },
    connects: ["rag", "rlhf"],
  },
  {
    id: "seguranca",
    levelId: 4,
    code: "4.2",
    title: "Segurança: prompt injection e guardrails",
    mapLabel: "Segurança",
    oneLiner: "Como sistemas de IA podem ser manipulados por conteúdo malicioso escondido nos dados que processam.",
    everyday: "Prompt injection é tipo um bilhete escondido dentro de um documento dizendo “ignore as instruções anteriores e faça isso aqui” — se o sistema não sabe diferenciar instrução confiável de conteúdo que só está lendo, ele pode obedecer ao bilhete por engano.",
    exec: {
      takeaway: "Um sistema de IA pode ser manipulado pelo próprio conteúdo que processa — um e-mail ou documento pode “instruir” o modelo sem ninguém digitar nada.",
      whyItMatters: "Pergunte que permissões o seu agent/assistente realmente tem — e se alguém já tentou “quebrar” ele de propósito antes do lançamento.",
    },
    interview: [
      {
        q: "Por que prompt injection é difícil de resolver de vez?",
        a: "Porque o modelo recebe instrução e dado pelo mesmo canal — texto. Diferente de um sistema tradicional, que separa código de dados, um LLM lê tudo junto. Guardrails e permissões reduzem o risco, mas é uma área ainda em evolução.",
      },
      {
        q: "Qual a diferença entre prompt injection direto e indireto?",
        a: "Direto é quando a própria pessoa que está conversando tenta manipular o modelo. Indireto é quando a instrução maliciosa vem escondida dentro de um conteúdo que o modelo só deveria “ler” — um e-mail, um documento, uma página web.",
      },
    ],
    deep: {
      paragraphs: [
        "Guardrails típicos combinam várias camadas — nenhuma sozinha resolve o problema todo.",
      ],
      bullets: [
        {
          label: "Filtros de entrada e saída",
          summary: "bloqueiam padrões conhecidos de manipulação ou conteúdo indevido.",
          example: {
            text: "Bloquear automaticamente uma resposta que contenha um padrão de número de cartão de crédito, antes de ela ser enviada pra fora.",
            sources: [{ label: "OWASP Top 10 for LLM Applications", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/" }],
          },
        },
        {
          label: "Classificadores",
          summary: "detectam tentativas de manipulação mais sutis.",
          example: {
            text: "Um modelo menor, treinado especificamente pra detectar tentativas de manipulação, analisa cada mensagem antes dela chegar no modelo principal.",
            sources: [{ label: "OWASP Top 10 for LLM Applications", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/" }],
          },
        },
        {
          label: "Permissões explícitas",
          summary: "um agent só deveria ter acesso ao que realmente precisa.",
          example: {
            text: "Um agent de atendimento pode ter acesso pra “consultar pedido”, mas não pra “processar reembolso” — mesmo que a mesma API tenha as duas opções.",
            sources: [{ label: "Wikipedia — Principle of least privilege", url: "https://en.wikipedia.org/wiki/Principle_of_least_privilege" }],
          },
        },
        {
          label: "Auditoria",
          summary: "registrar tudo que foi executado.",
          example: { text: "Guardar um log de “em 14/06, o agent X chamou a ferramenta Y com o argumento Z” — pra poder reconstruir o que aconteceu se algo der errado." },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Segurança de agents reaproveita conceitos clássicos de infraestrutura, agora aplicados a um sistema que decide por conta própria.",
      ],
      bullets: [
        {
          label: "Bedrock Guardrails e Azure AI Foundry",
          summary: "(filtros de conteúdo) são a versão gerenciada dessa camada de proteção.",
          links: [
            { name: "Bedrock Guardrails", url: "https://aws.amazon.com/bedrock/guardrails/" },
            { name: "Azure AI Foundry", url: "https://azure.microsoft.com/en-us/products/ai-foundry" },
          ],
        },
        "Princípios de IAM (papel com permissão mínima) se aplicam direto a um agent: ele só deveria ter acesso às ferramentas que realmente precisa pra tarefa.",
      ],
    },
    connects: ["agents", "evals"],
  },
  {
    id: "infra",
    levelId: 4,
    code: "4.3",
    title: "AI infrastructure",
    mapLabel: "Infraestrutura",
    oneLiner: "A camada que mantém um produto de IA de pé quando todo mundo usa ao mesmo tempo.",
    everyday: "É a diferença entre cozinhar pra 4 pessoas em casa e abastecer um restaurante lotado: a receita (o modelo) é a mesma, mas a cozinha (a infraestrutura) precisa ser outra — senão o serviço trava.",
    exec: {
      takeaway: "O que funciona bem pra 10 usuários simultâneos pode quebrar com 1.000 — infraestrutura de IA não escala sozinha.",
      whyItMatters: "Antes de prometer um prazo de lançamento, pergunte se alguém testou o sistema sob carga real, não só no ambiente de desenvolvimento.",
    },
    interview: [
      {
        q: "O que normalmente quebra primeiro quando um produto de IA escala?",
        a: "Latência sob carga (sem cache ou batching adequado), custo (sem controle de tokens) e observabilidade — sem saber o que o modelo respondeu, é difícil descobrir por que algo deu errado.",
      },
      {
        q: "Por que observabilidade importa tanto em produtos de IA?",
        a: "Porque o comportamento do modelo não é 100% determinístico — sem registrar prompts, respostas e custo por chamada, é quase impossível investigar por que algo deu errado depois do fato.",
      },
    ],
    deep: {
      paragraphs: [
        "Quatro frentes principais sustentam um produto de IA em produção, cada uma com suas próprias ferramentas e responsáveis.",
      ],
      bullets: [
        {
          label: "Serving",
          summary: "como as chamadas chegam até o modelo.",
          example: { text: "Um API gateway limitando cada usuário a 10 chamadas por minuto, pra um usuário não esgotar a cota de todo mundo." },
        },
        {
          label: "Inference",
          summary: "o que acontece durante a geração.",
          example: { text: "Agrupar 8 requisições que chegaram quase juntas e processá-las numa única passada pela GPU (batching), em vez de uma por vez." },
        },
        {
          label: "Observability",
          summary: "o que fica registrado.",
          example: { text: "Um dashboard mostrando que 2% das chamadas da última hora demoraram mais de 10 segundos — e permitindo abrir o trace de uma delas pra ver onde o tempo foi gasto." },
        },
        {
          label: "Governança",
          summary: "PII, auditoria, versionamento e compliance.",
          example: { text: "Garantir que nenhum dado de cliente de um país com lei de proteção de dados específica saia da região de cloud designada pra ele." },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Essa é a camada mais “cloud” de todas — o que muda é quanto dela você opera versus quanto terceiriza.",
      ],
      bullets: [
        {
          label: "Kubernetes (EKS, GKE, AKS)",
          summary: "continua sendo a base pra quem serve modelo próprio; quem usa modelo gerenciado terceiriza boa parte dessa camada.",
          links: [
            { name: "Kubernetes", url: "https://kubernetes.io/" },
            { name: "Amazon EKS", url: "https://aws.amazon.com/eks/" },
            { name: "Google GKE", url: "https://cloud.google.com/kubernetes-engine" },
            { name: "Azure AKS", url: "https://azure.microsoft.com/en-us/products/kubernetes-service" },
          ],
        },
        {
          label: "Datadog e Grafana",
          summary: "(ou os dashboards nativos de cada cloud) mantêm o sistema de pé sob carga real, junto com autoscaling de GPU sob demanda.",
          links: [
            { name: "Datadog", url: "https://www.datadoghq.com/" },
            { name: "Grafana", url: "https://grafana.com/" },
          ],
        },
      ],
    },
    visual: "infra-stack",
    connects: ["evals", "custo"],
  },
  {
    id: "custo",
    levelId: 4,
    code: "4.4",
    title: "Custo e performance",
    mapLabel: "Custo",
    oneLiner: "Por que rodar IA em produção custa o que custa — e o que dá pra fazer sobre isso.",
    everyday: "Quantização é tipo salvar uma foto em qualidade “boa” em vez de “máxima”: ocupa bem menos espaço, carrega mais rápido, e na prática quase ninguém percebe diferença.",
    exec: {
      takeaway: "O custo de IA em produção varia muito com volume de uso — o que parecia barato no piloto pode não ser barato em escala.",
      whyItMatters: "Peça uma projeção de custo por usuário ativo, não só o custo total do piloto, antes de aprovar o lançamento.",
    },
    interview: [
      {
        q: "O que mais pesa no custo de rodar um LLM?",
        a: "Volume de tokens de entrada e saída, o modelo escolhido e o número de chamadas. Por isso cache, batching e quantização importam tanto — cada um ataca uma parte diferente dessa conta.",
      },
      {
        q: "Quantização sempre piora a qualidade do modelo?",
        a: "Piora um pouco, mas geralmente pouco — a perda costuma ser pequena comparada à economia de memória e velocidade, por isso é tão usada em produção.",
      },
    ],
    deep: {
      paragraphs: [
        "Cada uma dessas técnicas ataca uma parte diferente da conta de custo:",
      ],
      bullets: [
        {
          label: "Tokens de entrada e saída",
          summary: "o fator que mais varia de chamada pra chamada.",
          example: { text: "Uma resposta de 500 palavras gera bem mais tokens de saída do que uma pergunta de 10 palavras gera de entrada — e o token de saída geralmente custa mais caro que o de entrada." },
        },
        {
          label: "KV cache",
          summary: "evita recalcular do zero a atenção sobre tokens já processados.",
          example: { text: "Numa conversa de 20 mensagens, sem KV cache o modelo reprocessaria as 19 mensagens anteriores a cada nova pergunta; com cache, ele só processa o que é novo." },
        },
        {
          label: "Batching",
          summary: "processar várias requisições juntas aproveita melhor a GPU.",
          example: { text: "Servir 100 usuários simultâneos numa GPU, agrupando as requisições que chegam no mesmo intervalo de tempo, em vez de uma fila estritamente sequencial." },
        },
        {
          label: "Quantização",
          summary: "reduz a precisão numérica do modelo pra rodar mais rápido e mais barato.",
          example: { text: "Um modelo de 70 bilhões de parâmetros em 16 bits ocupa ~140GB de memória; em 4 bits, menos de 40GB — rodando em menos GPUs, com perda de qualidade geralmente pequena." },
        },
        {
          label: "Mixture of experts (MoE)",
          summary: "ativa só uma fração da rede por token.",
          example: { text: "Um modelo MoE com 8 “especialistas” pode ter o tamanho total de um modelo gigante, mas ativar só 1-2 por token — como ter vários médicos especialistas no prédio, mas só chamar o cardiologista quando o caso é do coração." },
        },
      ],
    },
    bridge: {
      paragraphs: [
        "Decisões de custo de IA hoje entram direto no FinOps, como qualquer outro custo de infraestrutura.",
      ],
      bullets: [
        {
          label: "Bedrock, Vertex AI e Azure AI Foundry",
          summary: "trocam flexibilidade por preço mais previsível, com provisioned throughput, instâncias reservadas de GPU e contratos de capacidade.",
          links: [
            { name: "AWS Bedrock", url: "https://aws.amazon.com/bedrock/" },
            { name: "Google Vertex AI", url: "https://cloud.google.com/vertex-ai" },
            { name: "Azure AI Foundry", url: "https://azure.microsoft.com/en-us/products/ai-foundry" },
          ],
        },
        "FinOps pra IA hoje é quase uma especialidade própria: monitorar custo por chamada, por usuário, por funcionalidade — não só o total da conta.",
      ],
    },
    connects: ["infra", "llm"],
  },
];

const QUIZ = [
  {
    q: "Qual a diferença entre machine learning e deep learning?",
    a: "Deep learning é uma subárea de ML que usa redes neurais com muitas camadas. Todo deep learning é ML, mas nem todo ML é deep learning.",
  },
  {
    q: "Fine-tuning é sempre melhor que RAG pra ensinar algo novo ao modelo?",
    a: "Não. Pra conhecimento dinâmico ou que muda com frequência, RAG costuma ser mais simples, barato e fácil de atualizar. Fine-tuning muda o comportamento geral do modelo, não injeta fatos pontuais com facilidade.",
  },
  {
    q: "Por que um LLM alucina mesmo “parecendo confiante”?",
    a: "Porque ele gera a sequência de texto estatisticamente mais provável dado o contexto, sem checar fatos contra uma base — não é mentira intencional, é previsão sem verificação.",
  },
  {
    q: "Quando vale mais usar um agent do que um workflow fixo?",
    a: "Quando o caminho da tarefa não é previsível de antemão. Se o processo é sempre o mesmo, um workflow tradicional é mais barato, controlável e fácil de depurar.",
  },
  {
    q: "O que mais pesa no custo de rodar um LLM em produção?",
    a: "Volume de tokens de entrada e saída, modelo escolhido e número de chamadas — por isso cache, batching e quantização importam tanto.",
  },
];

function getTopic(id) {
  return TOPICS.find((t) => t.id === id);
}

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return url;
  }
}

/* ============================================================================
   MAPA MENTAL DE IA
   Independente do conteúdo da trilha — uma árvore de caixas que começam
   todas recolhidas. Categorias (com mais coisa dentro) ficam com borda
   pontilhada; itens-folha são simples. Relações entre itens de partes
   diferentes da árvore aparecem como uma linha pontilhada calculada em
   tempo real — não como coordenada fixa, já que abrir/fechar caixas
   empurra tudo no layout.
   ============================================================================ */

const AI_TREE = [
  {
    id: "ml",
    label: "Machine learning",
    top: "teal",
    children: [
      { id: "sup", label: "Supervisionado" },
      { id: "unsup", label: "Não supervisionado" },
      { id: "reforco", label: "Por reforço", rel: "llm" },
      { id: "arvores", label: "Árvores e regressão" },
      {
        id: "dl",
        label: "Deep learning",
        children: [
          { id: "neuronios", label: "Neurônios e camadas" },
          { id: "backprop", label: "Backpropagation", rel: "sup" },
          { id: "ativacao", label: "Função de ativação" },
          { id: "cnn", label: "Redes convolucionais", rel: "imagem" },
          {
            id: "genai",
            label: "IA generativa",
            children: [
              { id: "llm", label: "LLM", rel: "reforco" },
              {
                id: "rag",
                label: "RAG",
                children: [
                  { id: "docs", label: "Documentos" },
                  { id: "emb", label: "Embeddings" },
                  { id: "vdb", label: "Vector DB" },
                ],
              },
              { id: "ctxeng", label: "Context engineering" },
              {
                id: "agentenode",
                label: "Agente",
                children: [
                  { id: "memoryeng", label: "Memory engineering" },
                  { id: "skillsnode", label: "Skills" },
                ],
              },
              { id: "harnesseng", label: "Harness engineering" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "visao",
    label: "Visão e percepção",
    top: "violet",
    children: [
      { id: "imagem", label: "Reconhecimento de imagem", rel: "cnn" },
      { id: "objetos", label: "Detecção de objetos" },
      { id: "segmentacao", label: "Segmentação de imagem" },
      { id: "voz", label: "Reconhecimento de voz" },
    ],
  },
];

const AI_LINKS = [
  ["reforco", "llm"],
  ["backprop", "sup"],
  ["cnn", "imagem"],
];

const AI_INDEX = {};
(function flattenTree(nodes, parent) {
  nodes.forEach((n) => {
    AI_INDEX[n.id] = { node: n, parent };
    if (n.children) flattenTree(n.children, n.id);
  });
})(AI_TREE, null);

function CatBox({ node, depth, openIds, onToggle, onGoTo, registerRef, flashId }) {
  const hasChildren = !!node.children;

  if (!hasChildren) {
    const relTarget = node.rel && AI_INDEX[node.rel] ? AI_INDEX[node.rel].node : null;
    return (
      <div
        className={"leaf-box" + (flashId === node.id ? " flash" : "")}
        ref={(el) => registerRef(node.id, el)}
      >
        <span>{node.label}</span>
        {relTarget && (
          <button
            type="button"
            className="rel-btn"
            onClick={() => onGoTo(node.rel)}
            aria-label={"relaciona-se com " + relTarget.label}
            title={"relaciona-se com " + relTarget.label}
          >
            <ArrowLeftRight size={13} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  const isTop = depth === 0;
  const open = openIds.has(node.id);
  const className =
    "cat-box" + (isTop ? " cat-top top-" + node.top : " cat-sub") + (open ? " open" : "");

  return (
    <div className={className} ref={(el) => registerRef(node.id, el)}>
      <button type="button" className="cat-header" onClick={() => onToggle(node.id)}>
        <span className="cat-title">{node.label}</span>
        <span className="cat-meta">
          {node.children.length} {node.children.length === 1 ? "item" : "itens"}
          <ChevronRight size={14} className="cat-chevron" aria-hidden="true" />
        </span>
      </button>
      {open && (
        <div className="cat-body">
          {node.children.map((child) => (
            <CatBox
              key={child.id}
              node={child}
              depth={depth + 1}
              openIds={openIds}
              onToggle={onToggle}
              onGoTo={onGoTo}
              registerRef={registerRef}
              flashId={flashId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AiMindmap() {
  const [openIds, setOpenIds] = useState(new Set());
  const [lines, setLines] = useState([]);
  const [flash, setFlash] = useState(null);
  const wrapRef = useRef(null);
  const nodeRefs = useRef({});

  const registerRef = (id, el) => {
    nodeRefs.current[id] = el;
  };

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAncestors = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      let current = AI_INDEX[id] && AI_INDEX[id].parent;
      while (current) {
        next.add(current);
        current = AI_INDEX[current] && AI_INDEX[current].parent;
      }
      return next;
    });
  };

  const goTo = (id) => {
    expandAncestors(id);
    setFlash(id);
    window.setTimeout(() => {
      const el = nodeRefs.current[id];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    window.setTimeout(() => setFlash(null), 1300);
  };

  useEffect(() => {
    const recalc = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wrapRect = wrap.getBoundingClientRect();
      const next = [];
      AI_LINKS.forEach(([a, b]) => {
        const elA = nodeRefs.current[a];
        const elB = nodeRefs.current[b];
        if (!elA || !elB || elA.offsetParent === null || elB.offsetParent === null) return;
        const rA = elA.getBoundingClientRect();
        const rB = elB.getBoundingClientRect();
        next.push({
          id: a + "-" + b,
          x1: rA.left + rA.width / 2 - wrapRect.left,
          y1: rA.top + rA.height / 2 - wrapRect.top,
          x2: rB.left + rB.width / 2 - wrapRect.left,
          y2: rB.top + rB.height / 2 - wrapRect.top,
        });
      });
      setLines(next);
    };
    recalc();
    const t = window.setTimeout(recalc, 80);
    window.addEventListener("resize", recalc);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", recalc);
    };
  }, [openIds]);

  return (
    <section className="arch-map-section">
      <div className="mindmap-wrap" ref={wrapRef}>
        <svg className="mindmap-lines" aria-hidden="true">
          {lines.map((l) => (
            <line key={l.id} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </svg>
        <div className="ai-root">
          <span className="ai-root-label">AI</span>
          <div className="cat-row">
            {AI_TREE.map((node) => (
              <CatBox
                key={node.id}
                node={node}
                depth={0}
                openIds={openIds}
                onToggle={toggle}
                onGoTo={goTo}
                registerRef={registerRef}
                flashId={flash}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="arch-map-hint">
        Clique num bloco pra abrir o que tem dentro. O ícone de seta dupla mostra conceitos
        relacionados em outra parte do mapa — clique nele pra ir direto até lá.
      </p>
    </section>
  );
}

/* ============================================================================
   DIAGRAMAS — compartilhados pelos dois modos (mesmo desenho, mesmo lugar).
   ============================================================================ */

function NestedCirclesDiagram() {
  const cx = 190, cy = 130;
  const rings = [
    { r: 110, op: 0.35, label: "IA", sub: "campo amplo", ly: 40 },
    { r: 82, op: 0.55, label: "Machine learning", sub: "aprende com dados", ly: 80 },
    { r: 56, op: 0.78, label: "Deep learning", sub: "redes neurais profundas", ly: 120 },
    { r: 30, op: 1, label: "IA generativa", sub: "cria conteúdo novo", ly: 160 },
  ];
  return (
    <svg width="100%" viewBox="0 0 560 260" role="img" aria-label="Diagrama de círculos concêntricos mostrando IA, machine learning, deep learning e IA generativa, cada um dentro do anterior">
      {rings.map((ring, i) => {
        const angle = Math.PI / 4;
        const sx = cx + ring.r * Math.cos(angle);
        const sy = cy - ring.r * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke="var(--teal)" strokeOpacity={ring.op} strokeWidth="1.5" />
            <circle cx={sx} cy={sy} r="2.5" fill="var(--teal)" fillOpacity={ring.op} />
            <line x1={sx} y1={sy} x2={392} y2={ring.ly} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 3" />
            <text x={400} y={ring.ly - 6} className="dt">{ring.label}</text>
            <text x={400} y={ring.ly + 10} className="ds">{ring.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

function NeuralNetDiagram() {
  const inputs = [60, 100, 140];
  const hidden = [40, 80, 120, 160];
  const output = [100];
  return (
    <svg width="100%" viewBox="0 0 480 200" role="img" aria-label="Diagrama de rede neural com camada de entrada, camada oculta e camada de saída conectadas por linhas">
      {inputs.map((y1, i) =>
        hidden.map((y2, j) => (
          <line key={"ih" + i + j} x1="60" y1={y1} x2="240" y2={y2} stroke="var(--line)" strokeWidth="1" />
        ))
      )}
      {hidden.map((y1, j) =>
        output.map((y2, k) => (
          <line key={"ho" + j + k} x1="240" y1={y1} x2="420" y2={y2} stroke="var(--line)" strokeWidth="1" />
        ))
      )}
      {inputs.map((y, i) => <circle key={"i" + i} cx="60" cy={y} r="8" fill="var(--teal)" />)}
      {hidden.map((y, i) => <circle key={"h" + i} cx="240" cy={y} r="8" fill="var(--blue)" />)}
      {output.map((y, i) => <circle key={"o" + i} cx="420" cy={y} r="8" fill="var(--teal)" />)}
      <text x="60" y="186" className="ds" textAnchor="middle">entrada</text>
      <text x="240" y="186" className="ds" textAnchor="middle">camadas ocultas</text>
      <text x="420" y="186" className="ds" textAnchor="middle">saída</text>
    </svg>
  );
}

function EmbeddingClusterDiagram() {
  const bg = [[80, 150], [220, 140], [300, 80], [340, 40], [60, 60], [420, 110], [130, 175]];
  return (
    <svg width="100%" viewBox="0 0 480 220" role="img" aria-label="Diagrama de pontos no espaço de embeddings, mostrando duas frases parecidas próximas entre si e uma frase diferente distante">
      {bg.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="var(--ink-faint)" fillOpacity="0.35" />)}
      <line x1="150" y1="90" x2="175" y2="100" stroke="var(--teal)" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="150" cy="90" r="6" fill="var(--teal)" />
      <circle cx="175" cy="100" r="6" fill="var(--teal)" />
      <line x1="163" y1="95" x2="270" y2="55" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 3" />
      <text x="278" y="50" className="dt">cancelar / encerrar plano</text>
      <text x="278" y="66" className="ds">frases parecidas → vetores próximos</text>
      <circle cx="380" cy="180" r="6" fill="var(--violet)" />
      <line x1="380" y1="180" x2="278" y2="190" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 3" />
      <text x="60" y="194" className="dt">“qual é a previsão do tempo?”</text>
      <text x="60" y="208" className="ds">sentido diferente → vetor distante</text>
    </svg>
  );
}

function RagFlowDiagram() {
  const boxes = [
    { x: 35, y: 20, label: "Pergunta" },
    { x: 205, y: 20, label: "Busca vetorial" },
    { x: 375, y: 20, label: "Documentos" },
    { x: 35, y: 140, label: "Contexto" },
    { x: 205, y: 140, label: "LLM" },
    { x: 375, y: 140, label: "Resposta" },
  ];
  const w = 150, h = 44;
  return (
    <svg width="100%" viewBox="0 0 560 210" role="img" aria-label="Fluxo de RAG: pergunta vira busca vetorial, retorna documentos, monta contexto, passa pelo LLM e gera resposta">
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={w} height={h} rx="8" fill="var(--teal-soft)" stroke="var(--teal)" strokeWidth="1" strokeOpacity="0.5" />
          <text x={b.x + w / 2} y={b.y + h / 2} textAnchor="middle" dominantBaseline="central" className="dt">{b.label}</text>
        </g>
      ))}
      <line x1="185" y1="42" x2="203" y2="42" stroke="var(--teal)" strokeWidth="1.2" markerEnd="url(#ragArrow)" />
      <line x1="355" y1="42" x2="373" y2="42" stroke="var(--teal)" strokeWidth="1.2" markerEnd="url(#ragArrow)" />
      <path d="M450 64 L450 110 L110 110 L110 138" fill="none" stroke="var(--teal)" strokeWidth="1.2" markerEnd="url(#ragArrow)" />
      <line x1="185" y1="162" x2="203" y2="162" stroke="var(--teal)" strokeWidth="1.2" markerEnd="url(#ragArrow)" />
      <line x1="355" y1="162" x2="373" y2="162" stroke="var(--teal)" strokeWidth="1.2" markerEnd="url(#ragArrow)" />
      <defs>
        <marker id="ragArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="var(--teal)" strokeWidth="1.5" />
        </marker>
      </defs>
    </svg>
  );
}

function AgentLoopDiagram() {
  const boxes = [
    { x: 15, label: "Objetivo" },
    { x: 123, label: "Raciocínio" },
    { x: 231, label: "Ferramenta" },
    { x: 339, label: "Observação" },
    { x: 447, label: "Resultado" },
  ];
  const w = 98, y = 70, h = 40;
  return (
    <svg width="100%" viewBox="0 0 560 210" role="img" aria-label="Loop de um agent: objetivo, raciocínio, ferramenta, observação e resultado, com uma seta de retorno indicando repetição">
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={y} width={w} height={h} rx="8" fill="var(--blue-soft)" stroke="var(--blue)" strokeWidth="1" strokeOpacity="0.5" />
          <text x={b.x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" className="dt">{b.label}</text>
        </g>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={boxes[i].x + w} y1={y + h / 2} x2={boxes[i + 1].x} y2={y + h / 2} stroke="var(--blue)" strokeWidth="1.2" markerEnd="url(#agentArrow)" />
      ))}
      <path d="M388 110 C 388 160, 172 160, 172 110" fill="none" stroke="var(--blue)" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#agentArrow)" />
      <text x="280" y="178" textAnchor="middle" className="ds">repete até concluir</text>
      <defs>
        <marker id="agentArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="var(--blue)" strokeWidth="1.5" />
        </marker>
      </defs>
    </svg>
  );
}

function ContextQuadrantDiagram() {
  const inputs = [
    { x: 14, label: "Prompt" },
    { x: 130, label: "Memory" },
    { x: 246, label: "Tools" },
    { x: 362, label: "Recuperado" },
  ];
  const w = 104, h = 44;
  const central = { x: 120, y: 110, w: 240, h: 44 };
  const llm = { x: 180, y: 180, w: 120, h: 44 };
  return (
    <svg width="100%" viewBox="0 0 480 250" role="img" aria-label="Quatro fontes de contexto — prompt, memória, ferramentas e conteúdo recuperado — convergindo num contexto montado, que alimenta o LLM">
      {inputs.map((b, i) => {
        const cx = b.x + w / 2;
        const targetX = 140 + i * 60;
        return (
          <g key={i}>
            <rect x={b.x} y="10" width={w} height={h} rx="8" fill="var(--violet-soft)" stroke="var(--violet)" strokeWidth="1" strokeOpacity="0.5" />
            <text x={cx} y={32} textAnchor="middle" dominantBaseline="central" className="dt">{b.label}</text>
            <line x1={cx} y1="54" x2={targetX} y2={central.y} stroke="var(--violet)" strokeWidth="1" strokeOpacity="0.5" />
          </g>
        );
      })}
      <rect x={central.x} y={central.y} width={central.w} height={central.h} rx="8" fill="var(--teal-soft)" stroke="var(--teal)" strokeWidth="1.2" />
      <text x={central.x + central.w / 2} y={central.y + central.h / 2} textAnchor="middle" dominantBaseline="central" className="dt">Contexto montado</text>
      <line x1={central.x + central.w / 2} y1={central.y + central.h} x2={llm.x + llm.w / 2} y2={llm.y} stroke="var(--teal)" strokeWidth="1.2" markerEnd="url(#ctxArrow)" />
      <rect x={llm.x} y={llm.y} width={llm.w} height={llm.h} rx="8" fill="var(--blue-soft)" stroke="var(--blue)" strokeWidth="1.2" />
      <text x={llm.x + llm.w / 2} y={llm.y + llm.h / 2} textAnchor="middle" dominantBaseline="central" className="dt">LLM</text>
      <defs>
        <marker id="ctxArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="var(--teal)" strokeWidth="1.5" />
        </marker>
      </defs>
    </svg>
  );
}

function InfraStackDiagram() {
  const bands = [
    { label: "Serving", sub: "APIs, gateway, streaming" },
    { label: "Inference", sub: "tokens, batching, cache, GPU" },
    { label: "Observability", sub: "tracing, custo, logs de prompt" },
    { label: "Governança", sub: "PII, auditoria, versionamento" },
  ];
  return (
    <svg width="100%" viewBox="0 0 480 250" role="img" aria-label="Quatro camadas de infraestrutura de IA: serving, inference, observability e governança, empilhadas">
      {bands.map((b, i) => {
        const y = 10 + i * 56;
        return (
          <g key={i}>
            <rect x="20" y={y} width="440" height="52" rx="10" fill="var(--teal-soft)" stroke="var(--teal)" strokeWidth="1" strokeOpacity={0.4 + i * 0.15} />
            <text x="40" y={y + 22} className="dt">{b.label}</text>
            <text x="40" y={y + 40} className="ds">{b.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

const DIAGRAMS = {
  "nested-circles": NestedCirclesDiagram,
  "neural-net": NeuralNetDiagram,
  "embedding-cluster": EmbeddingClusterDiagram,
  "rag-flow": RagFlowDiagram,
  "agent-loop": AgentLoopDiagram,
  "context-quadrant": ContextQuadrantDiagram,
  "infra-stack": InfraStackDiagram,
};

/* ============================================================================
   PORTA COMPARTILHADA — aprofundamento.
   Os dois modos abrem exatamente o mesmo modal pra ir além do que está no
   card. É o ponto de encontro entre os dois adapters: mesmo dado, mesmo
   componente de profundidade, acionado por gatilhos diferentes.
   ============================================================================ */

function ProductLink({ link }) {
  const host = hostnameOf(link.url);
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-chip"
      title={"abrir " + host}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="link-tooltip">abrir {host}</span>
      {link.name}
      <ExternalLink size={11} aria-hidden="true" />
    </a>
  );
}

function DeepBullet({ bullet, onDrill }) {
  if (typeof bullet === "string") {
    return (
      <li className="deep-item">
        <span className="dot" aria-hidden="true" />
        <span className="deep-text">{bullet}</span>
      </li>
    );
  }

  if (bullet.links) {
    return (
      <li className="deep-item">
        <div className="deep-item-row">
          <span className="dot" aria-hidden="true" />
          <span className="deep-text">
            <strong>{bullet.label}</strong> — {bullet.summary}
          </span>
        </div>
        <div className="link-row">
          {bullet.links.map((l) => <ProductLink key={l.url} link={l} />)}
        </div>
      </li>
    );
  }

  const clickable = !!(bullet.example && onDrill);
  const inner = (
    <>
      <span className="dot" aria-hidden="true" />
      <span className="deep-text">
        <strong>{bullet.label}</strong> — {bullet.summary}
      </span>
      {clickable && <ChevronRight size={14} className="chev" aria-hidden="true" />}
    </>
  );
  if (clickable) {
    return (
      <li className="deep-item clickable">
        <button type="button" className="deep-item-btn" onClick={() => onDrill({ label: bullet.label, example: bullet.example })}>
          {inner}
        </button>
      </li>
    );
  }
  return (
    <li className="deep-item">
      <div className="deep-item-row">{inner}</div>
    </li>
  );
}

function DeepBlock({ block, accent, onDrill }) {
  if (!block) return null;
  return (
    <>
      {block.paragraphs && block.paragraphs.map((p, i) => <p key={"p" + i}>{p}</p>)}
      {block.bullets && block.bullets.length > 0 && (
        <ul className={"deep-list accent-" + (accent || "teal")}>
          {block.bullets.map((b, i) => <DeepBullet key={i} bullet={b} onDrill={onDrill} />)}
        </ul>
      )}
    </>
  );
}

function TopicModal({ topic, initialTab, onClose }) {
  const [tab, setTab] = useState(initialTab || "aprofundar");
  const [drill, setDrill] = useState(null);
  const tabs = [
    { id: "aprofundar", label: "aprofundar", Icon: Layers },
    { id: "entrevista", label: "entrevista", Icon: HelpCircle },
  ];
  if (topic.bridge) tabs.push({ id: "cloud", label: "cloud & engenharia", Icon: Cloud });

  const switchTab = (id) => {
    setTab(id);
    setDrill(null);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (drill) setDrill(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, drill]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={topic.title}>
        <div className="modal-head">
          <div>
            <span className="code">{topic.code}</span>
            <h3>{topic.title}</h3>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="fechar">
            <X size={18} />
          </button>
        </div>

        <div className="modal-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={"modal-tab tab-" + t.id + (tab === t.id ? " active" : "")}
              onClick={() => switchTab(t.id)}
            >
              <t.Icon size={14} aria-hidden="true" /> {t.label}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {drill ? (
            <div className="drill">
              <button type="button" className="back-btn" onClick={() => setDrill(null)}>
                <ChevronLeft size={15} aria-hidden="true" /> voltar
              </button>
              <h4>{drill.label}</h4>
              <p>{drill.example.text}</p>
              {drill.example.code && <pre className="code-block">{drill.example.code}</pre>}
              {drill.example.sources && drill.example.sources.length > 0 && (
                <div className="sources">
                  <span className="sources-tag">saiba mais</span>
                  <div className="sources-list">
                    {drill.example.sources.map((s) => (
                      <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="source-link">
                        {s.label} <ExternalLink size={11} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {tab === "aprofundar" && (
                <>
                  <DeepBlock block={topic.deep} accent="blue" onDrill={setDrill} />
                  {topic.snippet && <pre className="code-block">{topic.snippet}</pre>}
                </>
              )}
              {tab === "entrevista" &&
                topic.interview.map((item, i) => (
                  <div key={i} className="interview-item">
                    <p className="panel-q">{item.q}</p>
                    <p className="panel-a">{item.a}</p>
                  </div>
                ))}
              {tab === "cloud" && <DeepBlock block={topic.bridge} accent="violet" onDrill={setDrill} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ADAPTER 1 — Modo Estudo
   Trilha completa, sequencial, com conteúdo didático (analogia sempre visível,
   diagrama, e progresso por nível). É o "guia vivo" original.
   ============================================================================ */

function StudyTopicRow({ topic, isStudied, onToggleStudied, isHighlighted, onGoTo, onOpenModal, registerRef }) {
  const Diagram = topic.visual ? DIAGRAMS[topic.visual] : null;
  return (
    <div className={"trail-row" + (isHighlighted ? " flash" : "")} ref={(el) => registerRef(topic.id, el)}>
      <button
        type="button"
        className={"marker" + (isStudied ? " done" : "")}
        onClick={() => onToggleStudied(topic.id)}
        aria-label={isStudied ? "marcar como não estudado" : "marcar como estudado"}
        title={isStudied ? "marcar como não estudado" : "marcar como estudado"}
      >
        {isStudied ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      </button>

      <div className="card">
        <div className="card-head">
          <span className="code">{topic.code}</span>
          <h3>{topic.title}</h3>
        </div>

        <p className="one-liner">{topic.oneLiner}</p>

        {Diagram && (
          <div className="diagram">
            <Diagram />
          </div>
        )}

        <div className="everyday">
          <span className="everyday-tag">no dia a dia</span>
          <p>{topic.everyday}</p>
        </div>

        {topic.connects && topic.connects.length > 0 && (
          <div className="connects">
            <Link2 size={12} aria-hidden="true" />
            {topic.connects.map((cid) => {
              const t = getTopic(cid);
              if (!t) return null;
              return (
                <button key={cid} type="button" className="chip" onClick={() => onGoTo(cid)}>
                  {t.title}
                </button>
              );
            })}
          </div>
        )}

        <div className="icon-row">
          <button type="button" className="icon-btn amber" onClick={() => onOpenModal(topic.id, "entrevista")}>
            <HelpCircle size={15} aria-hidden="true" />
            pergunta de entrevista {topic.interview.length > 1 ? "(" + topic.interview.length + ")" : ""}
          </button>
          <button type="button" className="icon-btn blue" onClick={() => onOpenModal(topic.id, "aprofundar")}>
            <Layers size={15} aria-hidden="true" />
            aprofundar
          </button>
        </div>
      </div>
    </div>
  );
}

function ConclusionSection() {
  const [revealed, setRevealed] = useState({});
  const toggle = (i) => setRevealed((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="conclusion">
      <div className="recap">
        {LEVELS.filter((l) => l.id <= 4).map((lv) => (
          <div key={lv.id} className="recap-item">
            <span className="recap-num">{String(lv.id).padStart(2, "0")}</span>
            <div>
              <h4>{lv.name}</h4>
              <p>{lv.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quiz">
        <h3>
          <Flag size={16} aria-hidden="true" /> quiz rápido
        </h3>
        {QUIZ.map((item, i) => (
          <div key={i} className="quiz-item">
            <p className="quiz-q">
              {i + 1}. {item.q}
            </p>
            <button type="button" className="quiz-btn" onClick={() => toggle(i)}>
              {revealed[i] ? "ocultar resposta" : "ver resposta"}
            </button>
            {revealed[i] && <p className="quiz-a">{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function useTopicNavigation(storageKey) {
  const [activeLevel, setActiveLevel] = useState(1);
  const [studied, setStudied] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const topicRefs = useRef({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await window.storage.get(storageKey, false);
        if (mounted && res && res.value) {
          const parsed = JSON.parse(res.value);
          setStudied(parsed.studied || {});
        }
      } catch (e) {
        // ainda não existe progresso salvo
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [storageKey]);

  const persist = async (next) => {
    setStudied(next);
    try {
      await window.storage.set(storageKey, JSON.stringify({ studied: next }), false);
    } catch (e) {
      console.error("não foi possível salvar o progresso", e);
    }
  };

  const toggleStudied = (id) => persist({ ...studied, [id]: !studied[id] });
  const resetProgress = () => {
    if (window.confirm("Reiniciar todo o progresso?")) persist({});
  };

  const registerRef = (id, el) => {
    topicRefs.current[id] = el;
  };

  const goToTopic = (id) => {
    const t = getTopic(id);
    if (!t) return;
    setActiveLevel(t.levelId);
    setHighlight(id);
    window.setTimeout(() => {
      const el = topicRefs.current[id];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
    window.setTimeout(() => setHighlight(null), 1700);
  };

  const openModal = (id, tab) => setModal({ id, tab });
  const closeModal = () => setModal(null);

  return {
    activeLevel, setActiveLevel,
    studied, loaded,
    modal, highlight,
    toggleStudied, resetProgress,
    registerRef, goToTopic,
    openModal, closeModal,
  };
}

function StudyView() {
  const nav = useTopicNavigation(STUDY_STORAGE_KEY);
  const totalTopics = TOPICS.length;
  const studiedCount = Object.values(nav.studied).filter(Boolean).length;
  const progressPct = totalTopics > 0 ? Math.round((studiedCount / totalTopics) * 100) : 0;
  const currentLevel = LEVELS.find((l) => l.id === nav.activeLevel);
  const levelTopics = TOPICS.filter((t) => t.levelId === nav.activeLevel);
  const modalTopic = nav.modal ? getTopic(nav.modal.id) : null;

  return (
    <>
      <header className="hero hero-top">
        <span className="eyebrow">guia vivo · v0.7</span>
        <h1>Trilha de IA</h1>
      </header>

      <AiMindmap />

      <div className="hero hero-bottom">
        <p className="lede">
          Um guia pra aprender inteligência artificial do zero, em níveis conectados, sempre com
          um exemplo do dia a dia e um diagrama quando ajuda a visualizar. Pergunta de entrevista,
          aprofundamento técnico e a ponte com cloud e engenharia de software ficam dentro do
          mesmo painel — abra quando quiser ir além do básico.
        </p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: progressPct + "%" }} />
        </div>
        <div className="progress-label">
          <Compass size={14} aria-hidden="true" />
          {nav.loaded ? studiedCount + " de " + totalTopics + " marcos estudados" : "carregando seu progresso…"}
        </div>
      </div>

      <nav className="level-tabs" aria-label="níveis da trilha">
        {LEVELS.map((lv) => (
          <button
            key={lv.id}
            type="button"
            className={"level-tab" + (nav.activeLevel === lv.id ? " active" : "")}
            onClick={() => nav.setActiveLevel(lv.id)}
          >
            <span className="level-num">{String(lv.id).padStart(2, "0")}</span>
            <span className="level-name">{lv.name}</span>
          </button>
        ))}
      </nav>

      <main>
        {nav.activeLevel <= 4 ? (
          <>
            <p className="level-intro">{currentLevel.subtitle}</p>
            <div className="trail">
              <div className="trail-line" aria-hidden="true" />
              {levelTopics.map((topic) => (
                <StudyTopicRow
                  key={topic.id}
                  topic={topic}
                  isStudied={!!nav.studied[topic.id]}
                  onToggleStudied={nav.toggleStudied}
                  isHighlighted={nav.highlight === topic.id}
                  onGoTo={nav.goToTopic}
                  onOpenModal={nav.openModal}
                  registerRef={nav.registerRef}
                />
              ))}
            </div>
          </>
        ) : (
          <ConclusionSection />
        )}
      </main>

      <div className="sub-foot">
        <button type="button" className="reset-btn" onClick={nav.resetProgress}>
          <RotateCcw size={13} aria-hidden="true" /> reiniciar progresso
        </button>
      </div>

      {modalTopic && <TopicModal topic={modalTopic} initialTab={nav.modal.tab} onClose={nav.closeModal} />}
    </>
  );
}

/* ============================================================================
   ADAPTER 2 — Modo Executivo
   Mesma trilha, mesmos tópicos, mesmo modal de aprofundamento — mas o card
   mostra só o essencial: uma frase de takeaway, o diagrama (quando existe) e
   por que aquilo importa pra uma decisão. Tudo o resto fica a um clique.
   ============================================================================ */

function ExecTopicRow({ topic, isStudied, onToggleStudied, isHighlighted, onGoTo, onOpenModal, registerRef }) {
  const Diagram = topic.visual ? DIAGRAMS[topic.visual] : null;
  return (
    <div className={"trail-row" + (isHighlighted ? " flash" : "")} ref={(el) => registerRef(topic.id, el)}>
      <button
        type="button"
        className={"marker" + (isStudied ? " done" : "")}
        onClick={() => onToggleStudied(topic.id)}
        aria-label={isStudied ? "marcar como não visto" : "marcar como visto"}
        title={isStudied ? "marcar como não visto" : "marcar como visto"}
      >
        {isStudied ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      </button>

      <div className="card exec-card">
        <div className="card-head">
          <span className="code">{topic.code}</span>
          <h3>{topic.title}</h3>
        </div>

        <p className="exec-takeaway">{topic.exec.takeaway}</p>

        {Diagram && (
          <div className="diagram">
            <Diagram />
          </div>
        )}

        <p className="exec-why">{topic.exec.whyItMatters}</p>

        {topic.connects && topic.connects.length > 0 && (
          <div className="connects">
            <Link2 size={12} aria-hidden="true" />
            {topic.connects.map((cid) => {
              const t = getTopic(cid);
              if (!t) return null;
              return (
                <button key={cid} type="button" className="chip" onClick={() => onGoTo(cid)}>
                  {t.title}
                </button>
              );
            })}
          </div>
        )}

        <div className="icon-row">
          <button type="button" className="icon-btn amber" onClick={() => onOpenModal(topic.id, "entrevista")}>
            <HelpCircle size={15} aria-hidden="true" />
            pergunta pro time
          </button>
          <button type="button" className="icon-btn blue" onClick={() => onOpenModal(topic.id, "aprofundar")}>
            <Layers size={15} aria-hidden="true" />
            entender melhor
          </button>
        </div>
      </div>
    </div>
  );
}

function ExecSummary() {
  return (
    <div className="exec-summary">
      {LEVELS.filter((l) => l.id <= 4).map((lv) => (
        <div key={lv.id} className="exec-summary-level">
          <h4>
            {String(lv.id).padStart(2, "0")} · {lv.name}
          </h4>
          {TOPICS.filter((t) => t.levelId === lv.id).map((t) => (
            <div key={t.id} className="exec-summary-item">
              <span className="code">{t.code}</span>
              <div>
                <strong>{t.title}.</strong> <span>{t.exec.takeaway}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ExecView() {
  const nav = useTopicNavigation(EXEC_STORAGE_KEY);
  const totalTopics = TOPICS.length;
  const seenCount = Object.values(nav.studied).filter(Boolean).length;
  const progressPct = totalTopics > 0 ? Math.round((seenCount / totalTopics) * 100) : 0;
  const currentLevel = LEVELS.find((l) => l.id === nav.activeLevel);
  const levelTopics = TOPICS.filter((t) => t.levelId === nav.activeLevel);
  const modalTopic = nav.modal ? getTopic(nav.modal.id) : null;

  return (
    <>
      <header className="hero">
        <span className="eyebrow">modo executivo · v0.1</span>
        <h1>IA em 5 minutos</h1>
        <p className="lede">
          Pra quem precisa decidir, não programar. Bata o olho no que importa em cada tópico — e
          abra “entender melhor” só quando precisar ir além.
        </p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: progressPct + "%" }} />
        </div>
        <div className="progress-label">
          <Compass size={14} aria-hidden="true" />
          {nav.loaded ? seenCount + " de " + totalTopics + " tópicos vistos" : "carregando seu progresso…"}
        </div>
      </header>

      <nav className="level-tabs" aria-label="categorias">
        {LEVELS.map((lv) => (
          <button
            key={lv.id}
            type="button"
            className={"level-tab" + (nav.activeLevel === lv.id ? " active" : "")}
            onClick={() => nav.setActiveLevel(lv.id)}
          >
            <span className="level-num">{String(lv.id).padStart(2, "0")}</span>
            <span className="level-name">{lv.id === 5 ? "Resumo" : lv.name}</span>
          </button>
        ))}
      </nav>

      <main>
        {nav.activeLevel <= 4 ? (
          <>
            <p className="level-intro">{currentLevel.subtitle}</p>
            <div className="trail">
              <div className="trail-line" aria-hidden="true" />
              {levelTopics.map((topic) => (
                <ExecTopicRow
                  key={topic.id}
                  topic={topic}
                  isStudied={!!nav.studied[topic.id]}
                  onToggleStudied={nav.toggleStudied}
                  isHighlighted={nav.highlight === topic.id}
                  onGoTo={nav.goToTopic}
                  onOpenModal={nav.openModal}
                  registerRef={nav.registerRef}
                />
              ))}
            </div>
          </>
        ) : (
          <ExecSummary />
        )}
      </main>

      <div className="sub-foot">
        <button type="button" className="reset-btn" onClick={nav.resetProgress}>
          <RotateCcw size={13} aria-hidden="true" /> reiniciar progresso
        </button>
      </div>

      {modalTopic && <TopicModal topic={modalTopic} initialTab={nav.modal.tab} onClose={nav.closeModal} />}
    </>
  );
}

/* ============================================================================
   COMPOSIÇÃO — App escolhe qual adapter renderizar. O domínio (TOPICS,
   LEVELS) e a porta de aprofundamento (TopicModal) são os mesmos nos dois
   casos; só a apresentação muda.
   ============================================================================ */

export default function App() {
  const [mode, setMode] = useState("estudo");
  const shareLinkedInUrl =
    "https://www.linkedin.com/sharing/share-offsite/?url=" +
    encodeURIComponent(AUTHOR.shareUrl || AUTHOR.github);

  return (
    <div
      className="guide"
      style={{
        "--paper": "#F1F2ED",
        "--paper-card": "#FFFFFF",
        "--ink": "#1B1F1D",
        "--ink-soft": "#565F5A",
        "--ink-faint": "#8B928C",
        "--line": "#DBDED4",
        "--teal": "#1F5C52",
        "--teal-soft": "#E1ECE7",
        "--blue": "#2E4A63",
        "--blue-soft": "#E2E8EE",
        "--amber": "#93631A",
        "--amber-soft": "#F3E7D2",
        "--violet": "#51436B",
        "--violet-soft": "#E9E4F0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .guide {
          background: var(--paper);
          color: var(--ink);
          font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
          min-height: 100%;
          padding: clamp(20px, 4vw, 56px) clamp(16px, 5vw, 64px) 48px;
        }
        .guide * { box-sizing: border-box; }
        .guide h1, .guide h3, .guide h4 { font-family: "Fraunces", Georgia, serif; font-weight: 500; margin: 0; }
        .dt { font-family: "IBM Plex Sans", sans-serif; font-size: 12.5px; font-weight: 500; fill: var(--ink); }
        .ds { font-family: "IBM Plex Sans", sans-serif; font-size: 11px; fill: var(--ink-faint); }
        .mode-switcher { display: flex; justify-content: center; margin: 0 0 28px; }
        .mode-tabs { display: inline-flex; gap: 4px; background: var(--paper-card); border: 1px solid var(--line); border-radius: 999px; padding: 4px; }
        .mode-tab { border: none; background: none; padding: 8px 16px; border-radius: 999px; font-size: 13px; cursor: pointer; color: var(--ink-soft); display: inline-flex; align-items: center; gap: 6px; }
        .mode-tab.active { background: var(--teal); color: #fff; }
        .hero { max-width: 720px; margin: 0 auto 36px; }
        .hero.hero-top { margin-bottom: 22px; }
        .hero.hero-bottom { margin-top: 4px; }
        .arch-map-section { max-width: 920px; margin: 0 auto 28px; }
        .arch-map-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; gap: 12px; }
        .arch-map-title { font-family: "Fraunces", Georgia, serif; font-size: 15px; color: var(--ink); }
        .arch-back-btn { display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--line); background: none; border-radius: 999px; padding: 5px 12px; font-size: 12.5px; cursor: pointer; color: var(--ink-soft); flex-shrink: 0; }
        .arch-back-btn:hover { border-color: var(--teal); color: var(--teal); }
        .arch-map-canvas { border: 1px solid var(--line); border-radius: 16px; background: var(--paper); padding: 8px; overflow: hidden; }
        .arch-map-canvas svg { display: block; width: 100%; height: auto; }
        .arch-branch { fill: none; stroke-linecap: round; }
        .arch-branch.hub-branch { stroke-width: 3; opacity: 0.55; }
        .arch-branch.leaf-branch { stroke-width: 1.6; opacity: 0.4; }
        .branch-teal { stroke: var(--teal); }
        .branch-violet { stroke: var(--violet); }
        .branch-blue { stroke: var(--blue); }
        .branch-amber { stroke: var(--amber); }
        .arch-hub { cursor: pointer; }
        .arch-hub ellipse { fill: var(--ink); transition: filter 0.15s ease; }
        .arch-hub:hover ellipse { filter: brightness(1.2); }
        .arch-hub-title { font-family: "Fraunces", Georgia, serif; font-size: 16px; font-weight: 600; fill: #fff; pointer-events: none; }
        .arch-world-node rect { cursor: pointer; transition: filter 0.15s ease; }
        .arch-world-node:hover rect { filter: brightness(0.92); }
        .arch-world-title { font-family: "IBM Plex Sans", sans-serif; font-size: 12.5px; font-weight: 600; fill: #fff; pointer-events: none; }
        .arch-world-sub { font-family: "IBM Plex Sans", sans-serif; font-size: 10px; fill: rgba(255,255,255,0.85); pointer-events: none; }
        .arch-info { position: relative; margin-top: 12px; padding: 12px 36px 12px 14px; border-radius: 12px; font-size: 13.5px; line-height: 1.55; color: var(--ink); border: 1px solid var(--line); }
        .arch-info strong { font-weight: 600; }
        .arch-info.accent-teal { background: var(--teal-soft); border-color: var(--teal); }
        .arch-info.accent-violet { background: var(--violet-soft); border-color: var(--violet); }
        .arch-info.accent-blue { background: var(--blue-soft); border-color: var(--blue); }
        .arch-info.accent-amber { background: var(--amber-soft); border-color: var(--amber); }
        .arch-info-close { position: absolute; top: 8px; right: 8px; background: none; border: none; cursor: pointer; color: var(--ink-soft); padding: 4px; }
        .arch-info-close:hover { color: var(--ink); }
        .world-teal rect { fill: var(--teal); }
        .world-violet rect { fill: var(--violet); }
        .world-blue rect { fill: var(--blue); }
        .world-amber rect { fill: var(--amber); }
        .arch-node rect { cursor: pointer; fill: var(--paper-card); stroke-width: 1.4; transition: filter 0.15s ease; }
        .arch-node:hover rect { filter: brightness(0.95); }
        .node-teal rect { stroke: var(--teal); }
        .node-violet rect { stroke: var(--violet); }
        .node-blue rect { stroke: var(--blue); }
        .node-amber rect { stroke: var(--amber); }
        .arch-node-title { font-family: "IBM Plex Sans", sans-serif; font-size: 11.5px; font-weight: 500; fill: var(--ink); pointer-events: none; }
        .arch-edge.cross { stroke: var(--ink-soft); stroke-width: 1.3; stroke-dasharray: 4 3; opacity: 0.55; }
        .arch-map-hint { font-size: 12.5px; color: var(--ink-faint); margin: 10px 0 0; text-align: center; }
        .mindmap-wrap { position: relative; }
        .mindmap-lines { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
        .mindmap-lines line { stroke: var(--blue); stroke-width: 1.5; stroke-dasharray: 5 4; opacity: 0.55; }
        .ai-root { position: relative; z-index: 1; border: 1px solid var(--line); border-radius: 20px; padding: 20px; }
        .ai-root-label { display: block; font-family: "Fraunces", Georgia, serif; font-weight: 500; font-size: 15px; color: var(--ink); margin-bottom: 14px; }
        .cat-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-start; }
        .cat-box { border-radius: 14px; flex: 1 1 240px; }
        .cat-top { border: 1.5px solid var(--teal); background: var(--teal-soft); padding: 14px; }
        .cat-top.top-violet { border-color: var(--violet); background: var(--violet-soft); }
        .cat-sub { border: 1.5px dashed var(--line); background: var(--paper); padding: 12px; }
        .cat-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; background: none; border: none; cursor: pointer; padding: 0; text-align: left; font: inherit; }
        .cat-top .cat-title { font-family: "Fraunces", Georgia, serif; font-weight: 500; font-size: 15px; color: var(--teal); }
        .cat-top.top-violet .cat-title { color: var(--violet); }
        .cat-sub .cat-title { font-weight: 600; font-size: 13.5px; color: var(--ink); }
        .cat-meta { display: flex; align-items: center; gap: 6px; font-family: "IBM Plex Mono", monospace; font-size: 11px; color: var(--ink-faint); flex-shrink: 0; }
        .cat-chevron { transition: transform 0.15s ease; }
        .cat-box.open .cat-chevron { transform: rotate(90deg); }
        .cat-body { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .leaf-box { flex: 1 1 140px; max-width: 230px; display: flex; align-items: center; justify-content: space-between; gap: 6px; background: var(--paper-card); border: 0.5px solid var(--line); border-radius: 10px; padding: 8px 10px; font-size: 13px; color: var(--ink); transition: background 0.4s ease, border-color 0.2s ease; }
        .leaf-box.flash { background: var(--amber-soft); border-color: var(--amber); }
        .rel-btn { background: none; border: none; padding: 2px; cursor: pointer; color: var(--blue); flex-shrink: 0; display: flex; }
        .rel-btn:hover { color: var(--ink); }
        .genai-pipeline { margin-top: 14px; border: 1px solid var(--line); border-radius: 16px; padding: 16px; background: var(--paper-card); }
        .genai-pipeline .arch-map-hint { margin: 0 0 12px; }
        .genai-pipeline svg { display: block; width: 100%; height: auto; }
        .eyebrow {
          display: inline-block; font-family: "IBM Plex Mono", monospace; font-size: 12px;
          letter-spacing: 0.06em; color: var(--teal); background: var(--teal-soft);
          border-radius: 999px; padding: 4px 12px; margin-bottom: 14px;
        }
        .hero h1 { font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.08; }
        .lede { color: var(--ink-soft); font-size: 16px; line-height: 1.65; margin: 14px 0 24px; max-width: 60ch; }
        .progress-track { height: 6px; border-radius: 999px; background: var(--line); overflow: hidden; }
        .progress-fill { height: 100%; background: var(--teal); border-radius: 999px; transition: width 0.4s ease; }
        .progress-label { display: flex; align-items: center; gap: 6px; font-family: "IBM Plex Mono", monospace; font-size: 12px; color: var(--ink-faint); margin-top: 8px; }
        .level-tabs { display: flex; flex-wrap: wrap; gap: 8px; max-width: 920px; margin: 0 auto 28px; border-bottom: 1px solid var(--line); padding-bottom: 16px; }
        .level-tab {
          display: flex; align-items: baseline; gap: 8px; background: none; border: 1px solid var(--line);
          border-radius: 999px; padding: 8px 16px; cursor: pointer; font-size: 13px; color: var(--ink-soft);
          transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
        }
        .level-tab:hover { border-color: var(--teal); color: var(--ink); }
        .level-tab.active { background: var(--teal); border-color: var(--teal); color: #fff; }
        .level-num { font-family: "IBM Plex Mono", monospace; font-size: 11px; opacity: 0.75; }
        main { max-width: 920px; margin: 0 auto; }
        .level-intro { color: var(--ink-soft); font-size: 15px; margin: 0 0 28px; max-width: 60ch; }
        .trail { position: relative; }
        .trail-line { position: absolute; left: 19px; top: 8px; bottom: 8px; width: 2px; background: var(--line); }
        .trail-row { position: relative; display: grid; grid-template-columns: 40px 1fr; gap: 16px; margin-bottom: 18px; border-radius: 16px; transition: background 0.5s ease; }
        .trail-row.flash { background: var(--amber-soft); }
        .marker {
          position: relative; z-index: 1; width: 40px; height: 40px; border-radius: 50%; background: var(--paper-card);
          border: 1.5px solid var(--line); color: var(--ink-faint); display: flex; align-items: center; justify-content: center;
          cursor: pointer; align-self: flex-start; margin-top: 18px; transition: border-color 0.15s ease, color 0.15s ease;
        }
        .marker:hover { border-color: var(--teal); color: var(--teal); }
        .marker.done { background: var(--teal); border-color: var(--teal); color: #fff; }
        .card { background: var(--paper-card); border: 1px solid var(--line); border-radius: 16px; padding: 20px 22px; }
        .card-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
        .code { font-family: "IBM Plex Mono", monospace; font-size: 12px; color: var(--teal); }
        .card-head h3 { font-size: 19px; }
        .one-liner { color: var(--ink-soft); font-size: 14.5px; line-height: 1.6; margin: 0 0 14px; }
        .exec-takeaway { font-family: "Fraunces", Georgia, serif; font-weight: 500; font-size: 18px; line-height: 1.4; margin: 4px 0 14px; color: var(--ink); }
        .exec-why { font-size: 13.5px; color: var(--ink-soft); line-height: 1.55; margin: 0 0 14px; padding-left: 12px; border-left: 2px solid var(--teal); }
        .diagram { margin-bottom: 14px; border: 1px solid var(--line); border-radius: 12px; padding: 10px; background: var(--paper); }
        .diagram svg { display: block; }
        .everyday { background: var(--teal-soft); border-radius: 12px; padding: 12px 14px; margin-bottom: 14px; }
        .everyday-tag { display: block; font-family: "IBM Plex Mono", monospace; font-size: 10.5px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--teal); margin-bottom: 4px; }
        .everyday p { margin: 0; font-size: 14px; line-height: 1.6; color: var(--ink); }
        .connects { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; color: var(--ink-faint); margin-bottom: 14px; }
        .chip { background: none; border: 1px solid var(--line); border-radius: 999px; padding: 4px 10px; font-size: 12px; color: var(--ink-soft); cursor: pointer; transition: border-color 0.15s ease, color 0.15s ease; }
        .chip:hover { border-color: var(--violet); color: var(--violet); }
        .icon-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .icon-btn { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--line); background: none; border-radius: 999px; padding: 6px 12px; font-size: 12.5px; cursor: pointer; transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease; color: var(--ink-soft); }
        .icon-btn.amber:hover { border-color: var(--amber); color: var(--amber); background: var(--amber-soft); }
        .icon-btn.blue:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-soft); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(20,22,18,0.5); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 50; }
        .modal-card { background: var(--paper-card); border-radius: 18px; width: 100%; max-width: 600px; max-height: 85vh; overflow-y: auto; padding: 24px; }
        .modal-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
        .modal-head h3 { font-size: 19px; margin-top: 2px; }
        .modal-close { border: 1px solid var(--line); background: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ink-soft); flex-shrink: 0; }
        .modal-close:hover { border-color: var(--ink-soft); }
        .modal-tabs { display: flex; flex-wrap: wrap; gap: 8px; border-bottom: 1px solid var(--line); padding-bottom: 14px; margin-bottom: 16px; }
        .modal-tab { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--line); background: none; border-radius: 999px; padding: 6px 13px; font-size: 12.5px; cursor: pointer; color: var(--ink-soft); }
        .modal-tab.tab-aprofundar.active { background: var(--blue-soft); border-color: var(--blue); color: var(--blue); }
        .modal-tab.tab-entrevista.active { background: var(--amber-soft); border-color: var(--amber); color: var(--amber); }
        .modal-tab.tab-cloud.active { background: var(--violet-soft); border-color: var(--violet); color: var(--violet); }
        .modal-body p { margin: 0 0 12px; line-height: 1.65; font-size: 14.5px; color: var(--ink); }
        .modal-body > p:last-child { margin-bottom: 0; }
        .deep-list { list-style: none; margin: 4px 0 4px; padding: 0; display: flex; flex-direction: column; gap: 4px; }
        .deep-item { font-size: 14.5px; line-height: 1.6; color: var(--ink); }
        .deep-item-btn { display: flex; align-items: flex-start; gap: 10px; width: 100%; text-align: left; background: none; border: 1px solid transparent; border-radius: 10px; padding: 8px 10px; margin: 0 -10px; cursor: pointer; font: inherit; color: inherit; }
        .deep-item.clickable .deep-item-btn:hover { background: var(--paper); border-color: var(--line); }
        .deep-item-row { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; }
        .dot { flex-shrink: 0; width: 6px; height: 6px; border-radius: 50%; margin-top: 9px; background: var(--ink-faint); }
        .accent-blue .dot { background: var(--blue); }
        .accent-violet .dot { background: var(--violet); }
        .deep-text { flex: 1; }
        .deep-text strong { font-weight: 600; }
        .chev { flex-shrink: 0; margin-top: 4px; color: var(--ink-faint); }
        .deep-item.clickable .deep-item-btn:hover .chev { color: var(--blue); }
        .link-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 4px 16px; }
        .link-chip {
          position: relative; display: inline-flex; align-items: center; gap: 4px;
          font-size: 12px; padding: 3px 9px; border-radius: 999px; border: 1px solid var(--line);
          color: var(--ink-soft); text-decoration: none; background: var(--paper);
        }
        .accent-violet .link-chip { color: var(--violet); border-color: var(--violet); background: var(--violet-soft); }
        .accent-violet .link-chip:hover { background: var(--violet); color: #fff; }
        .link-tooltip {
          position: absolute; bottom: calc(100% + 6px); left: 0; background: var(--ink); color: #fff;
          font-family: "IBM Plex Mono", monospace; font-size: 11px; padding: 4px 8px; border-radius: 6px;
          white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.15s ease; z-index: 5;
        }
        .link-chip:hover .link-tooltip, .link-chip:focus-visible .link-tooltip { opacity: 1; }
        .back-btn { display: inline-flex; align-items: center; gap: 4px; background: none; border: none; color: var(--ink-soft); font-size: 13px; cursor: pointer; padding: 0; margin-bottom: 16px; }
        .back-btn:hover { color: var(--ink); }
        .drill h4 { font-size: 17px; margin-bottom: 10px; font-family: "Fraunces", Georgia, serif; font-weight: 500; }
        .code-block { font-family: "IBM Plex Mono", monospace; font-size: 13px; background: rgba(0,0,0,0.06); border-radius: 10px; padding: 12px 14px; margin: 10px 0 0; overflow-x: auto; white-space: pre; line-height: 1.55; color: var(--ink); }
        .sources { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line); }
        .sources-tag { display: block; font-family: "IBM Plex Mono", monospace; font-size: 10.5px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 8px; }
        .sources-list { display: flex; flex-direction: column; gap: 6px; }
        .source-link { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: var(--blue); text-decoration: none; }
        .source-link:hover { text-decoration: underline; }
        .interview-item { padding: 14px 0; border-top: 1px solid var(--line); }
        .interview-item:first-child { border-top: none; padding-top: 0; }
        .panel-q { font-weight: 600; }
        .panel-a { color: var(--ink-soft); }
        .conclusion { display: flex; flex-direction: column; gap: 32px; }
        .recap { display: grid; gap: 14px; }
        .recap-item { display: grid; grid-template-columns: 36px 1fr; gap: 14px; align-items: baseline; }
        .recap-num { font-family: "IBM Plex Mono", monospace; font-size: 12px; color: var(--teal); }
        .recap-item h4 { font-size: 16px; margin-bottom: 2px; }
        .recap-item p { margin: 0; color: var(--ink-soft); font-size: 14px; }
        .quiz { background: var(--paper-card); border: 1px solid var(--line); border-radius: 16px; padding: 22px 24px; }
        .quiz h3 { display: flex; align-items: center; gap: 8px; font-size: 17px; margin-bottom: 16px; }
        .quiz-item { border-top: 1px solid var(--line); padding: 14px 0; }
        .quiz-item:first-of-type { border-top: none; padding-top: 0; }
        .quiz-q { font-size: 14.5px; margin: 0 0 8px; }
        .quiz-btn { border: 1px solid var(--line); background: none; border-radius: 999px; padding: 5px 12px; font-size: 12.5px; cursor: pointer; color: var(--ink-soft); }
        .quiz-btn:hover { border-color: var(--teal); color: var(--teal); }
        .quiz-a { margin: 10px 0 0; font-size: 14px; line-height: 1.6; color: var(--ink-soft); background: var(--teal-soft); border-radius: 10px; padding: 10px 12px; }
        .exec-summary { display: flex; flex-direction: column; gap: 28px; max-width: 920px; margin: 0 auto; }
        .exec-summary-level h4 { font-size: 16px; margin-bottom: 10px; }
        .exec-summary-item { display: grid; grid-template-columns: 40px 1fr; gap: 12px; padding: 10px 0; border-top: 1px solid var(--line); }
        .exec-summary-item:first-of-type { border-top: none; }
        .exec-summary-item .code { font-size: 11px; margin-top: 2px; }
        .exec-summary-item div { font-size: 14px; line-height: 1.55; color: var(--ink); }
        .exec-summary-item strong { font-weight: 600; }
        .sub-foot { max-width: 920px; margin: 24px auto 0; }
        .foot { max-width: 920px; margin: 48px auto 0; border-top: 1px solid var(--line); padding-top: 20px; }
        .reset-btn { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--line); background: none; border-radius: 999px; padding: 6px 14px; font-size: 12.5px; cursor: pointer; color: var(--ink-faint); margin-bottom: 12px; }
        .reset-btn:hover { border-color: var(--ink-soft); color: var(--ink-soft); }
        .foot p { color: var(--ink-faint); font-size: 13px; max-width: 60ch; }
        .foot-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 16px; font-size: 13px; }
        .foot-link { display: inline-flex; align-items: center; gap: 5px; color: var(--ink-soft); text-decoration: none; }
        .foot-link:hover { color: var(--teal); }
        .foot-sep { color: var(--line); }
        .coffee-btn {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; padding: 8px 16px;
          border-radius: 999px; background: var(--amber-soft); color: var(--amber); border: 1px solid var(--amber);
          text-decoration: none; font-size: 13px; font-weight: 500;
        }
        .coffee-btn:hover { background: var(--amber); color: #fff; }
        .author { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line); font-size: 12.5px; color: var(--ink-faint); }
        .author a { display: inline-flex; align-items: center; gap: 4px; color: var(--ink-soft); text-decoration: none; }
        .author a:hover { color: var(--teal); }
        .guide button:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
        .guide a:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .progress-fill, .trail-row, .icon-btn, .chip, .marker, .link-tooltip { transition: none; } }
        @media (max-width: 560px) {
          .trail-row { grid-template-columns: 32px 1fr; gap: 10px; }
          .marker { width: 32px; height: 32px; margin-top: 14px; }
          .trail-line { left: 15px; }
          .card { padding: 16px; }
          .modal-card { padding: 18px; }
        }
      `}</style>

      <div className="mode-switcher">
        <div className="mode-tabs" role="tablist" aria-label="modo de visualização">
          <button
            type="button"
            className={"mode-tab" + (mode === "estudo" ? " active" : "")}
            onClick={() => setMode("estudo")}
          >
            <BookOpen size={14} aria-hidden="true" /> Trilha de estudo
          </button>
          <button
            type="button"
            className={"mode-tab" + (mode === "executivo" ? " active" : "")}
            onClick={() => setMode("executivo")}
          >
            <Zap size={14} aria-hidden="true" /> Modo executivo
          </button>
        </div>
      </div>

      {mode === "estudo" ? <StudyView /> : <ExecView />}

      <footer className="foot">
        <p>
          Próxima evolução sugerida: exemplos de código em Python e TypeScript, um mini-lab de
          embeddings com busca real, e uma arquitetura de RAG completa passo a passo.
        </p>

        <div className="foot-actions">
          <a className="foot-link" href={shareLinkedInUrl} target="_blank" rel="noopener noreferrer">
            <Linkedin size={13} aria-hidden="true" /> Compartilhe no LinkedIn
          </a>
          <span className="foot-sep" aria-hidden="true">·</span>
          <a
            className="foot-link"
            href={"mailto:" + AUTHOR.email + "?subject=" + encodeURIComponent("Sugestão de melhoria — Trilha de IA")}
          >
            <Megaphone size={13} aria-hidden="true" /> Sugira melhorias
          </a>
          <span className="foot-sep" aria-hidden="true">·</span>
          <a
            className="foot-link"
            href={"mailto:" + AUTHOR.email + "?subject=" + encodeURIComponent("Feedback — Trilha de IA")}
          >
            <Mail size={13} aria-hidden="true" /> Me mande feedback
          </a>
        </div>

        <a className="coffee-btn" href={AUTHOR.coffee} target="_blank" rel="noopener noreferrer">
          ☕ Gostou? Me pague um café.
        </a>

        <div className="author">
          <span>
            Criado por {AUTHOR.name} · {AUTHOR.role}
          </span>
          <a href={AUTHOR.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={13} aria-hidden="true" /> LinkedIn
          </a>
          <a href={AUTHOR.github} target="_blank" rel="noopener noreferrer">
            <Github size={13} aria-hidden="true" /> GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
