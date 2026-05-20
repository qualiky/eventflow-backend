# Backend - EventFlow

## Requirements:

- Backend: `Bun` or Node. Compatible with Node 22+. Tested and built in Bun.
- Database: `PostgreSQL`. Running locally on port 5432. Replace connection string in `.env.example` if using something else (RDS, Aurora Postgres, or Supabase) before you copy it to `.env`.
- code-review-graph: If using AI agent to commit code, please ensure you have `code-review-graph` installed via `uv` (requires Python, can use MacOS or Linux' built in Python runtime). Refer to `code-review-graph` for how-to.


## Installation

1. Clone the repo and go to the code folder
2. Install dependencies with `bun install`.
3. Copy .env.example to .env with `cp .env.example .env` and replace the URL for frontend and database.
4. Run `bun run db:migrate` to run the initial migration.
5. Start the application with `bun run dev`.
