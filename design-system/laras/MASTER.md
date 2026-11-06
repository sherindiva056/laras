# Laras design system

Scope: local interactive MVP at /laras. Existing portfolio stays at /.

UI UX Pro Max search: SaaS dashboard productivity. Adopt flat design, simple navigation and restrained interaction; marketing conversion pattern is not applicable to this workspace.

Tokens: dark forest #253b32, primary #315d49, warm white #fafbf8, sidebar #f1f4ed, border #e5e9e3. Sage, peach and lilac identify projects; text also identifies every state.

Typography: local Segoe UI / Arial, clear hierarchy. Use native buttons, labeled forms, native modal dialog with focus containment and Escape dismissal. No decorative animation for frequently used dashboard actions. Respect reduced motion.

Responsive: full sidebar on desktop, icon navigation on tablet/mobile; project and task sections collapse to one column. All styles scoped to .laras-app and lr- prefixed classes.

Current boundary: synthetic demo data in localStorage; no shared accounts, real AI, financial posting or server reminders. These require backend implementation from the Laras guide.

## Revision from user reference
White sidebar and canvas, violet primary #7054e8, pale lavender states. Remove sage motif and decorative inspirational card. Use readable 12-14px operational labels. Reference image is authoritative over generic search palette. Current implementation boundaries are documented in README.md.

## Comfortable web scale

Current application typography: Plus Jakarta Sans Variable, locally hosted. Body 16px, task titles 15–16px, secondary text 12–14px, page headings 28–32px. Primary controls at least 46px high. Dashboard metrics reflow into two columns below 1250px and one below 600px; project cards reflow to two then one column. Purple is reserved for active state and primary actions; white panels and neutral text provide the hierarchy. Login and verification follow the same readable scale. Previous tiny 9–12px operational labels have been enlarged.

## Landing page

Route `/` introduces Laras with a project-board illustration, product explanation, three feature panels, workflow, FAQ and demo CTA. `/login` hosts account access, `/laras` remains the authenticated workspace, `/demo` stays login-free. The visual board on the landing page is an illustration, not an interactive application. Logo assets in public/brand are reused across landing, workspace, login, verification and favicon. No invented customer counts or testimonials; roadmap features are explicitly labeled.

## Blue identity revision — 7 November 2026

User reference: dark navy, electric blue, centered headline, floating product panels, then a light feature section. Primary #315DF4, navy #060E30, light blue #92ACFF. Logo SVG/PNG assets and application/login/verification palettes updated. No animation introduced. Hero board and progress cards are labeled product illustrations, not user metrics. Mobile stacks the hero content and removes the secondary progress card to retain readable product context.

## Typography revision
Manrope Variable replaces Plus Jakarta Sans across landing, workspace, login and verification. Landing hero weight 800, section headings 750, body 450. Display tracking -0.045em to -0.055em; paragraphs retain normal tracking and generous leading. Font is locally bundled via @fontsource-variable/manrope. Logo artwork retains its own wordmark.
