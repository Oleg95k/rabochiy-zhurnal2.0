# Рабочий журнал

Ежедневный журнал задач на React, TypeScript и Vite. Задачи группируются по дате, статистика считается автоматически, а локальная версия хранит данные в `localStorage` браузера.

## Запуск на компьютере

1. Установите Node.js LTS с сайта https://nodejs.org/ (вместе с ним устанавливается npm).
2. Откройте терминал в папке проекта.
3. Выполните:

   ```bash
   npm install
   npm run dev
   ```

4. Откройте адрес, который Vite покажет в терминале (обычно http://localhost:5173).

Для локальной проверки production-сборки:

```bash
npm run build
npm run preview
```

## Публикация на Vercel

Проект уже содержит `vercel.json`: Vercel собирает приложение командой `npm run build`, размещает папку `dist` и направляет запросы SPA на `index.html`.

1. Загрузите папку проекта в новый Git-репозиторий GitHub (сам Git-репозиторий можно сделать private).
2. Войдите на https://vercel.com/ и выберите **Add New → Project**.
3. Импортируйте репозиторий. Проверьте настройки: Framework — Vite, Build Command — `npm run build`, Output Directory — `dist`.
4. Нажмите **Deploy**. После успешной сборки Vercel покажет постоянный адрес вида `имя-проекта.vercel.app`.
5. Каждый push в подключённую ветку будет обновлять сайт. Домен `vercel.app` доступен без покупки домена; собственный домен настраивается отдельно.

Публикация в Vercel в этой версии не выполнялась.

## Важное о сохранении между устройствами

`localStorage` хранится отдельно в профиле каждого браузера на каждом устройстве. Поэтому данные не синхронизируются между компьютером и телефоном и могут исчезнуть при очистке данных сайта или смене браузерного профиля. Размещение приложения на Vercel само по себе этого не меняет: Vercel публикует файлы сайта, но не хранит пользовательскую историю.

Для синхронизации нужен сервер хранения данных (например, облачная база) и обычно авторизация пользователя. Это можно сделать на бесплатном тарифе подходящего сервиса, внимательно проверив его текущие ограничения; платные сервисы в проект не подключены. После подключения данные нужно будет переносить из локального хранилища в базу. До этого используйте журнал в том же браузере и на том же устройстве.

## GitHub Pages

Workflow `.github/workflows/static.yml` builds the project on pushes to `main` and publishes `dist` through GitHub Pages. For this repository (`rabochiy-zhurnal2.0`), Vite uses the `/rabochiy-zhurnal2.0/` base path only in the Pages workflow; local development and Vercel keep `/`.

To enable deployment once, open **Settings → Pages** in the repository and select **GitHub Actions** as the build and deployment source. Then push the workflow and source files to `main`. The deployment URL will appear in the workflow run and the Pages settings.


