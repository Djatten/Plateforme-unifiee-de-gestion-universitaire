# 🎓 UniPlatform — Conception & Architecture du Projet

> **Plateforme unifiée de gestion universitaire**  
> *Académique · Administratif · Logistique*

---

## 🗺️ Vue d'ensemble

```mermaid
mindmap
  root((UniPlatform))
    Étudiants
      Dossier académique
      Inscriptions
      Notes & résultats
      Portail étudiant
    Enseignants
      Permanents & vacataires
      Charges horaires
      Emplois du temps
      Portail enseignant
    Administration
      Personnel d'appui
      Documents officiels
      Délibérations
    Ressources
      Salles de classe
      Chambres campus
      Calendriers
    Pilotage
      Tableau de bord
      Statistiques
      Audit log
```

---

## 🏗️ Architecture fonctionnelle

```mermaid
graph TB
    subgraph CORE["🔵 Cœur Métier"]
        E[Étudiants]
        EN[Enseignants]
        P[Personnel]
        CL[Classes & Filières]
        MA[Matières]
        SA[Salles]
        CH[Chambres]
        AA[Années Académiques]
    end

    subgraph TRANS["🟣 Modules Transversaux"]
        AUTH[Auth & Rôles]
        DOC[Moteur Documents]
        PLAN[Moteur Planning]
        NOTIF[Moteur Notifications]
    end

    subgraph PORTALS["🟢 Portails"]
        PA[Portail Admin]
        PE[Portail Étudiant]
        PEN[Portail Enseignant]
    end

    subgraph ANALYTICS["🟠 Pilotage"]
        DASH[Tableau de Bord]
        STATS[Statistiques]
        AUDIT[Audit Log]
    end

    CORE --> TRANS
    TRANS --> PORTALS
    TRANS --> ANALYTICS
```

---

## 🛠️ Stack Technologique

```mermaid
graph LR
    subgraph FRONTEND["Frontend"]
        NX[Next.js 14 App Router]
        TW[TailwindCSS]
        SH[shadcn/ui]
        ZU[Zustand]
        RQ[React Query]
    end

    subgraph BACKEND["Backend"]
        FA[FastAPI Python]
        PG[PostgreSQL]
        RD[Redis Cache]
        CE[Celery Workers]
    end

    subgraph INFRA["Infrastructure"]
        DK[Docker / Compose]
        NG[Nginx]
        S3[S3 Storage]
        MN[Minio]
    end

    subgraph AUTH["Auth"]
        JW[JWT / OAuth2]
        RB[RBAC]
    end

    FRONTEND -->|REST / WebSocket| BACKEND
    BACKEND --> INFRA
    BACKEND --> AUTH
```

### Tableau récapitulatif

| Couche | Technologie | Rôle |
|---|---|---|
| **Frontend** | Next.js 14 + TypeScript | Interface utilisateur, SSR/SSG |
| **UI/UX** | TailwindCSS + shadcn/ui | Design system cohérent |
| **État client** | Zustand + React Query | State management + cache |
| **API** | FastAPI (Python) | REST API performante, auto-docs |
| **ORM** | SQLAlchemy + Alembic | Modèles DB + migrations |
| **Base de données** | PostgreSQL 16 | Données relationnelles |
| **Cache** | Redis | Sessions, cache API, queues |
| **Workers** | Celery + Redis | Tâches async (PDF, emails...) |
| **Documents** | WeasyPrint / Jinja2 | Génération PDF |
| **Stockage** | Minio (compatible S3) | Fichiers, documents générés |
| **Auth** | JWT + OAuth2 + RBAC | Auth sécurisée multi-rôles |
| **Infra** | Docker + Nginx | Déploiement containerisé |

---

## 👥 Rôles & Permissions

```mermaid
graph TD
    ADMIN[👑 Super Admin]
    SCOL[🏛️ Scolarité]
    ENS[👨‍🏫 Enseignant]
    ETU[🎓 Étudiant]
    PERS[🧑‍💼 Personnel Appui]

    ADMIN -->|Accès total| ALL[Tous les modules]
    SCOL -->|Accès| INS[Inscriptions]
    SCOL -->|Accès| NOTE[Notes]
    SCOL -->|Accès| DOC[Documents]
    SCOL -->|Accès| ETU_MGT[Gestion Étudiants]
    ENS -->|Accès| SAISIE[Saisie Notes]
    ENS -->|Accès| EDT[Emploi du temps]
    ENS -->|Accès| SOUT[Soutenances]
    ETU -->|Lecture| ESPACE[Espace Personnel]
    PERS -->|Accès| SERV[Gestion Service]
```

---

## 🚀 Planification Agile — Sprints

### 🔴 Sprint 1 — Fondations (Semaine 1-2) `MVP Core`

```mermaid
kanban
  column[Todo]
    task[Init projet Next.js + FastAPI]
    task[Modèle de données PostgreSQL]
    task[Auth JWT + RBAC]
    task[CI/CD Docker Compose]
  column[In Progress]
    task[Design system TailwindCSS]
  column[Done]
    task[Cahier des charges]
```

**Livrables Sprint 1 :**
- Architecture DB définie (schéma Postgres)
- Auth + gestion des rôles fonctionnelle
- Environnement de développement prêt

---

### 🟡 Sprint 2 — Gestion des entités (Semaine 3-4) `MVP Core`

**User Stories :**

| ID | En tant que | Je veux | Priorité |
|---|---|---|---|
| US-01 | Admin | Créer/modifier un dossier étudiant | 🔴 High |
| US-02 | Admin | Gérer les enseignants permanents et vacataires | 🔴 High |
| US-03 | Admin | Créer filières, niveaux, classes | 🔴 High |
| US-04 | Admin | Rattacher étudiants à une classe | 🔴 High |
| US-05 | Admin | Consulter la liste des étudiants par classe | 🟡 Med |

---

### 🟡 Sprint 3 — Inscriptions & Notes (Semaine 5-6) `MVP Core`

**User Stories :**

| ID | En tant que | Je veux | Priorité |
|---|---|---|---|
| US-06 | Scolarité | Ouvrir une campagne d'inscription | 🔴 High |
| US-07 | Étudiant | Faire une préinscription en ligne | 🔴 High |
| US-08 | Scolarité | Valider / rejeter une inscription | 🔴 High |
| US-09 | Enseignant | Saisir les notes de ma matière | 🔴 High |
| US-10 | Système | Calculer les moyennes automatiquement | 🔴 High |
| US-11 | Scolarité | Générer les relevés de notes | 🟡 Med |

---

### 🟢 Sprint 4 — Emplois du temps & Salles (Semaine 7-8)

**User Stories :**

| ID | En tant que | Je veux | Priorité |
|---|---|---|---|
| US-12 | Admin | Gérer l'inventaire des salles | 🔴 High |
| US-13 | Admin | Créer l'emploi du temps d'une classe | 🔴 High |
| US-14 | Système | Détecter les conflits de planning | 🔴 High |
| US-15 | Étudiant | Consulter mon emploi du temps | 🟡 Med |
| US-16 | Enseignant | Consulter mon planning | 🟡 Med |

---

### 🔵 Sprint 5 — Documents & Portails (Semaine 9-10)

**User Stories :**

| ID | En tant que | Je veux | Priorité |
|---|---|---|---|
| US-17 | Scolarité | Générer automatiquement un certificat de scolarité | 🔴 High |
| US-18 | Étudiant | Télécharger mes documents depuis mon espace | 🔴 High |
| US-19 | Étudiant | Faire une demande de document en ligne | 🟡 Med |
| US-20 | Admin | Personnaliser les modèles de documents | 🟡 Med |

---

### 🟣 Sprint 6 — Soutenances & Campus (Semaine 11-12)

**User Stories :**

| ID | En tant que | Je veux | Priorité |
|---|---|---|---|
| US-21 | Admin | Planifier les soutenances | 🟡 Med |
| US-22 | Admin | Affecter jury, salles et rapporteurs | 🟡 Med |
| US-23 | Système | Générer le PV de soutenance | 🟡 Med |
| US-24 | Admin | Gérer les chambres du campus | 🟢 Low |
| US-25 | Admin | Affecter un étudiant à une chambre | 🟢 Low |

---

### ⚫ Sprint 7 — Dashboard & Finalisation (Semaine 13-14)

**User Stories :**

| ID | En tant que | Je veux | Priorité |
|---|---|---|---|
| US-26 | Direction | Voir les effectifs par filière | 🟡 Med |
| US-27 | Direction | Voir les taux de réussite | 🟡 Med |
| US-28 | Admin | Accéder au journal des actions (audit) | 🟡 Med |
| US-29 | Admin | Archiver une année académique | 🟢 Low |

---

## 📐 Schéma de la Base de Données (simplifié)

```mermaid
erDiagram
    AnneeAcademique {
        int id PK
        string libelle
        date debut
        date fin
        bool active
    }

    Filiere {
        int id PK
        string code
        string nom
        string niveau
    }

    Classe {
        int id PK
        string nom
        int filiere_id FK
        int annee_id FK
        int capacite
    }

    Etudiant {
        int id PK
        string matricule
        string nom
        string prenom
        string email
        date date_naissance
    }

    Inscription {
        int id PK
        int etudiant_id FK
        int classe_id FK
        string statut
        date date_inscription
    }

    Enseignant {
        int id PK
        string matricule
        string nom
        string prenom
        string type
        string email
    }

    Matiere {
        int id PK
        string code
        string nom
        int coefficient
        int volume_horaire
        int filiere_id FK
    }

    Note {
        int id PK
        int etudiant_id FK
        int matiere_id FK
        int annee_id FK
        float note_cc
        float note_exam
        float moyenne
    }

    Salle {
        int id PK
        string nom
        int capacite
        string type
    }

    Soutenance {
        int id PK
        int etudiant_id FK
        date date_soutenance
        int salle_id FK
        float note
    }

    Chambre {
        int id PK
        string numero
        int capacite
        string statut
    }

    AnneeAcademique ||--o{ Classe : contient
    Filiere ||--o{ Classe : inclut
    Filiere ||--o{ Matiere : definit
    Classe ||--o{ Inscription : regroupe
    Etudiant ||--o{ Inscription : fait
    Etudiant ||--o{ Note : obtient
    Etudiant ||--o{ Soutenance : passe
    Matiere ||--o{ Note : evalue
    Salle ||--o{ Soutenance : accueille
```

---

## 🔄 Flux principal — Cycle de vie étudiant

```mermaid
sequenceDiagram
    participant ETU as 🎓 Étudiant
    participant SCO as 🏛️ Scolarité
    participant SYS as ⚙️ Système
    participant ENS as 👨‍🏫 Enseignant

    ETU->>SYS: Préinscription en ligne
    SYS->>SCO: Notification nouvelle demande
    SCO->>SYS: Validation inscription
    SYS->>ETU: Email confirmation + accès portail

    loop Semestre
        ENS->>SYS: Saisie des notes
        SYS->>SYS: Calcul automatique moyennes
    end

    SCO->>SYS: Lancement délibérations
    SYS->>SYS: Calcul résultats finaux
    SYS->>ETU: Notification résultats disponibles
    ETU->>SYS: Demande relevé de notes
    SYS->>ETU: Génération PDF automatique
```

---

## 📦 Structure des modules API

```mermaid
graph TB
    API[FastAPI — /api/v1]

    API --> AUTH_R[/auth — login, refresh, logout]
    API --> ETU_R[/students — CRUD étudiants]
    API --> ENS_R[/teachers — CRUD enseignants]
    API --> INS_R[/enrollments — inscriptions]
    API --> NOTE_R[/grades — notes & résultats]
    API --> EDT_R[/schedules — emplois du temps]
    API --> SALLE_R[/rooms — salles]
    API --> DOC_R[/documents — génération docs]
    API --> SOUT_R[/defenses — soutenances]
    API --> DASH_R[/dashboard — stats & KPIs]
    API --> ADMIN_R[/admin — config & paramètres]
```

---

## 🗓️ Roadmap globale

```mermaid
gantt
    title Roadmap UniPlatform
    dateFormat  YYYY-MM-DD
    section MVP Core
    Sprint 1 - Fondations         :s1, 2025-01-01, 14d
    Sprint 2 - Entités            :s2, after s1, 14d
    Sprint 3 - Inscriptions/Notes :s3, after s2, 14d

    section Fonctionnel
    Sprint 4 - Emplois du temps   :s4, after s3, 14d
    Sprint 5 - Documents/Portails :s5, after s4, 14d
    Sprint 6 - Soutenances/Campus :s6, after s5, 14d

    section Finalisation
    Sprint 7 - Dashboard & QA     :s7, after s6, 14d
    Tests & déploiement           :s8, after s7, 7d
```

---

## 📊 Critères de succès du MVP

| Indicateur | Cible |
|---|---|
| Temps de génération d'un document | < 2 secondes |
| Disponibilité de la plateforme | 99.5% |
| Couverture de tests API | ≥ 80% |
| Temps de réponse API (p95) | < 500ms |
| Support utilisateurs simultanés | 500+ |

---

## 🔮 Évolutions futures (Post-MVP)

```mermaid
graph LR
    MVP[MVP v1.0]

    MVP --> PAY[💳 Paiement en ligne des frais]
    MVP --> LMS[📚 Intégration LMS - Moodle]
    MVP --> SIG[✍️ Signature électronique]
    MVP --> BADGE[🎫 Badge numérique étudiant]
    MVP --> API_EXT[🔌 API publique inter-systèmes]
    MVP --> MOBILE[📱 Application mobile]
    MVP --> BI[📈 Business Intelligence avancé]
```

---

*Document généré pour le projet UniPlatform — Version 1.0*  
*Architecture : Monolithique modulaire → Microservices (v2)*
