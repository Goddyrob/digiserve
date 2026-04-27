# Welcome to your Lovable project

## Setup

1. Copy `.env.example` to `.env`.
2. Replace the placeholder values with your Supabase project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Restart the Vite dev server after updating `.env`.

## Supabase

The app uses Supabase auth and requires a valid project URL and publishable key. If your browser reports `ERR_NAME_NOT_RESOLVED`, the configured `VITE_SUPABASE_URL` is not reachable or the Supabase project host is invalid.
