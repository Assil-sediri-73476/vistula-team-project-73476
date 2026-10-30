# Task Manager

Basic HTML, CSS and JavaScript Task Manager for the Vistula Team Project – IT course.

**Student ID:** 73476  
**GitHub username in use:** Assil55  
**Repository:** https://github.com/Assil55/vistula-team-project-73476  
**Application / submission URL:** https://Assil55.github.io/vistula-team-project-73476/

## Setup status

Source files are prepared. Deployment and database integration must be verified after account and Supabase configuration. The URLs above are the required destinations, not a claim that they are already live.

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

Use the existing public repository `Assil55/vistula-team-project-73476`. This account and repository name differ from the assignment requirements (`vistula-team-project-73476/vistula-task-manager`); confirm acceptance with the instructor before submission. Upload these project files directly to the repository root on `main`. In **Settings → Pages**, choose **Deploy from a branch**, **main**, **/ (root)** and save. No build command is needed.

For a local preview, serve this directory through an HTTP server rather than opening `index.html` as a file.

## Team collaboration — to be completed by the students

`contribution.html` and `contribution.json` are intentionally absent. A different student must add them through a Pull Request and the repository owner must merge it. The main page already links to `contribution.html`.

- Incoming merged PR (partner contributes here): **PENDING**
- Outgoing merged PR (73476 contributes to partner): **PENDING**
- Contributor page: https://Assil55.github.io/vistula-team-project-73476/contribution.html
- Contributor JSON: https://Assil55.github.io/vistula-team-project-73476/contribution.json

Replace both PENDING entries with actual merged PR links. This assignment is not complete until both collaboration requirements are satisfied.

## Final verification

On the deployed website: create a test task, refresh to verify persistence, edit its title and description, mark complete/incomplete, and delete it. Verify an error message when the network is unavailable. Check the partner's contributor page fetches their ID from JSON, both PRs are merged, and their links are recorded above. Submit only the main GitHub Pages URL in Platon.

