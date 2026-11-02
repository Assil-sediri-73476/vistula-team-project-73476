# Task Manager

Basic HTML, CSS and JavaScript Task Manager for the Vistula Team Project – IT course.

**Student ID:** 73476  
**GitHub username in use:** Assil55  
**Repository:** https://github.com/Assil55/vistula-team-project-73476  
**Application / submission URL:** https://assil55.github.io/vistula-team-project-73476/

## Setup status

The application is deployed on GitHub Pages and connected to Supabase. All CRUD operations have been tested on the live site.

## Features

- Display, create, edit, complete/reopen, and delete tasks.
- Persist changes through the Supabase PostgreSQL REST API.
- Accessible form, responsive layout, loading states, and useful error messages.
- No framework, build process, login, or separate backend required.

## Supabase setup

1. Create a free, separate demonstration Supabase project containing test data only.
2. Run `supabase-setup.sql` once in its SQL Editor. This creates the `tasks` table, grants, and public CRUD RLS policies.
3. Copy the project URL and **publishable** API key (`sb_publishable_…`) from the project dashboard into `config.json`.
4. Keep `tableName` equal to `tasks`. Never add a secret key, service role key, or database password.

The application sends the public key through the `apikey` header and calls `/rest/v1/tasks` using GET, POST, PATCH and DELETE. Public RLS access is intentional for this assignment's demonstration database.

## GitHub Pages

The site is published from the `main` branch, root folder, via **Settings → Pages → Deploy from a branch**. No build command is needed.

## Team collaboration

- Incoming merged PR (partner contributes here): https://github.com/Assil55/vistula-team-project-73476/pull/2
- Outgoing merged PR (73476 contributes to partner): https://github.com/mohamedayad-73180/vistula-task-manager/pull/1 (file names fixed in https://github.com/mohamedayad-73180/vistula-task-manager/pull/2)
- Contributor page: https://assil55.github.io/vistula-team-project-73476/contribution.html
- Contributor JSON: https://assil55.github.io/vistula-team-project-73476/contribution.json

Both collaboration Pull Requests have been completed and merged.

## Final verification

On the deployed website: create a test task, refresh to verify persistence, edit its title and description, mark complete/incomplete, and delete it. The partner's contributor page fetches the ID from JSON. Submit only the main GitHub Pages URL in Platon.
