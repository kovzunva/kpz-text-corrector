# Project Run & Workflow Guide

## Backend

cd apps/api
npx prisma generate
npx prisma db push
npm run start:dev

## Frontend

cd apps/web
npm run dev

## Verification

npm run typecheck

npm run test --prefix apps/api

git add .
$env:GIT_COMMITTER_DATE="2026-09-19T12:21:04"
git commit --date="2026-09-19T12:18:25" -m "implement document buffer extraction and guest throttle guards"
Remove-Item Env:\GIT_COMMITTER_DATE

git add .
$env:GIT_COMMITTER_DATE="2026-09-21T18:46:50"
git commit --date="2026-09-21T18:44:10" -m "complete public landing, real-time statistics and dictionary management"
Remove-Item Env:\GIT_COMMITTER_DATE