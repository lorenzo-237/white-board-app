# Déploiement (VPS + PM2)

> `npm run build` génère via Nitro un serveur Node autonome : `.output/server/index.mjs`
> (+ fichiers statiques dans `.output/public`). `npm start` le lance et écoute sur `PORT`.

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
