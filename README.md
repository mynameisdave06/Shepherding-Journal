# Shepherding Journal

A personal mobile-first Shepherding Journal and Cell Activity app. It can run as a private PWA and optionally sync journal data to a private Supabase account.

## Cloud setup (optional)
1. Create a Supabase project.
2. Open SQL Editor and run `supabase.sql`.
3. Open Project Settings/API and copy the Project URL and Publishable key.
4. Put them in `config.js`:
   - `url: 'https://YOUR-PROJECT.supabase.co'`
   - `key: 'YOUR-PUBLISHABLE-KEY'`
5. Upload the changed files to GitHub Pages.

Use the **publishable** key in the browser, never a `service_role`/secret key. The database is protected by Row Level Security so each signed-in account can access only its own row.

If email confirmation is enabled in Supabase, confirm the email before signing in.
