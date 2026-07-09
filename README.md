# Souki — Plateforme de Souk Automobile

Plateforme SaaS pour organiser, gérer et participer à des souks automobiles en Algérie.

## Rôles

- **Organisateur** — Crée et gère des souks, valide les inscriptions, attribue les emplacements
- **Vendeur** — S'inscrit aux souks, ajoute ses véhicules, génère des QR codes
- **Visiteur** — Parcourt les souks et véhicules, place des enchères, scanne les QR codes

## Stack

| Technologie | Version |
|-------------|---------|
| Next.js | 16.2.10 |
| React | 19.2.4 |
| Prisma | 6.19.3 |
| SQLite | — |
| Tailwind CSS | 4.x |
| Framer Motion | latest |
| TypeScript | 5.x |

## Démarrage

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Initialiser la base de données
npx prisma db push
npx tsx prisma/seed.ts

# Lancer en production (Turbopack non compatible)
npm run build && ./start.sh
```

## Documentation

- **Structure du projet** → [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **API (Swagger UI)** → [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

> ⚠ L'authentification n'est pas encore implémentée — les IDs sont codés en dur.
