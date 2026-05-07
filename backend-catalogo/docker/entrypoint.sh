#!/bin/sh
set -eu

echo "Generating Prisma client..."
npx prisma generate

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Running seed..."
npm run seed

echo "Syncing seed images..."
npm run seed:images

echo "Starting API..."
exec npm run start:prod
