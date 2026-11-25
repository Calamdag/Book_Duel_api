# Book-Duel API

Backend API for Book-Duel, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Dave Mikael Calamdag Calamdag, BSCS 3-1
- Group and game concept: Team 11

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone https://github.com/Calamdag/Book_Duel_api.git
cd Book_Duel_api
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Who may call | Purpose | Success |
|---|---|---|---|---|
| GET | /health | Anyone | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Anyone | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | The Hub, with the `X-Hub-Key` header | Finished games, every player, and the top 3. Optional `?since=` | 200 (401 without the key) |
| POST | /question-sets | HOST or ADMIN | Create a question set | 201 (400 invalid body) |
| GET | /question-sets | HOST or ADMIN | List the host's own sets (an admin sees all) | 200 |
| GET | /question-sets/{id} | The owner or ADMIN | Read one set | 200 (404 not found, 403 not yours) |
| PATCH | /question-sets/{id} | The owner or ADMIN | Change title, description, subject or grade_level | 200 (400 empty or invalid body) |
| DELETE | /question-sets/{id} | The owner or ADMIN | Delete a set | 204 (409 if a game used it) |
| POST | /sessions | HOST or ADMIN | Start a game from a question set. The server makes the six-digit join code | 201 (404 set not found, 403 not yours) |
| GET | /sessions/{code} | Anyone | Read a game by its code (the host is not shown) | 200 (404 no such code, 400 bad code) |
| PATCH | /sessions/{code} | The game's host or ADMIN | Change the status to `playing` or `ended` | 200 (409 INVALID_STATUS_CHANGE) |
| POST | /sessions/{code}/players | Any signed-in account | Join a game, or rejoin it and get the same seat back | 201 new seat, 200 rejoin (409 started, ended, full or nickname taken) |
| GET | /sessions/{code}/players | Anyone | Nicknames, HP and score of the players in a game | 200 |

Until login is built in Week 12, `/question-sets` and `/sessions` read the caller from the `X-Demo-User` header (a school ID such as `2099-0101`). This is not security.

Game statuses: `waiting`, then `playing`, then `ended`. A game never goes backward. A game holds at most 30 players, and one account has one seat per game.

The Postman collection for these endpoints is in `postman/book-duel-week11.postman_collection.json` (Collection v2.1).

## What "completed" means in my game

A player has completed the game when they submitted an answer for every non-voided round of the session. A player who was eliminated or left before answering every round has completed = false.

## Tables

- `hosts`: the original host accounts table. It is kept but no longer referenced (see the design change below).
- `users`: accounts identified by school ID, with full name, email and role (HOST, ADMIN or PLAYER).
- `question_sets`: a quiz created by a host.
- `questions`: the questions inside a set.
- `choices`: the answer options for each question.
- `sessions`: one played game, with its join code and status (`waiting`, `playing` or `ended`).
- `session_players`: one seat per user per session, with nickname and score.
- `rounds`: one question being played in a session.
- `answers`: a player's answer to a round.

Design change: `question_sets.host_id` and `sessions.host_id` reference `users.user_id` (role HOST) instead of `hosts`, because the Week 11 kit identifies callers from `users`.

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |