# Laras design system

Scope: local interactive MVP at /laras. Existing portfolio stays at /.

UI UX Pro Max search: SaaS dashboard productivity. Adopt flat design, simple navigation and restrained interaction; marketing conversion pattern is not applicable to this workspace.

Tokens: dark forest #253b32, primary #315d49, warm white #fafbf8, sidebar #f1f4ed, border #e5e9e3. Sage, peach and lilac identify projects; text also identifies every state.

Typography: local Segoe UI / Arial, clear hierarchy. Use native buttons, labeled forms, native modal dialog with focus containment and Escape dismissal. No decorative animation for frequently used dashboard actions. Respect reduced motion.

Responsive: full sidebar on desktop, icon navigation on tablet/mobile; project and task sections collapse to one column. All styles scoped to .laras-app and lr- prefixed classes.

Current boundary: synthetic demo data in localStorage; no shared accounts, real AI, financial posting or server reminders. These require backend implementation from the Laras guide.

## Revision from user reference
White sidebar and canvas, violet primary #7054e8, pale lavender states. Remove sage motif and decorative inspirational card. Use readable 12-14px operational labels. Reference image is authoritative over generic search palette. Current implementation boundaries are documented in README.md.
