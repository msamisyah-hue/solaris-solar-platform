# ALROMAR ENERGIES
## Plateforme de supervision et de suivi des installations photovoltaïques

<p align="center">
  <strong>Prototype de démonstration — Données simulées localement</strong><br>
  Projet de stage d'ingénierie · Interface web de supervision solaire
</p>

---

## Présentation

ALROMAR ENERGIES est une plateforme web de supervision et de suivi des installations photovoltaïques. Elle permet de visualiser en temps réel et historiquement les données de télémétrie d'un parc solaire simulé :

- **Tension et courant des panneaux solaires**
- **Tension et état de la batterie**
- **Température de surface des modules**
- **Rendement et production d'énergie**
- **Alertes et maintenance**
- **Rapports de portefeuille**

> **Note importante :** Les données affichées sont des données de simulation générées localement. Aucun capteur physique réel n'est connecté dans cette version prototype.

---

## Fonctionnalités principales

| Module | Description |
|--------|-------------|
| **Tableau de bord** | Vue d'ensemble du portefeuille : KPIs, graphiques temps réel, alertes actives |
| **Surveillance Énergie** | Métriques en direct : tension, courant, puissance, température, état batterie |
| **Analytiques** | Graphiques historiques avec filtres (1H, 3H, 6H, 12H, 24H, 7J, 30J) |
| **Installations** | Gestion du parc solaire : tableau + fiches par site |
| **Panneaux Solaires** | Registre des actifs : rendement, état, température par panneau |
| **Alertes** | Flux d'alertes par sévérité (critique, avertissement, info) avec accusé réception |
| **Maintenance** | Planification et suivi des interventions techniques |
| **Rapports** | Rapport de portefeuille imprimable / exportable PDF |
| **Paramètres** | Préférences de surveillance, notifications, profil utilisateur |

---

## Architecture

```
Organizing-the-solar-panel-efficiency-monitoring-system/
├── monitoring-web/                  # Frontend React
│   ├── src/
│   │   ├── views/                   # Pages de l'application
│   │   ├── components/              # Composants réutilisables
│   │   ├── assets/css/solaris.css   # Système de design ALROMAR ENERGIES
│   │   └── routes.js                # Configuration des routes
│   └── public/
├── node_local_test_api_server/      # Backend Express.js
│   ├── app.js                       # API REST + simulation données
│   └── .env                         # Configuration base de données
├── database/
│   └── solar_monitoring.sql         # Schéma MySQL + données de démonstration
└── LOCAL_SETUP.md                   # Guide d'installation locale
```

---

## Stack technologique

| Couche | Technologie |
|--------|------------|
| **Frontend** | React 16, react-router-dom v5, Bootstrap 3, Chart.js v2 |
| **Backend** | Node.js, Express 4 |
| **Base de données** | MySQL 5.7+ |
| **Graphiques** | react-chartjs-2, react-gauge-chart |
| **HTTP Client** | Axios |
| **Styles** | CSS custom properties, Inter (Google Fonts) |

---

## Installation locale

### Prérequis

- Node.js v14+
- MySQL 5.7+ ou MariaDB 10+
- npm

### 1. Base de données

```sql
-- Dans MySQL :
source database/solar_monitoring.sql
```

Crée la base `solar_power_test` avec toutes les tables et données de démonstration.

### 2. Backend

```bash
cd node_local_test_api_server
npm install
npm start
```

Le serveur démarre sur **http://localhost:3001**

Vérification :
```
GET http://localhost:3001/api/health
```

### 3. Frontend

```bash
cd monitoring-web
npm install
npm start
```

L'application s'ouvre sur **http://localhost:3000**

---

## Données de démonstration

Le portefeuille de démonstration inclut **6 installations solaires marocaines fictives** :

| Code | Site | Région | Capacité |
|------|------|--------|----------|
| CAS-GTP-01 | Casablanca Green Tech Park | Casablanca-Settat | 450 kWp |
| RAK-OAS-02 | Marrakech Solar Oasis | Marrakech-Safi | 620 kWp |
| AGA-AGR-03 | Agadir Agri-PV | Souss-Massa | 320 kWp |
| RAB-UNI-04 | Rabat University Campus | Rabat-Salé-Kénitra | 280 kWp |
| OUJ-DES-05 | Oujda Desert PV Pilot | Oriental | 850 kWp |
| TNG-CST-06 | Tanger Coastal Hybrid | Tanger-Tétouan | 390 kWp |

> Ces données sont **fictives** et servent uniquement à la démonstration du prototype.

La simulation génère automatiquement de nouvelles données de télémétrie toutes les **10 secondes**.

---

## API Backend

### Endpoints originaux (télémétrie temps réel)

```
GET /controller_info_last           # Dernière lecture contrôleur
GET /controller_info_last_L1H       # Dernière heure
GET /controller_info_last_L3H       # 3 dernières heures
GET /controller_info_last_L6H       # 6 dernières heures
GET /controller_info_last_L12H      # 12 dernières heures
GET /controller_info_last_LD        # 24 dernières heures
GET /controller_info_last_LW        # 7 derniers jours
GET /controller_info_last_LM        # 30 derniers jours
GET /solar_info_last                # Dernière température surface
```

### Endpoints ALROMAR ENERGIES

```
GET  /api/health                       # Vérification santé
GET  /api/system_stats                 # KPIs globaux du portefeuille
GET  /api/installations                # Liste des installations
GET  /api/installations/:id            # Détail installation (panneaux, alertes, maintenance)
GET  /api/panels                       # Liste des panneaux solaires
GET  /api/alerts                       # Liste des alertes
POST /api/alerts/:id/acknowledge       # Accuser réception d'une alerte
GET  /api/maintenance                  # Liste des tâches de maintenance
POST /api/maintenance                  # Créer une tâche de maintenance
```

---

## Configuration

Le fichier `node_local_test_api_server/.env` contient la configuration de connexion à la base de données :

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=solar_power_test
```

---

## Palette de couleurs

| Rôle | Couleur | Code |
|------|---------|------|
| Vert foncé (principal) | ![#176B5B](https://placehold.co/15x15/176B5B/176B5B.png) | `#176B5B` |
| Vert secondaire | ![#38A169](https://placehold.co/15x15/38A169/38A169.png) | `#38A169` |
| Jaune solaire | ![#F4B942](https://placehold.co/15x15/F4B942/F4B942.png) | `#F4B942` |
| Fond clair | ![#F7FAF9](https://placehold.co/15x15/F7FAF9/F7FAF9.png) | `#F7FAF9` |

---

## Attribution

Ce projet est construit sur la base du template open-source
[Light Bootstrap Dashboard React v1.3.0](https://github.com/creativetimofficial/light-bootstrap-dashboard-react)
par Creative Tim, distribué sous licence MIT.

La licence originale est conservée dans `monitoring-web/LICENSE.md`.

L'interface ALROMAR ENERGIES, les fonctionnalités de gestion d'actifs, les API REST étendues
et l'adaptation visuelle constituent le travail original de ce projet de stage.

---

*ALROMAR ENERGIES — Plateforme de supervision photovoltaïque — Prototype de démonstration*
