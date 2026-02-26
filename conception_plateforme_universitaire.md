# 🎓 UniCore — Conception Complète de la Plateforme Universitaire

> **Version :** 1.0 · **Méthode :** Agile (Scrum) · **Statut :** Document de conception initial

---

## 🗺️ Table des matières

1. [Vision produit](#vision)
2. [Architecture système](#architecture)
3. [Modèle de données — Entités clés](#entites)
4. [Zones d'ombre & angles morts](#zones-ombre)
5. [Backlog agile — Sprints](#backlog)
6. [Stack technologique](#stack)
7. [Diagramme de flux utilisateur](#flux)
8. [Sécurité & conformité](#securite)

---

## 🎯 1. Vision Produit {#vision}

> **UniCore** est une plateforme SaaS multi-tenant dédiée aux établissements d'enseignement supérieur, centralisant l'ensemble du cycle de vie académique, administratif et logistique.

### Proposition de valeur

| 👤 Acteur | 🔴 Problème actuel | ✅ Solution UniCore |
|---|---|---|
| Étudiant | Déplacements multiples pour documents | Portail self-service 24/7 |
| Enseignant | Saisie des notes en double | Interface unifiée + import Excel |
| Scolarité | Excel fragiles, données dupliquées | Base unique + workflows automatisés |
| Direction | Aucune visibilité temps réel | Dashboard analytique live |
| DSI | Systèmes isolés non interconnectés | API REST ouverte + webhooks |

---

## 🏗️ 2. Architecture Système {#architecture}

### Vue d'ensemble macro

```mermaid
graph TB
    subgraph FRONTEND["🖥️ Frontend Layer"]
        PA[Portail Admin]
        PE[Portail Étudiant]
        PP[Portail Enseignant]
        PM[App Mobile]
    end

    subgraph API["⚙️ API Gateway / Backend"]
        GW[API Gateway\nAuth + Rate Limiting]
        
        subgraph CORE["Core Services"]
            S1[👥 Students Service]
            S2[👨‍🏫 Teachers Service]
            S3[📚 Academic Service]
            S4[📅 Planning Service]
            S5[📄 Documents Service]
            S6[🏠 Campus Service]
        end

        subgraph TRANSVERSAL["Modules transversaux"]
            AUTH[🔐 Auth / RBAC]
            NOTIF[🔔 Notifications]
            AUDIT[📋 Audit Log]
            SEARCH[🔍 Search Engine]
        end
    end

    subgraph DATA["🗄️ Data Layer"]
        PG[(PostgreSQL\nDonnées principales)]
        REDIS[(Redis\nCache / Sessions)]
        S3B[(S3 / MinIO\nDocuments & Fichiers)]
        ES[(Elasticsearch\nRecherche full-text)]
    end

    subgraph EXTERNAL["🌐 Services Externes"]
        EMAIL[📧 SMTP / SendGrid]
        SMS[📱 Twilio]
        PAY[💳 Paiement en ligne]
        ESIGN[✍️ Signature électronique]
    end

    FRONTEND --> GW
    GW --> CORE
    GW --> TRANSVERSAL
    CORE --> DATA
    TRANSVERSAL --> DATA
    NOTIF --> EMAIL
    NOTIF --> SMS
    S5 --> S3B
    S3 --> PAY
    S5 --> ESIGN

    style FRONTEND fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f
    style API fill:#dcfce7,stroke:#22c55e,color:#14532d
    style DATA fill:#fef9c3,stroke:#eab308,color:#713f12
    style EXTERNAL fill:#fce7f3,stroke:#ec4899,color:#831843
```

### Architecture base de données (multi-tenant)

```mermaid
graph LR
    T1[Université A\nSchema: univ_a]
    T2[Université B\nSchema: univ_b]
    T3[Université C\nSchema: univ_c]
    
    PG[(PostgreSQL\nMulti-schema)]
    
    T1 --> PG
    T2 --> PG
    T3 --> PG

    style PG fill:#fef9c3,stroke:#eab308
```

> **Stratégie multi-tenant :** Un schema PostgreSQL par établissement → isolation des données, migrations indépendantes, facturation à l'usage.

---

## 🗃️ 3. Modèle de Données — Entités Clés {#entites}

### ERD simplifié — Cœur académique

```mermaid
erDiagram
    ANNEE_ACADEMIQUE {
        uuid id PK
        string libelle
        date date_debut
        date date_fin
        boolean active
    }

    FILIERE {
        uuid id PK
        string code
        string libelle
        string niveau_max
        int duree_annees
    }

    NIVEAU {
        uuid id PK
        uuid filiere_id FK
        int ordre
        string libelle
    }

    CLASSE {
        uuid id PK
        uuid niveau_id FK
        uuid annee_id FK
        string code
        int effectif_max
    }

    ETUDIANT {
        uuid id PK
        string matricule
        string nom
        string prenom
        date naissance
        string statut
        string genre
        uuid nationalite_id FK
    }

    INSCRIPTION {
        uuid id PK
        uuid etudiant_id FK
        uuid classe_id FK
        uuid annee_id FK
        string statut
        date date_inscription
        string type_inscription
        boolean boursier
    }

    ENSEIGNANT {
        uuid id PK
        string matricule
        string nom
        string prenom
        string type
        string grade
        string specialite
    }

    MATIERE {
        uuid id PK
        uuid niveau_id FK
        string code
        string libelle
        float coefficient
        int volume_horaire
        string type_evaluation
        string semestre
    }

    NOTE {
        uuid id PK
        uuid etudiant_id FK
        uuid matiere_id FK
        uuid annee_id FK
        float note_cc
        float note_examen
        float moyenne
        string session
        boolean validee
    }

    SALLE {
        uuid id PK
        string code
        string batiment
        int capacite
        string type
        boolean equipement_video
        boolean accessible_pmr
    }

    ANNEE_ACADEMIQUE ||--o{ CLASSE : "contient"
    FILIERE ||--o{ NIVEAU : "comporte"
    NIVEAU ||--o{ CLASSE : "génère"
    CLASSE ||--o{ INSCRIPTION : "accueille"
    ETUDIANT ||--o{ INSCRIPTION : "effectue"
    INSCRIPTION ||--o{ NOTE : "génère"
    MATIERE ||--o{ NOTE : "évaluée par"
    NIVEAU ||--o{ MATIERE : "inclut"
```

### ERD — Planning & Campus

```mermaid
erDiagram
    CRENEAU_HORAIRE {
        uuid id PK
        uuid classe_id FK
        uuid matiere_id FK
        uuid enseignant_id FK
        uuid salle_id FK
        date date_cours
        time heure_debut
        time heure_fin
        string type_seance
        boolean annule
    }

    CHAMBRE {
        uuid id PK
        string numero
        string batiment
        int capacite
        string type
        string statut
        float tarif_mensuel
    }

    OCCUPATION_CHAMBRE {
        uuid id PK
        uuid chambre_id FK
        uuid etudiant_id FK
        date date_entree
        date date_sortie_prevue
        date date_sortie_effective
        float caution_versee
        string statut
    }

    SOUTENANCE {
        uuid id PK
        uuid etudiant_id FK
        uuid salle_id FK
        uuid annee_id FK
        datetime date_heure
        string titre_memoire
        string statut
        float note_finale
        string mention
    }

    JURY_MEMBRE {
        uuid id PK
        uuid soutenance_id FK
        uuid enseignant_id FK
        string role
        boolean president
    }

    CHAMBRE ||--o{ OCCUPATION_CHAMBRE : "occupée par"
    SOUTENANCE ||--o{ JURY_MEMBRE : "composé de"
```

---

## ⚠️ 4. Zones d'Ombre & Angles Morts {#zones-ombre}

> **🔴 Ce sont les situations que votre document original n'a PAS anticipées.** Chacune peut bloquer le projet en production.

### 4.1 — Entités manquantes ou sous-spécifiées

#### 🔴 CRITIQUE — La nationalité et les étudiants étrangers

Vous n'avez pas prévu :
- Suivi du **titre de séjour / visa étudiant** (date d'expiration, alertes)
- **Équivalences de diplômes** étrangers pour l'admission
- Documents spécifiques pour étudiants hors UE/UEMOA

#### 🔴 CRITIQUE — Les groupes de TD/TP

La classe est une unité trop grosse. En réalité :
- Une classe de 80 étudiants se divise en **groupes de TD** (20-25)
- Les **groupes de TP** peuvent être différents des groupes de TD
- Un étudiant peut changer de groupe (chirurgie, échange, redoublement partiel)

```mermaid
graph TD
    C[Classe L1 Info A\n80 étudiants] --> TD1[Groupe TD1\n25 étudiants]
    C --> TD2[Groupe TD2\n25 étudiants]
    C --> TD3[Groupe TD3\n30 étudiants]
    TD1 --> TP1[Groupe TP1\n12 étudiants]
    TD1 --> TP2[Groupe TP2\n13 étudiants]
    TD2 --> TP3[Groupe TP3\n12 étudiants]
    TD2 --> TP4[Groupe TP4\n13 étudiants]

    style C fill:#fee2e2,stroke:#ef4444
    style TD1 fill:#fef9c3,stroke:#eab308
    style TD2 fill:#fef9c3,stroke:#eab308
    style TD3 fill:#fef9c3,stroke:#eab308
```

#### 🟠 IMPORTANT — Les sessions d'examen

Vous avez les notes mais pas la **session** structurée :
- Session normale vs session de rattrapage
- Dates d'ouverture/fermeture de saisie des notes
- Clôture de session par le responsable pédagogique
- Archivage après délibération (notes immuables)

#### 🟠 IMPORTANT — Les transferts et mobilités

Situations non modélisées :
- **Transfert entrant** (étudiant venant d'une autre université)
- **Transfert sortant**
- **Changement de filière** en cours d'année
- **Interruption temporaire** (congé maternité, maladie longue durée)
- **Étudiant en double inscription** (formation continue + initiale)

#### 🟡 À PRÉVOIR — Les frais et paiements

```mermaid
graph LR
    I[Inscription] --> F1[Frais d'inscription]
    I --> F2[Frais de scolarité]
    I --> F3[Frais pédagogiques]
    F2 --> ECH[Échéancier\nversements]
    ECH --> V1[Versement 1\n50%]
    ECH --> V2[Versement 2\n30%]
    ECH --> V3[Versement 3\n20%]
    V1 --> VALID{Validation\naccès plateforme}

    style VALID fill:#dcfce7,stroke:#22c55e
    style F1 fill:#fee2e2,stroke:#ef4444
    style F2 fill:#fee2e2,stroke:#ef4444
```

Sans module de paiement, la plateforme ne peut pas **conditionner l'accès** aux services (notes, emplois du temps) au règlement des frais.

#### 🟡 À PRÉVOIR — Le parcours pédagogique individualisé

Vous traitez tous les étudiants uniformément. Or :
- Un étudiant **redoublant partiellement** ne suit que certaines matières
- Un étudiant en **validation d'acquis** (VAE/VAP) peut être dispensé de certains modules
- Un étudiant en **stage long** a un emploi du temps spécifique

#### 🟡 À PRÉVOIR — Les conventions et partenariats

Non traités :
- **Conventions de stage** (entreprise, durée, tuteur)
- **Conventions d'échange** Erasmus / bilatérales
- **Entreprises partenaires** pour alternance
- **Tuteurs professionnels** (non enseignants, mais évaluateurs)

### 4.2 — Situations opérationnelles non anticipées

| ❓ Situation | ⚡ Impact | 💡 Solution recommandée |
|---|---|---|
| Enseignant absent en urgence | Cours annulé sans prévenir → conflit emploi du temps | Système de remplacement + notification push |
| Délibération contestée | Modification de note après clôture | Workflow de demande de révision avec double validation |
| Deux étudiants homonymes | Confusion de dossiers | Matricule unique + photo obligatoire |
| Soutenance reportée en urgence | Jury partiellement présent | Seuil minimum de jury + report automatique |
| Diplôme non retiré après 2 ans | Stockage physique, espace perdu | Statut "diplôme en attente" + relances automatiques |
| Étudiant décédé | Dossier bloqué dans le système | Statut "archivé - décès" + procédure famille |
| Coupure réseau lors de saisie notes | Perte de données | Auto-save local (IndexedDB) + sync à la reconnexion |
| Changement de responsable pédagogique | Accès perdus / doublons | Transfert de rôle avec historique |

### 4.3 — Entités manquantes dans votre modèle

```mermaid
mindmap
  root((Entités\noubliées))
    Académique
      Groupe de TD/TP
      Session d'examen
      UE / Bloc de compétences
      Programme pédagogique versionné
      Barème de notation
    Personnes
      Tuteur de stage
      Responsable entreprise
      Ancien étudiant alumni
      Candidat préinscription
    Financier
      Frais académiques
      Versement / Reçu
      Bourse
      Exonération
    Logistique
      Matériel pédagogique
      Clé de salle
      Badge d'accès
      Véhicule campus
    Légal
      Convention de stage
      Convention d'alternance
      Accord de confidentialité
      Attestation de déontologie
```

---

## 🏃 5. Backlog Agile — Conception par Sprints {#backlog}

### Roadmap globale

```mermaid
gantt
    title Roadmap UniCore — 12 mois
    dateFormat  YYYY-MM-DD
    section 🏁 Phase 0 — Fondations
    Setup infra & CI/CD           :done,    p0a, 2024-01-01, 1w
    Auth / RBAC / Multi-tenant    :done,    p0b, 2024-01-08, 1w
    section 🌱 Sprint 1-2 — MVP Core
    Gestion étudiants             :active,  s1a, 2024-01-15, 2w
    Gestion enseignants           :         s1b, 2024-01-15, 2w
    section 🌿 Sprint 3-4 — Académique
    Classes & filières            :         s2a, 2024-01-29, 2w
    Inscriptions                  :         s2b, 2024-01-29, 2w
    section 🌳 Sprint 5-6 — Évaluations
    Notes & résultats             :         s3a, 2024-02-12, 2w
    Sessions & délibérations      :         s3b, 2024-02-12, 2w
    section 📅 Sprint 7-8 — Planning
    Emplois du temps              :         s4a, 2024-02-26, 2w
    Salles & ressources           :         s4b, 2024-02-26, 2w
    section 📄 Sprint 9-10 — Documents
    Moteur de documents           :         s5a, 2024-03-11, 2w
    Portails étudiant/enseignant  :         s5b, 2024-03-11, 2w
    section 🏠 Sprint 11-12 — Campus
    Chambres & hébergement        :         s6a, 2024-03-25, 2w
    Soutenances & jurys           :         s6b, 2024-03-25, 2w
    section 📊 Sprint 13-14 — Analytics
    Dashboard & statistiques      :         s7a, 2024-04-08, 2w
    Audit log & traçabilité       :         s7b, 2024-04-08, 2w
    section 💳 Sprint 15-16 — Évolutions
    Paiements en ligne            :         s8a, 2024-04-22, 2w
    API publique & intégrations   :         s8b, 2024-04-22, 2w
```

### Détail Sprint 1 & 2 — MVP (exemple)

| # | User Story | Priorité | Points | Acceptance Criteria |
|---|---|---|---|---|
| US-001 | En tant qu'admin, je peux créer un dossier étudiant | 🔴 Must | 5 | Matricule auto-généré, champs obligatoires validés |
| US-002 | En tant qu'étudiant, je peux me connecter avec mon email | 🔴 Must | 3 | JWT, 2FA optionnel, reset password |
| US-003 | En tant que scolarité, je peux importer une liste CSV d'étudiants | 🔴 Must | 8 | Validation colonnes, rapport d'erreurs, rollback si échec |
| US-004 | En tant qu'admin, je peux créer un profil enseignant | 🔴 Must | 5 | Type permanent/vacataire, spécialité, documents |
| US-005 | En tant qu'admin, je peux créer des filières et niveaux | 🔴 Must | 3 | Arborescence filière > niveau > option |
| US-006 | En tant qu'admin, je peux créer une classe pour une année académique | 🔴 Must | 3 | Rattachement filière/niveau, capacité max |
| US-007 | En tant que scolarité, je peux inscrire un étudiant dans une classe | 🟠 Should | 5 | Vérification capacité, statut inscription, historique |
| US-008 | En tant qu'enseignant, je peux saisir les notes d'une matière | 🟠 Should | 8 | Grille de saisie, calcul auto, sauvegarde brouillon |
| US-009 | En tant qu'admin, je peux générer un certificat de scolarité PDF | 🟠 Should | 8 | Template personnalisable, numérotation, signature |
| US-010 | En tant que direction, je vois un tableau de bord des effectifs | 🟡 Could | 5 | Graphiques par filière, export Excel |

### Définition of Done (DoD)

> ✅ Code revu par un pair  
> ✅ Tests unitaires ≥ 80% couverture  
> ✅ Tests E2E sur le happy path  
> ✅ Documentation API (Swagger)  
> ✅ Testé sur mobile (responsive)  
> ✅ Validé par le Product Owner  
> ✅ Déployé en staging  

---

## 💻 6. Stack Technologique {#stack}

### Vue d'ensemble de la stack

```mermaid
graph TB
    subgraph FRONT["🖥️ Frontend"]
        NEXT[Next.js 14\nApp Router]
        TS[TypeScript]
        TAIL[Tailwind CSS]
        RQ[TanStack Query\nv5]
        ZOD[Zod\nValidation]
    end

    subgraph BACK["⚙️ Backend"]
        NODE[Node.js 20 LTS]
        NEST[NestJS\nFramework]
        PRISMA[Prisma ORM]
        JWT2[JWT + Passport]
    end

    subgraph DATA2["🗄️ Data"]
        PG2[PostgreSQL 16]
        REDIS2[Redis 7]
        MINIO[MinIO\nS3-compatible]
    end

    subgraph DEVOPS["🚀 DevOps"]
        DOCKER[Docker\nCompose]
        GHA[GitHub Actions\nCI/CD]
        CADDY[Caddy\nReverse Proxy]
    end

    FRONT --> BACK
    BACK --> DATA2
    DEVOPS --> FRONT
    DEVOPS --> BACK

    style FRONT fill:#dbeafe,stroke:#3b82f6
    style BACK fill:#dcfce7,stroke:#22c55e
    style DATA2 fill:#fef9c3,stroke:#eab308
    style DEVOPS fill:#fce7f3,stroke:#ec4899
```

### Justification des choix

| Technologie | Rôle | Pourquoi ce choix |
|---|---|---|
| **Next.js 14** | Frontend SSR/SPA | SEO, performance, routing puissant, Server Actions |
| **NestJS** | Backend API | Architecture modulaire, DI, compatible microservices |
| **PostgreSQL** | Base principale | ACID, JSON natif, Row-Level Security pour multi-tenant |
| **Prisma** | ORM | Type-safe, migrations versionnées, excellent DX |
| **Redis** | Cache + Sessions | Rate limiting, file de jobs (Bull), sessions |
| **MinIO** | Stockage fichiers | Self-hosted, compatible S3, gratuit |
| **BullMQ** | Queue de jobs | Génération PDF asynchrone, envoi emails en masse |
| **Puppeteer** | Génération PDF | Templates HTML → PDF haute qualité |
| **Zod** | Validation | Schemas partagés front/back, type inference |

### Alternatives considérées

| Besoin | Option retenue | Alternative écartée | Raison |
|---|---|---|---|
| ORM | Prisma | TypeORM | Meilleure DX, types auto-générés |
| Framework backend | NestJS | Express nu | Structure, modules, testabilité |
| PDF | Puppeteer | PDFKit | Templates HTML plus flexibles |
| Auth | Passport + JWT | Auth0 / Clerk | Coût + souveraineté des données |
| Recherche | PostgreSQL full-text | Elasticsearch | Suffisant pour v1, moins de complexité |

---

## 🔄 7. Diagramme de Flux Utilisateur {#flux}

### Flux d'inscription étudiant

```mermaid
sequenceDiagram
    participant E as 👤 Étudiant
    participant WEB as 🌐 Portail Web
    participant API as ⚙️ API
    participant SCO as 👩‍💼 Scolarité
    participant NOTIF as 🔔 Notifications

    E->>WEB: Accès formulaire préinscription
    WEB->>API: POST /inscriptions/preinscription
    API-->>E: Email de confirmation + lien dossier
    E->>WEB: Upload documents (pièces d'identité, diplômes)
    WEB->>API: POST /documents/upload
    API-->>SCO: Notification nouveau dossier à traiter
    SCO->>API: GET /inscriptions/pending
    SCO->>API: PUT /inscriptions/:id/validate
    API-->>E: Email + SMS "Inscription validée"
    API->>API: Génération automatique matricule
    API->>API: Création compte étudiant
    API-->>E: Identifiants de connexion
    E->>WEB: Première connexion + changement mdp
```

### Flux de saisie et validation des notes

```mermaid
stateDiagram-v2
    [*] --> Brouillon : Enseignant commence la saisie
    Brouillon --> EnCours : Saisie partielle sauvegardée
    EnCours --> Soumis : Enseignant soumet les notes
    Soumis --> EnRevision : Responsable pédagogique demande correction
    EnRevision --> Soumis : Enseignant corrige et resoumet
    Soumis --> Validé : Responsable valide
    Validé --> Délibéré : Commission de délibération
    Délibéré --> Publié : Direction publie les résultats
    Publié --> [*]
    
    Validé --> ContestéAdmin : Demande de révision admin
    ContestéAdmin --> Validé : Correction approuvée (tracée)
```

### Diagramme de rôles et permissions

```mermaid
graph TD
    subgraph ROLES["🔐 Rôles & Accès"]
        ADM[👑 Super Admin\nTous droits]
        DIR[🏛️ Directeur\nLecture + validation]
        SCO2[📋 Scolarité\nGestion inscriptions\n+ documents]
        ENS[👨‍🏫 Enseignant\nNotes + EDT personnel]
        ETU[🎓 Étudiant\nConsultation uniquement]
        RESP[🔑 Resp. Pédagogique\nValidation notes\n+ délibérations]
        TECH[🔧 Technicien\nGestion salles\n+ matériel]
    end

    ADM -->|délègue| DIR
    ADM -->|crée| SCO2
    ADM -->|crée| RESP
    ADM -->|crée| TECH
    SCO2 -->|crée comptes| ENS
    SCO2 -->|crée comptes| ETU

    style ADM fill:#fee2e2,stroke:#ef4444
    style DIR fill:#fce7f3,stroke:#ec4899
    style SCO2 fill:#dbeafe,stroke:#3b82f6
    style ENS fill:#dcfce7,stroke:#22c55e
    style ETU fill:#f0fdf4,stroke:#86efac
```

---

## 🔒 8. Sécurité & Conformité {#securite}

### Checklist sécurité

| Domaine | Mesure | Priorité |
|---|---|---|
| **Authentification** | JWT RS256 + refresh tokens rotatifs | 🔴 MVP |
| **Autorisation** | RBAC + Row-Level Security PostgreSQL | 🔴 MVP |
| **Transport** | HTTPS obligatoire, HSTS | 🔴 MVP |
| **Mots de passe** | bcrypt (cost 12) + politique de complexité | 🔴 MVP |
| **Audit** | Toute action tracée (qui, quoi, quand, depuis où) | 🟠 Sprint 2 |
| **RGPD / Données perso** | Droit à l'effacement, export des données | 🟠 Sprint 3 |
| **Rate limiting** | 100 req/min par IP, 1000 req/min par token | 🟠 Sprint 2 |
| **Upload fichiers** | Scan antivirus, type MIME strict, taille max | 🟠 Sprint 2 |
| **Sauvegarde** | Backup quotidien chiffré, rétention 30 jours | 🟠 Sprint 1 |
| **2FA** | TOTP optionnel pour admins, obligatoire super admin | 🟡 Sprint 4 |
| **Chiffrement données** | Données sensibles chiffrées at-rest (AES-256) | 🟡 Sprint 4 |

### Points de vigilance spécifiques aux universités

> ⚠️ **FERPA / Réglementations locales** : Vérifier la législation de votre pays sur la protection des données des étudiants mineurs.

> ⚠️ **Notes = données légales** : Une modification de note après délibération doit être **impossible** sans workflow de validation explicite et **traçabilité complète** (qui a demandé, qui a approuvé, horodatage NTP certifié).

> ⚠️ **Documents officiels** : Les certificats et relevés doivent avoir un **numéro unique vérifiable** et idéalement un **QR code** permettant leur authentification en ligne.

---

## 🚀 Prochaines étapes recommandées

```mermaid
graph LR
    A[📋 Valider ce document\navec les parties prenantes] --> B[🗺️ Atelier\nEvent Storming\navec l'équipe]
    B --> C[🎨 Wireframes\ndes écrans critiques]
    C --> D[🔨 Sprint 0\nSetup infra + CI/CD]
    D --> E[🌱 Sprint 1-2\nMVP Core]

    style A fill:#dbeafe,stroke:#3b82f6
    style B fill:#dcfce7,stroke:#22c55e
    style C fill:#fef9c3,stroke:#eab308
    style D fill:#fce7f3,stroke:#ec4899
    style E fill:#dcfce7,stroke:#22c55e
```

---

*Document généré avec UniCore Design System · Dernière mise à jour : 2026*
