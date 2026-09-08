# SAD Service Request Management System

A responsive online service request workspace built with vanilla HTML, CSS, and JavaScript, designed for GitHub Pages and Supabase.

## Run locally

Open `index.html` in a browser for the demo workspace, or serve the folder with any static server. The demo works without credentials. Sign-in redirects to the workspace in demo mode.

## Project structure

- `index.html` - request dashboard and create-request dialog
- `login.html` - Supabase-ready authentication screen
- `css/style.css` - responsive application and login styles
- `js/supabase.js` - Supabase client configuration and request query
- `js/auth.js` - sign-in and sign-out behavior
- `js/app.js` - dashboard rendering, filtering, and interactions
- `documentation/system-analysis.md` - architecture and deployment notes

## Deploy

Push the repository to GitHub and enable GitHub Pages from `main`. For persistent data and authentication, follow the Supabase setup in `documentation/system-analysis.md` and load your project URL and anon key before `js/supabase.js`.