import { useState } from "react";

const phases = [
  {
    id: 1,
    title: "FONDATIONS",
    subtitle: "Semaine 1 — Infrastructure & Core",
    color: "#6366f1",
    accent: "#818cf8",
    duration: "7 jours",
    icon: "⚙️",
    sprints: [
      {
        day: "J1",
        label: "Setup & Architecture",
        type: "infra",
        tasks: [
          { id: "T001", text: "Initialiser le monorepo (apps/web, apps/api, packages/shared)", done: false },
          { id: "T002", text: "Configurer TypeScript strict dans tout le monorepo", done: false },
          { id: "T003", text: "Setup Docker Compose (PostgreSQL 15, Redis 7, MinIO)", done: false },
          { id: "T004", text: "Configurer ESLint + Prettier + Husky pre-commit hooks", done: false },
          { id: "T005", text: "Setup GitHub Actions CI/CD (lint, test, build)", done: false },
          { id: "T006", text: "Initialiser Prisma ORM + schéma de base de données", done: false },
          { id: "T007", text: "Créer les migrations initiales (users, annees_academiques)", done: false },
        ]
      },
      {
        day: "J2",
        label: "Auth & Sécurité",
        type: "backend",
        tasks: [
          { id: "T008", text: "Implémenter POST /auth/login — JWT + Refresh Token", done: false },
          { id: "T009", text: "Implémenter POST /auth/refresh — rotation refresh token", done: false },
          { id: "T010", text: "Implémenter POST /auth/logout — invalidation token", done: false },
          { id: "T011", text: "Middleware RBAC — vérification rôle par route", done: false },
          { id: "T012", text: "Rate limiter — 5 tentatives / 15 min (RG-ACC-004)", done: false },
          { id: "T013", text: "Hasher mots de passe bcrypt cost=12", done: false },
          { id: "T014", text: "Seeder utilisateurs de test (admin, scolarité, enseignant, étudiant)", done: false },
        ]
      },
      {
        day: "J3",
        label: "API Étudiants & Filières",
        type: "backend",
        tasks: [
          { id: "T015", text: "Migration complète — tables étudiants, filières, classes", done: false },
          { id: "T016", text: "GET /students — liste paginée, filtrée, recherche full-text", done: false },
          { id: "T017", text: "POST /students — création avec détection doublon (RG-ETU-002)", done: false },
          { id: "T018", text: "GET/PUT /students/:id — détail et modification", done: false },
          { id: "T019", text: "PATCH /students/:id/statut — changement statut avec motif", done: false },
          { id: "T020", text: "CRUD complet /filieres et /classes", done: false },
          { id: "T021", text: "Validation Zod sur tous les endpoints", done: false },
        ]
      },
      {
        day: "J4",
        label: "API Inscriptions",
        type: "backend",
        tasks: [
          { id: "T022", text: "Migration — tables inscriptions, affectations enseignants", done: false },
          { id: "T023", text: "POST /inscriptions — vérification quota classe (RG-INS-002)", done: false },
          { id: "T024", text: "Détection doublon inscription même classe/même année (RG-INS-001)", done: false },
          { id: "T025", text: "PATCH /inscriptions/:id/statut — workflow validation/rejet", done: false },
          { id: "T026", text: "GET /inscriptions — filtres par classe, année, statut", done: false },
          { id: "T027", text: "Audit log sur toutes les mutations (RG-TRA-001)", done: false },
        ]
      },
      {
        day: "J5",
        label: "React — Setup & Layout",
        type: "frontend",
        tasks: [
          { id: "T028", text: "Setup React 18 + Vite + TypeScript + Tailwind CSS", done: false },
          { id: "T029", text: "Configurer TanStack Query + Axios interceptors (refresh auto)", done: false },
          { id: "T030", text: "Configurer Zustand — store auth (user, token, rôle)", done: false },
          { id: "T031", text: "Layout principal — Sidebar dynamique par rôle + Header", done: false },
          { id: "T032", text: "Route guards — redirection si non authentifié / rôle insuffisant", done: false },
          { id: "T033", text: "Page Login — formulaire + gestion erreurs + redirection", done: false },
        ]
      },
      {
        day: "J6",
        label: "React — Gestion Étudiants",
        type: "frontend",
        tasks: [
          { id: "T034", text: "DataTable générique — tri, pagination, recherche, export CSV", done: false },
          { id: "T035", text: "Page liste étudiants — filtres statut + filière + recherche nom", done: false },
          { id: "T036", text: "Formulaire création étudiant — validation React Hook Form + Zod", done: false },
          { id: "T037", text: "Modal détail étudiant — onglets : infos, inscriptions, notes", done: false },
          { id: "T038", text: "Composant StatusBadge — couleurs par statut étudiant", done: false },
          { id: "T039", text: "Page filières & classes — CRUD complet avec interface", done: false },
        ]
      },
      {
        day: "J7",
        label: "Tests & Stabilisation Sprint 1",
        type: "qa",
        tasks: [
          { id: "T040", text: "Tests unitaires Vitest — services auth, student, inscription", done: false },
          { id: "T041", text: "Tests d'intégration — endpoints API avec base de données test", done: false },
          { id: "T042", text: "Test E2E Cypress — flux login + création étudiant + inscription", done: false },
          { id: "T043", text: "Revue sécurité — CORS, headers Helmet, SQL injection", done: false },
          { id: "T044", text: "Documentation API Swagger/OpenAPI auto-générée", done: false },
          { id: "T045", text: "Demo interne Sprint 1 + ajustements prioritaires", done: false },
        ]
      },
    ]
  },
  {
    id: 2,
    title: "FONCTIONNEL",
    subtitle: "Semaine 2 — Modules Métier MVP",
    color: "#0ea5e9",
    accent: "#38bdf8",
    duration: "7 jours",
    icon: "🎓",
    sprints: [
      {
        day: "J8",
        label: "API Notes & Calculs",
        type: "backend",
        tasks: [
          { id: "T046", text: "Migration — tables notes, matieres, affectations_enseignants", done: false },
          { id: "T047", text: "POST /grades — saisie avec vérif affectation enseignant (RG-ACC-010)", done: false },
          { id: "T048", text: "Règle note 0–20, session 1/2/rattrapage (RG-NOT-001, 003)", done: false },
          { id: "T049", text: "Calcul automatique moyenne finale par formule (RG-NOT-004)", done: false },
          { id: "T050", text: "Calcul moyenne générale pondérée par coefficient (RG-NOT-005)", done: false },
          { id: "T051", text: "POST /grades/validate — workflow validation direction pédago", done: false },
          { id: "T052", text: "GET /grades/deliberation/:classeId — résultats délibération", done: false },
        ]
      },
      {
        day: "J9",
        label: "API Emplois du Temps",
        type: "backend",
        tasks: [
          { id: "T053", text: "Migration — tables salles, creneaux_horaires", done: false },
          { id: "T054", text: "POST /schedule/slot — création créneau avec triple vérification", done: false },
          { id: "T055", text: "Vérification conflit salle (RG-EDT-001)", done: false },
          { id: "T056", text: "Vérification conflit enseignant (RG-EDT-002)", done: false },
          { id: "T057", text: "Vérification conflit classe (RG-EDT-003)", done: false },
          { id: "T058", text: "GET /schedule/classe/:id — emploi du temps d'une classe", done: false },
          { id: "T059", text: "GET /schedule/teacher/:id — emploi du temps d'un enseignant", done: false },
        ]
      },
      {
        day: "J10",
        label: "Générateur PDF & Documents",
        type: "backend",
        tasks: [
          { id: "T060", text: "Setup Puppeteer + templates HTML certificat et relevé", done: false },
          { id: "T061", text: "Génération numéro unique non recyclable (RG-DOC-001)", done: false },
          { id: "T062", text: "Calcul hash SHA256 du contenu document (RG-DOC-002)", done: false },
          { id: "T063", text: "Génération QR Code lié à l'endpoint de vérification publique (RG-DOC-009)", done: false },
          { id: "T064", text: "Upload PDF vers MinIO / S3 + stockage URL en DB", done: false },
          { id: "T065", text: "GET /documents/verify/:hash — endpoint public vérification", done: false },
          { id: "T066", text: "File job Queue (Bull) pour génération asynchrone", done: false },
        ]
      },
      {
        day: "J11",
        label: "React — Notes & EDT",
        type: "frontend",
        tasks: [
          { id: "T067", text: "Page saisie notes — tableau par classe/matière, inline editing", done: false },
          { id: "T068", text: "Indicateur statut note (provisoire / validée) avec couleurs", done: false },
          { id: "T069", text: "Page relevé de notes étudiant — moyennes + coefficients", done: false },
          { id: "T070", text: "Interface délibération — résultats par classe, admis/ajourné", done: false },
          { id: "T071", text: "Calendrier emploi du temps (FullCalendar) — vue semaine", done: false },
          { id: "T072", text: "Formulaire création créneau — sélecteurs salle/enseignant/classe", done: false },
          { id: "T073", text: "Affichage conflits EDT en rouge avec message explicite", done: false },
        ]
      },
      {
        day: "J12",
        label: "React — Documents & Portail",
        type: "frontend",
        tasks: [
          { id: "T074", text: "Page génération documents — choix type + aperçu avant téléchargement", done: false },
          { id: "T075", text: "Page archivage documents — historique avec filtres", done: false },
          { id: "T076", text: "Portail étudiant — mes notes, mon EDT, mes documents", done: false },
          { id: "T077", text: "Page portail enseignant — mes classes, saisie notes, mon EDT", done: false },
          { id: "T078", text: "Page inscriptions scolarité — validation / rejet avec motif", done: false },
          { id: "T079", text: "Notifications toast système — succès / erreurs / conflits", done: false },
        ]
      },
      {
        day: "J13",
        label: "Dashboard & Statistiques",
        type: "frontend",
        tasks: [
          { id: "T080", text: "API endpoints stats — effectifs, taux réussite, charges enseignants", done: false },
          { id: "T081", text: "Dashboard admin — KPIs cartes (effectifs, inscriptions, taux)", done: false },
          { id: "T082", text: "Graphique Recharts — évolution inscriptions par mois", done: false },
          { id: "T083", text: "Graphique — répartition par filière (donut chart)", done: false },
          { id: "T084", text: "Tableau charges enseignants — heures effectuées vs quota", done: false },
          { id: "T085", text: "Export statistiques CSV/Excel depuis le dashboard", done: false },
        ]
      },
      {
        day: "J14",
        label: "Finalisation MVP & Déploiement",
        type: "deploy",
        tasks: [
          { id: "T086", text: "Tests E2E complets — flux saisie notes, génération documents, EDT", done: false },
          { id: "T087", text: "Recette fonctionnelle sur données réelles (import CSV test)", done: false },
          { id: "T088", text: "Optimisation performances — index DB, lazy loading React", done: false },
          { id: "T089", text: "Configuration Nginx reverse proxy + HTTPS (certificat SSL)", done: false },
          { id: "T090", text: "Déploiement Docker Compose sur serveur staging", done: false },
          { id: "T091", text: "Sauvegarde automatique base de données (backup quotidien)", done: false },
          { id: "T092", text: "Documentation utilisateur — guide rapide par rôle", done: false },
        ]
      },
    ]
  },
  {
    id: 3,
    title: "V2 — AVANCÉ",
    subtitle: "Mois 2–3 — Modules Complémentaires",
    color: "#10b981",
    accent: "#34d399",
    duration: "6 semaines",
    icon: "🚀",
    sprints: [
      { day: "S3", label: "Soutenances & Jury", type: "backend", tasks: [
        { id: "T093", text: "Module planification soutenances + affectation jury", done: false },
        { id: "T094", text: "Vérification conflits d'intérêt jury (RG-SOU-003)", done: false },
        { id: "T095", text: "Génération automatique Procès-Verbal PDF", done: false },
      ]},
      { day: "S4", label: "Chambres & Résidences", type: "backend", tasks: [
        { id: "T096", text: "Module gestion chambres campus + affectations", done: false },
        { id: "T097", text: "Suivi disponibilités par période + historique occupations", done: false },
      ]},
      { day: "S5", label: "Notifications & Alertes", type: "backend", tasks: [
        { id: "T098", text: "Système notifications email (Nodemailer) pour inscriptions, notes", done: false },
        { id: "T099", text: "Alertes admin — dépassement quota enseignant, congé maladie", done: false },
      ]},
      { day: "S6", label: "Import & Migration", type: "backend", tasks: [
        { id: "T100", text: "Module import CSV/Excel étudiants + rapport d'erreurs", done: false },
        { id: "T101", text: "Import données depuis ancien système avec mapping colonnes", done: false },
      ]},
      { day: "S7", label: "Workflow Délibérations", type: "backend", tasks: [
        { id: "T102", text: "Workflow complet délibération — checklist, compensation, PV", done: false },
        { id: "T103", text: "Règles de compensation inter-matières paramétrables", done: false },
      ]},
      { day: "S8", label: "UI Avancée & Mobile", type: "frontend", tasks: [
        { id: "T104", text: "Mode sombre + thème personnalisable par établissement", done: false },
        { id: "T105", text: "PWA — cache offline pour consultation notes (zone faible réseau)", done: false },
      ]},
    ]
  },
  {
    id: 4,
    title: "V3 — SCALE",
    subtitle: "Mois 4–6 — Évolutions Stratégiques",
    color: "#f59e0b",
    accent: "#fbbf24",
    duration: "12 semaines",
    icon: "🌍",
    sprints: [
      { day: "M4", label: "Paiements en ligne", type: "backend", tasks: [
        { id: "T106", text: "Intégration passerelle de paiement (Stripe / PayDunya Afrique)", done: false },
        { id: "T107", text: "Gestion frais académiques — suivi paiements, relances auto", done: false },
      ]},
      { day: "M4", label: "Signature électronique", type: "backend", tasks: [
        { id: "T108", text: "Signature électronique des documents officiels (DocuSign / YumiSign)", done: false },
        { id: "T109", text: "Horodatage certifié des documents signés", done: false },
      ]},
      { day: "M5", label: "Badge Numérique Étudiant", type: "fullstack", tasks: [
        { id: "T110", text: "Génération carte étudiant numérique avec QR code unique", done: false },
        { id: "T111", text: "Vérification NFC / QR pour accès bâtiments (optionnel)", done: false },
      ]},
      { day: "M5", label: "Intégration LMS", type: "backend", tasks: [
        { id: "T112", text: "API LMS (Moodle) — synchronisation matières et étudiants", done: false },
        { id: "T113", text: "Import notes automatique depuis LMS vers la plateforme", done: false },
      ]},
      { day: "M6", label: "Multi-établissements", type: "infra", tasks: [
        { id: "T114", text: "Architecture multitenancy complète (schema-per-tenant PostgreSQL)", done: false },
        { id: "T115", text: "Dashboard groupe — stats consolidées multi-établissements", done: false },
      ]},
      { day: "M6", label: "API Publique & Écosystème", type: "backend", tasks: [
        { id: "T116", text: "API REST publique documentée pour intégrations tierces", done: false },
        { id: "T117", text: "Webhooks — événements temps réel vers systèmes externes", done: false },
      ]},
    ]
  }
];

const typeColors = {
  infra: { bg: "#1e1b4b", border: "#6366f1", text: "#a5b4fc", label: "Infrastructure" },
  backend: { bg: "#0c1a2e", border: "#0ea5e9", text: "#7dd3fc", label: "Backend" },
  frontend: { bg: "#0d2318", border: "#10b981", text: "#6ee7b7", label: "Frontend" },
  qa: { bg: "#1c1209", border: "#f59e0b", text: "#fcd34d", label: "QA / Tests" },
  deploy: { bg: "#1a0a2e", border: "#a855f7", text: "#d8b4fe", label: "Déploiement" },
  fullstack: { bg: "#0d1c1a", border: "#14b8a6", text: "#5eead4", label: "Full-Stack" },
};

const stats = {
  totalTasks: 117,
  mvpTasks: 92,
  phases: 4,
  mvpDays: 14,
  totalWeeks: 24,
};

export default function Roadmap() {
  const [activePhase, setActivePhase] = useState(0);
  const [expandedDay, setExpandedDay] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [filter, setFilter] = useState("all");

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const getPhaseProgress = (phase) => {
    const allTasks = phase.sprints.flatMap(s => s.tasks);
    const done = allTasks.filter(t => completedTasks[t.id]).length;
    return { done, total: allTasks.length, pct: Math.round((done / allTasks.length) * 100) };
  };

  const filteredSprints = (phase) => {
    if (filter === "all") return phase.sprints;
    return phase.sprints.filter(s => s.type === filter);
  };

  const phase = phases[activePhase];
  const progress = getPhaseProgress(phase);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080b14",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#e2e8f0",
      padding: "0",
    }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        borderBottom: "1px solid #1e293b",
        padding: "32px 40px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 11, letterSpacing: 4, color: "#6366f1", textTransform: "uppercase", fontWeight: 700 }}>UniPlatform</span>
                <span style={{ color: "#334155", fontSize: 10 }}>▸</span>
                <span style={{ fontSize: 11, letterSpacing: 3, color: "#475569", textTransform: "uppercase" }}>Roadmap de Construction</span>
              </div>
              <h1 style={{
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 900,
                letterSpacing: -1,
                margin: 0,
                background: "linear-gradient(90deg, #f8fafc 0%, #6366f1 60%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'DM Mono', monospace",
              }}>
                PLAN DE DÉVELOPPEMENT
              </h1>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13, letterSpacing: 1 }}>
                {stats.totalTasks} tâches · {stats.phases} phases · MVP en {stats.mvpDays} jours
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Tâches MVP", value: stats.mvpTasks, color: "#6366f1" },
                { label: "Durée MVP", value: "14j", color: "#0ea5e9" },
                { label: "Durée totale", value: "6 mois", color: "#10b981" },
                { label: "Phases", value: stats.phases, color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "#0f172a",
                  border: `1px solid ${s.color}33`,
                  borderRadius: 8,
                  padding: "10px 18px",
                  textAlign: "center",
                  minWidth: 80,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>

        {/* Phase selector */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          {phases.map((p, i) => {
            const prog = getPhaseProgress(p);
            return (
              <button key={p.id} onClick={() => { setActivePhase(i); setExpandedDay(null); }}
                style={{
                  flex: "1 1 200px",
                  background: activePhase === i ? `${p.color}18` : "#0f172a",
                  border: `2px solid ${activePhase === i ? p.color : "#1e293b"}`,
                  borderRadius: 12,
                  padding: "16px 20px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}>
                <div style={{ position: "absolute", top: 0, left: 0, height: 3, width: `${prog.pct}%`, background: p.color, transition: "width 0.5s", borderRadius: "3px 0 0 0" }} />
                <div style={{ fontSize: 20, marginBottom: 6 }}>{p.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: activePhase === i ? p.color : "#94a3b8", letterSpacing: 2, textTransform: "uppercase" }}>{p.title}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{p.duration}</div>
                <div style={{ fontSize: 11, color: p.color, marginTop: 8 }}>{prog.done}/{prog.total} tâches · {prog.pct}%</div>
              </button>
            );
          })}
        </div>

        {/* Phase header */}
        <div style={{
          background: `linear-gradient(135deg, ${phase.color}12 0%, transparent 100%)`,
          border: `1px solid ${phase.color}30`,
          borderRadius: 16,
          padding: "24px 28px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 32 }}>{phase.icon}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: phase.color, letterSpacing: -1 }}>Phase {phase.id} — {phase.title}</h2>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>{phase.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["all", "backend", "frontend", "infra", "qa", "deploy", "fullstack"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1px solid ${filter === f ? typeColors[f]?.border || phase.color : "#1e293b"}`,
                background: filter === f ? (typeColors[f]?.bg || "#1e293b") : "transparent",
                color: filter === f ? (typeColors[f]?.text || phase.color) : "#64748b",
                fontSize: 11,
                cursor: "pointer",
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 600,
                transition: "all 0.15s",
              }}>
                {f === "all" ? "Tout" : typeColors[f]?.label || f}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar global phase */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#475569", letterSpacing: 2, textTransform: "uppercase" }}>Progression Phase {phase.id}</span>
            <span style={{ fontSize: 11, color: phase.color, fontWeight: 700 }}>{progress.done} / {progress.total} tâches complétées</span>
          </div>
          <div style={{ height: 6, background: "#1e293b", borderRadius: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${progress.pct}%`,
              background: `linear-gradient(90deg, ${phase.color}, ${phase.accent})`,
              borderRadius: 6,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* Sprints grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredSprints(phase).map((sprint, si) => {
            const sprintDone = sprint.tasks.filter(t => completedTasks[t.id]).length;
            const sprintPct = Math.round((sprintDone / sprint.tasks.length) * 100);
            const isExpanded = expandedDay === `${activePhase}-${si}`;
            const tc = typeColors[sprint.type] || typeColors.backend;

            return (
              <div key={si} style={{
                background: "#0d1117",
                border: `1px solid ${isExpanded ? tc.border : "#1e293b"}`,
                borderRadius: 12,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}>
                {/* Sprint header */}
                <button onClick={() => setExpandedDay(isExpanded ? null : `${activePhase}-${si}`)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}>

                  {/* Day badge */}
                  <div style={{
                    minWidth: 48,
                    height: 48,
                    background: `${tc.border}20`,
                    border: `1px solid ${tc.border}50`,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    color: tc.text,
                    letterSpacing: 1,
                    flexShrink: 0,
                  }}>
                    {sprint.day}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{sprint.label}</span>
                      <span style={{
                        padding: "2px 10px",
                        background: tc.bg,
                        border: `1px solid ${tc.border}40`,
                        borderRadius: 20,
                        fontSize: 10,
                        color: tc.text,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}>{tc.label}</span>
                    </div>
                    {/* Progress mini bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                      <div style={{ flex: 1, height: 3, background: "#1e293b", borderRadius: 3, overflow: "hidden", maxWidth: 200 }}>
                        <div style={{ height: "100%", width: `${sprintPct}%`, background: tc.border, transition: "width 0.4s" }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#475569", whiteSpace: "nowrap" }}>{sprintDone}/{sprint.tasks.length}</span>
                    </div>
                  </div>

                  <div style={{
                    fontSize: 18,
                    color: isExpanded ? tc.text : "#334155",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0)",
                    transition: "transform 0.2s, color 0.2s",
                    flexShrink: 0,
                    marginLeft: 8,
                  }}>▶</div>
                </button>

                {/* Tasks list */}
                {isExpanded && (
                  <div style={{
                    borderTop: `1px solid ${tc.border}30`,
                    padding: "12px 20px 20px",
                  }}>
                    {sprint.tasks.map((task, ti) => {
                      const done = completedTasks[task.id];
                      return (
                        <div key={task.id}
                          onClick={() => toggleTask(task.id)}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            padding: "10px 12px",
                            margin: "4px 0",
                            borderRadius: 8,
                            cursor: "pointer",
                            background: done ? `${tc.border}10` : "transparent",
                            border: `1px solid ${done ? tc.border + "40" : "transparent"}`,
                            transition: "all 0.15s",
                          }}>
                          {/* Checkbox */}
                          <div style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            border: `2px solid ${done ? tc.border : "#334155"}`,
                            background: done ? tc.border : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: 1,
                            transition: "all 0.15s",
                          }}>
                            {done && <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>✓</span>}
                          </div>

                          <div style={{ flex: 1 }}>
                            <span style={{
                              fontSize: 11,
                              color: "#475569",
                              fontFamily: "monospace",
                              marginRight: 8,
                            }}>{task.id}</span>
                            <span style={{
                              fontSize: 14,
                              color: done ? "#475569" : "#cbd5e1",
                              textDecoration: done ? "line-through" : "none",
                              lineHeight: 1.5,
                            }}>{task.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: 40,
          padding: "20px 24px",
          background: "#0d1117",
          border: "1px solid #1e293b",
          borderRadius: 12,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          <span style={{ fontSize: 11, color: "#475569", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>Légende</span>
          {Object.entries(typeColors).map(([key, val]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: val.border }} />
              <span style={{ fontSize: 12, color: "#64748b" }}>{val.label}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 11, color: "#334155" }}>
            💡 Cliquez sur une tâche pour la marquer comme complétée
          </div>
        </div>

      </div>
    </div>
  );
}
