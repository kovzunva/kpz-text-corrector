# Scope of Work & Deliverables

## 1. Domain Requirements & Functional Modules

### Module A: Public Landing & Statistics (`/`)
- Global navigation bar with route switcher and auth state triggers.
- Hero marketing section highlighting advanced features for registered members.
- Aggregated statistics grid:
  - Total users registered.
  - Total characters and words processed.
  - Total syntax, spelling, and style errors detected.
  - Top 10 most common linguistic errors recorded across sessions.
- Responsive footer with application metadata and navigation links.

### Module B: Workspace Editor & Interactive Canvas (`/editor`)
- Dual-layer text editor (synchronized highlight backdrop behind transparent input).
- Multi-tier color coding:
  - Spelling: Red
  - Grammar: Amber
  - Style: Blue
  - Typography: Violet
- Interactive correction popover:
  - Error description and rule identification.
  - Click-to-replace suggestion triggers.
  - "Ignore Once" action (session-only dismissal).
  - "Always Ignore" action (persists rule to custom dictionary for authorized users).
- Virtual Pagination System:
  - Configurable page size threshold (~2,500 characters per virtual sheet).
  - Page navigation controls with non-breaking word boundaries.
  - Copy actions: copy active page or copy complete document text.
- Live counters for words, characters, and issue density.

### Module C: Authorization & Role Boundaries
- **Guest Role**:
  - Hard limit of 1,200 characters per analysis run.
  - File upload disabled with registration prompt.
  - Dictionary persistent storage disabled.
  - In-editor promotional banner.
- **Authenticated User Role**:
  - Analysis capacity up to 50,000 characters per document.
  - Native file import supported (`.txt`, `.docx`).
  - Unlimited persistent dictionary rule additions.

### Module D: Personalized Dictionary Management (`/dictionary`)
- Data grid displaying all active ignore patterns and custom rules for the user.
- Filtering by pattern type, text query, or creation date.
- Rule deletion with immediate invalidation during subsequent text checks.

---

## 2. Implementation Milestones

| Stage | Domain | Objectives |
| :--- | :--- | :--- |
| **Phase 1** | Foundation & UI System | Set up Next.js + NestJS monorepo. Build `App*` UI wrappers around MUI with strict typing and CSS modules. |
| **Phase 2** | Text Engine & External API | Connect LanguageTool API. Build NestJS middleware for rule suppression against PostgreSQL dictionary tables. |
| **Phase 3** | Workspace Canvas & Pagination | Build synchronized backdrop editor in Next.js. Implement text slicing, offset transformations, and tooltip replacement logic. |
| **Phase 4** | File Parsing & Guest Engine | Implement buffer parsing for file uploads. Add IP-based throttling and character boundaries for guests. |
| **Phase 5** | Analytics & Dictionary Dashboard | Build metric aggregation queries in PostgreSQL. Deliver statistics page and dictionary management module. |