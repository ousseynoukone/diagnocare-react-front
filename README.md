# Diagnocare – Interface Web React

Interface web de la plateforme de santé Diagnocare. Elle permet aux patients de décrire leurs symptômes en langage naturel, de consulter des prédictions de maladies générées par IA, de suivre leur état de santé dans le temps, de gérer leur profil médical et de télécharger leurs résumés de consultation. Une interface d'administration est intégrée pour la gestion des utilisateurs, des prédictions et des paramètres applicatifs.

---

## Table des matières

1. [Stack technique](#stack-technique)
2. [Authentification](#authentification)
3. [Pages et navigation](#pages-et-navigation)
4. [Structure du projet](#structure-du-projet)
5. [Lancement en local](#lancement-en-local)
6. [Déploiement Docker](#déploiement-docker)
7. [Variables d'environnement](#variables-denvironnement)

---

## Stack technique

| Catégorie | Technologie | Version |
| :--- | :--- | :--- |
| Framework principal | React | 19 |
| Système de build | Vite | 8 |
| Langage | TypeScript | 6 |
| Style | Tailwind CSS + CSS personnalisé | v4 |
| Icônes | Lucide React | 1.x |
| Gestion d'état global | Zustand (stores persistés) | 5 |
| Requêtes & cache API | TanStack React Query | 5 |
| Formulaires | React Hook Form | 7 |
| Client HTTP | Axios (intercepteurs, credentials) | 1.x |
| Routage | React Router DOM | 7 |
| Internationalisation | i18next + react-i18next + détection navigateur | 26.x |
| Cartographie | Leaflet + React Leaflet | 1.9 / 5.x |
| Notifications toast | Sonner | 2.x |

---

## Authentification

L'application ne stocke **jamais** les tokens JWT dans le localStorage ni dans sessionStorage. Elle délègue entièrement la gestion des sessions aux **cookies HttpOnly** émis par la Gateway backend, rendant les tokens inaccessibles au JavaScript et protégeant contre les attaques XSS.

### Client Axios (`src/api-s/AxiosApiClient.ts`)

```ts
// withCredentials: true force le navigateur à :
// 1. Joindre automatiquement les cookies à chaque requête sortante
// 2. Sauvegarder les cookies reçus via Set-Cookie
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})
```

### Intercepteur de rafraîchissement automatique

Si une requête API retourne un `401 Unauthorized` (token d'accès expiré), l'intercepteur Axios :
1. Appelle silencieusement `POST /auth/refresh-token` en arrière-plan
2. Le backend remet à jour le cookie `token` si le `refreshToken` est encore valide
3. Rejoue automatiquement la requête échouée — l'utilisateur ne voit aucune interruption

### Store utilisateur (`src/store/UserStore.ts`)

- Stocke uniquement les métadonnées du profil (nom, e-mail, rôles) dans Zustand pour l'affichage de l'interface
- La fonction `logout()` envoie une requête au backend pour expirer les cookies, puis réinitialise l'état local
- Aucun secret cryptographique ne transite par le store

---

## Pages et navigation

L'application est structurée en quatre layouts indépendants, chacun avec ses propres garde-fous d'accès.

### Layout public (`/`)

Pages accessibles sans connexion.

| Route | Composant | Description |
| :--- | :--- | :--- |
| `/` ou `/home` | `HomePage` | Page d'accueil de la plateforme |
| `/terms` | `TermsOfServicePage` | Conditions générales d'utilisation |
| `/privacy` | `PrivacyPolicyPage` | Politique de confidentialité |

### Layout authentification (`/login`, `/signup`…)

Pages d'authentification avec design centré.

| Route | Composant | Description |
| :--- | :--- | :--- |
| `/login` | `LoginPage` | Formulaire de connexion |
| `/signup` | `RegisterPage` | Formulaire d'inscription |
| `/reset-password` | `ResetPasswordPage` | Réinitialisation de mot de passe via OTP |
| `/verify-email` | `VerifyEmailPage` | Vérification d'e-mail par code OTP |

### Layout dashboard (patient connecté)

Pages du tableau de bord patient, accessibles après connexion.

| Route | Composant | Description |
| :--- | :--- | :--- |
| `/dashboard` | `DashboardPage` | Vue principale – accès rapide aux fonctionnalités |
| `/dashboard/evaluation` | `EvaluationPage` | Soumettre des symptômes et consulter les prédictions IA |
| `/dashboard/suivis` | `SuivisPage` | Suivis de santé (check-ins J+1 et J+2) |
| `/dashboard/historique` | `HistoriquePage` | Historique des prédictions et résumés de consultation |
| `/dashboard/profil` | `ProfilMedicalPage` | Profil médical patient (données biométriques et antécédents) |
| `/dashboard/parametres` | `ParametresPage` | Paramètres du compte (mot de passe, e-mail, RGPD) |

### Layout administration

Pages réservées aux administrateurs.

| Route | Composant | Description |
| :--- | :--- | :--- |
| `/admin` | `AdminDashboardPage` | Tableau de bord administrateur |
| `/admin/users` | `AdminUsersPage` | Gestion des utilisateurs |
| `/admin/predictions` | `AdminPredictionsPage` | Vue globale des prédictions et alertes rouges |
| `/admin/reports` | `AdminReportsPage` | Gestion des rapports et signalements |
| `/admin/urgent-diseases` | `AdminUrgentDiseasesPage` | Gestion des maladies urgentes |
| `/admin/settings` | `AdminSettingsPage` | Paramètres applicatifs (délais check-in, URL de base…) |

---

## Structure du projet

```
diagnocare-react-front/
│
├── src/
│   ├── api-s/                      # Couche API
│   │   ├── AxiosApiClient.ts       # Instance Axios globale (withCredentials, intercepteurs)
│   │   ├── requests/               # Fonctions de requêtes par domaine
│   │   └── services/               # Services de haut niveau
│   │
│   ├── assets/                     # Images, logos SVG
│   │
│   ├── components/                 # Composants réutilisables
│   │   ├── admin/                  # Composants spécifiques à l'admin
│   │   ├── basics/                 # Éléments de base (boutons, inputs…)
│   │   ├── dashboard/              # Composants du tableau de bord patient
│   │   ├── footer/                 # Pied de page
│   │   ├── head/                   # En-tête / navigation
│   │   ├── help/                   # FAQ et aide
│   │   └── shared/                 # Composants partagés entre layouts
│   │
│   ├── hooks/                      # Hooks React Query personnalisés
│   │   ├── useAuth.tsx             # Connexion, déconnexion, inscription
│   │   ├── useCheckIns.tsx         # Gestion des check-ins de suivi
│   │   ├── useDownloadPDF.ts       # Téléchargement du résumé PDF
│   │   ├── usePredictions.tsx      # Création et lecture des prédictions
│   │   ├── useProfile.tsx          # Profil médical patient
│   │   ├── useReports.tsx          # Rapports utilisateurs
│   │   └── useSymptoms.tsx         # Catalogue de symptômes
│   │
│   ├── layouts/                    # Layouts de page
│   │   ├── PublicLayout.tsx        # Navigation publique + footer
│   │   ├── AuthLayout.tsx          # Conteneur centré pour les pages auth
│   │   ├── MainLayout.tsx          # Dashboard patient avec sidebar
│   │   └── AdminLayout.tsx         # Interface d'administration
│   │
│   ├── locales/                    # Traductions i18next
│   │   ├── fr.json                 # Traductions françaises
│   │   └── en.json                 # Traductions anglaises
│   │
│   ├── pages/                      # Pages de l'application
│   │   ├── auth/                   # Login, Register, Reset, Verify
│   │   ├── dashboard/              # Dashboard, Evaluation, Suivis, Historique, Profil, Paramètres
│   │   ├── admin/                  # Dashboard admin, Users, Predictions, Reports…
│   │   ├── home/                   # Page d'accueil publique
│   │   └── legal/                  # CGU, Politique de confidentialité
│   │
│   ├── store/                      # Stores Zustand
│   │   ├── UserStore.ts            # Profil utilisateur, état d'authentification
│   │   └── EvaluationStore.ts      # État de la session d'évaluation des symptômes
│   │
│   ├── types/                      # Types TypeScript
│   │   ├── models/                 # Modèles de données (User, Prediction, CheckIn…)
│   │   └── storage-keys.ts         # Clés de localStorage
│   │
│   ├── utils/                      # Utilitaires
│   │   ├── browserSettings.ts      # Paramètres navigateur
│   │   ├── confidenceStyles.ts     # Styles selon le niveau de confiance ML
│   │   ├── errorHelper.ts          # Formatage des erreurs API
│   │   ├── FaqItems.ts             # Contenu de la FAQ
│   │   ├── storageHelper.ts        # Helpers localStorage
│   │   └── translationHelper.ts    # Helpers i18next
│   │
│   ├── App.tsx                     # Arbre de routes React Router
│   ├── i18n.ts                     # Configuration i18next
│   └── main.tsx                    # Point d'entrée React
│
├── public/                         # Fichiers statiques servis tels quels
├── index.html                      # Template HTML principal
├── vite.config.ts                  # Configuration Vite
├── tsconfig.app.json               # Configuration TypeScript
├── eslint.config.js                # Configuration ESLint
├── Dockerfile                      # Build multi-étapes Vite + Nginx
└── nginx.conf                      # Routing SPA pour Nginx
```

---

## Lancement en local

### Prérequis

- Node.js 18 ou supérieur
- npm (ou bun)
- Backend Diagnocare démarré (voir le README du dossier `diagnocare-microservies-v2`)

### Installation et démarrage

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Créer le fichier de configuration :**
   ```bash
   # Créer le fichier .env à la racine du projet
   VITE_API_BASE_URL=http://localhost:8765/api/v1
   ```

3. **Démarrer le serveur de développement (HMR activé) :**
   ```bash
   npm run dev
   # L'application est disponible sur http://localhost:5173
   ```

4. **Vérifier les types TypeScript :**
   ```bash
   npm run build   # tsc -b && vite build
   ```

5. **Lancer le linter :**
   ```bash
   npm run lint
   ```

6. **Prévisualiser le build de production :**
   ```bash
   npm run preview
   ```

---

## Déploiement Docker

L'image Docker utilise un **build multi-étapes** :
1. **Étape build** : Vite compile les sources TypeScript/React en fichiers statiques optimisés
2. **Étape runtime** : Nginx sert les fichiers statiques et gère le routing SPA (`try_files $uri /index.html`)

```bash
# Construction de l'image
docker build -t diagnocare-front .

# Démarrage du conteneur
docker run -p 80:80 diagnocare-front
```

En production, le frontend est inclus dans le `docker-compose.yml` à la racine du projet avec les variables d'environnement injectées au moment du build.

---

## Variables d'environnement

| Variable | Description | Valeur par défaut (dev) |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | URL de base de la Gateway API | `http://localhost:8765/api/v1` |

> Les variables préfixées par `VITE_` sont injectées au moment du build par Vite et intégrées dans le bundle JavaScript. Ne jamais y stocker de secrets.
