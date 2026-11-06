# Personal website

The live website is built from this folder. Editing and pushing files here to main automatically publishes them to https://siefeldinsobih.com.

Content: `_data/`. Blog posts: `_posts/`. Images: `assets/uploads/`. Fonts and colors: `assets/theme.css`. Navigation: `_layouts/personal.liquid`.

Local preview (Node.js 24): `npm ci`, `npm run build`, then `npm run dev`.

The November 2026 notice is in `_data/personal.json` under `banner`. Set `enabled` to false to remove it.

The older al-folio files remain outside this folder for reference. Deployment uses this folder only.

Upcoming goals: edit `home.goals.items` in `_data/personal.json`. Add or remove list items as plans change. Recent updates are in `_data/updates.json`, newest first.
