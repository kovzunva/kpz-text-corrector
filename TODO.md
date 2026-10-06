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
$env:GIT_COMMITTER_DATE="2026-09-21T18:46:50"
git commit --date="2026-09-21T18:44:10" -m "complete public landing, real-time statistics and dictionary management"
Remove-Item Env:\GIT_COMMITTER_DATE

Внеси зміни на сторінку едітора:
- забезпеч такий порядок блоків: рядок хедера Workspace Editor, Quota Capacity, головне текстове поле, пагінація та дії, статистика, банер cta реєстрації
- зміни дизайн блоку статистики таким чином, щоб там було 1 чи 2 повні рядки, бо зараз там 1 рядок на 6 карток і другий рядок на 2 картки, що виглядає некрасиво
- у блоці дій та пагінації:
    - кнопку імпорту виводити лише для авторизованих
    - дві різні кнопки копіювання виводити лише якщо є більше ніж одна сторінка, інакше просто Copy
    - змінити вигляд кнопок дій імпорту та копіювання таким чином, щоб вони виглядали більш збалансовано і більш доступно показували свою важливість і роль відносно інших, бо зараз якийсь каламбур: 1 блакитна обведена, 1 сіра обведена, знову 1 блакитна обведена
- видали початковий текст з поле, воно має бути початково пусте і мати плейсхолдер