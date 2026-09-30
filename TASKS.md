# Base de données & authentification — état des lieux & tâches

## État des lieux — base de données

L'app ("Suivi Séances") est branchée sur Postgres via Prisma 7 + TanStack
Query.

- [prisma/schema.prisma](prisma/schema.prisma) — `User`, `Exercise`,
  `Template` → `TemplateItem`, `WorkoutSession` → `SessionItem`. Les items
  dupliquent `name`/`category` au lieu de faire une vraie FK vers `Exercise` :
  supprimer un exercice ne doit jamais casser un template ou une séance
  existante.
- [src/db.ts](src/db.ts) — client Prisma singleton (adapter `pg`, généré par
  `prisma init`, réutilisé entre les rechargements HMR en dev).
- [src/lib/workout/server/](src/lib/workout/server/) — les `createServerFn`
  (`exercises.ts`, `templates.ts`, `sessions.ts`, `profile.ts`) : tout le
  CRUD, avec des mappers vers le modèle applicatif dans `mappers.ts`.
- [src/lib/workout/workout-context.tsx](src/lib/workout/workout-context.tsx) —
  `WorkoutProvider`/`useWorkout()` avec `useQuery`/`useMutation`. Interface
  publique inchangée depuis la version localStorage d'origine.
- [src/router.tsx](src/router.tsx) / [src/routes/__root.tsx](src/routes/__root.tsx) —
  `QueryClient` créé dans le router, `setupRouterSsrQueryIntegration` pour
  l'hydratation SSR, `QueryClientProvider` posé dans `RootDocument`.
- [src/lib/workout/types.ts](src/lib/workout/types.ts) reste la source de
  vérité du modèle de domaine ; le schéma Prisma est son miroir.

`activeSession` (la séance en cours de saisie) reste volontairement en
`useState` côté client, pas en base : c'est un brouillon, seul `finishSession`
écrit réellement une `WorkoutSession`.

## État des lieux — authentification & rôles

- **Session** : mécanisme intégré de TanStack Start (`useSession`/
  `getSession`/`clearSession`, cookie httpOnly scellé), pas un JWT fait main
  — voir [src/lib/auth/session.ts](src/lib/auth/session.ts). Expire au bout
  de 30 jours ; le bouton "Prolonger de 30 jours" sur `/profile` reseal le
  cookie sans redemander le mot de passe.
- **Mots de passe** : `bcryptjs` — [src/lib/auth/password.ts](src/lib/auth/password.ts).
- **Server functions** : [src/lib/auth/server.ts](src/lib/auth/server.ts)
  (`getCurrentUser`, `login`, `register`, `logout`),
  [src/lib/admin/server.ts](src/lib/admin/server.ts) (`listUsers`,
  `setUserStatus`).
- **Garde de route** : [src/routes/_app.tsx](src/routes/_app.tsx) redirige
  vers `/login` si pas connecté, vers `/account-status` si `status !==
  ACTIVE`. [src/routes/_app/admin/users.tsx](src/routes/_app/admin/users.tsx)
  ajoute une garde `role === ADMIN`.
- **Données par utilisateur** : `Template` et `WorkoutSession` ont un
  `userId` obligatoire, tous les CRUD sont scopés dessus (avec vérification
  d'appartenance avant modification/suppression). `Exercise` reste partagé
  entre tous les users, sans scoping.
- **Menu burger** : [src/components/layout/user-menu.tsx](src/components/layout/user-menu.tsx)
  — Profil, Administration (si admin), Se déconnecter.

Mono-utilisateur/pas d'auth : **résolu**, ce n'est plus une question ouverte.

## Ce qu'il reste à faire (côté utilisateur)

### 1. Variables d'environnement à ajouter dans `.env`

```
SESSION_SECRET="<chaîne aléatoire d'au moins 32 caractères>"
ADMIN_EMAIL="ton@email.com"
ADMIN_PASSWORD="<mot de passe pour ton compte admin>"
```

`DATABASE_URL` est déjà présent. `SESSION_SECRET` sert à sceller les cookies
de session — n'importe quelle chaîne aléatoire suffisamment longue convient
(ex: `openssl rand -base64 32`).

### 2. Lancer la migration (qui joue aussi le seed admin)

```bash
npx prisma migrate dev --name init
```

Le seed (`prisma/seed.ts`, configuré dans `prisma7.config.ts`) tourne
automatiquement après la migration et crée/relance ton compte `ADMIN` actif
à partir de `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Rejouable sans risque
(`upsert`) si tu changes le mot de passe dans `.env` et relances
`npx prisma db seed`.

Tant que ce n'est pas fait, l'app tourne mais aucune requête ne peut
aboutir (pas de table `User` etc.) — connecte-toi une fois le seed passé.

### 3. Migration "items_category_and_ascending_sets" — ✅ déjà appliquée

`Category` a gagné `abdo`/`dos`, et `TemplateItem`/`SessionItem` ont gagné
`category` (snapshot) et `ascendingSets` (JSON nullable, pour la "gamme
montante").

### 4. Nouvelle migration : suppression de `Template.category` / `WorkoutSession.category`

Un template/une séance n'a plus de catégorie choisie à la main — elle est
maintenant déduite des catégories de ses exercices (`getItemCategories` dans
[src/lib/workout/format.ts](src/lib/workout/format.ts), "commun" étant
ignoré dès qu'une catégorie plus précise est présente). Les colonnes
`Template.category` et `WorkoutSession.category` (l'ancien enum
`TemplateCategory`, maintenant supprimé du schéma) ne servent donc plus à
rien côté appli. Il faut rejouer :

```bash
npx prisma migrate dev --name drop_template_session_category
```

C'est une suppression de colonnes : aucune perte de données gênante (ces
colonnes n'étaient qu'un affichage), Prisma ne devrait rien demander.

## Questions ouvertes / décisions déjà prises par défaut

- **SQLite vs Postgres** : tranché, c'est Postgres (déjà configuré).
- **Pas de réinitialisation de mot de passe** : hors scope pour l'instant
  (pas demandé). Si un jour un user oublie son mot de passe, il faut
  repasser par toi (admin) — pas de flow "mot de passe oublié" par email.
- **Suppression de compte** : pas de bouton pour supprimer un `User` côté
  admin (seulement Accepter/Bloquer/Remettre en attente). Si supprimé un
  jour, `onDelete: Cascade` supprimera aussi ses templates/séances.
