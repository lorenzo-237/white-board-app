# Déploiement (VPS + PM2)

## Prérequis (une seule fois, dans le repo)
- Le build actuel (`dist/server/server.js`) exporte seulement un handler `fetch` : il n'écoute sur aucun port.
  → Ajouter Nitro (`npm i nitro`, puis `nitro()` dans les plugins de `vite.config.ts`) pour générer `.output/server/index.mjs`.
- Corriger le script `start` dans `package.json` : `node .output/server/index.mjs` (actuellement `.dist/server/index.mjs`).

## Serveur (une seule fois)
1. Node LTS, PostgreSQL et PM2 (`npm i -g pm2`)
2. Créer la base et l'utilisateur Postgres
3. Cloner le repo dans `/home/ubuntu/prod/white-board`
4. Créer `.env` : `DATABASE_URL`, `SESSION_SECRET` (32+ caractères aléatoires), `ADMIN_EMAIL`, `ADMIN_PASSWORD`
5. Reverse proxy (nginx) vers le port `4440` + HTTPS (certbot), obligatoire pour la PWA et le service worker

## Déployer / mettre à jour
```bash
git pull
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 startOrReload ecosystem.config.cjs
```

## Première mise en route
```bash
npx prisma db seed   # crée/active le compte admin depuis ADMIN_EMAIL / ADMIN_PASSWORD
pm2 save
pm2 startup   # puis exécuter la commande affichée
```

## Après déploiement
- Si `public/sw.js` a changé : incrémenter `VERSION` pour vider l'ancien cache
- Logs : `pm2 logs white-board-app`
