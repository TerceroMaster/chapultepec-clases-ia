/**
 * Plataforma Académica Digital IA
 * Catedrático: Mtro. Luis Ramón Tercero Martínez González
 */

// Estado global de la aplicación
const AppState = {
  currentTab: 'inicio',
  // API Key cargada de forma segura desde env.js (Dokploy), localStorage o modal de configuración
  apiKeyOpenAI: (window.__ENV__ && window.__ENV__.OPENAI_API_KEY) || localStorage.getItem('nexus_openai_key') || '',
  elevenLabsAgentId: (window.__ENV__ && window.__ENV__.ELEVENLABS_AGENT_ID) || localStorage.getItem('nexus_eleven_agent') || 'agent_7001m60bmxq9f65t5djwwcx49cq3',
  activeFilter: 'todos',
  isVoiceRecording: false,
  isGlobalVoiceActive: false,
  synth: window.speechSynthesis || null,
  recognition: null
};

// Base de datos de Asignaturas de Especialidad e Innovación
const ACADEMIC_PROGRAMS = [
  {
    id: 'lic-conta-ia',
    category: 'licenciaturas',
    badge: 'Licenciatura',
    badgeClass: 'badge-lic',
    title: 'Contaduría Pública y Finanzas Aplicando IA',
    subtitle: 'Transforma los datos en decisiones inteligentes',
    coverImg: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    description: 'Automatización de estados financieros, detección de anomalías contables mediante modelos de Machine Learning, auditoría predictiva con Transformers y modelos econométricos potenciados por IA.',
    interactiveLab: 'simulador-finanzas',
    labTitle: 'Simulador Financiero Predictivo & Auditoría con ML',
    topics: ['Modelos Tabulares en Finanzas', 'NLP para Detección de Fraude', 'Agentes Autónomos en Facturación SAT', 'Dashboard Predictivo Cash-Flow']
  },
  {
    id: 'esp-enfermeria-ia',
    category: 'especialidades',
    badge: 'Especialidad',
    badgeClass: 'badge-esp',
    title: 'IA Aplicada en los Servicios de Enfermería',
    subtitle: 'Integra tecnología e innovación clínica de alto impacto',
    coverImg: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    description: 'Automatización integral del Proceso de Atención de Enfermería (PAE) usando NLP en tiempo real (tecnología basada en Clara IA), mitigación del error en dosificación y notas clínicas automatizadas.',
    interactiveLab: 'simulador-pae',
    labTitle: 'Laboratorio PAE Inteligente & Asistente Clínico',
    topics: ['Generación de Diagnósticos NANDA-NIC-NOC con LLMs', 'Transcripción Clínica en Tiempo Real', 'Reducción del 80% de Carga Administrativa', 'Ética y Privacidad Clínica']
  },
  {
    id: 'esp-ia-generativa',
    category: 'especialidades',
    badge: 'Especialidad',
    badgeClass: 'badge-esp',
    title: 'IA Generativa y sus Aplicaciones',
    subtitle: 'Impulsa la transformación digital y modelos autónomos',
    coverImg: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    description: 'Inmersión profunda en arquitecturas Transformer, Fine-Tuning de LLMs, arquitecturas RAG (Retrieval-Augmented Generation), marcos de seguridad ISO 42001 y orquestación de agentes multi-perfil.',
    interactiveLab: 'laboratorio-rag',
    labTitle: 'Playground de Agentes Autónomos & RAG Sandbox',
    topics: ['Modelos Fundacionales & Transformers', 'Bases de Datos Vectoriales y Embeddings', 'Gobernanza y Mitigación de Riesgos (ISO 42001)', 'Agentes Multi-agente de Voz y Texto']
  },
  {
    id: 'mae-hosp-ia',
    category: 'maestrias',
    badge: 'Maestría',
    badgeClass: 'badge-mae',
    title: 'IA Aplicada en la Administración de Hospitales',
    subtitle: 'Innovación, optimización y tecnología para la gestión de la salud',
    coverImg: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    description: 'Optimización algorítmica de camas, triage predictivo, previsión de demanda hospitalaria con modelos multivariados y diseño de tableros directivos inteligentes con IA.',
    interactiveLab: 'simulador-triage',
    labTitle: 'Simulador Directivo: Triage Predictivo & Ocupación Hospitalaria',
    topics: ['Previsión de Recursos Críticos y Farmacia', 'Reducción de Tiempos de Espera en Urgencias', 'Agentes Clínicos para Seguimiento Post-operatorio', 'Modelos Multimodales en Salud']
  },
  {
    id: 'doc-agentes-moe',
    category: 'doctorados',
    badge: 'Doctorado',
    badgeClass: 'badge-doc',
    title: 'Investigación Doctoral: Agentes de IA, MoE y Ecosistemas Multiagente',
    subtitle: 'Seguimiento Farmacoterapéutico Inteligente para Pacientes de Tabasco, México',
    coverImg: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    description: 'Línea de investigación doctoral centrada en arquitecturas Mixture of Experts (MoE y variantes) y sistemas multiagente autónomos para la optimización y adherencia farmacoterapéutica en el sureste de México. Implementación con n8n, ElevenLabs, LangChain, LangGraph, LangGraph-Swarm, LangSmith y Langflow.',
    interactiveLab: 'laboratorio-moe-agentes',
    labTitle: 'Simulador Doctoral: Orquestador Multiagente MoE para Seguimiento Farmacoterapéutico',
    topics: [
      'Arquitecturas MoE (Mixture of Experts) & Especialistas Clínicos',
      'Orquestación con LangGraph, LangGraph-Swarm & Langflow',
      'Agentes Multimodales: Voz (ElevenLabs) + Automatización (n8n)',
      'Trazabilidad y Evaluación con LangSmith & Telemetría en Salud',
      'Casos de Estudio: Adherencia y Monitoreo en Pacientes de Tabasco'
    ]
  }
];

// Base de datos de Talleres
const WORKSHOPS = [
  {
    title: 'Construcción de Agentes de Voz Clínicos con ElevenLabs y Webhooks',
    level: 'Intermedio - Avanzado',
    duration: '12 Horas Prácticas',
    tag: 'Hands-on Coding',
    desc: 'Crea un agente de voz con latencia ultrabaja para atención de consultas de pacientes y estudiantes.'
  },
  {
    title: 'Prompt Engineering Avanzado & Arquitecturas RAG para Negocios',
    level: 'Todos los niveles',
    duration: '8 Horas',
    tag: 'Empresarial',
    desc: 'Conecta documentos contables y manuales institucionales con modelos de lenguaje sin alucinaciones.'
  },
  {
    title: 'Auditoría y Cumplimiento de la Norma ISO 42001 para Sistemas de IA',
    level: 'Especializado',
    duration: '10 Horas',
    tag: 'Gobernanza',
    desc: 'Marco legal y metodológico para certificar que tus soluciones de IA cumplen normas internacionales.'
  }
];

// Base de datos de Cursos
const COURSES = [
  {
    code: 'IA-101',
    title: 'Fundamentos de Inteligencia Artificial & Aprendizaje Automático',
    modules: '6 Módulos',
    status: 'Disponible Abierto',
    desc: 'Desde regresión y árboles de decisión hasta redes neuronales profundas con ejemplos reales en Python.'
  },
  {
    code: 'MED-IA',
    title: 'Simulación Clínica con Pacientes Virtuales para Educación Médica',
    modules: '8 Módulos',
    status: 'Disponible Abierto',
    desc: 'Metodología docente basada en simuladores full-stack interactivos para entrenamiento de criterio clínico.'
  },
  {
    code: 'FIN-IA',
    title: 'Analítica Predictiva y Modelos Tabulares en Finanzas Modernas',
    modules: '5 Módulos',
    status: 'Disponible Abierto',
    desc: 'Aprende a transformar hojas contables tradicionales en sistemas predictivos con modelos Gated.'
  }
];

// Recursos Digitales - NotebookLM Hub
const NOTEBOOK_RESOURCES = [
  {
    id: 'nb-enfermeria',
    title: 'Cuaderno NotebookLM: Protocolos Clínicos & Proceso de Atención de Enfermería',
    subject: 'Especialidad en IA Aplicada en Enfermería',
    audioDuration: '8:45 min',
    summary: 'Resumen ejecutivo con Audio Overview sintetizado sobre la integración de NLP para automatizar notas clínicas NANDA y NIC sin comprometer la ética médica.',
    audioSampleText: 'Bienvenidos al resumen interactivo de la asignatura. En este módulo analizamos cómo la inteligencia artificial no reemplaza el juicio de la enfermera, sino que elimina el 80% de las tareas de captura manual mediante asistentes de voz...'
  },
  {
    id: 'nb-finanzas',
    title: 'Cuaderno NotebookLM: Guía Maestra de Auditoría Predictiva con IA',
    subject: 'Licenciatura en Contaduría y Finanzas',
    audioDuration: '10:12 min',
    summary: 'Compendio analítico sobre modelos de clasificación supervisada para detección de fraudes tributarios, conciliación inteligente y modelos Tabulares.',
    audioSampleText: 'En esta guía de estudio examinamos la transición de la contabilidad reactiva a la predictiva. Los modelos Transformers permiten clasificar transacciones atípicas con precisiones superiores al 94%...'
  },
  {
    id: 'nb-transformers',
    title: 'Cuaderno NotebookLM: GatedTabTransformer vs Redes Convencionales',
    subject: 'Doctorado & Maestría en Salud',
    audioDuration: '12:30 min',
    summary: 'Análisis comparativo de rendimiento en datos médicos reales de pacientes con nefropatía y factores de riesgo metabólico.',
    audioSampleText: 'Este análisis profundiza en los mecanismos de auto-atención para variables mixtas (numéricas y categóricas), demostrando la superioridad del GatedTabTransformer frente a XGBoost en datasets clínicos complejos...'
  }
];

// Base de datos de Artículos Científicos Clasificados por Bloques Temáticos
const SCIENTIFIC_PAPERS_BLOCKS = [
  {
    category: 'profesor',
    badge: 'Bloque 1',
    badgeColor: 'rgba(56, 189, 248, 0.2)',
    badgeTextColor: '#38bdf8',
    title: 'Producción Científica y Tesis del Catedrático',
    papers: [
      {
        year: '2026',
        title: 'Investigación Doctoral: Agentes de IA con MoE (Mixture of Experts) & Multiagentes para Seguimiento Farmacoterapéutico en Tabasco, México',
        status: 'En Desarrollo Doctoral (UJAT 2026-2029)',
        scope: 'Tesis Doctoral en Ciencias de la Computación / Especialidad en IA',
        tags: ['MoE', 'Mixture of Experts', 'LangGraph-Swarm', 'n8n', 'ElevenLabs', 'LangSmith'],
        abstract: 'Diseño e implementación de un ecosistema multiagente autónomo basado en arquitecturas MoE especializadas (farmacocinética, fitoterapia regional e interacciones) para el seguimiento proactivo de pacientes crónicos en el estado de Tabasco.'
      },
      {
        year: '2024',
        title: 'Modelo GatedTabTransformer para el diagnóstico de la Nefropatía Diabética en pacientes con Diabetes Mellitus',
        status: 'Titulado con Mención por Tesis (UJAT)',
        scope: 'Tesis de Maestría en Ciencias de la Computación (IA & Datos)',
        tags: ['GatedTabTransformer', 'Datos Tabulares', 'SOTA', 'Ciencia de Datos'],
        abstract: 'Investigación pionera en la integración de capas de gating a arquitecturas TabTransformer para optimizar la convergencia y explicabilidad en registros clínicos tabulares.'
      }
    ]
  },
  {
    category: 'salud',
    badge: 'Bloque 2',
    badgeColor: 'rgba(16, 185, 129, 0.2)',
    badgeTextColor: '#34d399',
    title: 'Artículos de Inteligencia Artificial Aplicada a la Salud & Farmacia Clínica',
    papers: [
      {
        year: '2026',
        title: 'AlicIA Pharmaceutical: A Privacy-Preserving Multimodal Multi-Profile Clinical Pharmacist for Offline Deployment on Commodity Hardware',
        status: 'Publicado',
        scope: 'Internacional / Inteligencia Artificial en Salud',
        tags: ['Transformers', 'Privacidad Médica', 'Multimodal', 'Edge AI', 'Offline'],
        abstract: 'Desarrollo de un agente farmacológico multimodal capaz de operar sin conexión a internet en hardware estándar, preservando la confidencialidad de datos clínicos y asistiendo en interacciones medicamentosas.'
      },
      {
        year: '2026',
        title: 'Modelo de pacientes virtuales con IA para el desarrollo de habilidades blandas en estudiantes en farmacia clínica y hospitalaria',
        status: 'En Revisión',
        scope: 'Innovación Educativa & IA Clínica',
        tags: ['Simulación Clínica', 'Educación Médica', 'Next.js', 'LLMs', 'Evaluación'],
        abstract: 'Plataforma educativa con pacientes virtuales interactivos para que los estudiantes practiquen empatía, comunicación asertiva y anamnesis clínica antes de enfrentarse a entornos hospitalarios reales.'
      },
      {
        year: '2025',
        title: 'Modelo Transformer para la identificación de la nefropatía diabética en pacientes Mexicanos',
        status: 'Publicado',
        scope: 'Investigación Aplicada / Salud Pública',
        tags: ['Transformers', 'Nefropatía Diabética', 'Deep Learning', 'Salud México'],
        abstract: 'Entrenamiento y evaluación de una arquitectura Transformer ajustada a la epidemiología mexicana para la detección temprana de daño renal en pacientes con Diabetes Mellitus.'
      }
    ]
  },
  {
    category: 'finanzas',
    badge: 'Bloque 3',
    badgeColor: 'rgba(245, 158, 11, 0.2)',
    badgeTextColor: '#fbbf24',
    title: 'Artículos & Desarrollos de IA Aplicada a la Contaduría, Auditoría y Finanzas',
    papers: [
      {
        year: '2025',
        title: 'Modelos Transformers para Clasificación usando Datos Tabulares en Detección de Fraude y Auditoría',
        status: 'Ponencia Internacional (Data Journey Fest, Lima, Perú)',
        scope: 'Finanzas Computacionales & Datos Masivos',
        tags: ['Datos Tabulares', 'Auditoría Predictiva', 'Detección de Anomalías', 'Finanzas'],
        abstract: 'Transferencia de mecanismos de auto-atención profunda para el análisis de transacciones financieras complejas, reduciendo falsos positivos en conciliaciones bancarias masivas.'
      },
      {
        year: '2025',
        title: 'Automatización Inteligente de Discrepancias Fiscales y Modelado Predictivo de Cash-Flow con Deep Learning',
        status: 'Reporte Técnico de Aplicación Financiera',
        scope: 'Contaduría Pública & Tecnologías Fiscales',
        tags: ['Auditoría SAT', 'Cash-Flow Predictivo', 'Machine Learning', 'Finanzas'],
        abstract: 'Metodología basada en redes neuronales supervisadas para la identificación temprana de discrepancias tributarias y optimización de flujo de caja empresarial.'
      }
    ]
  }
];

// Base de Datos de Conceptos de Inteligencia Artificial (Básicos, Intermedios y Avanzados)
const AI_CONCEPTS_CATEGORIES = [
  {
    category: 'basicos',
    name: 'Conceptos Básicos de IA',
    badge: 'Nivel 1 • Fundamentos',
    badgeColor: 'rgba(56, 189, 248, 0.2)',
    badgeTextColor: '#38bdf8',
    concepts: [
      {
        id: 'c-modelo-base',
        term: 'Modelo Base de IA (Foundation Model)',
        tag: 'Arquitectura',
        summary: 'Red neuronal masiva preentrenada en terabytes de datos que aprende representaciones universales del lenguaje, código o visión. Sirve como punto de partida para especialización posterior.',
        readText: 'Modelo Base de Inteligencia Artificial. Es una red neuronal masiva preentrenada con terabytes de información. Aprende representaciones generales del conocimiento y el lenguaje, sirviendo como fundamento para tareas especializadas mediante fine-tuning o prompting.'
      },
      {
        id: 'c-prompt',
        term: 'Prompt (Instrucción de Entrada)',
        tag: 'Interacción',
        summary: 'Entrada en lenguaje natural o estructurado que un usuario proporciona al modelo para guiar su respuesta, razonamiento o generación de contenido.',
        readText: 'Prompt o Instrucción de Entrada. Es el texto o conjunto de órdenes en lenguaje natural que le damos a un modelo de lenguaje para indicarle exactamente qué tarea debe realizar, el formato de salida y el contexto requerido.'
      },
      {
        id: 'c-system-prompt',
        term: 'System Prompt (Instrucción de Sistema)',
        tag: 'Gobernanza & Rol',
        summary: 'Directriz raíz e invisible para el usuario final que define la identidad, tono, restricciones éticas, políticas de seguridad y límites operativos del modelo antes de cualquier interacción.',
        readText: 'System Prompt o Instrucción de Sistema. Es la instrucción maestra que define la personalidad, las reglas de seguridad, el tono profesional y los límites de un modelo de inteligencia artificial antes de que el usuario comience a chatear.'
      },
      {
        id: 'c-temperatura',
        term: 'Temperatura (Hiperparámetro de Aleatoriedad)',
        tag: 'Inferencia',
        summary: 'Parámetro numérico (0.0 a 2.0) que modula la probabilidad de los siguientes tokens. Cero genera respuestas deterministas y lógicas; valores altos fomentan creatividad y variedad.',
        readText: 'Temperatura. Es un hiperparámetro que controla qué tan predecible o creativo es un modelo. Con temperatura cero, el modelo es estrictamente lógico y determinista; con temperaturas altas, explora combinaciones de palabras más variadas y creativas.'
      },
      {
        id: 'c-embeddings',
        term: 'Embeddings (Vectores de Significado Semántico)',
        tag: 'Representación',
        summary: 'Representaciones matemáticas en vectores multidimensionales donde palabras, oraciones o documentos con significado similar quedan ubicados cerca en el espacio vectorial.',
        readText: 'Embeddings o Vectores Semánticos. Son traducciones matemáticas del texto a listas de números en múltiples dimensiones. Permiten que la computadora entienda qué tan cerca o lejos está el significado de dos conceptos.'
      }
    ]
  },
  {
    category: 'intermedios',
    name: 'Conceptos Intermedios de IA',
    badge: 'Nivel 2 • Aplicación & Orquestación',
    badgeColor: 'rgba(16, 185, 129, 0.2)',
    badgeTextColor: '#34d399',
    concepts: [
      {
        id: 'c-rag',
        term: 'RAG (Retrieval-Augmented Generation)',
        tag: 'Memoria Externa',
        summary: 'Arquitectura que recupera fragmentos relevantes de bases de datos vectoriales propias antes de que el modelo responda, eliminando alucinaciones y citando fuentes fidedignas.',
        readText: 'RAG, o Generación Aumentada por Recuperación. Es una técnica donde el modelo busca en una base de datos privada antes de responder. Esto evita que invente respuestas falsas y le permite consultar manuales contables o expedientes médicos en tiempo real.'
      },
      {
        id: 'c-agente-ia',
        term: 'Agente de IA (AI Agent Autónomo)',
        tag: 'Autonomía',
        summary: 'Sistema impulsado por un modelo que percibe su entorno, planifica pasos secuenciales, toma decisiones y ejecuta acciones en el mundo real llamando a herramientas y APIs externas.',
        readText: 'Agente de Inteligencia Artificial. Es un sistema autónomo que va más allá de un simple chatbot. Puede percibir un objetivo, planificar una serie de pasos, consultar herramientas externas como calendarios o bases de datos, y tomar decisiones para resolver una tarea completa.'
      },
      {
        id: 'c-human-loop',
        term: 'Human-in-the-Loop (HITL)',
        tag: 'Seguridad & Control',
        summary: 'Diseño arquitectónico donde un experto humano supervisa, valida o autoriza decisiones críticas del agente (como emitir una receta médica o transferir fondos) antes de su ejecución final.',
        readText: 'Human in the loop, o Humano en el Bucle. Es una práctica de seguridad donde el agente de inteligencia artificial prepara un análisis o diagnóstico, pero requiere forzosamente la autorización y firma de un profesional humano antes de ejecutar una acción crítica.'
      },
      {
        id: 'c-guardrails',
        term: 'Guardrails (Límites y Barreras para Agentes)',
        tag: 'Contención',
        summary: 'Capas de validación programáticas o de modelos especializados (ej. NeMo Guardrails) que verifican entradas y salidas para evitar sesgos, temas prohibidos o fugas de datos.',
        readText: 'Guardrails o Límites para Agentes. Son vallas de contención de software que inspeccionan los mensajes de entrada y salida del agente, asegurando que nunca hable de temas prohibidos, no filtre secretos y respete las normas éticas de la institución.'
      },
      {
        id: 'c-fine-tuning',
        term: 'Fine-Tuning (Ajuste Fino de Pesos)',
        tag: 'Especialización',
        summary: 'Proceso de reentrenamiento supervisado con datasets curados para adaptar un modelo base a un dialecto, estilo o tarea técnica específica (como terminología clínica o fiscal SAT).',
        readText: 'Fine-tuning o Ajuste Fino. Consiste en reentrenar ligeramente un modelo ya existente con miles de ejemplos especializados para que hable con el vocabulario exacto de un enfermero, un abogado o un auditor fiscal.'
      }
    ]
  },
  {
    category: 'avanzados',
    name: 'Conceptos Avanzados de IA',
    badge: 'Nivel 3 • Frontera & Estado del Arte (SOTA)',
    badgeColor: 'rgba(236, 72, 153, 0.2)',
    badgeTextColor: '#f472b6',
    concepts: [
      {
        id: 'c-graphrag',
        term: 'GraphRAG (RAG Potenciado con Grafos de Conocimiento)',
        tag: 'Grafos & Razonamiento',
        summary: 'Evolución del RAG vectorial que estructura los datos en nodos y relaciones (usando grafos como Neo4j). Permite inferir causalidad, relaciones indirectas y comprensión holística de corpus masivos.',
        readText: 'GraphRAG. Es la evolución de vanguardia del RAG tradicional. En lugar de buscar solo por coincidencia matemática en vectores, utiliza grafos de conocimiento con nodos y conexiones para entender relaciones complejas, causalidad e interacciones entre medicamentos o entidades financieras.'
      },
      {
        id: 'c-multiagente',
        term: 'Sistema Multiagente de IA (Multi-Agent Swarm / LangGraph)',
        tag: 'Colaboración',
        summary: 'Ecosistema de múltiples agentes con roles especializados (ej. Investigador, Auditor, Crítico, Redactor) que colaboran, debaten y se transfieren tareas mediante grafos de control cíclico.',
        readText: 'Sistemas Multiagente de Inteligencia Artificial. Son redes donde varios agentes autónomos con diferentes especialidades cooperan entre sí. Por ejemplo, un agente revisa los signos vitales, otro consulta la farmacocinética y un agente supervisor valida la decisión final.'
      },
      {
        id: 'c-transformers',
        term: 'Arquitectura Transformers & Auto-Atención',
        tag: 'Mecanismo Central',
        summary: 'Arquitectura basada en Self-Attention que procesa todos los elementos de una secuencia simultáneamente en paralelo, calculando el peso relacional de cada token respecto a los demás.',
        readText: 'Arquitectura Transformers. Es la revolución computacional creada en 2017 basada en el mecanismo de autoatención. Permite procesar enormes cantidades de texto en paralelo, comprendiendo el contexto de cada palabra en relación con todo el documento simultáneamente.'
      },
      {
        id: 'c-moe',
        term: 'MoE (Mixture of Experts & Sparse Gating)',
        tag: 'Modelos de Frontera',
        summary: 'Arquitectura donde capas densas se reemplazan por múltiples sub-redes especialistas. Un router disperso activa solo 2 o 4 expertos por token (técnica clave de DeepSeek-V3, Nemotron y Kimi).',
        readText: 'Mixture of Experts, o Mezcla de Expertos. Es la arquitectura utilizada por los modelos de frontera más rápidos del mundo, como DeepSeek y Nemotron. Divide el modelo en decenas de mini expertos y activa únicamente a los dos más idóneos para cada palabra, reduciendo el costo hasta un setenta por ciento.'
      },
      {
        id: 'c-jailbreaking',
        term: 'Jailbreaking de IA & Red Teaming Adversario',
        tag: 'Ciberseguridad IA',
        summary: 'Pruebas de estrés y metodologías de ataque (Many-shot, Roleplay, Prompt Injections) para forzar a un modelo a saltarse sus barreras de seguridad, permitiendo parcharlo antes del despliegue.',
        readText: 'Jailbreaking y Red Teaming Adversario. Son metodologías de seguridad informática avanzadas donde se simulan ataques cibernéticos contra el modelo para encontrar vulnerabilidades y blindar los agentes antes de su lanzamiento comercial.'
      }
    ]
  }
];

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
  renderPrograms('todos');
  renderNotebooks();
  renderPapers();
  renderConcepts();
  renderWorkshops();
  renderCourses();
  setupNavigation();
  setupSimulators();
  setupChat();
  setupVoiceAgent();
  setupKeysModal();
  setupGlobalVoiceWidget();
  setupElevenLabsAriaWidget();
});

// LÓGICA DE VOZ FEMENINA INTELIGENTE (Web Speech API)
let currentSpeechCardId = null;

function speakTextFemaleVoice(text, cardId, event) {
  if (event) event.stopPropagation();
  
  if (!window.speechSynthesis) {
    alert('Tu navegador no soporta síntesis de voz Web Speech.');
    return;
  }
  
  // Si ya estaba leyendo la misma tarjeta, pausar/detener
  if (window.speechSynthesis.speaking && currentSpeechCardId === cardId) {
    window.speechSynthesis.cancel();
    resetActiveCardSpeech();
    return;
  }
  
  // Cancelar lectura anterior si existía
  window.speechSynthesis.cancel();
  resetActiveCardSpeech();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-MX';
  utterance.rate = 1.05;
  utterance.pitch = 1.15; // Tono más agudo / femenino agradable
  
  // Buscar voz femenina en español si el sistema la ofrece
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v => 
    (v.lang.includes('es') || v.lang.includes('ES')) && 
    (v.name.toLowerCase().includes('sabina') || 
     v.name.toLowerCase().includes('paulina') || 
     v.name.toLowerCase().includes('monica') || 
     v.name.toLowerCase().includes('helena') || 
     v.name.toLowerCase().includes('female') || 
     v.name.toLowerCase().includes('maria') || 
     v.name.toLowerCase().includes('lucia') ||
     v.name.toLowerCase().includes('zira') ||
     v.name.toLowerCase().includes('laura'))
  ) || voices.find(v => v.lang.includes('es') || v.lang.includes('ES'));
  
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }
  
  const cardElement = document.getElementById(`card-${cardId}`);
  if (cardElement) {
    cardElement.classList.add('reading-active');
    currentSpeechCardId = cardId;
  }
  
  utterance.onend = () => {
    resetActiveCardSpeech();
  };
  
  utterance.onerror = () => {
    resetActiveCardSpeech();
  };
  
  window.speechSynthesis.speak(utterance);
}

function resetActiveCardSpeech() {
  document.querySelectorAll('.concept-card').forEach(c => c.classList.remove('reading-active'));
  currentSpeechCardId = null;
}

// RENDERIZAR CONCEPTOS DE IA DIVIDIDOS EN 3 CATEGORÍAS
function renderConcepts() {
  const container = document.getElementById('concepts-container');
  if (!container) return;
  
  container.innerHTML = AI_CONCEPTS_CATEGORIES.map(cat => `
    <div class="concept-category-block">
      <div class="concept-category-header">
        <span class="paper-block-badge" style="background:${cat.badgeColor}; color:${cat.badgeTextColor};">${cat.badge}</span>
        <h3>${cat.name}</h3>
      </div>
      <div class="concepts-cards-grid">
        ${cat.concepts.map(c => `
          <div class="concept-card" id="card-${c.id}" onclick="speakTextFemaleVoice('${c.readText.replace(/'/g, "\\'")}', '${c.id}', event)">
            <div class="concept-card-top">
              <span class="concept-tag" style="background:rgba(255,255,255,0.06); color:var(--brand-cyan);">${c.tag}</span>
              <button class="btn-speak-concept" title="Escuchar en voz femenina" onclick="speakTextFemaleVoice('${c.readText.replace(/'/g, "\\'")}', '${c.id}', event)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              </button>
            </div>
            <h4>${c.term}</h4>
            <p>${c.summary}</p>
            <div class="concept-card-footer">
              <span class="concept-voice-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                Clic para escuchar en voz de mujer
              </span>
              <span>Audio Activo</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// NAVEGACIÓN ENTRE SECCIONES
function setupNavigation() {
  // Manejador del botón Menú Desplegable (Mega Menú)
  const menuTrigger = document.getElementById('btn-menu-trigger');
  const megaMenu = document.getElementById('mega-menu-modal');
  const closeMega = document.getElementById('btn-close-mega');
  
  if (menuTrigger && megaMenu) {
    menuTrigger.addEventListener('click', () => {
      megaMenu.classList.add('active');
    });
  }
  
  if (closeMega && megaMenu) {
    closeMega.addEventListener('click', () => {
      megaMenu.classList.remove('active');
    });
  }
  
  if (megaMenu) {
    megaMenu.addEventListener('click', (e) => {
      if (e.target === megaMenu) megaMenu.classList.remove('active');
    });
  }

  // Todos los elementos con data-target (en nav y en mega-menú)
  const navTargets = document.querySelectorAll('[data-target]');
  navTargets.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      switchView(targetId);
      if (megaMenu) megaMenu.classList.remove('active');
    });
  });
}

function switchView(viewId) {
  AppState.currentTab = viewId;
  const sections = document.querySelectorAll('.view-section');
  sections.forEach(sec => {
    sec.classList.remove('active');
  });
  
  const activeSec = document.getElementById(`view-${viewId}`);
  if (activeSec) {
    activeSec.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Actualizar botones de acceso rápido activos
  document.querySelectorAll('.nav-quick-btn').forEach(btn => {
    if (btn.getAttribute('data-target') === viewId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// RENDERIZAR ASIGNATURAS / PROGRAMAS
function renderPrograms(filter) {
  const container = document.getElementById('programs-container');
  if (!container) return;
  
  const filtered = filter === 'todos' 
    ? ACADEMIC_PROGRAMS 
    : ACADEMIC_PROGRAMS.filter(p => p.category === filter);
    
  container.innerHTML = filtered.map(p => `
    <div class="program-card">
      <div class="card-top" style="background-image: url('${p.coverImg}');">
        <span class="card-badge ${p.badgeClass}">${p.badge}</span>
      </div>
      <div class="card-body">
        <div class="ai-interactive-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
          Módulo con IA Activa
        </div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        
        <div style="margin-bottom: 1rem;">
          <small style="color: var(--text-dim); display:block; margin-bottom: 0.35rem; font-weight:600;">Ejes Temáticos Clave:</small>
          <ul style="padding-left: 1.1rem; font-size: 0.82rem; color: #94a3b8;">
            ${p.topics.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
        
        <div class="card-footer">
          <span style="font-size: 0.8rem; color: var(--brand-cyan); font-weight: 600;">Prof. Mtro. Luis Ramón Tercero</span>
          <button class="btn-card-action" onclick="openInteractiveLab('${p.id}')">
            Probar Simulador IA
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// FILTRADO POR CATEGORÍA
window.filterCategory = function(cat, btnElement) {
  document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderPrograms(cat);
};

// RENDERIZAR NOTEBOOKLM HUB
function renderNotebooks() {
  const container = document.getElementById('notebooks-container');
  if (!container) return;
  
  container.innerHTML = NOTEBOOK_RESOURCES.map(nb => `
    <div class="notebook-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.75rem;">
        <span style="font-size: 0.72rem; background: rgba(168, 85, 247, 0.15); color: #c084fc; padding: 0.25rem 0.65rem; border-radius: 9999px; font-weight: 700;">NotebookLM Powered</span>
        <span style="font-size: 0.8rem; color: var(--text-dim); font-weight: 600;">${nb.audioDuration}</span>
      </div>
      <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.4rem; color: #fff;">${nb.title}</h3>
      <p style="font-size: 0.85rem; color: var(--brand-cyan); margin-bottom: 0.75rem; font-weight: 500;">${nb.subject}</p>
      <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">${nb.summary}</p>
      
      <!-- Audio Overview Simulator -->
      <div class="audio-player-mock">
        <button class="btn-play" onclick="playNotebookAudio('${nb.id}', this)">
          <svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <div class="audio-track-info">
          <div style="display:flex; justify-content:space-between; font-size: 0.78rem;">
            <span>Resumen Conversacional (Audio Overview)</span>
            <span class="audio-timer">00:00</span>
          </div>
          <div class="track-progress">
            <div class="track-bar" id="track-${nb.id}"></div>
          </div>
        </div>
      </div>
      
      <div style="margin-top: auto; display:flex; gap: 0.5rem;">
        <button class="btn-secondary" style="font-size: 0.8rem; padding: 0.5rem 1rem; width: 100%; justify-content:center;" onclick="showNotebookTranscript('${nb.id}')">
          Ver Transcripción & Esquema
        </button>
      </div>
    </div>
  `).join('');
}

// RENDERIZAR PRODUCCIÓN CIENTÍFICA CLASIFICADA POR BLOQUES
function renderPapers() {
  const container = document.getElementById('papers-container');
  if (!container) return;
  
  container.innerHTML = SCIENTIFIC_PAPERS_BLOCKS.map(block => `
    <div class="paper-block-section">
      <div class="paper-block-header">
        <span class="paper-block-badge" style="background:${block.badgeColor}; color:${block.badgeTextColor};">${block.badge}</span>
        <h3>${block.title}</h3>
      </div>
      <div>
        ${block.papers.map(p => `
          <div class="paper-item">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem; flex-wrap:wrap; gap:0.5rem;">
              <span class="paper-year">${p.year} • ${p.status}</span>
              <span style="font-size: 0.8rem; color: var(--text-dim);">${p.scope}</span>
            </div>
            <h4 class="paper-title">${p.title}</h4>
            <div class="paper-meta">Investigador: <strong>Mtro. Luis Ramón Tercero Martínez González</strong> (UJAT / FTF AI Factory)</div>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.6;">${p.abstract}</p>
            <div class="paper-tags">
              ${p.tags.map(t => `<span class="p-pill">${t}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// RENDERIZAR TALLERES Y CURSOS
function renderWorkshops() {
  const container = document.getElementById('workshops-container');
  if (!container) return;
  container.innerHTML = WORKSHOPS.map(w => `
    <div class="program-card" style="padding: 1.75rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
        <span class="card-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">${w.tag}</span>
        <small style="color: var(--text-dim);">${w.duration}</small>
      </div>
      <h3 style="font-size: 1.25rem; font-weight:700; margin-bottom: 0.6rem;">${w.title}</h3>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">${w.desc}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: auto;">
        <span style="font-size: 0.8rem; color: var(--text-dim);">Nivel: ${w.level}</span>
        <button class="btn-primary" style="font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="alert('Inscripción libre para alumnos. ¡Bienvenido al taller!')">Acceder al Taller</button>
      </div>
    </div>
  `).join('');
}

function renderCourses() {
  const container = document.getElementById('courses-container');
  if (!container) return;
  container.innerHTML = COURSES.map(c => `
    <div class="program-card" style="padding: 1.75rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
        <span class="card-badge" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;">${c.code}</span>
        <small style="color: var(--brand-emerald); font-weight:600;">${c.status}</small>
      </div>
      <h3 style="font-size: 1.25rem; font-weight:700; margin-bottom: 0.6rem;">${c.title}</h3>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">${c.desc}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: auto;">
        <span style="font-size: 0.8rem; color: var(--text-dim);">${c.modules}</span>
        <button class="btn-secondary" style="font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="alert('Plan de estudio y lecciones abiertas cargadas correctamente.')">Ver Programa</button>
      </div>
    </div>
  `).join('');
}

// SIMULADORES / INTERACTIVE LABS
function openInteractiveLab(progId) {
  const prog = ACADEMIC_PROGRAMS.find(p => p.id === progId);
  if (!prog) return;
  
  const modal = document.getElementById('lab-modal');
  const title = document.getElementById('modal-lab-title');
  const body = document.getElementById('modal-lab-body');
  
  title.innerHTML = `
    <span class="card-badge ${prog.badgeClass}" style="margin-right: 0.5rem;">${prog.badge}</span>
    ${prog.labTitle}
  `;
  
  if (prog.id === 'lic-conta-ia') {
    body.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Prueba el algoritmo de detección de anomalías y conciliación bancaria inteligente. Ajusta los parámetros del modelo para observar la clasificación en tiempo real:
        </p>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <label style="font-size: 0.85rem; color: var(--text-dim); display:block; margin-bottom: 0.4rem;">Volumen de Facturas Simuladas:</label>
          <input type="range" id="sim-volume" min="100" max="5000" value="1250" style="width:100%;" oninput="document.getElementById('vol-val').innerText = this.value">
          <span id="vol-val" style="font-size: 0.9rem; font-weight:700; color: var(--brand-cyan);">1250</span> transacciones
        </div>
        <div>
          <label style="font-size: 0.85rem; color: var(--text-dim); display:block; margin-bottom: 0.4rem;">Sensibilidad del Modelo TabTransformer:</label>
          <select id="sim-sensitivity" style="width:100%; padding: 0.4rem; background: #0f172a; color:#fff; border: 1px solid var(--border-subtle); border-radius: 6px;">
            <option value="0.95">Alta (95% - Tolerancia cero a discrepancias)</option>
            <option value="0.90" selected>Equilibrada (90% - E-commerce y Nómina)</option>
            <option value="0.80">Básica (80% - Análisis preliminar)</option>
          </select>
        </div>
      </div>
      <button class="btn-primary" style="width:100%; justify-content:center; margin-bottom: 1.5rem;" onclick="runFinanceSim()">
        Ejecutar Inferencia del Modelo
      </button>
      <div id="sim-result-box" style="background: #090e17; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1.25rem; font-family: monospace; font-size: 0.88rem; color: #a5f3fc; min-height: 120px;">
        Presiona 'Ejecutar Inferencia' para procesar el lote con el modelo predictivo...
      </div>
    `;
  } else if (prog.id === 'esp-enfermeria-ia') {
    body.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          <strong>Simulador Clara IA / Asistente PAE:</strong> Introduce un caso clínico rápido o síntomas para generar el plan de cuidados automatizado NANDA-NIC-NOC con IA generativa:
        </p>
      </div>
      <textarea id="pae-input" style="width:100%; height: 90px; background:#090e17; border:1px solid var(--border-subtle); border-radius: 8px; padding: 0.75rem; color:#fff; font-size: 0.9rem; margin-bottom: 1rem;" placeholder="Ejemplo: Paciente masculino de 58 años, diabético tipo 2, refiere fatiga extrema, cefalea pulsátil, TA 150/95 mmHg, edema maleolar bilateral ++..."></textarea>
      <button class="btn-primary" style="width:100%; justify-content:center; margin-bottom: 1.25rem;" onclick="runPAESim()">
        Generar Diagnóstico PAE con Copiloto Clínico
      </button>
      <div id="pae-result" style="background: #090e17; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1.25rem; font-size: 0.88rem; min-height: 140px; color: #cbd5e1;">
        Esperando datos del paciente...
      </div>
    `;
  } else if (prog.id === 'doc-agentes-moe') {
    body.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          <strong>Simulador de Orquestación MoE & Ecosistema Multiagente:</strong> Demostración de la tesis doctoral del <strong>Mtro. Luis Ramón Tercero Martínez</strong> para el seguimiento farmacoterapéutico en el estado de Tabasco, México.
        </p>
      </div>
      <div style="background:#090e17; border:1px solid var(--border-subtle); border-radius:8px; padding:1rem; margin-bottom: 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.6rem;">
          <span style="font-size:0.8rem; color:var(--brand-cyan); font-weight:700;">Stack Tecnológico de la Tesis:</span>
          <span style="font-size:0.75rem; color:#94a3b8;">LangGraph-Swarm • LangSmith • n8n • ElevenLabs • Langflow</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
          <span class="p-pill" style="border-color:#38bdf8; background:rgba(56,189,248,0.1); color:#38bdf8;">Router Gating MoE</span>
          <span class="p-pill" style="border-color:#a855f7; background:rgba(168,85,247,0.1); color:#c084fc;">Expert: Adherencia & Horarios</span>
          <span class="p-pill" style="border-color:#10b981; background:rgba(16,185,129,0.1); color:#34d399;">Expert: Interacciones Fármaco-Nutriente</span>
          <span class="p-pill" style="border-color:#f59e0b; background:rgba(245,158,11,0.1); color:#fbbf24;">Agente de Voz ElevenLabs</span>
        </div>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="font-size: 0.85rem; color: var(--text-dim); display:block; margin-bottom: 0.4rem;">Seleccionar Perfil de Paciente de Tabasco (Cohorte de Estudio):</label>
        <select id="moe-scenario" style="width:100%; padding: 0.55rem; background: #0f172a; color:#fff; border: 1px solid var(--border-subtle); border-radius: 6px;">
          <option value="1">Paciente 64 años (Villahermosa/Centro): Polimedicado (Metformina + Enalapril) con reporte de cefalea y mareo</option>
          <option value="2">Paciente 52 años (Cárdenas): Insulina NPH + consumo concomitante de plantas medicinales locales</option>
          <option value="3">Paciente 59 años (Comalcalco): Dificultad para recordar horarios y necesidad de llamada de voz preventiva</option>
        </select>
      </div>
      <button class="btn-primary" style="width:100%; justify-content:center; margin-bottom: 1.25rem;" onclick="runDoctoralMoESim()">
        Ejecutar Enrutador MoE & Grafo de Agentes (LangGraph-Swarm)
      </button>
      <div id="moe-result-box" style="background: #090e17; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1.25rem; font-size: 0.88rem; min-height: 150px; color: #cbd5e1; font-family: monospace;">
        Esperando ejecución del grafo multiagente...
      </div>
    `;
  } else {
    body.innerHTML = `
      <div style="padding: 1rem 0;">
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
          Este laboratorio integra un entorno de ejecución demostrativo diseñado por el <strong>Mtro. Luis Ramón Tercero Martínez</strong> para que los estudiantes interactúen con agentes de IA reales y modelos Transformer.
        </p>
        <div style="background: #090e17; border-left: 4px solid var(--brand-cyan); padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem;">
          <h4 style="color:#fff; margin-bottom: 0.35rem;">Tecnologías integradas en este módulo:</h4>
          <p style="color: var(--text-dim); font-size: 0.85rem;">Python, Modelos Transformers, Embeddings Vectoriales, Evaluación Clínica en Hardware Estándar y Validación Cruzada.</p>
        </div>
        <button class="btn-primary" style="width:100%; justify-content:center;" onclick="closeModal()">
          Entendido / Regresar al Aula
        </button>
      </div>
    `;
  }
  
  modal.classList.add('active');
}

window.runDoctoralMoESim = function() {
  const box = document.getElementById('moe-result-box');
  const sel = document.getElementById('moe-scenario').value;
  box.innerHTML = '⚡ Inicializando LangGraph-Swarm... Router MoE evaluando tokens de consulta... Trazabilidad en LangSmith iniciada...';
  
  setTimeout(() => {
    let details = '';
    if (sel === '1') {
      details = `
[LANGGRAPH-SWARM] Router MoE activó: [Expert 1: Farmacocinética] + [Expert 3: Riesgo Cardiovascular]
---------------------------------------------------------------------------------
• Diagnóstico MoE: Posible hipotensión ortostática por interacción Enalapril + deshidratación térmica regional.
• Flujo n8n disparado: Webhook enviado a enfermera de enlace y ajuste en bitácora clínica.
• Trazabilidad LangSmith: Latencia de routing: 18ms | Precisión de selección experta: 99.4%
• Agente de Voz ElevenLabs: Programada nota de voz automática matutina con instrucciones claras en lenguaje coloquial.
---------------------------------------------------------------------------------
Resultado: Alerta preventiva emitida sin saturar urgencias hospitalarias.`;
    } else if (sel === '2') {
      details = `
[LANGGRAPH-SWARM] Router MoE activó: [Expert 2: Interacciones Fitoterapia / Fármacos] + [Expert 1: Glucemia]
---------------------------------------------------------------------------------
• Detección Crítica: Interacción potencial de hipoglucemia severa entre infusión regional e Insulina NPH.
• Alerta en tiempo real: Se genera notificación prioritaria en tablero clínico y mensaje de voz al paciente.
• Orquestación n8n: Sincronización automática con el expediente clínico electrónico.
• Auditoría LangSmith: Run ID #moe-tabasco-7829 validado y clasificado como evento adverso evitado.
---------------------------------------------------------------------------------
Resultado: Protección inmediata del paciente en su entorno domiciliario.`;
    } else {
      details = `
[LANGGRAPH-SWARM] Router MoE activó: [Expert 4: Conducta & Adherencia] + [Agente de Voz ElevenLabs]
---------------------------------------------------------------------------------
• Diagnóstico MoE: Barrera de cumplimiento por complejidad de pauta posológica post-alta.
• Intervención del Swarm: Generación de agenda automatizada mediante llamadas vocales interactivas de ElevenLabs.
• Integración n8n: Disparo programado de recordatorios de voz y seguimiento de confirmación por respuesta oral.
• LangSmith Trace: Ejecución exitosa de nodo "ConfirmaciónPosologíaNode" (Cost: $0.0012).
---------------------------------------------------------------------------------
Resultado: Adherencia terapéutica proyectada al 92% para el paciente en Tabasco.`;
    }
    box.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit; color: #a5f3fc;">${details}</pre>`;
  }, 700);
};

window.runFinanceSim = function() {
  const box = document.getElementById('sim-result-box');
  box.innerHTML = '⚡ Inicializando tensores... Evaluando discrepancias con GatedTabTransformer...';
  setTimeout(() => {
    box.innerHTML = `
[OK] Lote procesado: 1,250 pólizas analizadas en 42ms.
------------------------------------------------------------
• 1,234 Pólizas verificadas y cuadradas automáticamente (98.72%)
• 16 Transacciones catalogadas con riesgo de anomalía / duplicidad
• 3 Inconsistencias en retenciones ISR/IVA señaladas al auditor
------------------------------------------------------------
Métrica de Ahorro: Reducción estimada de 18.5 horas de auditoría manual.
Recomendación del Agente: Enviar resumen a CFO y emitir alertas tempranas.
    `;
  }, 600);
};

window.runPAESim = function() {
  const input = document.getElementById('pae-input').value.trim();
  const box = document.getElementById('pae-result');
  box.innerHTML = '⚡ Procesando notas clínicas con motor NLP especializado en Enfermería...';
  setTimeout(() => {
    box.innerHTML = `
<div style="color: var(--brand-emerald); font-weight:700; margin-bottom: 0.5rem;">✓ Proceso de Atención de Enfermería (PAE) Generado:</div>
<div style="margin-bottom: 0.5rem;"><strong>1. Diagnóstico NANDA sugerido:</strong> [00179] Riesgo de nivel de glucemia inestable r/c falta de adherencia al plan terapéutico y [00204] Perfusión tisular periférica ineficaz evidenciado por edema maleolar ++.</div>
<div style="margin-bottom: 0.5rem;"><strong>2. Criterios de Resultado (NOC):</strong> Estado circulatorio (0401) y Severidad de la hipertensión (2112).</div>
<div><strong>3. Intervenciones de Enfermería (NIC):</strong> Monitorización de signos vitales cada 4 hrs, control de balance hídrico y educación diabetológica personalizada.</div>
<div style="margin-top: 0.75rem; font-size: 0.78rem; color: var(--text-dim); border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 0.5rem;">
  *Tiempo de documentación reducido de 35 min a 45 segundos. Validación final bajo criterio del enfermero a cargo.
</div>
    `;
  }, 750);
};

// AUDIO / NOTEBOOKLM SIMULADOR
function playNotebookAudio(id, btn) {
  const nb = NOTEBOOK_RESOURCES.find(n => n.id === id);
  if (!nb) return;
  
  if (AppState.synth && AppState.synth.speaking) {
    AppState.synth.cancel();
    btn.innerHTML = `<svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    return;
  }
  
  if (AppState.synth) {
    const utterance = new SpeechSynthesisUtterance(nb.audioSampleText);
    utterance.lang = 'es-MX';
    utterance.rate = 1.05;
    
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    
    utterance.onend = () => {
      btn.innerHTML = `<svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    };
    
    AppState.synth.speak(utterance);
  } else {
    alert(`Reproduciendo Audio Overview sintetizado de NotebookLM: "${nb.title}"`);
  }
}

function showNotebookTranscript(id) {
  const nb = NOTEBOOK_RESOURCES.find(n => n.id === id);
  if (!nb) return;
  
  const modal = document.getElementById('lab-modal');
  const title = document.getElementById('modal-lab-title');
  const body = document.getElementById('modal-lab-body');
  
  title.innerHTML = `NotebookLM: ${nb.title}`;
  body.innerHTML = `
    <div style="margin-bottom: 1rem; color: var(--brand-cyan); font-weight:600;">Materia: ${nb.subject}</div>
    <div style="background:#090e17; padding: 1.25rem; border-radius: 8px; border:1px solid var(--border-subtle); line-height: 1.6; font-size: 0.92rem; color: #cbd5e1;">
      <h4 style="color:#fff; margin-bottom: 0.5rem;">Transcripción del Audio Overview:</h4>
      <p style="margin-bottom: 1rem;">"${nb.audioSampleText}"</p>
      <h4 style="color:#fff; margin-bottom: 0.5rem;">Puntos de Estudio Destacados por la IA:</h4>
      <ul style="padding-left: 1.25rem;">
        <li>Estructuración de datos y mitigación de sesgos.</li>
        <li>Aplicabilidad inmediata en entornos profesionales y toma de decisiones.</li>
        <li>Casos de estudio y referencias bibliográficas cargadas en el corpus del Notebook.</li>
      </ul>
    </div>
  `;
  modal.classList.add('active');
}

// SETUP MODAL
function setupSimulators() {
  const modal = document.getElementById('lab-modal');
  const closeBtn = document.querySelector('.btn-close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

function closeModal() {
  const modal = document.getElementById('lab-modal');
  if (modal) modal.classList.remove('active');
}

// CHAT EN VIVO - AGENTE DE TEXTO (OpenAI / Demo Inteligente)
function setupChat() {
  const sendBtn = document.getElementById('btn-send-chat');
  const input = document.getElementById('chat-text-input');
  
  if (sendBtn && input) {
    sendBtn.addEventListener('click', sendUserMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendUserMessage();
    });
  }
}

// UTILIDAD PARA FORMATEAR RESPUESTAS EN LISTAS LIMPIAS Y PROFESIONALES
function formatChatReply(rawText) {
  if (!rawText) return '';
  
  // Limpiar y normalizar líneas
  const lines = rawText.trim().split('\n');
  let html = '';
  let inOrderedList = false;
  let inUnorderedList = false;

  const closeLists = () => {
    if (inOrderedList) {
      html += '</ol>';
      inOrderedList = false;
    }
    if (inUnorderedList) {
      html += '</ul>';
      inUnorderedList = false;
    }
  };

  const formatInline = (str) => {
    return str
      // Negritas **texto**
      .replace(/\*\*(.*?)\*\*/g, '<strong class="chat-accent">$1</strong>')
      // Código `codigo`
      .replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>')
      // Enlaces markdown [texto](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      closeLists();
      continue;
    }

    // Coincidencia con lista numerada: 1. o 1)
    const numMatch = line.match(/^(\d+)[\.\)]\s+(.*)$/);
    // Coincidencia con lista desordenada: - o * o •
    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);

    if (numMatch) {
      if (inUnorderedList) {
        html += '</ul>';
        inUnorderedList = false;
      }
      if (!inOrderedList) {
        html += '<ol class="chat-ordered-list">';
        inOrderedList = true;
      }
      const num = numMatch[1];
      const text = formatInline(numMatch[2]);
      html += `<li class="chat-list-item"><span class="chat-item-num">${num}</span><div class="chat-item-text">${text}</div></li>`;
    } else if (bulletMatch) {
      if (inOrderedList) {
        html += '</ol>';
        inOrderedList = false;
      }
      if (!inUnorderedList) {
        html += '<ul class="chat-bullet-list">';
        inUnorderedList = true;
      }
      const text = formatInline(bulletMatch[1]);
      html += `<li class="chat-bullet-item"><span class="chat-bullet-dot"></span><div class="chat-item-text">${text}</div></li>`;
    } else {
      closeLists();
      // Encabezados markdown ### o ##
      if (line.startsWith('### ')) {
        html += `<h5 class="chat-subheading">${formatInline(line.replace(/^###\s+/, ''))}</h5>`;
      } else if (line.startsWith('## ')) {
        html += `<h4 class="chat-heading">${formatInline(line.replace(/^##\s+/, ''))}</h4>`;
      } else {
        html += `<p class="chat-paragraph">${formatInline(line)}</p>`;
      }
    }
  }

  closeLists();

  return `
    <div class="chat-structured-card">
      <div class="chat-card-meta">
        <span class="chat-badge-tutor"><span class="live-dot-green"></span> Tutor Académico IA</span>
        <span class="chat-badge-model">GPT-4o-mini &bull; Mtro. Luis Tercero</span>
      </div>
      <div class="chat-card-content">
        ${html}
      </div>
      <div class="chat-card-actions">
        <button class="chat-action-btn" onclick="copyChatMessage(this)" title="Copiar texto de esta respuesta">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copiar
        </button>
        <button class="chat-action-btn" onclick="speakChatContent(this)" title="Escuchar respuesta con voz de mujer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          Escuchar Voz
        </button>
      </div>
    </div>
  `;
}

// Helpers para copiar y reproducir voz desde el chat
window.copyChatMessage = function(btn) {
  const card = btn.closest('.chat-structured-card');
  if (!card) return;
  const content = card.querySelector('.chat-card-content');
  const text = content ? content.innerText : '';
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ ¡Copiado!';
    btn.style.borderColor = '#10b981';
    btn.style.color = '#6ee7b7';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2000);
  });
};

window.speakChatContent = function(btn) {
  const card = btn.closest('.chat-structured-card');
  if (!card) return;
  const content = card.querySelector('.chat-card-content');
  const text = content ? content.innerText : '';
  if (text) {
    speakResponseFemale(text);
  }
};

async function sendUserMessage() {
  const input = document.getElementById('chat-text-input');
  const text = input.value.trim();
  if (!text) return;
  
  // Agregar mensaje del usuario con diseño limpio
  appendMessage(`<div class="chat-user-bubble">${escapeHTML(text)}</div>`, 'user');
  input.value = '';
  
  // Indicador de escribiendo
  const loadingId = 'loading-' + Date.now();
  appendMessage(`
    <div class="chat-loading-indicator">
      <div class="loading-spinner-dot"></div>
      <div class="loading-spinner-dot"></div>
      <div class="loading-spinner-dot"></div>
      <span>Tutor Académico estructurando respuesta en lista...</span>
    </div>
  `, 'bot', loadingId);
  
  // Si el usuario configuró API Key de OpenAI
  if (AppState.apiKeyOpenAI) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AppState.apiKeyOpenAI}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Eres el Tutor Académico Inteligente del Mtro. Luis Ramón Tercero Martínez González (Maestro en Ciencias de la Computación, candidato a Doctor en IA). Respondes a los alumnos sobre materias de IA en Finanzas, IA en Enfermería (PAE), IA en Hospitales, Transformers y producciones científicas del profesor.

REGLAS DE FORMATO ESTRICTAS:
1. Organiza SIEMPRE tu respuesta estructurada en una LISTA NUMERADA LIMPIA (1., 2., 3., 4.).
2. Cada elemento de la lista DEBE comenzar con un título en negrita (ejemplo: 1. **Nombre del Concepto**: Explicación clara y sintética).
3. Presenta explicaciones concisas, pedagógicas y de alto rigor técnico.
4. Agrega un breve saludo introductorio de 1 línea al inicio y una recomendación práctica breve al final con el prefijo "💡 Recomendación:".
5. NO respondas en párrafos largos desordenados. Prioriza siempre listas ejecutivas impecables.`
            },
            { role: 'user', content: text }
          ],
          temperature: 0.65
        })
      });
      
      const data = await response.json();
      const reply = data.choices && data.choices[0] ? data.choices[0].message.content : 'Error al procesar con OpenAI. Verifica tu API Key.';
      removeMessage(loadingId);
      appendMessage(formatChatReply(reply), 'bot');
    } catch (err) {
      removeMessage(loadingId);
      appendMessage(formatChatReply('Nota: Se produjo un inconveniente de red con el endpoint de OpenAI. Mostrando respuesta optimizada del repositorio académico local:'), 'bot');
      generateSmartLocalReply(text);
    }
  } else {
    // Respuesta simulada inteligente del profesor
    setTimeout(() => {
      removeMessage(loadingId);
      generateSmartLocalReply(text);
    }, 600);
  }
}

function generateSmartLocalReply(text) {
  const lower = text.toLowerCase();
  let reply = '';
  
  if (lower.includes('enfermería') || lower.includes('salud') || lower.includes('clara') || lower.includes('pae')) {
    reply = `Hola. Estos son los pilares clave de la **Especialidad de IA Aplicada a Enfermería** en la cátedra del Mtro. Luis Tercero:

1. **Clara IA & Automatización PAE**: Sistema inteligente que guía la valoración, diagnóstico, planeación, ejecución y evaluación conforme a taxonomías NANDA/NIC/NOC, reduciendo hasta 80% la carga administrativa.
2. **Modelos de Lenguaje Médico Seguro**: Despliegue de LLMs especializados en terminología clínica que operan con estricta privacidad de datos hospitalarios.
3. **Triaje y Detección Temprana**: Algoritmos de clasificación supervisada para alertas tempranas de sepsis y descompensación hemodinámica.
4. **Human-in-the-Loop Clínico**: La IA asiste sin reemplazar el juicio crítico de la enfermera o enfermero especialista.

💡 Recomendación: Te sugiero explorar el Simulador Interactivo de Clara IA en la sección de Materias.`;
  } else if (lower.includes('contaduría') || lower.includes('finanzas') || lower.includes('sat') || lower.includes('fiscal')) {
    reply = `Hola. Aquí tienes las tecnologías que dominan los estudiantes en la **Licenciatura en Contaduría y Finanzas con IA**:

1. **GatedTabTransformer**: Redes neuronales de atención para datos tabulares, capaces de auditar y conciliar millones de registros contables en segundos.
2. **Detección de Anomalías Fiscales**: Modelos no supervisados que identifican discrepancias con algoritmos tipo Isolation Forest y autoencoders.
3. **Predicción de Flujo de Efectivo**: Series temporales (DeepAR y TFT) para proyectar liquidez y optimizar cuentas por cobrar y pagar.
4. **Automatización de Declaraciones**: Pipelines que procesan XML del SAT con agentes NLP para cálculo predictivo de impuestos.

💡 Recomendación: Revisa la sección de Materias para conocer los datasets financieros utilizados en clase.`;
  } else if (lower.includes('hospital') || lower.includes('administración') || lower.includes('quirófano')) {
    reply = `Hola. En la **Maestría de IA para Administración Hospitalaria**, abordamos la optimización médica estratégica:

1. **Predicción de Demanda en Urgencias**: Modelos probabilísticos para anticipar picos de afluencia por estacionalidad o contingencias.
2. **Gestión Inteligente de Quirófanos y Camas**: Algoritmos de asignación óptima que reducen tiempos de espera y maximizan ocupación segura.
3. **Cadena de Suministro Farmacéutico**: Modelado de inventario crítico para evitar desabasto de medicamentos de alta especialidad.
4. **Gobernanza y Ética de Datos**: Protocolos de seguridad HIPAA / NOM-024 para resguardar expedientes clínicos electrónicos.

💡 Recomendación: Consulta la sección de investigación del profesor para ver casos de estudio en hospitales públicos y privados.`;
  } else if (lower.includes('doctorado') || lower.includes('investigación') || lower.includes('tesis') || lower.includes('paper')) {
    reply = `Hola. En el nivel de **Doctorado e Investigación Científica**, el Mtro. Luis Ramón Tercero lidera los siguientes frentes:

1. **Predicción de Nefropatía Diabética**: Aplicación de arquitecturas Transformer SOTA para diagnóstico precoz de daño renal crónico mediante biomarcadores longitudinales.
2. **AlicIA Pharmaceutical**: Plataforma de IA Edge para consulta clínica y posología que opera de forma 100% offline en zonas marginadas o sin conectividad.
3. **MoE (Mixture of Experts)**: Desarrollo de routers dinámicos de enrutamiento para modelos eficientes de menor costo computacional.
4. **Publicaciones Internacionales**: Artículos científicos indexados en Scopus y congresos internacionales de Inteligencia Artificial.

💡 Recomendación: Puedes descargar el CV académico completo del profesor desde el botón de la barra superior.`;
  } else {
    reply = `¡Hola! Como Tutor Académico de la cátedra del Mtro. Luis Ramón Tercero Martínez, te comparto las áreas principales de nuestra plataforma:

1. **Licenciatura en Finanzas con IA**: Auditoría predictiva, GatedTabTransformers y conciliación masiva de estados contables.
2. **Especialidad de IA en Enfermería**: Automatización del PAE (Clara IA) y modelos NLP para documentación clínica rápida y segura.
3. **Maestría en Administración Hospitalaria**: Optimización predictiva de quirófanos, camas y demanda hospitalaria.
4. **Doctorado & Transformers**: Tesis doctoral sobre nefropatía diabética y modelos de visión y lenguaje biomédico.
5. **Conceptos IA con Voz Femenina**: 21 conceptos esenciales clasificados en Básicos, Intermedios y Avanzados con lectura de voz interactiva.

💡 Recomendación: Escribe tu pregunta sobre cualquier materia o selecciona un simulador interactivo para comenzar.`;
  }
  
  appendMessage(formatChatReply(reply), 'bot');
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function appendMessage(html, type, id) {
  const box = document.getElementById('chat-messages-container');
  if (!box) return;
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  if (id) msg.id = id;
  msg.innerHTML = html;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

function removeMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// SETUP AGENTE DE VOZ (ElevenLabs / Web Speech API)
function setupVoiceAgent() {
  const voiceBtn = document.getElementById('btn-voice-toggle');
  const wave = document.getElementById('voice-wave-anim');
  const transcriptBox = document.getElementById('voice-transcript-text');
  
  // Soporte de reconocimiento de voz de navegador si está disponible
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    AppState.recognition = new SpeechRecognition();
    AppState.recognition.lang = 'es-MX';
    AppState.recognition.continuous = false;
    
    AppState.recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      transcriptBox.innerHTML = `<strong>Tú dijiste:</strong> "${speechResult}"`;
      speakVoiceReply(speechResult);
    };
    
    AppState.recognition.onerror = () => {
      stopVoiceRecording();
    };
    
    AppState.recognition.onend = () => {
      stopVoiceRecording();
    };
  }
  
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      if (!AppState.isVoiceRecording) {
        startVoiceRecording();
      } else {
        stopVoiceRecording();
      }
    });
  }
}

function startVoiceRecording() {
  AppState.isVoiceRecording = true;
  const wave = document.getElementById('voice-wave-anim');
  const voiceBtn = document.getElementById('btn-voice-toggle');
  const transcriptBox = document.getElementById('voice-transcript-text');
  
  if (wave) wave.classList.add('recording');
  if (voiceBtn) {
    voiceBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg>
      Detener Escucha
    `;
    voiceBtn.style.background = '#e11d48';
  }
  if (transcriptBox) transcriptBox.innerText = 'Escuchando tu voz... Haz tu pregunta sobre las clases del Mtro. Luis Ramón Tercero.';
  
  if (AppState.recognition) {
    try {
      AppState.recognition.start();
    } catch (e) {
      console.log('Voice already started');
    }
  } else {
    // Fallback de demostración rápida si el micrófono no tiene permiso directo
    setTimeout(() => {
      if (AppState.isVoiceRecording) {
        const demoQuery = '¿Qué aprenderemos en la especialidad de IA en Enfermería?';
        transcriptBox.innerHTML = `<strong>Pregunta de prueba detectada:</strong> "${demoQuery}"`;
        speakVoiceReply(demoQuery);
        stopVoiceRecording();
      }
    }, 2500);
  }
}

function stopVoiceRecording() {
  AppState.isVoiceRecording = false;
  const wave = document.getElementById('voice-wave-anim');
  const voiceBtn = document.getElementById('btn-voice-toggle');
  if (wave) wave.classList.remove('recording');
  if (voiceBtn) {
    voiceBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      Hablar con el Asistente de Voz
    `;
    voiceBtn.style.background = '';
  }
  if (AppState.recognition) {
    try { AppState.recognition.stop(); } catch(e) {}
  }
}

// SISTEMA DE CONOCIMIENTO GLOBAL DE LA PLATAFORMA PARA OPENAI
const PLATFORM_KNOWLEDGE_PROMPT = `
Eres la Asistente de Voz Inteligente Global de la "Plataforma IA Académico", bajo la cátedra del Mtro. Luis Tercero Martínez (Maestro en Ciencias de la Computación titulado por tesis en la UJAT y estudiante de Doctorado en Ciencias de la Computación con especialidad en IA y Ciencia de Datos).

Conoces al 100% todos los módulos, materias y proyectos de la plataforma:
1. Catedrático: Mtro. Luis Tercero Martínez, fundador de FTF AI Factory, autor de Clara IA (copiloto clínico de enfermería) y el Simulador de Pacientes Virtuales. Posee certificaciones AWS AI Practitioner e ISO 42001 en Ética y Gobernanza.
2. Tesis Doctoral (2026-2029): "Agentes de IA con MoE (Mixture of Experts y variantes) y Sistemas Multiagente para el Seguimiento Farmacoterapéutico en Pacientes de Tabasco, México", utilizando LangGraph-Swarm, LangSmith, n8n, Langflow y ElevenLabs.
3. Oferta Académica con IA:
   - Licenciatura: Contaduría Pública y Finanzas Aplicando IA (auditoría predictiva y detección de anomalías con modelos tabulares).
   - Especialidades: IA Aplicada en Servicios de Enfermería (PAE automatizado con Clara IA) e IA Generativa (RAG, Embeddings e ISO 42001).
   - Maestría: IA Aplicada en la Administración de Hospitales (triage predictivo y optimización de camas).
   - Doctorado: Ecosistema Multiagente MoE con Router Gating y telemetría LangSmith.
4. Conceptos IA: Glosario en 3 niveles (Básicos como Modelo Base, Prompt, Temperatura, Embeddings; Intermedios como RAG, Agentes Autónomos, Human-in-the-Loop, Guardrails; Avanzados como GraphRAG con Neo4j, Multiagentes LangGraph, Transformers y Jailbreaking).
5. Ética y Seguridad: Mitigación de Jailbreaking, Prompt Injections, Red Teaming, norma ISO/IEC 42001 y bioética NOM-004-SSA3.
6. Tecnologías: n8n, Make, ElevenLabs, OpenAI, Gemini Gems, Hugging Face, CrewAI, LangChain, LangGraph, LangGraph-Swarm, LangSmith, Langflow, Python, SQL, Supabase y Neo4j.

Instrucción de Respuesta: Responde en español con tono femenino, profesional, pedagógico y muy conciso (máximo 2 a 3 oraciones), ideal para ser escuchado por síntesis de voz.
`;

async function askOpenAIGlobalAgent(userQuery) {
  if (!AppState.apiKeyOpenAI) {
    return generateSmartLocalReply(userQuery);
  }
  
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AppState.apiKeyOpenAI}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: PLATFORM_KNOWLEDGE_PROMPT },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });
    
    const data = await res.json();
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    }
  } catch (err) {
    console.error('OpenAI API Error:', err);
  }
  
  return generateSmartLocalReply(userQuery);
}

// ═══════════════════════════════════════════════
// ARIA ELEVENLABS — Conversación de Voz Nativa
// SDK: @11labs/client via ESM
// ═══════════════════════════════════════════════

let ariaConversation = null;
let isAriaCallActive = false;

// Cargar SDK ElevenLabs de forma lazy
async function loadElevenLabsSDK() {
  try {
    const module = await import('https://esm.sh/@11labs/client@latest');
    return module.Conversation;
  } catch (err) {
    console.error('[Aria SDK] Error cargando SDK ElevenLabs:', err);
    return null;
  }
}

// Cambiar estado visual del orbe y avatar
function setAriaOrbState(state) {
  const orb = document.getElementById('aria-mic-btn');
  const avatar = document.getElementById('aria-avatar-large');
  const statusEl = document.getElementById('aria-call-status');
  const waves = document.getElementById('aria-call-waves');

  if (!orb) return;

  // Limpiar clases de estado
  orb.classList.remove('connecting', 'listening', 'speaking');
  if (avatar) avatar.classList.remove('listening', 'speaking');
  if (waves) waves.classList.remove('active', 'recording');

  const states = {
    idle: {
      status: 'Toca el micrófono para comenzar',
      statusColor: '#64748b',
    },
    connecting: {
      orbClass: 'connecting',
      status: '⏳ Conectando con Aria...',
      statusColor: '#fcd34d',
    },
    listening: {
      orbClass: 'listening',
      avatarClass: 'listening',
      status: '🎙️ Te escucho...',
      statusColor: '#6ee7b7',
      wavesActive: true,
      wavesClass: 'recording',
    },
    speaking: {
      orbClass: 'speaking',
      avatarClass: 'speaking',
      status: '💬 Aria está respondiendo...',
      statusColor: '#fb923c',
      wavesActive: true,
      wavesClass: 'recording',
    },
    error: {
      status: '❌ Error de conexión — intenta de nuevo',
      statusColor: '#f87171',
    },
  };

  const cfg = states[state] || states.idle;
  if (cfg.orbClass) orb.classList.add(cfg.orbClass);
  if (cfg.avatarClass && avatar) avatar.classList.add(cfg.avatarClass);
  if (statusEl) {
    statusEl.textContent = cfg.status;
    statusEl.style.color = cfg.statusColor;
  }
  if (waves && cfg.wavesActive) {
    waves.classList.add('active');
    if (cfg.wavesClass) waves.classList.add(cfg.wavesClass);
  }
}

// Iniciar llamada con ElevenLabs
async function startAriaCall() {
  setAriaOrbState('connecting');

  try {
    // Solicitar micrófono
    await navigator.mediaDevices.getUserMedia({ audio: true });

    const Conversation = await loadElevenLabsSDK();
    if (!Conversation) {
      setAriaOrbState('error');
      return;
    }

    ariaConversation = await Conversation.startSession({
      agentId: AppState.elevenLabsAgentId || 'agent_7001m60bmxq9f65t5djwwcx49cq3',
      onConnect: () => {
        isAriaCallActive = true;
        setAriaOrbState('listening');
      },
      onDisconnect: () => {
        isAriaCallActive = false;
        ariaConversation = null;
        setAriaOrbState('idle');
      },
      onError: (err) => {
        console.error('[Aria] Error:', err);
        setAriaOrbState('error');
        setTimeout(() => setAriaOrbState('idle'), 3000);
      },
      onModeChange: ({ mode }) => {
        if (mode.mode === 'speaking') {
          setAriaOrbState('speaking');
        } else if (mode.mode === 'listening') {
          setAriaOrbState('listening');
        }
      },
    });

  } catch (err) {
    console.error('[Aria] Error iniciando sesión:', err);
    setAriaOrbState('error');
    setTimeout(() => setAriaOrbState('idle'), 3000);
    isAriaCallActive = false;
  }
}

// Detener llamada
async function stopAriaCall() {
  if (ariaConversation) {
    try { await ariaConversation.endSession(); } catch(e) {}
    ariaConversation = null;
  }
  isAriaCallActive = false;
  setAriaOrbState('idle');
}

// Toggle (llamado desde onclick en HTML)
window.toggleAriaCall = async function() {
  if (isAriaCallActive) {
    await stopAriaCall();
  } else {
    await startAriaCall();
  }
};

// SETUP WIDGET ARIA — Manejo del panel flotante
function setupElevenLabsAriaWidget() {
  const ariaBtn = document.getElementById('eleven-voice-btn');
  const ariaPanel = document.getElementById('eleven-voice-panel');
  const closePanelBtn = document.getElementById('btn-close-eleven-panel');
  const globalPanel = document.getElementById('global-voice-panel');
  const globalBtn = document.getElementById('global-voice-btn');

  if (ariaBtn && ariaPanel) {
    ariaBtn.addEventListener('click', () => {
      const isOpen = ariaPanel.classList.contains('active');
      if (isOpen) {
        // Minimizar / Cerrar Aria
        ariaPanel.classList.remove('active');
        ariaBtn.classList.remove('active-listening');
        if (isAriaCallActive) stopAriaCall();
      } else {
        // Abrir Aria y cerrar panel de Voz OpenAI
        if (globalPanel) globalPanel.classList.remove('active');
        if (globalBtn) globalBtn.classList.remove('active-listening');
        stopGlobalVoiceListening();

        ariaPanel.classList.add('active');
        ariaBtn.classList.add('active-listening');
      }
    });
  }

  if (closePanelBtn && ariaPanel) {
    closePanelBtn.addEventListener('click', () => {
      ariaPanel.classList.remove('active');
      if (ariaBtn) ariaBtn.classList.remove('active-listening');
      if (isAriaCallActive) stopAriaCall();
    });
  }
}

// SETUP DEL AGENTE DE VOZ GLOBAL FLOTANTE (Voz IA)
function setupGlobalVoiceWidget() {
  const floatBtn = document.getElementById('global-voice-btn');
  const panel = document.getElementById('global-voice-panel');
  const closePanelBtn = document.getElementById('btn-close-voice-panel');
  const ariaPanel = document.getElementById('eleven-voice-panel');
  const ariaBtn = document.getElementById('eleven-voice-btn');
  
  if (closePanelBtn && panel) {
    closePanelBtn.addEventListener('click', () => {
      panel.classList.remove('active');
      if (floatBtn) floatBtn.classList.remove('active-listening');
      stopGlobalVoiceListening();
    });
  }
  
  if (floatBtn && panel) {
    floatBtn.addEventListener('click', () => {
      const isOpen = panel.classList.contains('active');
      if (isOpen) {
        // Minimizar / Cerrar panel de Voz IA
        panel.classList.remove('active');
        floatBtn.classList.remove('active-listening');
        stopGlobalVoiceListening();
      } else {
        // Abrir panel de Voz IA y cerrar Aria si estuviera abierto
        if (ariaPanel) ariaPanel.classList.remove('active');
        if (ariaBtn) ariaBtn.classList.remove('active-listening');
        if (isAriaCallActive) stopAriaCall();

        panel.classList.add('active');
        floatBtn.classList.add('active-listening');
      }
    });
  }
}

function startGlobalVoiceListening() {
  AppState.isGlobalVoiceActive = true;
  const floatBtn = document.getElementById('global-voice-btn');
  const panel = document.getElementById('global-voice-panel');
  const dialogBox = document.getElementById('global-voice-dialog');
  const wave = document.getElementById('global-voice-wave');
  
  if (panel) panel.classList.add('active');
  if (floatBtn) floatBtn.classList.add('active-listening');
  if (wave) wave.classList.add('recording');
  if (dialogBox) dialogBox.innerHTML = '<span style="color:#38bdf8;">🎙️ Te escucho... Pregúntame sobre cualquier materia, agente, investigación doctoral o tecnología de la plataforma:</span>';
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recog = new SpeechRecognition();
    recog.lang = 'es-MX';
    recog.continuous = false;
    
    recog.onresult = async (event) => {
      const query = event.results[0][0].transcript;
      if (dialogBox) {
        dialogBox.innerHTML = `<div><strong>Tú:</strong> "${query}"</div><div style="margin-top:0.4rem; color:#f472b6;"><em>Pensando con OpenAI GPT-4o-mini...</em></div>`;
      }
      
      const answer = await askOpenAIGlobalAgent(query);
      
      if (dialogBox) {
        dialogBox.innerHTML = `
          <div style="margin-bottom:0.5rem;"><strong>Tú:</strong> "${query}"</div>
          <div style="color:#a5f3fc;"><strong>Asistente IA:</strong> ${answer}</div>
        `;
      }
      
      speakResponseFemale(answer);
      stopGlobalVoiceListening();
    };
    
    recog.onerror = () => stopGlobalVoiceListening();
    recog.onend = () => stopGlobalVoiceListening();
    
    try { recog.start(); } catch(e) { stopGlobalVoiceListening(); }
  } else {
    // Demostración guiada si el navegador no tiene permiso inmediato
    setTimeout(async () => {
      if (AppState.isGlobalVoiceActive) {
        const sampleQuestion = '¿En qué consiste la tesis doctoral del Mtro. Luis Tercero Martínez?';
        dialogBox.innerHTML = `<div><strong>Pregunta de voz de ejemplo:</strong> "${sampleQuestion}"</div><div style="margin-top:0.4rem; color:#f472b6;"><em>Consultando con OpenAI GPT-4o-mini...</em></div>`;
        const answer = await askOpenAIGlobalAgent(sampleQuestion);
        dialogBox.innerHTML = `
          <div style="margin-bottom:0.5rem;"><strong>Pregunta:</strong> "${sampleQuestion}"</div>
          <div style="color:#a5f3fc;"><strong>Asistente IA:</strong> ${answer}</div>
        `;
        speakResponseFemale(answer);
        stopGlobalVoiceListening();
      }
    }, 2000);
  }
}

function stopGlobalVoiceListening() {
  AppState.isGlobalVoiceActive = false;
  const floatBtn = document.getElementById('global-voice-btn');
  const wave = document.getElementById('global-voice-wave');
  if (floatBtn) floatBtn.classList.remove('active-listening');
  if (wave) wave.classList.remove('recording');
}

// Helper para botones de sugerencias rápidas
window.quickVoiceQuery = async function(question) {
  const dialogBox = document.getElementById('global-voice-dialog');
  const panel = document.getElementById('global-voice-panel');
  const wave = document.getElementById('global-voice-wave');
  
  if (panel) panel.classList.add('active');
  if (wave) wave.classList.add('recording');
  if (dialogBox) dialogBox.innerHTML = `<div><strong>Pregunta:</strong> "${question}"</div><div style="margin-top:0.4rem; color:#f472b6;"><em>Consultando con OpenAI GPT-4o-mini...</em></div>`;
  
  const answer = await askOpenAIGlobalAgent(question);
  
  if (dialogBox) {
    dialogBox.innerHTML = `
      <div style="margin-bottom:0.5rem;"><strong>Pregunta:</strong> "${question}"</div>
      <div style="color:#a5f3fc;"><strong>Asistente IA:</strong> ${answer}</div>
    `;
  }
  
  speakResponseFemale(answer);
  if (wave) wave.classList.remove('recording');
};

// Exponer funciones globalmente para uso desde HTML
window.startGlobalVoiceListening = startGlobalVoiceListening;
window.stopGlobalVoiceListening = stopGlobalVoiceListening;

function speakResponseFemale(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'es-MX';
  utter.rate = 1.05;
  utter.pitch = 1.15;
  
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v => 
    (v.lang.includes('es') || v.lang.includes('ES')) && 
    (v.name.toLowerCase().includes('sabina') || 
     v.name.toLowerCase().includes('paulina') || 
     v.name.toLowerCase().includes('monica') || 
     v.name.toLowerCase().includes('helena') || 
     v.name.toLowerCase().includes('female') || 
     v.name.toLowerCase().includes('maria') || 
     v.name.toLowerCase().includes('lucia') ||
     v.name.toLowerCase().includes('zira') ||
     v.name.toLowerCase().includes('laura'))
  ) || voices.find(v => v.lang.includes('es') || v.lang.includes('ES'));
  
  if (femaleVoice) utter.voice = femaleVoice;
  window.speechSynthesis.speak(utter);
}

// SETUP AGENTE DE VOZ (Dentro de la pestaña de Agentes)
function setupVoiceAgent() {
  const voiceBtn = document.getElementById('btn-voice-toggle');
  const transcriptBox = document.getElementById('voice-transcript-text');
  
  if (voiceBtn) {
    voiceBtn.addEventListener('click', async () => {
      startVoiceRecording();
    });
  }
}

function startVoiceRecording() {
  AppState.isVoiceRecording = true;
  const wave = document.getElementById('voice-wave-anim');
  const voiceBtn = document.getElementById('btn-voice-toggle');
  const transcriptBox = document.getElementById('voice-transcript-text');
  
  if (wave) wave.classList.add('recording');
  if (voiceBtn) {
    voiceBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg>
      Detener Escucha
    `;
    voiceBtn.style.background = '#e11d48';
  }
  if (transcriptBox) transcriptBox.innerText = 'Escuchando tu voz... Pregúntale a la IA del Mtro. Luis Tercero Martínez.';
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recog = new SpeechRecognition();
    recog.lang = 'es-MX';
    recog.continuous = false;
    
    recog.onresult = async (event) => {
      const speechResult = event.results[0][0].transcript;
      transcriptBox.innerHTML = `<strong>Tú dijiste:</strong> "${speechResult}"<br><span style="color:#f472b6;"><em>Generando respuesta con OpenAI GPT-4o-mini...</em></span>`;
      const reply = await askOpenAIGlobalAgent(speechResult);
      transcriptBox.innerHTML = `<strong>Tú dijiste:</strong> "${speechResult}"<div style="margin-top:0.5rem; color:var(--brand-cyan);"><strong>Respuesta IA:</strong> "${reply}"</div>`;
      speakResponseFemale(reply);
      stopVoiceRecording();
    };
    
    recog.onerror = () => stopVoiceRecording();
    recog.onend = () => stopVoiceRecording();
    
    try { recog.start(); } catch(e) { stopVoiceRecording(); }
  } else {
    setTimeout(async () => {
      if (AppState.isVoiceRecording) {
        const demoQuery = '¿Qué aprenderemos en la especialidad de IA en Enfermería?';
        transcriptBox.innerHTML = `<strong>Pregunta detectada:</strong> "${demoQuery}"<br><span style="color:#f472b6;"><em>Procesando con OpenAI GPT-4o-mini...</em></span>`;
        const reply = await askOpenAIGlobalAgent(demoQuery);
        transcriptBox.innerHTML = `<strong>Pregunta:</strong> "${demoQuery}"<div style="margin-top:0.5rem; color:var(--brand-cyan);"><strong>Respuesta IA:</strong> "${reply}"</div>`;
        speakResponseFemale(reply);
        stopVoiceRecording();
      }
    }, 2000);
  }
}

function stopVoiceRecording() {
  AppState.isVoiceRecording = false;
  const wave = document.getElementById('voice-wave-anim');
  const voiceBtn = document.getElementById('btn-voice-toggle');
  if (wave) wave.classList.remove('recording');
  if (voiceBtn) {
    voiceBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      Hablar con el Asistente de Voz
    `;
    voiceBtn.style.background = '';
  }
}

// SETUP MODAL DE CONFIGURACIÓN DE API KEYS
function setupKeysModal() {
  const btn = document.getElementById('btn-open-config');
  const modal = document.getElementById('config-modal');
  const closeBtn = document.getElementById('btn-close-config');
  const saveBtn = document.getElementById('btn-save-keys');
  
  const openAiInput = document.getElementById('cfg-openai-key');
  const elevenInput = document.getElementById('cfg-eleven-agent');
  
  if (openAiInput) openAiInput.value = AppState.apiKeyOpenAI;
  if (elevenInput) elevenInput.value = AppState.elevenLabsAgentId;
  
  if (btn && modal) {
    btn.addEventListener('click', () => modal.classList.add('active'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      AppState.apiKeyOpenAI = openAiInput.value.trim();
      AppState.elevenLabsAgentId = elevenInput.value.trim();
      localStorage.setItem('nexus_openai_key', AppState.apiKeyOpenAI);
      localStorage.setItem('nexus_eleven_agent', AppState.elevenLabsAgentId);
      alert('¡Configuración guardada exitosamente! Ya puedes interactuar en vivo.');
      modal.classList.remove('active');
    });
  }
}
