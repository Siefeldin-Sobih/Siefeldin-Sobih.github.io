# Personal website draft — editing guide

This is the Hybrid B design, rendered with ordinary Liquid templates and JSON data compatible with Jekyll/al-folio. The Node renderer exports the same templates for the separate hosted review draft. It does not require React, Astro, or a database.

## Everyday edits

| Change | File |
| --- | --- |
| Name, intro, portrait, teaching/research cards, links, banner | `_data/personal.json` |
| CV experience, education, publications | `_data/cv.json` |
| Downloadable CV | Replace `assets/files/cv.pdf` |
| Projects, hackathons, research, datasets | `_data/work.json` |
| Updates, newest first | `_data/updates.json` |
| Achievements | `_data/achievements.json` |
| References | `_data/references.json`; page introduction in `_data/reference_settings.json` |
| Blog heading and introduction | `_data/blog.json` |
| Individual blog posts | One Markdown file in `_posts/` |
| Fonts, colors, spacing, card radius | Variables at the top of `assets/theme.css` |
| Page layout | `_includes/personal/` and `_layouts/personal.liquid` |

The web CV and downloadable PDF are independent: editing JSON updates the web CV, replacing PDF updates the download. The Print button can save the current web CV as a PDF through the browser.

## Work Experience views

The navigation calls the CV page CV. Its URL remains `/cv/` to preserve links.
The three persistent cards select Teaching, Research, or Complete CV. Only one view is visible at a time; Complete CV is the default. Teaching and Research include full role descriptions plus relevant supporting sections.
In `_data/cv.json`, each work entry has a `category`: `teaching`, `research`, or `other`. The first two feed their focused views; all entries, including `other` and uncategorized entries, remain in Complete CV. Edit a role once and it updates every relevant view.
Links can open `/cv/?view=teaching`, `/cv/?view=research`, or `/cv/?view=complete`. The browser Back/Forward buttons restore the selected view. Arrow keys move between cards; Home/End select the first/last card.
Print prints the selected view. The PDF download is explicitly the complete CV regardless of the selected view.

## References

Add one entry to `_data/references.json` per person, or use the References form in Pages CMS.
Fields: `name`, `role`, `department`, `institution`, `photo`, `email`, and `phone`.
Only the name is required; empty optional fields are omitted on the page. Upload a photo through Pages CMS or add an image under `assets/uploads/` and put its path in `photo`. Without a photo, the card uses the person's initial.
The example card appears only when the reference list is empty and `showExample` is true in `_data/reference_settings.json`; set it to false to show the available-on-request message instead.
Reference data included on a publicly published website can be read and copied by visitors. Confirm the person's permission before publishing contact information or a photo.

## Preview and build

Install dependencies with `pnpm install --frozen-lockfile`, then run `pnpm build` and `pnpm dev`.
Preview opens at http://127.0.0.1:4173.
The static output is `dist/`. The deployment uses the exact same content and templates.

## Images and privacy

The draft includes no personal photos, external analytics, remote fonts, or third-party scripts. All illustrations are local SVG.
To enable a portrait, upload a file into `assets/uploads/`, then set `photo` to its path and edit `photoAlt` in `personal.json`.
Keep `photo` empty to retain the graphic.
Public photos can be copied by visitors; robots directives are not a security boundary.
The review deployment starts private. `noindex` and robots disallow are additional draft settings, not access controls.

## Add work

Duplicate one object in `work.json`, give it a unique lowercase `id`, and edit its title, summary, type, description, tags, and optional repository URL.
Type may be Project, Research, Hackathon, or Dataset. The filter controls derive their categories from the data. Empty categories are omitted.
No work cards are shown on the homepage.
`art` chooses one of the four existing illustration styles.
Use `url: ""` for work without an external link. The About this work disclosure still opens.

## Browser editor

### Blog

The Blog page has an editable introduction above its post cards. Each post opens its own reading page.
Create a file named `YYYY-MM-DD-your-post-slug.md` in `_posts/`, or use the Blog posts form in Pages CMS.
Frontmatter contains `title`, `date`, `description` (the card summary), optional `category`, and `published`. The body is Markdown.
Set `published: false` to keep an unfinished post off the website. The build removes old output so unpublishing a post also removes its generated page.
Set `example: false` when a post contains your own writing. The two included example posts are explicitly labeled as placeholders.
Set `showExamples: false` in `_data/blog.json` to remove example cards and their generated post pages.
Images and links work inside posts; media uploaded under `assets/uploads/` is retained in the repository.
All post content is authored by the site owner; this website has no public post-submission endpoint.

For Jekyll/al-folio integration, merge a posts entry into the existing `defaults` array in `_config.yml`:

```yaml
- scope:
    path: ""
    type: posts
  values:
    layout: personal
    section: blog_post
    permalink: /blog/:title/
```

Preserve existing defaults entries. Existing legacy posts should retain their own frontmatter layouts if they need the old design. Keep the sample posts only in the private review draft.

`.pages.yml` uses JSON-compatible YAML and configures Pages CMS forms, repeatable lists, media uploads, and the CV.
Install the Pages CMS GitHub app for the selected website repository, open that repository in app.pagescms.org, and the forms use these files.
The configuration is prepared; the GitHub app has not been authorized or connected.
Media files stay in Git. No custom CMS database exists.

## Integrating with your existing al-folio website

The existing source was read from:
https://github.com/Siefeldin-Sobih/Siefeldin-Sobih.github.io
Baseline commit: c868968.

This deliverable contains the custom theme layer, not a replacement copy of upstream al-folio.
Apply in a branch of your existing repository:
1. Copy `_data/*.json`, `_includes/personal/`, `_layouts/personal.liquid`, and this draft's `assets/`.
2. Replace `_pages/about.md` with `_pages/about.html`. Do not leave both homepages active.
3. Copy the other `_pages/personal_*.html` files.
4. Keep your existing Gemfile, deployment workflows, domain/CNAME, and site configuration.
5. Retain the existing PDF résumé route or redirect it to `/cv/` if desired.
6. Copy `.pages.yml` if using Pages CMS. Copy or merge the optional draft build scripts only if using this static preview workflow.
7. Validate a real Jekyll build before publishing the GitHub branch.

This draft uses a separate Sites deployment for review. It does not overwrite the current domain, push to your GitHub main branch, or change your existing hosting. A full Ruby/Jekyll build is not available in this environment; the Liquid templates and all exported pages are rendered using LiquidJS. Jekyll compatibility is intentional but still needs a real Jekyll build before merging into the old site.

## Content provenance and review

CV and PDF: existing repository, assets/json/resume.json and assets/pdf/websitesiefresume.pdf.
Bio, teaching, awards, and outreach: existing _pages and _news.
VNForge, PAM250, and Lucid descriptions: the corresponding public repository descriptions/READMEs.
No hackathon wins, project outcomes, or new credentials were invented.
Open-ended roles and the most recent teaching course were carried over from the old site and need your confirmation. The draft makes these limits visible rather than presenting old dates as current.

## Domain later

For GitHub Pages, retain the existing CNAME and GitHub Pages workflow when merging the theme.
For the temporary Sites host, custom domains are also supported. No DNS changes were made.
Remove the draft footer note, robots disallow, and noindex meta when the final public content is approved.


## Publications

Edit `_data/publications.json` or the Publications form in Pages CMS. Add another object for each new paper.
Use `status: "published"` or `status: "in-progress"`. All, In progress, and Published filters update automatically.
`date` is YYYY-MM-DD; entries sort newest first, with undated entries afterward. Update the date when publishing a manuscript.
`authors`, `venue`, `summary`, and `url` are optional; use an empty string to omit them.
The two manuscript titles are placeholders pending your actual titles. The published entry was copied from the existing CV.
Run `npm run build` after edits and refresh the preview.
