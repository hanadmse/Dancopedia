# Dancopedia

**[dancopedia.com](https://dancopedia.com)** — A community-driven encyclopedia of Brazilian dances.

Dancopedia lets users browse, search, and discover Brazilian dances organized by category and region, explore an interactive map of Brazil, and ask an AI chatbot questions about Brazilian dance culture. The site is open to the public — anyone can create a free account to submit dance entries for admin review, leave feedback, and use the chatbot.

---

## Features

### Browse & Discover
- **Category pages** — Traditional, Festival, Partner, and Pop/Contemporary dance styles
- **Region pages** — Dances organized by geographic origin: Rio de Janeiro, Northeastern Brazil, Pernambuco, and Bahia
- **Interactive map** — Clickable SVG map of Brazil linking directly to regional dance pages
- **Dance detail pages** — Full descriptions, images, category, and region for each dance entry
- **Historical timeline** — Chronological history of Brazilian dance evolution
- **Instruments reference** — Overview of instruments associated with Brazilian dance music

### Search
- Full-text search across dance names and descriptions, accessible from any page via the navigation toolbar

### AI Chatbot
- Embedded chatbot powered by the Groq API 
- Answers natural language questions about Brazilian dances using the live database as its knowledge source
- Rate-limited and protected against prompt injection and jailbreak attempts
- Conversation history preserved within a session

### Community Contributions
- Registered users can submit new dance entries with a name, description, category, region, and image
- Submissions enter a pending queue and are published only after admin approval
- Users can save favorite dances to their personal dashboard

### Feedback Wall
- Users can submit feedback about the site
- Approved submissions appear on a public feedback wall

### Admin Dashboard
- Approve or reject pending dance submissions
- Moderate user feedback
- DataTables-powered interface for managing content at scale

### Authentication
- Account registration and login with role-based access (`user` / `admin`)
- Session-based authentication with a 30-minute inactivity timeout


---

## Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP with MySQLi (raw prepared statements, no ORM) |
| Web Server | Apache with `.htaccess` URL rewriting |
| Database | MySQL |
| Frontend | HTML5, Vanilla JavaScript (Fetch API), Bootstrap 5.3.3 |
| AI Chatbot | PHP endpoint + Groq API (llama-3.3-70b-versatile) |
| Icons | Font Awesome 5.15.4 |
| Admin tables | jQuery 3.7.1 + DataTables 1.13.6 |

### Directory Layout

```
dancopedia/
├── src/
│   ├── web/                   # Web root — all pages and API endpoints
│   │   ├── index.html         # Homepage
│   │   ├── search.html        # Search page
│   │   ├── map.html           # Interactive Brazil map
│   │   ├── api/               # 14 JSON API endpoints (POST)
│   │   ├── categories/        # Traditional, Festival, Partner, Pop pages
│   │   ├── regions/           # Rio, Northeastern Brazil, Pernambuco, Bahia pages
│   │   ├── dances/            # Slug-based dance detail page
│   │   ├── pages/             # About, Timeline, Instruments
│   │   ├── auth/              # Login, Register, Logout
│   │   ├── user/              # User dashboard, Contribute form
│   │   ├── admin/             # Admin dashboard, Feedback management
│   │   ├── community/         # Feedback form, Feedback wall
│   │   ├── partials/          # Shared components (toolbar, chatbox, breadcrumb)
│   │   └── assets/            # CSS, JS, and images
│   ├── app/                   # Shared PHP helpers (auth, API utilities)
│   ├── config/                # Database connection and environment config
│   └── database/              # SQL schema, seed data, and migrations
└── tests/                     # Playwright E2E and unit test suites
```

### Request Flow

PHP pages in `src/web/` render the UI. User interactions trigger AJAX calls via the Fetch API to PHP endpoints in `src/web/api/`, which execute prepared MySQL queries and return JSON. No routing framework — file paths are the routes, with Apache `.htaccess` rewriting clean URLs (e.g., `/dances/samba`) to the appropriate PHP files.

### API Endpoints

All endpoints accept `POST` requests and return JSON.

| Endpoint | Purpose | Access |
|---|---|---|
| `fetch_dances.php` | List/filter dances by region, category, approval status | Public |
| `get_dance.php` | Fetch a single dance by ID or slug | Public |
| `dance_search.php` | Full-text search across dance names and descriptions | Public |
| `fetch_map_dances.php` | Fetch dances with map coordinates | Public |
| `create_dance.php` | Submit a new dance (sets `approved = 0`) | Authenticated |
| `approve_dance.php` | Approve a pending dance | Admin |
| `disapprove_dance.php` | Reject a pending dance | Admin |
| `deleteDance.php` | Delete a dance entry | Admin |
| `updateDance.php` | Edit a dance entry | Admin |
| `submit_feedback.php` | Submit user feedback | Public |
| `fetch_feedback.php` | Retrieve pending feedback | Admin |
| `fetch_approved_feedback.php` | Retrieve public feedback | Public |
| `approve_feedback.php` | Approve a feedback entry | Admin |
| `chat.php` | AI chatbot conversation | Authenticated |

### Database Schema

Database name: `brazil_dances`

| Table | Purpose |
|---|---|
| `users_form` | User accounts with `user_type` (`admin` / `user`) |
| `dances` | Dance entries with `approved` flag, slug, map coordinates, and FKs to category, region, media |
| `dance_categories` | Four categories: Traditional, Festival, Partner, Pop |
| `region` | Four regions: Rio de Janeiro, Northeastern Brazil, Pernambuco, Bahia |
| `media` | Image URLs and alt text for dances |
| `preferences` | User-favorited dance relationships |
| `feedback` | User-submitted feedback with `approved` flag |

### Authentication & Security

- Session-based authentication (`$_SESSION`) with 30-minute inactivity timeout
- CSRF token verification on all state-changing API endpoints
- Security headers set via `.htaccess`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- Sensitive file types (`.sql`, `.env`, `.log`, `.ini`, `.sh`, `.bak`) blocked at the server level
- Chatbot endpoint includes prompt injection detection (10+ regex patterns) and rate limiting (20 requests per minute per session)

### Frontend Conventions

**Component loading** — The navigation toolbar and chatbot widget are loaded dynamically via `fetch()` from `src/web/partials/` and injected into pages at runtime, keeping markup DRY.

**Template inheritance** — Category and region list pages (e.g., `categories/festival.php`) set a few PHP variables (`$pageTitle`, `$pageHeading`, `$loadCategory`, `$loadRegion`) and `include` the shared `partials/dance_list_page.php` shell, which handles all rendering.

**Data-bridge pattern** — PHP-derived constants are passed to external JS files via a minimal inline `<script>` block (constants only, no logic), keeping PHP and JS cleanly separated.

**Asset naming** — Page CSS files use PascalCase (`Adminhome.css`); page JS files use camelCase (`adminhome.js`); shared utilities use lowercase (`toolbar.css`, `load_dances.js`).

---

## Testing

Tests are written with [Playwright](https://playwright.dev/) and cover both end-to-end browser flows and unit-level browser logic.

### Test Suites

**End-to-end (`tests/e2e/`)**

| Suite | Coverage |
|---|---|
| `auth.spec.js` | Login, registration, invalid credentials, session handling |
| `navigation.spec.js` | Page routing and breadcrumb navigation |
| `home.spec.js` | Homepage loading and featured dance cards |
| `public-archive.spec.js` | Category/region filtering and search |
| `access-control.spec.js` | Admin vs. user permission enforcement |
| `workflows.spec.js` | Full user journeys: dance submission, feedback approval |

**Unit (`tests/unit/`)**

| Suite | Coverage |
|---|---|
| `load-dances.spec.js` | Dance list loading and rendering logic |
| `breadcrumb.spec.js` | Breadcrumb navigation component |
| `core-browser-logic.spec.js` | Cross-browser DOM and Fetch API behavior |

### Running Tests

```bash
npm test            # All tests (unit + E2E)
npm run test:unit   # Unit tests only
npm run test:ui     # Interactive Playwright UI
npm run test:headed # Headed browser mode
npm run test:report # View last HTML report
```

Tests run against a dedicated isolated database (`brazil_dances_e2e`) with a global setup/teardown to seed and clean state between runs.

---

## Seeded Dance Catalog

The database ships with 13 core Brazilian dances:

Samba, Forró, Frevo, Axé, Bossa Nova, Capoeira, Maracatu, Lambada, Quadrilha, Maculelê, Carimbó, Funk Carioca, Baião

---

