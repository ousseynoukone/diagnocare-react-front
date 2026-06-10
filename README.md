# Diagnocare – Interface Web React

Interface web réactive et performante du projet Diagnocare, une plateforme de santé intelligente permettant aux patients de soumettre leurs symptômes, de consulter des prédictions de maladies, de prendre des rendez-vous et de gérer leur profil médical.

---

## Stack Technique

| Catégorie | Technologie |
| :--- | :--- |
| Framework principal | React 19 (Composants fonctionnels, Hooks) |
| Système de build | Vite 8 (HMR / Fast Refresh) |
| Langage | TypeScript 6 |
| Style | Tailwind CSS v4 + CSS personnalisé |
| Icônes | Lucide React |
| Gestion d'état | Zustand 5 (stores persistés) |
| Requêtes API | TanStack React Query 5 (cache, mutations) |
| Formulaires | React Hook Form 7 |
| Client HTTP | Axios (intercepteurs, credentials) |
| Routage | React Router DOM v7 |
| Internationalisation | i18next + react-i18next (FR / EN) |
| Cartographie | Leaflet + React Leaflet |
| Notifications | Sonner |

---

## Authentification par Cookies HttpOnly

Pour protéger contre les attaques XSS, **les tokens JWT ne sont jamais stockés dans le localStorage ni accessibles par JavaScript**. L'application s'appuie intégralement sur les **cookies HttpOnly** émis par la passerelle backend.

### Détails d'implémentation

1. **Client Axios (`AxiosApiClient.ts`)**
   - L'instance globale `apiClient` est configurée avec `withCredentials: true`.
   - Cela force le navigateur à joindre automatiquement les cookies (`token`, `refreshToken`) à chaque requête sortante, et à sauvegarder les cookies reçus via `Set-Cookie`.

2. **Store utilisateur (`UserStore.ts`)**
   - Le localStorage ne stocke que les métadonnées du profil (nom, e-mail, rôles) dans le store `diagnocare-user`, utilisées uniquement pour l'affichage.
   - Les secrets d'authentification restent cachés au JavaScript.
   - L'appel à `logout()` déclenche une requête vers `/auth/logout` (qui invalide les cookies côté serveur), puis réinitialise l'état local de l'interface.

3. **Mécanisme de rafraîchissement automatique**
   - Si une requête API échoue avec un statut `401 Unauthorized` (token expiré), l'intercepteur Axios le détecte.
   - Il tente automatiquement un appel vers `/auth/refresh-token` (qui réussit si le cookie `refreshToken` est encore valide).
   - Une fois le token rafraîchi, la requête initiale est automatiquement rejouée sans interruption pour l'utilisateur.

---

## Lancement en local

### Prérequis

- Node.js v18 ou supérieur
- npm ou bun

### Démarrage rapide

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Créer un fichier `.env` à la racine du projet :
   ```env
   VITE_API_BASE_URL=http://localhost:8765/api/v1
   ```

3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

4. Construire pour la production :
   ```bash
   npm run build
   ```

5. Prévisualiser le build de production :
   ```bash
   npm run preview
   ```

---

## Structure du projet

```
diagnocare-react-front/
├── src/
│   ├── api-s/              # Client Axios, services et requêtes API
│   ├── assets/             # Images et logos
│   ├── components/         # Composants réutilisables (admin, dashboard, partagés…)
│   ├── hooks/              # Hooks personnalisés (auth, profil, symptômes, rapports…)
│   ├── layouts/            # Layouts de page (public, auth, dashboard, admin)
│   ├── locales/            # Fichiers de traduction (fr.json, en.json)
│   ├── pages/              # Pages de l'application (auth, dashboard, admin, légal…)
│   ├── store/              # Stores Zustand (UserStore, EvaluationStore)
│   ├── types/              # Types TypeScript et modèles de données
│   └── utils/              # Fonctions utilitaires
├── public/                 # Fichiers statiques publics
├── index.html              # Point d'entrée HTML
├── vite.config.ts          # Configuration Vite
├── Dockerfile              # Image Docker de production (Nginx)
└── nginx.conf              # Configuration du serveur Nginx
```

---

## Déploiement avec Docker

L'application est packagée en une image Docker multi-étapes : Vite génère un build statique optimisé, puis Nginx le sert.

```bash
docker build -t diagnocare-front .
docker run -p 80:80 diagnocare-front
```
