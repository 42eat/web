# Prisma

## Setup (nouveau dev)
```bash
docker compose up -d
pnpm dlx prisma migrate dev
```

## Modifier la DB
1. Modifier `prisma/schema.prisma`
2. `pnpm dlx prisma migrate dev --name ce_que_tu_as_fait`
3. Commiter `schema.prisma` + `prisma/migrations/`

## Commandes
```bash
prisma migrate dev --name nom    # créer une migration
prisma migrate status            # voir ce qui est appliqué
prisma studio                    # interface graphique pour les données
prisma migrate deploy            # appliquer les migrations en prod (CI/CD)
```

## Règles
- On ne modifie jamais la DB à la main, toujours par une migration
- `.env` n'est jamais commité, `.env.example` oui
- `prisma/migrations/` est toujours commité