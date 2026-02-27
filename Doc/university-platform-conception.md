# 🎓 UniPlatform — Conception Complète
> **Plateforme de Gestion Universitaire Unifiée**  
> Stack : React · Node.js · PostgreSQL · MVP 2 semaines

---

## 📋 Table des matières

1. [Vision & Périmètre](#vision)
2. [Zones d'ombre & Cas non imaginés](#zones-ombre)
3. [Architecture Globale](#architecture)
4. [Modèle de Données UML](#uml)
5. [Diagramme de Classes OO](#classes)
6. [User Stories & Backlog Scrum](#scrum)
7. [Architecture Frontend (React)](#frontend)
8. [Architecture Backend (Node.js)](#backend)
9. [Schéma Base de Données](#database)
10. [Roadmap MVP 2 semaines](#roadmap)
11. [Stack Technologique](#stack)
12. [Considérations Sécurité](#securite)
13. [Récapitulatif](#recapitulatif)

---

## 🎯 1. Vision & Périmètre {#vision}

> Centraliser 100% des opérations académiques dans une seule plateforme, accessible par rôle, depuis n'importe quel appareil.

```mermaid
mindmap
  root((UniPlatform))
    Acteurs
      Étudiant
      Enseignant
      Scolarité
      Direction
      Personnel Admin
    Modules MVP
      Étudiants
      Inscriptions
      Notes
      Emplois du temps
      Documents
    Modules V2
      Chambres
      Soutenances
      Paiements
      LMS
      API externe
```

---

## ⚠️ 2. Zones d'ombre — Cas non imaginés {#zones-ombre}

> Ces situations **critiques** n'apparaissent pas dans la conception initiale et doivent être traitées en amont.

### 2.1 Situations académiques complexes

| Situation | Problème si non géré | Solution à prévoir |
| --- | --- | --- |
| **Étudiant doublement inscrit** | Deux filières en parallèle (ex : droit + licence pro) | Autorisation explicite par admin + flag multi-inscription |
| **Changement de filière en cours d'année** | Historique cassé, notes perdues | Table `transfert_filiere` avec date et motif |
| **Équivalences de cours étrangers** | Notes d'échanges Erasmus/étrangers | Module validation d'acquis avec correspondance matières |
| **Rattrapage & sessions spéciales** | Notes de 1ère et 2ème session distinctes | `session` (1, 2, rattrapage) sur chaque note |
| **Étudiant décédé ou disparu** | Statut bloqué, historique requis | Statut `archivé_décès`, données conservées 10 ans |
| **Étudiant en congé médical** | Ni présent, ni abandonné | Statut `congé_médical` avec dates de reprise |
| **Reconnaissance de diplôme étranger** | Niveau d'entrée ambigu | Champ `diplome_etranger_validé` + attachement scan |

### 2.2 Situations d'enseignement

| Situation | Problème | Solution |
|---|---|---|
| **Cours mutualisés** | Une matière partagée entre 2 filières | Relation M:N `cours ↔ classe` |
| **Enseignant en arrêt maladie** | Cours non assuré, remplacement urgent | Statut `remplacement_temporaire` + notification auto |
| **Vacataire sans contrat signé** | Peut saisir des notes sans être formalisé | Validation de contrat avant activation compte |
| **Conflit d'intérêt jury** | Enseignant qui note son propre proche | Flag `lien_familial` à déclarer à la création du jury |
| **Saisie de notes après deadline** | Délibération passée | Workflow de correction avec validation doyen |
| **Matière enseignée par 2 enseignants** | Qui saisit quoi ? | Partition de la matière (CM/TD/TP) par sous-groupe |

### 2.3 Situations administratives

| Situation | Problème | Solution |
|---|---|---|
| **Doublon d'étudiant** | Même étudiant créé deux fois | Détection par (nom + prénom + date naissance + ville) |
| **Numéro étudiant recyclé** | Ancien numéro réattribué à un nouveau | UUID permanent + code lisible non recyclable |
| **Document falsifié** | Certificat modifié après génération | QR Code de vérification + hash SHA256 du contenu |
| **Changement de règle de calcul en cours d'année** | Quelle formule s'applique ? | Versioning des règles pédagogiques par `annee_academique` |
| **Année académique non clôturée** | On ne peut pas passer à la suivante | Workflow de clôture avec checklist obligatoire |
| **Données RGPD** | Droit à l'oubli d'un étudiant sorti | Politique de rétention + anonymisation après 10 ans |

### 2.4 Situations infrastructurelles

| Situation | Problème | Solution |
|---|---|---|
| **Panne pendant délibération** | Données partiellement sauvées | Transactions DB atomiques + autosave toutes les 30s |
| **Plusieurs admins simultanés** | Conflits de modification | Optimistic locking + notifications de conflit |
| **Import de données depuis Excel** | Migration depuis l'ancien système | Module d'import CSV/Excel avec validation et rapport d'erreurs |
| **Connexion lente / offline** | Zone à faible couverture | PWA avec cache offline pour consultation des notes |

---

## 🏗️ 3. Architecture Globale {#architecture}

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client Layer"]
        WEB["React Web App<br/>Tailwind CSS"]
        MOB["React Native / PWA<br/>Mobile"]
    end

    subgraph API["⚙️ API Layer — Node.js / Express"]
        GW["API Gateway<br/>Rate Limiting · CORS"]
        AUTH["Auth Service<br/>JWT · Refresh Token"]
        STUDENT["Student Service"]
        ACADEMIC["Academic Service"]
        SCHEDULE["Schedule Service"]
        DOC["Document Service"]
        NOTIF["Notification Service"]
    end

    subgraph DATA["💾 Data Layer"]
        PG[("PostgreSQL<br/>Primary DB")]
        REDIS[("Redis<br/>Sessions · Cache")]
        S3["MinIO / S3<br/>Documents · Fichiers"]
        ELASTIC["(V2) Elasticsearch<br/>Recherche avancée"]
    end

    subgraph INFRA["🔧 Infrastructure"]
        QUEUE["Bull Queue<br/>Jobs asynchrones"]
        MAILER["Mailer Service<br/>SMTP"]
        PDF["PDF Generator<br/>Puppeteer"]
    end

    WEB --> GW
    MOB --> GW
    GW --> AUTH
    GW --> STUDENT
    GW --> ACADEMIC
    GW --> SCHEDULE
    GW --> DOC
    GW --> NOTIF

    STUDENT --> PG
    ACADEMIC --> PG
    SCHEDULE --> PG
    SCHEDULE --> REDIS
    AUTH --> REDIS
    DOC --> PG
    DOC --> S3
    DOC --> PDF

    NOTIF --> QUEUE
    QUEUE --> MAILER
    PDF --> S3
```

---

## 📐 4. Modèle de Données UML — Entités Principales {#uml}

```mermaid
erDiagram
    ANNEE_ACADEMIQUE {
        uuid id PK
        string code "2024-2025"
        date date_debut
        date date_fin
        enum statut "ouvert|clos|archivé"
        boolean est_courante
    }

    UNIVERSITE {
        uuid id PK
        string nom
        string code
        string logo_url
        jsonb parametres
    }

    FILIERE {
        uuid id PK
        uuid universite_id FK
        string nom
        string code
        enum niveau "licence|master|doctorat|bts"
        int duree_annees
    }

    CLASSE {
        uuid id PK
        uuid filiere_id FK
        uuid annee_academique_id FK
        string nom
        int capacite_max
        int annee_niveau "1,2,3..."
    }

    ETUDIANT {
        uuid id PK
        string numero_etudiant UK
        string nom
        string prenom
        date date_naissance
        string email UK
        string telephone
        enum statut "actif|suspendu|diplome|abandon|conge_medical|archive"
        boolean multi_inscription
        timestamp created_at
    }

    INSCRIPTION {
        uuid id PK
        uuid etudiant_id FK
        uuid classe_id FK
        uuid annee_academique_id FK
        enum statut "inscrit|en_attente|rejete|suspendu"
        date date_inscription
        int session_inscription "1|2"
        string motif_rejet
        boolean est_transfert
        uuid classe_precedente_id FK
    }

    ENSEIGNANT {
        uuid id PK
        string matricule UK
        string nom
        string prenom
        string email UK
        enum type "permanent|vacataire"
        string specialite
        int quota_heures_max
        enum statut "actif|conge|inactif"
    }

    MATIERE {
        uuid id PK
        uuid filiere_id FK
        string nom
        string code UK
        float coefficient
        int volume_horaire_cm
        int volume_horaire_td
        int volume_horaire_tp
        int annee_niveau
        int semestre "1|2"
    }

    AFFECTATION_ENSEIGNANT {
        uuid id PK
        uuid enseignant_id FK
        uuid matiere_id FK
        uuid classe_id FK
        uuid annee_academique_id FK
        enum type_seance "CM|TD|TP"
        int heures_effectuees
    }

    NOTE {
        uuid id PK
        uuid etudiant_id FK
        uuid matiere_id FK
        uuid annee_academique_id FK
        uuid saisi_par FK
        float note_cc
        float note_exam
        float moyenne_finale
        int session "1|2|rattrapage"
        enum statut "provisoire|validee|contestee"
        timestamp saisi_le
        timestamp validee_le
        string commentaire
    }

    SALLE {
        uuid id PK
        uuid universite_id FK
        string nom
        string batiment
        int capacite
        enum type "cours|amphi|labo|soutenance"
        boolean disponible
    }

    CRENEAU_HORAIRE {
        uuid id PK
        uuid salle_id FK
        uuid affectation_id FK
        uuid annee_academique_id FK
        date date
        time heure_debut
        time heure_fin
        enum jour "lun|mar|mer|jeu|ven|sam"
        boolean est_recurrent
    }

    SOUTENANCE {
        uuid id PK
        uuid etudiant_id FK
        uuid salle_id FK
        uuid annee_academique_id FK
        string titre_memoire
        datetime date_heure
        float note
        enum statut "planifiee|terminee|reportee"
        string pv_url
    }

    JURY_SOUTENANCE {
        uuid id PK
        uuid soutenance_id FK
        uuid enseignant_id FK
        enum role "president|rapporteur|membre"
        boolean conflit_interet
    }

    DOCUMENT_ADMINISTRATIF {
        uuid id PK
        uuid etudiant_id FK
        uuid genere_par FK
        enum type "certificat|releve|attestation|decision"
        string numero_unique UK
        string hash_sha256
        string qr_code_url
        string fichier_url
        timestamp genere_le
        boolean archive
    }

    UTILISATEUR {
        uuid id PK
        string email UK
        string password_hash
        enum role "admin|scolarite|enseignant|etudiant|personnel"
        uuid profil_id
        string profil_type
        boolean actif
        timestamp derniere_connexion
    }

    CHAMBRE_CAMPUS {
        uuid id PK
        uuid universite_id FK
        string numero
        string batiment
        int capacite
        enum type "simple|double|studio"
        enum statut "disponible|occupee|maintenance"
    }

    OCCUPATION_CHAMBRE {
        uuid id PK
        uuid chambre_id FK
        uuid etudiant_id FK
        date date_entree
        date date_sortie
        enum statut "active|terminee|annulee"
    }

    ANNEE_ACADEMIQUE ||--o{ CLASSE : "contient"
    ANNEE_ACADEMIQUE ||--o{ INSCRIPTION : "regroupe"
    ANNEE_ACADEMIQUE ||--o{ NOTE : "concerne"
    FILIERE ||--o{ CLASSE : "contient"
    FILIERE ||--o{ MATIERE : "définit"
    UNIVERSITE ||--o{ FILIERE : "propose"
    UNIVERSITE ||--o{ SALLE : "possède"
    UNIVERSITE ||--o{ CHAMBRE_CAMPUS : "héberge"
    ETUDIANT ||--o{ INSCRIPTION : "a"
    ETUDIANT ||--o{ NOTE : "reçoit"
    ETUDIANT ||--o{ SOUTENANCE : "passe"
    ETUDIANT ||--o{ DOCUMENT_ADMINISTRATIF : "obtient"
    CLASSE ||--o{ INSCRIPTION : "accueille"
    CLASSE ||--o{ AFFECTATION_ENSEIGNANT : "liée à"
    ENSEIGNANT ||--o{ AFFECTATION_ENSEIGNANT : "assure"
    ENSEIGNANT ||--o{ JURY_SOUTENANCE : "participe"
    ENSEIGNANT ||--o{ NOTE : "saisit"
    MATIERE ||--o{ AFFECTATION_ENSEIGNANT : "concernée par"
    MATIERE ||--o{ NOTE : "évaluée par"
    AFFECTATION_ENSEIGNANT ||--o{ CRENEAU_HORAIRE : "planifié dans"
    SALLE ||--o{ CRENEAU_HORAIRE : "utilisée dans"
    SALLE ||--o{ SOUTENANCE : "accueille"
    SOUTENANCE ||--o{ JURY_SOUTENANCE : "composé de"
    CHAMBRE_CAMPUS ||--o{ OCCUPATION_CHAMBRE : "a"
    ETUDIANT ||--o{ OCCUPATION_CHAMBRE : "occupe"
```

---

## 🧱 5. Diagramme de Classes — Orienté Objet {#classes}

```mermaid
classDiagram
    class Etudiant {
        +UUID id
        +String numeroEtudiant
        +String nom
        +String prenom
        +Date dateNaissance
        +String email
        +StatutEtudiant statut
        +Boolean multiInscription
        +inscrire(classe, annee) Inscription
        +obtenirNotes(annee) Note[]
        +genererDocument(type) Document
        +calculerMoyenne(annee) Float
    }

    class Inscription {
        +UUID id
        +StatutInscription statut
        +Date dateInscription
        +Int sessionInscription
        +Boolean estTransfert
        +valider() void
        +rejeter(motif) void
        +suspendre() void
    }

    class Classe {
        +UUID id
        +String nom
        +Int capaciteMax
        +Int anneeNiveau
        +getEtudiants() Etudiant[]
        +getEnseignants() Enseignant[]
        +getEmploiDuTemps() Creneau[]
        +getNombreInscrits() Int
        +estComplete() Boolean
    }

    class Enseignant {
        +UUID id
        +String matricule
        +TypeEnseignant type
        +Int quotaHeuresMax
        +StatutEnseignant statut
        +getChargeHoraire(annee) Int
        +getClasses(annee) Classe[]
        +saisirNote(etudiant, matiere, note) Note
        +estDisponible(creneau) Boolean
    }

    class Matiere {
        +UUID id
        +String code
        +String nom
        +Float coefficient
        +Int volumeHoraireCM
        +Int volumeHoraireTD
        +Int volumeHoraireTP
        +Int semestre
        +calculerMoyenneClasse(classe) Float
    }

    class Note {
        +UUID id
        +Float noteCC
        +Float noteExam
        +Float moyenneFinale
        +Int session
        +StatutNote statut
        +valider() void
        +contester(motif) void
        +calculerMoyenne() Float
        +estEliminatoire() Boolean
    }

    class Soutenance {
        +UUID id
        +String titreMemoire
        +DateTime dateHeure
        +Float note
        +StatutSoutenance statut
        +ajouterJure(enseignant, role) void
        +genererPV() Document
        +verifierConflitInteret() Boolean
    }

    class Salle {
        +UUID id
        +String nom
        +Int capacite
        +TypeSalle type
        +estDisponible(debut, fin) Boolean
        +getCreneaux(semaine) Creneau[]
    }

    class DocumentAdministratif {
        +UUID id
        +TypeDocument type
        +String numeroUnique
        +String hashSha256
        +String qrCodeUrl
        +generer() void
        +verifier(hash) Boolean
        +archiver() void
    }

    class AnneeAcademique {
        +UUID id
        +String code
        +Date dateDebut
        +Date dateFin
        +StatutAnnee statut
        +Boolean estCourante
        +ouvrir() void
        +cloturer() void
        +archiver() void
        +getStatistiques() Stats
    }

    class Utilisateur {
        +UUID id
        +String email
        +Role role
        +Boolean actif
        +seConnecter(email, mdp) Token
        +seDeconnecter() void
        +changerMotDePasse(ancien, nouveau) void
    }

    class ServiceNote {
        <<service>>
        +calculerMoyenneGenerale(etudiant, annee) Float
        +genererReleve(etudiant, annee) Document
        +deliberer(classe, annee) Resultat[]
        +verifierCoherence(notes) Erreur[]
    }

    class ServiceEmploiDuTemps {
        <<service>>
        +creerCreneau(affectation, salle, debut, fin) Creneau
        +detecterConflits(creneau) Conflit[]
        +suggererSalle(cours, nbEtudiants) Salle[]
        +exporterEmploiDuTemps(classe) PDF
    }

    class ServiceDocument {
        <<service>>
        +genererCertificatScolarite(etudiant) Document
        +genererReleve(etudiant, annee) Document
        +verifierDocument(qrCode) Boolean
        +archiverBatch(annee) void
    }

    Etudiant "1" --> "0..*" Inscription : passe
    Classe "1" --> "0..*" Inscription : accueille
    Etudiant "1" --> "0..*" Note : reçoit
    Matiere "1" --> "0..*" Note : évaluée
    Enseignant "1" --> "0..*" Note : saisit
    Enseignant "1" --> "0..*" Soutenance : juge
    Etudiant "1" --> "0..*" Soutenance : passe
    Salle "1" --> "0..*" Soutenance : accueille
    Etudiant "1" --> "0..*" DocumentAdministratif : obtient
    Classe "0..*" --> "1" AnneeAcademique : appartient
    ServiceNote ..> Note : gère
    ServiceNote ..> Etudiant : concerne
    ServiceEmploiDuTemps ..> Salle : consulte
    ServiceEmploiDuTemps ..> Enseignant : planifie
    ServiceDocument ..> DocumentAdministratif : génère
    Utilisateur --> Etudiant : profil
    Utilisateur --> Enseignant : profil
```

---

## 📌 6. Backlog Scrum — User Stories {#scrum}

### Épics & Sprints MVP (2 semaines)

```mermaid
gantt
    title MVP UniPlatform — 2 Semaines
    dateFormat  DD-MM
    section Sprint 1 — Fondations (J1-J7)
    Setup projet + Auth JWT          :s1t1, 01-01, 1d
    Modèle DB + migrations           :s1t2, 02-01, 1d
    CRUD Étudiants                   :s1t3, 03-01, 1d
    CRUD Enseignants + Filières      :s1t4, 04-01, 1d
    CRUD Classes + Inscriptions      :s1t5, 05-01, 1d
    Interface React - Layout + Auth  :s1t6, 01-01, 3d
    Interface Gestion Étudiants      :s1t7, 04-01, 2d

    section Sprint 2 — Fonctionnel (J8-J14)
    API Saisie Notes + calcul moy.   :s2t1, 08-01, 2d
    API Emplois du temps simples     :s2t2, 10-01, 1d
    Génération PDF (certificats)     :s2t3, 11-01, 1d
    Interface Notes + EDT            :s2t4, 08-01, 3d
    Interface Documents              :s2t5, 11-01, 1d
    Tests + Déploiement MVP          :s2t6, 12-01, 2d
```

### Backlog priorisé

```mermaid
quadrantChart
    title Priorisation des User Stories
    x-axis Faible effort --> Fort effort
    y-axis Faible valeur --> Haute valeur
    quadrant-1 A faire en premier
    quadrant-2 Planifier
    quadrant-3 Éliminer ou reporter
    quadrant-4 Déléguer

    Connexion / Auth: [0.15, 0.95]
    Gestion Étudiants: [0.25, 0.90]
    Saisie Notes: [0.35, 0.85]
    Génération Relevé: [0.40, 0.80]
    Inscriptions: [0.30, 0.85]
    Emplois du temps: [0.60, 0.75]
    Gestion Chambres: [0.55, 0.40]
    Portail Étudiant: [0.45, 0.70]
    Soutenances: [0.70, 0.65]
    Statistiques: [0.50, 0.55]
    Paiement en ligne: [0.85, 0.60]
    LMS Integration: [0.90, 0.45]
```

### User Stories principales

#### 🔐 Authentification
```
US-001 : En tant qu'administrateur,
         je veux me connecter avec email/mot de passe
         afin d'accéder aux fonctionnalités de gestion.
         → Critères : JWT, refresh token, rôle vérifié, logout.

US-002 : En tant qu'étudiant,
         je veux réinitialiser mon mot de passe par email
         afin de ne pas être bloqué hors de mon compte.
```

#### 🎓 Gestion étudiants
```
US-010 : En tant que scolarité,
         je veux créer un dossier étudiant complet
         afin d'enregistrer un nouvel étudiant.
         → Critères : doublon détecté, numéro auto-généré, email unique.

US-011 : En tant que scolarité,
         je veux changer le statut d'un étudiant (congé médical, abandon)
         afin de refléter sa situation réelle.
         → Critères : historique du statut conservé, motif obligatoire.

US-012 : En tant qu'étudiant,
         je veux consulter mes informations personnelles
         afin de vérifier et corriger mes données.
```

#### 📝 Inscriptions
```
US-020 : En tant que scolarité,
         je veux inscrire un étudiant à une classe
         afin de formaliser son parcours pour l'année.
         → Critères : vérifier quota classe, détecter double inscription.

US-021 : En tant qu'étudiant,
         je veux faire une préinscription en ligne
         afin d'initier ma demande d'inscription.
```

#### 📊 Notes
```
US-030 : En tant qu'enseignant,
         je veux saisir les notes de mes étudiants par matière
         afin de les enregistrer dans le système.
         → Critères : validation 0-20, session 1/2/rattrapage, provisoire avant validation.

US-031 : En tant que directeur pédagogique,
         je veux valider les notes avant délibération
         afin d'en garantir la fiabilité.

US-032 : En tant qu'étudiant,
         je veux consulter mes notes
         afin de suivre ma progression académique.
```

#### 📄 Documents
```
US-040 : En tant qu'étudiant,
         je veux télécharger mon certificat de scolarité
         afin de le soumettre à des organismes externes.
         → Critères : QR code de vérification, numéro unique, PDF signé.

US-041 : En tant que scolarité,
         je veux générer des relevés de notes officiels
         afin de les remettre aux étudiants.
```

---

## ⚛️ 7. Architecture Frontend React {#frontend}

### Structure des dossiers

```
src/
├── app/                    # Config globale (router, store, theme)
│   ├── router.tsx
│   ├── store.ts           # Zustand global state
│   └── theme.ts
├── features/               # Modules métier (feature-based)
│   ├── auth/
│   │   ├── components/    # LoginForm, ResetPassword
│   │   ├── hooks/         # useAuth, useSession
│   │   ├── pages/         # LoginPage
│   │   └── api.ts         # authApi
│   ├── students/
│   │   ├── components/    # StudentCard, StudentForm, StudentTable
│   │   ├── hooks/         # useStudents, useStudentDetail
│   │   ├── pages/         # StudentsPage, StudentDetailPage
│   │   └── api.ts
│   ├── grades/
│   ├── schedule/
│   ├── documents/
│   ├── enrollments/
│   └── dashboard/
├── shared/                 # Composants réutilisables
│   ├── components/         # Button, Modal, DataTable, Badge
│   ├── hooks/             # useDebounce, usePagination
│   ├── utils/             # formatDate, formatNote, generatePDF
│   └── types/             # TypeScript interfaces globales
└── api/                    # Axios instance + interceptors
    ├── client.ts
    └── endpoints.ts
```

### Flux de navigation par rôle

```mermaid
flowchart TD
    LOGIN["🔐 Login Page"] --> AUTH{Authentification}
    AUTH -->|Échec| LOGIN
    AUTH -->|Admin| DA["📊 Dashboard Admin\nEffectifs · Stats · Alertes"]
    AUTH -->|Scolarité| DS["📋 Dashboard Scolarité\nInscriptions · Dossiers"]
    AUTH -->|Enseignant| DE["👨‍🏫 Dashboard Enseignant\nMes Classes · Mes Notes"]
    AUTH -->|Étudiant| DET["🎓 Portail Étudiant\nNotes · EDT · Documents"]

    DA --> MA["Gestion Étudiants"]
    DA --> MB["Gestion Enseignants"]
    DA --> MC["Paramètres Académiques"]
    DA --> MD["Statistiques"]

    DS --> MA
    DS --> ME["Inscriptions"]
    DS --> MF["Documents"]

    DE --> MG["Saisie Notes"]
    DE --> MH["Mon EDT"]

    DET --> MI["Mes Notes"]
    DET --> MH
    DET --> MJ["Mes Documents"]
```

### Composants clés

```mermaid
graph TB
    subgraph LAYOUT["Layout Principal"]
        NAV["Sidebar Navigation\n(rôle-based)"]
        HEADER["Header\n(user, notifications, logout)"]
        CONTENT["Content Area"]
    end

    subgraph SHARED["Composants Partagés"]
        DT["DataTable\n(sort, filter, pagination)"]
        FORM["SmartForm\n(validation, erreurs)"]
        MODAL["Modal / Drawer"]
        BADGE["StatusBadge\n(couleurs par statut)"]
        PDF_VIEW["PDFViewer"]
    end

    subgraph PAGES["Pages principales"]
        P1["StudentListPage"]
        P2["GradeEntryPage"]
        P3["SchedulePage\n(FullCalendar)"]
        P4["DocumentPage"]
        P5["DashboardPage\n(Recharts)"]
    end

    P1 --> DT
    P1 --> FORM
    P2 --> FORM
    P3 --> MODAL
    P4 --> PDF_VIEW
    P5 --> BADGE
```

---

## 🖥️ 8. Architecture Backend Node.js {#backend}

### Structure API REST

```
api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.middleware.ts   # JWT verify
│   │   │   └── auth.routes.ts
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── enrollments/
│   │   ├── grades/
│   │   ├── schedule/
│   │   ├── documents/
│   │   └── dashboard/
│   ├── shared/
│   │   ├── middleware/
│   │   │   ├── roleGuard.ts        # RBAC
│   │   │   ├── rateLimiter.ts
│   │   │   ├── validator.ts        # Zod schemas
│   │   │   └── auditLog.ts         # Traçabilité
│   │   ├── database/
│   │   │   ├── db.ts               # Knex / Prisma client
│   │   │   └── migrations/
│   │   └── utils/
│   │       ├── pdfGenerator.ts     # Puppeteer
│   │       ├── qrCode.ts
│   │       └── hashUtils.ts
│   └── app.ts
```

### Flux API — Saisie de Note (exemple complet)

```mermaid
sequenceDiagram
    participant E as Enseignant (React)
    participant GW as API Gateway
    participant AUTH as Auth Middleware
    participant GS as Grade Service
    participant DB as PostgreSQL
    participant AUDIT as Audit Log

    E->>GW: POST /api/grades {etudiantId, matiereId, note, session}
    GW->>AUTH: Vérifier JWT + rôle "enseignant"
    AUTH-->>GW: ✅ Token valide, userId = X

    GW->>GS: saisirNote(data, enseignantId)
    GS->>DB: Vérifier affectation enseignant→matière→classe
    DB-->>GS: ✅ Affectation confirmée

    GS->>GS: Valider note (0 ≤ n ≤ 20)
    GS->>DB: INSERT note (statut = "provisoire")
    DB-->>GS: Note créée

    GS->>GS: Recalculer moyenne finale
    GS->>DB: UPDATE note.moyenne_finale
    DB-->>GS: ✅ Mis à jour

    GS->>AUDIT: LOG {action: "SAISIE_NOTE", userId, data, timestamp}
    GS-->>GW: { success: true, note: {...} }
    GW-->>E: 201 Created { note }
```

### Endpoints API principaux

```mermaid
graph LR
    subgraph AUTH_EP["🔐 Auth"]
        A1["POST /auth/login"]
        A2["POST /auth/refresh"]
        A3["POST /auth/logout"]
    end

    subgraph STUDENT_EP["🎓 Étudiants"]
        B1["GET /students?page&search&statut"]
        B2["POST /students"]
        B3["GET /students/:id"]
        B4["PUT /students/:id"]
        B5["PATCH /students/:id/statut"]
        B6["GET /students/:id/notes"]
        B7["GET /students/:id/documents"]
    end

    subgraph GRADE_EP["📊 Notes"]
        C1["GET /grades?classe&matiere&annee"]
        C2["POST /grades"]
        C3["PUT /grades/:id"]
        C4["POST /grades/validate"]
        C5["GET /grades/deliberation/:classeId"]
    end

    subgraph DOC_EP["📄 Documents"]
        D1["POST /documents/certificat"]
        D2["POST /documents/releve"]
        D3["GET /documents/verify/:hash"]
        D4["GET /documents/:id/download"]
    end

    subgraph SCHED_EP["📅 EDT"]
        E1["GET /schedule/classe/:id"]
        E2["GET /schedule/teacher/:id"]
        E3["POST /schedule/slot"]
        E4["GET /schedule/conflicts"]
    end
```

### Middleware RBAC — Contrôle d'accès

```mermaid
graph TD
    REQ["Requête entrante"] --> JWT["Vérifier JWT"]
    JWT -->|Invalide| ERR401["401 Unauthorized"]
    JWT -->|Valide| ROLE["Extraire rôle"]

    ROLE --> CHECK{Rôle autorisé\npour cette route?}
    CHECK -->|Non| ERR403["403 Forbidden"]
    CHECK -->|Oui| OWNER{Vérification\npropriété si nécessaire}

    OWNER -->|Enseignant saisit\nnote d'une autre classe| ERR403
    OWNER -->|Étudiant consulte\nses propres notes| NEXT["next() → Controller"]
    OWNER -->|Admin, scolarité\n→ accès total| NEXT
```

---

## 🗄️ 9. Schéma Base de Données PostgreSQL {#database}

### Schéma physique simplifié (tables MVP)

```mermaid
erDiagram
    users {
        uuid id PK
        varchar email UK
        text password_hash
        varchar role
        uuid profil_id
        varchar profil_type
        boolean actif
        timestamp created_at
    }

    annees_academiques {
        uuid id PK
        varchar code UK
        date date_debut
        date date_fin
        varchar statut
        boolean est_courante
    }

    filieres {
        uuid id PK
        varchar nom
        varchar code UK
        varchar niveau
        int duree_annees
    }

    classes {
        uuid id PK
        uuid filiere_id FK
        uuid annee_academique_id FK
        varchar nom
        int capacite_max
        int annee_niveau
    }

    etudiants {
        uuid id PK
        varchar numero_etudiant UK
        varchar nom
        varchar prenom
        date date_naissance
        varchar email UK
        varchar telephone
        varchar statut
        timestamp created_at
        timestamp updated_at
    }

    inscriptions {
        uuid id PK
        uuid etudiant_id FK
        uuid classe_id FK
        uuid annee_academique_id FK
        varchar statut
        date date_inscription
        int session_inscription
        text motif_rejet
        boolean est_transfert
        timestamp created_at
    }

    enseignants {
        uuid id PK
        varchar matricule UK
        varchar nom
        varchar prenom
        varchar email UK
        varchar type
        varchar specialite
        int quota_heures_max
        varchar statut
    }

    matieres {
        uuid id PK
        uuid filiere_id FK
        varchar nom
        varchar code UK
        float coefficient
        int volume_cm
        int volume_td
        int volume_tp
        int annee_niveau
        int semestre
    }

    notes {
        uuid id PK
        uuid etudiant_id FK
        uuid matiere_id FK
        uuid annee_academique_id FK
        uuid saisi_par FK
        float note_cc
        float note_exam
        float moyenne_finale
        int session
        varchar statut
        timestamp saisi_le
        timestamp validee_le
    }

    salles {
        uuid id PK
        varchar nom
        varchar batiment
        int capacite
        varchar type
        boolean disponible
    }

    creneaux_horaires {
        uuid id PK
        uuid salle_id FK
        uuid annee_academique_id FK
        date date
        time heure_debut
        time heure_fin
        varchar jour
        boolean est_recurrent
    }

    documents_administratifs {
        uuid id PK
        uuid etudiant_id FK
        uuid genere_par FK
        varchar type
        varchar numero_unique UK
        varchar hash_sha256
        varchar qr_code_url
        varchar fichier_url
        timestamp genere_le
        boolean archive
    }

    audit_logs {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar entite
        uuid entite_id
        jsonb avant
        jsonb apres
        varchar ip
        timestamp created_at
    }

    users ||--o{ audit_logs : "génère"
    etudiants ||--o{ inscriptions : "a"
    classes ||--o{ inscriptions : "accueille"
    annees_academiques ||--o{ classes : "contient"
    annees_academiques ||--o{ inscriptions : "regroupe"
    filieres ||--o{ classes : "inclut"
    filieres ||--o{ matieres : "définit"
    etudiants ||--o{ notes : "reçoit"
    matieres ||--o{ notes : "évaluée par"
    enseignants ||--o{ notes : "saisit"
    etudiants ||--o{ documents_administratifs : "obtient"
    salles ||--o{ creneaux_horaires : "utilisée"
```

### Index recommandés

```sql
-- Performance critique
CREATE INDEX idx_inscriptions_etudiant ON inscriptions(etudiant_id, annee_academique_id);
CREATE INDEX idx_notes_etudiant_annee ON notes(etudiant_id, annee_academique_id);
CREATE INDEX idx_notes_matiere ON notes(matiere_id, session);
CREATE INDEX idx_creneaux_salle_date ON creneaux_horaires(salle_id, date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_etudiants_numero ON etudiants(numero_etudiant);
CREATE INDEX idx_audit_entite ON audit_logs(entite, entite_id);

-- Recherche full-text sur étudiants
CREATE INDEX idx_etudiants_search ON etudiants USING GIN(
  to_tsvector('french', nom || ' ' || prenom)
);
```

---

## 🚀 10. Roadmap MVP 2 Semaines {#roadmap}

### Plan jour par jour

```mermaid
timeline
    title Sprint MVP UniPlatform
    section Semaine 1
        Jour 1 : Setup repo monorepo
                 : Prisma + DB schema
                 : CI/CD basique
        Jour 2 : Auth JWT complet
                 : Middleware RBAC
                 : Tests auth
        Jour 3 : API Étudiants CRUD
                 : API Filières + Classes
                 : Validations Zod
        Jour 4 : API Inscriptions
                 : Détection doublons
                 : Règles métier
        Jour 5 : React setup + Router
                 : Layout + Sidebar
                 : Page Login
        Jour 6 : Pages Étudiants
                 : Formulaires
                 : DataTable
        Jour 7 : Tests + Bugfixes
                 : Démo interne
    section Semaine 2
        Jour 8 : API Notes
                 : Calcul moyennes
                 : Validation pédagogique
        Jour 9 : API Emplois du temps
                 : Détection conflits
        Jour 10 : Générateur PDF
                  : Certificats
                  : QR Code
        Jour 11 : Interface Notes
                  : Interface EDT
        Jour 12 : Interface Documents
                  : Portail étudiant
        Jour 13 : Dashboard stats
                  : Intégration E2E
        Jour 14 : Tests finaux
                  : Déploiement MVP
                  : Documentation
```

### Périmètre MVP vs V2

```mermaid
graph LR
    subgraph MVP["✅ MVP — 2 semaines"]
        style MVP fill:#22c55e,color:#fff
        M1["Auth multi-rôles"]
        M2["CRUD Étudiants"]
        M3["Inscriptions"]
        M4["Saisie Notes"]
        M5["Emploi du temps simple"]
        M6["Certificats PDF + QR"]
        M7["Portail étudiant (lecture)"]
        M8["Dashboard basique"]
    end

    subgraph V2["🔵 V2 — Mois 2-3"]
        style V2 fill:#3b82f6,color:#fff
        V2a["Gestion Chambres"]
        V2b["Soutenances + Jury"]
        V2c["Notifications email/SMS"]
        V2d["Import Excel"]
        V2e["Statistiques avancées"]
        V2f["Workflow délibération"]
    end

    subgraph V3["🟣 V3 — Mois 4+"]
        style V3 fill:#8b5cf6,color:#fff
        V3a["Paiement en ligne"]
        V3b["Badge numérique"]
        V3c["Signature électronique"]
        V3d["LMS intégration"]
        V3e["API externe"]
        V3f["Mobile app native"]
    end

    MVP --> V2 --> V3
```

---

## 🛠️ 11. Stack Technologique {#stack}

### Stack complète

```mermaid
graph TB
    subgraph FRONT["Frontend"]
        style FRONT fill:#1e40af,color:#fff
        R["React 18 + TypeScript"]
        RR["React Router v6"]
        TW["Tailwind CSS"]
        ZU["Zustand (state)"]
        RQ["TanStack Query (data fetching)"]
        RHF["React Hook Form + Zod"]
        RC["Recharts (graphiques)"]
        FC["FullCalendar (EDT)"]
    end

    subgraph BACK["Backend"]
        style BACK fill:#15803d,color:#fff
        NE["Node.js + Express + TypeScript"]
        PR["Prisma ORM"]
        JW["JWT (jsonwebtoken)"]
        ZOD["Zod (validation)"]
        PUP["Puppeteer (PDF)"]
        QR["qrcode library"]
        BQ["Bull (job queue)"]
        ND["Nodemailer (emails)"]
    end

    subgraph DATA["Data & Infrastructure"]
        style DATA fill:#92400e,color:#fff
        PG["PostgreSQL 15"]
        RD["Redis 7"]
        MIN["MinIO (fichiers)"]
        DOC["Docker Compose"]
        NGX["Nginx (reverse proxy)"]
    end

    subgraph TOOLS["Outils Dev"]
        style TOOLS fill:#374151,color:#fff
        VT["Vitest (tests)"]
        CY["Cypress (E2E)"]
        ESL["ESLint + Prettier"]
        GH["GitHub Actions (CI)"]
    end

    FRONT -->|HTTPS REST API| BACK
    BACK --> PG
    BACK --> RD
    BACK --> MIN
    PG --> DOC
    RD --> DOC
    MIN --> DOC
```

### Justification des choix

| Choix | Alternative écartée | Raison |
|---|---|---|
| **Prisma** | Sequelize, Knex | Typage TypeScript natif, migrations sûres |
| **Zustand** | Redux | Moins de boilerplate pour MVP |
| **TanStack Query** | SWR, Axios seul | Cache, pagination, mutations intégrées |
| **Zod** | Joi, Yup | Shared entre front et back, TypeScript-first |
| **Puppeteer** | PDFKit, jsPDF | Rendu HTML → PDF fidèle au template |
| **Bull + Redis** | Agenda, node-cron | Queue fiable pour PDF/emails async |
| **PostgreSQL** | MongoDB | Données fortement relationnelles, ACID |
| **FullCalendar** | react-big-calendar | Plus complet pour emploi du temps complexe |

---

## 🔒 Considérations Sécurité

```mermaid
mindmap
  root((Sécurité))
    Authentification
      JWT access token 15min
      Refresh token 7j en HttpOnly cookie
      Rate limit login 5 essais/15min
      Détection connexion inhabituelle
    Autorisation
      RBAC granulaire par route
      Vérification propriété ressource
      Log toutes les actions sensibles
    Données
      Hachage mot de passe bcrypt cost=12
      Chiffrement données sensibles
      QR Code + SHA256 sur documents
      RGPD anonymisation après 10 ans
    Infrastructure
      HTTPS obligatoire
      Headers sécurité Helmet.js
      CORS strict
      SQL injection via Prisma ORM
      XSS via React auto-escape
```

---

## 📊 Récapitulatif

| Dimension | Décision |
|---|---|
| **Durée MVP** | 2 semaines (14 jours) |
| **Frontend** | React 18 + TypeScript + Tailwind |
| **Backend** | Node.js + Express + Prisma |
| **Base de données** | PostgreSQL + Redis |
| **Auth** | JWT + Refresh Token + RBAC |
| **PDF** | Puppeteer + QR Code + SHA256 |
| **Déploiement** | Docker Compose + Nginx |
| **Tests** | Vitest (unit) + Cypress (E2E) |
| **Modules MVP** | Auth, Étudiants, Inscriptions, Notes, EDT, Documents |
| **Zones d'ombre couvertes** | Doublons, statuts complexes, sessions multiples, traçabilité, RGPD |

> **💡 Conseil clé :** Priorisez la solidité du modèle de données dès le départ. Une mauvaise conception des entités `Note` (sans session, sans statut provisoire/validé) ou `Inscription` (sans historique de transfert) sera très coûteuse à corriger en V2.
