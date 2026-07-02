# UI Redesign — work history & plan

Branch: `ui-redesign`. This file is the cross-session source of truth for the UI/UX
redesign. **Every AI session working on the redesign must read this file first and
update the "Work log" section before finishing.**

## Chosen direction

Hybrid approved by the owner (2026-07-02): **Direction A («Văn phòng số») layout &
density, with Direction B («Ấn triện») identity accents.** Design pitch artifact:
https://claude.ai/code/artifact/e567a60f-e0d8-4103-9ba9-bbcc254d3019

### Design tokens (single source: `src/theme/index.ts`)

| Token | Value | Use |
|---|---|---|
| `primary.main` | `#8C2F2B` | Seal red — primary actions, active nav, links |
| `primary.dark` | `#6E2320` | Hover on primary |
| `secondary.main` | `#16232F` | Dark ink navy — sidebar bg, app bar |
| `background.default` | `#F6F5F2` | Warm paper-grey workspace ground |
| `background.paper` | `#FFFFFF` | Cards, forms |
| `text.primary` | `#2B2622` | Warm ink |
| `text.secondary` | `#6B655C` | Captions, helper text |
| `divider` | `#E4E1DA` | Borders, card outlines |
| `success.main` | `#3F6B4F` | "Đủ thông tin" states |
| `warning.main` | `#C07A24` | Missing-fields states |
| `softTeal` (legacy) | kept, remapped to `#B9A063` (muted brass) | still referenced by ~10 editor pages; migrate then delete |

### Typography

- Body/UI: **Be Vietnam Pro** (`@fontsource/be-vietnam-pro`), weights 400/500/600/700.
- Document titles & page headings: **Lora** (`@fontsource/lora`) 600/700 — used via
  theme `h1–h4` fontFamily. Form labels/inputs stay sans.
- Roboto removed.

### Rules

- No hardcoded colors in pages/components — everything from `theme.palette`.
  (Pre-existing hardcodes are migrated page-by-page in Phase 3.)
- Header height 64px (was 100px). Sidebar dark `secondary.main`, active item =
  red left border + tinted bg.
- Disabled/coming-soon items: dashed border + "Sắp có" chip, default cursor.

## Phase plan

- **Phase 1 — Foundation (this is the enabler for everything):**
  fonts, full `createTheme` (palette + typography + component overrides:
  Button, TextField, Paper/Card, Dialog, Chip, Table), Layout (compact header,
  dark sidebar, build-time out of the floating footer), Login, ChooseDocument +
  RoundedBox, choose-sub-document.
- **Phase 2 — Form UX (highest daily value):**
  section navigator (Bên A / Bên B / Tài sản / Giá / Xem lại) for the shared land
  editor `hdcn-quyen-sd-dat-toan-bo` first, sticky action bar with "Tạo văn bản" +
  draft status, per-section required-field indicators. Then roll the pattern to the
  other document-editor pages.
- **Phase 3 — Page-by-page migration:**
  work-history, submit-contract, history (Tổng hợp), report, report-branch-manager,
  employee, profile, documents — replace hardcoded colors, apply card/table styles,
  replace `alert()` on 401 (in `src/api/index.ts`) with a proper dialog/toast.
- **Phase 4 — Polish:**
  home search + "recently edited" shortcuts, mobile bottom-nav refresh, loading
  states naming the file being generated, empty states.

## Work log (newest first)

### 2026-07-02 — Session 1 — Phase 1 DONE
- Created branch `ui-redesign`, wrote this doc.
- Fonts: added `@fontsource/be-vietnam-pro` (400–700) + `@fontsource/lora`
  (600/700), removed Roboto and the Google Fonts CDN import in `index.css`
  (Montserrat/Poppins/Noto Serif were unused elsewhere).
- `src/theme/index.ts`: full token system per the table above + component
  overrides (Button, TextField size=small default, Card outlined default,
  DialogTitle serif, TableHead uppercase caption style, tabular-nums cells).
  Exports `SERIF_FAMILY` for one-off serif text. Added `<CssBaseline />` in
  `main.tsx` so `background.default` applies.
- Layout: header 100px → 64px (56 mobile), ink-navy bg, serif brand, avatar
  shows user initial, logout is a quiet outlined button. Floating build-time
  footer removed → now a caption at the bottom of the dark sidebar. Content
  column scrolls itself (`overflowY: auto`) with bottom padding for mobile nav.
- SidebarMenu: dark (`secondary.main`), active = red-light left border +
  white text; "Menu" heading removed.
- SidebarMenuMobile: white bottom nav with labels, active = primary red,
  safe-area inset padding.
- Login: navy gradient ground (bg photo no longer used — `src/assets/images/
  login-bg-image.jpg` still on disk), white card with TG seal-red mark, serif
  brand, primary red submit (was hardcoded green).
- RoundedBox: white card + divider border, red-tinted folder chip, hover
  border/shadow, chevron; inactive = dashed border + "Sắp có" chip + default
  cursor. Same props API — both choose-document pages picked it up unchanged.
- `pnpm build` passes; Vietnamese font subsets confirmed in dist.
- NOT yet visually checked in a browser — do that at the start of session 2.

**Next session: Phase 2** — section navigator + sticky action bar in
`src/pages/document-editor/hdcn-quyen-sd-dat-toan-bo/index.tsx` (serves 8
contract types; read its flag props first), then roll to other editors.

## Notes for future sessions

- `softTeal` palette key is declared in `src/theme/type.d.ts` and used in ~10
  document-editor pages — do not remove until Phase 3 migrates them.
- `pnpm build` must pass (tsc + vite). No test runner exists.
- Vietnamese identifiers (with diacritics) are wire-format — never rename.
- `DocumentEditor` slug-dispatch logic must not change during the redesign —
  this effort is visual/UX only.
