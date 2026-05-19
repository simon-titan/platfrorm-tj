export interface LandingFeature {
  icon: string;
  label: string;
  detail: string | null;
}

export interface LandingFounder {
  image: string;
  name: string;
  subtitle: string;
  bio: string[];
  achievements: string[];
  checklist: string[];
  socialLinks: { instagram: string; tiktok: string; telegram: string; linkedin: string };
}

export interface LandingStat {
  value: string;
  suffix: string;
  label: string;
}

export interface LandingPhase {
  label: string;
  title: string;
  description: string;
  bullets: string[];
}

export interface LandingTargetGroupBullet {
  text: string;
  icon: string;
}

export interface LandingTargetGroup {
  iconName: string;
  title: string;
  description: string;
  bullets: LandingTargetGroupBullet[];
  cta: string;
}

export interface LandingReview {
  name: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  avatar?: string;
}

export interface LandingApplicationQuestion {
  id: string;
  heading: string;
  description: string;
  placeholder: string;
  minChars: number;
}

export interface LandingConfig {
  brand: { name: string; tagline: string; color: string };
  product: { type: string; name: string; headline: string; subheadline: string; subheadlineHighlight: string; videoEnvKey: string };
  features: LandingFeature[];
  communityCard: LandingFeature;
  founder: LandingFounder;
  stats: LandingStat[];
  phases: LandingPhase[];
  targetGroups: LandingTargetGroup[];
  reviews: LandingReview[];
  cta: { primary: string; secondary: string; disclaimer: string };
  application: { questions: LandingApplicationQuestion[] };
}

export const landingConfig: LandingConfig = {
  brand: {
    name: "T&J Consulting",
    tagline: "Expertenwissen. Strukturiert. Messbar.",
    color: "#1F3A2E",
  },

  product: {
    type: "Free-Kurs",
    name: "T&J Consulting",
    headline: "Deine Chance auf einen Platz bei T&J Consulting!",
    subheadlineHighlight: "kostenlosen",
    subheadline:
      "Bewirb dich für einen der {exklusiven} Plätze in unserem {kostenlosen} Programm — nur ausgewählte {Mitglieder} werden aufgenommen.",
    videoEnvKey: "NEXT_PUBLIC_HT_INTRO_VIDEO_URL",
  },

  features: [
    { icon: "VideoCamera", label: "Exklusive Lernmaterialien", detail: "Über 120 Std. von Video-Modulen bis Tests" },
    { icon: "BookOpen", label: "Strukturierter Lehrplan", detail: "Von den Basics bis zur Profi-Anwendung" },
    { icon: "Users", label: "Exklusive Community", detail: "Gleichgesinnte auf Augenhöhe" },
    { icon: "Target", label: "Persönliches Mentoring", detail: "Direktes Feedback auf deinen Fortschritt" },
    { icon: "Trophy", label: "Bewährte Methoden", detail: "Aus Jahren praktischer Erfahrung" },
    { icon: "Shield", label: "Nachhaltige Ergebnisse", detail: "Langfristiger Aufbau statt schnelle Fixes" },
  ],

  communityCard: { icon: "Trophy", label: "Handverlesene Community", detail: "Jede Bewerbung wird persönlich geprüft" },

  founder: {
    image: "/founder/founder.jpeg",
    name: "T&J Consulting",
    subtitle: "GRÜNDER & GESCHÄFTSFÜHRER",
    bio: [
      "Wir haben über Jahre hinweg ein System aufgebaut, das funktioniert. Nicht auf dem Papier — sondern in der Praxis, mit echten Menschen, die echte Ergebnisse erzielen wollten.",
      "Irgendwann war uns klar: Was wir aufgebaut haben, ist zu wertvoll um es für uns zu behalten. Aber wir wollten keine Massenveranstaltung. Deshalb haben wir T&J Consulting gegründet — eine Gemeinschaft, in der nur Menschen landen, die es wirklich ernst meinen.",
      "Kein Fluff. Kein Copy-Paste. Nur eine Methodik, die funktioniert — und ein Umfeld, das dich zwingt, besser zu werden.",
    ],
    achievements: [
      "1.000+ begleitete Mitglieder",
      "Nachgewiesene Ergebnisse",
      "Jahre praktischer Erfahrung",
      "Persönlich geprüfte Aufnahme",
    ],
    checklist: [
      "Strategisches Denken & Planung",
      "Strukturierter Kompetenzaufbau",
      "Persönliche Weiterentwicklung",
      "Umsetzung & Execution",
      "Community & Netzwerk",
      "Feedback-Kultur und Iteration",
      "Dokumentation und Fortschrittstracking",
      "Langfristiger Aufbau statt kurzfristiger Erfolge",
    ],
    socialLinks: {
      instagram: "#",
      tiktok: "#",
      telegram: "#",
      linkedin: "https://www.linkedin.com/company/tj-consulting/",
    },
  },

  stats: [
    { value: "1.000", suffix: "+", label: "Begleitete Mitglieder" },
    { value: "5", suffix: " Jahre", label: "Praktische Erfahrung" },
    { value: "120", suffix: " Std.", label: "Lernmaterial" },
    { value: "98", suffix: " %", label: "Weiterempfehlungsrate" },
  ],

  phases: [
    {
      label: "PHASE 1",
      title: "Fundament & Mindset",
      description:
        "Du lernst, wie erfolgreiche Menschen denken und handeln. Wir legen das mentale und strukturelle Fundament, auf dem alles andere aufbaut.",
      bullets: [
        "Klarheit über Ziele und Prioritäten",
        "Aufbau von Gewohnheiten und Routinen",
        "Warum Konsistenz wichtiger ist als Talent",
      ],
    },
    {
      label: "PHASE 2",
      title: "Strategie & Umsetzung",
      description:
        "Du entwickelst ein klares System für deine persönliche oder berufliche Entwicklung und weißt, wie du es konsequent anwendest.",
      bullets: [
        "Strukturiertes Vorgehen mit Methode",
        "Entscheidungsfindung und Prioritätensetzung",
        "Von Wissen zu konsequenter Umsetzung",
      ],
    },
    {
      label: "PHASE 3",
      title: "Wachstum & Skalierung",
      description:
        "Du bringst alles zusammen — und weißt, wie du deine Ergebnisse systematisch weiterentwickelst und langfristig auf ein neues Level hebst.",
      bullets: [
        "Ergebnisse messen und optimieren",
        "Fortschritt dokumentieren und feiern",
        "Nächste Stufe definieren und ansteuern",
      ],
    },
  ],

  targetGroups: [
    {
      iconName: "Student",
      title: "Der Einsteiger",
      description:
        "Du willst von Grund auf richtig starten, ohne teure Fehler und ohne Chaos. Du brauchst Struktur, die dich Schritt für Schritt führt.",
      bullets: [
        { text: "Noch am Anfang des Weges", icon: "Clock" },
        { text: "Unsicher, wo du anfangen sollst", icon: "HelpCircle" },
        { text: "Kein klares System vorhanden", icon: "XCircle" },
      ],
      cta: "Jetzt bewerben",
    },
    {
      iconName: "TrendUp",
      title: "Der Unbeständige",
      description:
        "Du machst bereits Fortschritte, aber deine Ergebnisse sind inkonsistent. Du weißt, dass dir etwas Fundamentales fehlt.",
      bullets: [
        { text: "Inkonsistente Ergebnisse trotz Wissen", icon: "BarChart3" },
        { text: "Schwierigkeiten mit Disziplin", icon: "Flame" },
        { text: "Kein funktionierendes System", icon: "FileX" },
      ],
      cta: "Jetzt bewerben",
    },
    {
      iconName: "Trophy",
      title: "Der Ambitionierte",
      description:
        "Du willst auf ein professionelles Level und bist bereit, dafür konsequent zu arbeiten — wirklich.",
      bullets: [
        { text: "Bereit, konsequent hart zu arbeiten", icon: "Dumbbell" },
        { text: "Klares Ziel und echter Antrieb", icon: "Rocket" },
        { text: "Langfristiges Denken als Priorität", icon: "Brain" },
      ],
      cta: "Jetzt bewerben",
    },
  ],

  reviews: [
    {
      name: "Maximilian R.",
      rating: 5,
      title: "Endlich ein strukturierter Ansatz",
      text: "Ich habe vorher unzählige Kurse konsumiert — immer das gleiche oberflächliche Zeug. T&J Consulting hat mir zum ersten Mal gezeigt, wie strukturiertes Arbeiten wirklich funktioniert. Das Fundament stimmt.",
      date: "März 2026",
      avatar: "/client-pb/1765279404415.jpg",
    },
    {
      name: "Laura K.",
      rating: 5,
      title: "Mehr als erwartet",
      text: "Ich war skeptisch, ob ein kostenloser Kurs wirklich Mehrwert liefern kann. Aber das Team gibt alles — kein Fluff, kein Upsell-Druck. Einfach ehrliches Wissen, das mir direkt geholfen hat.",
      date: "April 2026",
      avatar: "/client-pb/393d1b15978eed96285cf196b2f51eda.avif",
    },
    {
      name: "Jonas T.",
      rating: 5,
      title: "Community macht den Unterschied",
      text: "Das Onboarding war top, aber was mich wirklich überzeugt hat ist die Community. Menschen, die tatsächlich wissen wovon sie reden. Kein Spam — nur echter Austausch auf hohem Niveau.",
      date: "Februar 2026",
      avatar: "/client-pb/4208db19763848b131989eadba9899aa.avif",
    },
    {
      name: "Sarah W.",
      rating: 4,
      title: "Solider Einstieg",
      text: "Das Programm ist sehr gut aufgebaut und die Inhalte werden verständlich erklärt. Besonders die strukturierten Lernpfade haben mir die Augen geöffnet. Klare Empfehlung für alle, die es ernst meinen.",
      date: "März 2026",
      avatar: "/client-pb/user_6819319_6ec853ff-5777-4398-8fcc-06e2621cbcf8.avif",
    },
  ],

  cta: {
    primary: "Jetzt kostenlos bewerben",
    secondary: "Wir nehmen nicht jeden an. Jede Bewerbung wird persönlich geprüft.",
    disclaimer: "Keine Kreditkarte erforderlich · Kostenloser Zugang",
  },

  application: {
    questions: [
      {
        id: "current_situation",
        heading: "Wo stehst du gerade — und was beschäftigt dich aktuell am meisten?",
        description:
          "Erzähl uns von deiner aktuellen Situation — egal ob Einsteiger oder bereits mit Erfahrung. Wir wollen verstehen, wo du heute stehst.",
        placeholder:
          "Ich beschäftige mich aktuell mit ... Meine aktuelle Situation ist ... und ich merke, dass ...",
        minChars: 30,
      },
      {
        id: "goals",
        heading: "Was möchtest du in den nächsten 12 Monaten erreichen — und warum ist dir das wichtig?",
        description:
          "Sei konkret. Berufliche Ziele, persönliche Ziele, Entwicklungsziele — alles ist willkommen. Wir suchen Menschen mit echtem Antrieb.",
        placeholder: "In den nächsten 12 Monaten möchte ich ... erreichen, weil ...",
        minChars: 50,
      },
      {
        id: "why_now",
        heading:
          "Warum möchtest du in dieses Programm aufgenommen werden — und weshalb glaubst du, dass genau jetzt der richtige Zeitpunkt dafür ist?",
        description:
          "Was macht dich zur richtigen Person für dieses Programm? Überzeuge uns — wir nehmen nur Bewerber auf, die wirklich bereit sind.",
        placeholder: "Ich möchte aufgenommen werden, weil ... Jetzt ist der richtige Zeitpunkt, weil ...",
        minChars: 50,
      },
    ],
  },
};
