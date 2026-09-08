# Online Service Request Management System

## Purpose

This system gives the Delatina team one place to submit, triage, assign, and resolve internal service requests. The static front end can run from GitHub Pages; Supabase supplies authentication and the persistent request data when configured.

## Architecture

- **Presentation:** `index.html` is the authenticated request workspace and `login.html` is the sign-in route. `css/style.css` contains the responsive visual system.
- **Client logic:** `js/app.js` renders and filters requests, handles request creation feedback, and currently includes an intentionally small demo dataset for local preview. `js/auth.js` owns sign-in and sign-out.
- **Data and auth:** `js/supabase.js` creates a Supabase client only when `SUPABASE_URL` and `SUPABASE_ANON_KEY` are supplied. The `service_requests` query is ready for the production table.
- **Hosting:** Push the repository to GitHub and enable GitHub Pages for the `main` branch. The app uses relative paths, so it works at a project-page URL.

## Supabase setup

Run [`supabase/migrations/20260908000000_create_service_requests.sql`](../supabase/migrations/20260908000000_create_service_requests.sql) in the Supabase SQL Editor. It creates the `public.service_requests` table with the columns used by `js/app.js`, enables Row Level Security, and adds authenticated-user policies. Use the anon/publishable key in the browser; never expose a service-role key.

Before deployment, define the two constants in a small configuration script loaded before `js/supabase.js`:

```html
<script>
  window.SUPABASE_URL = 'https://your-project.supabase.co';
  window.SUPABASE_ANON_KEY = 'your-anon-key';
</script>
```

For a production implementation, replace the demo array in `app.js` with `getServiceRequests()`, map the returned database columns to the table view, and add an authenticated insert to the request form handler.

## User flow

1. A team member signs in with Supabase Auth.
2. They scan request metrics, search or filter requests, and submit a new request.
3. An administrator reviews priority and status, then updates the record in Supabase.
4. The table and summary metrics provide a lightweight operational view.