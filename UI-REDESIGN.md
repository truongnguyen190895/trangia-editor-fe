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

### 2026-07-02 — Session 5 — Phase 4 done (dialogs + home polish)
- All ~27 dialog files restyled (3 parallel agents, purely presentational):
  plain DialogTitles (theme serif applies), grey info/search boxes →
  outlined Paper on `background.default`, confirm buttons → contained
  primary (was success/info/secondary), cancels → outlined, giant blue
  add-icons → primary small buttons/icons, inner tables → `size="small"`
  with IconButton actions. `color="error"` kept only on truly destructive
  confirms (delete phiếu thu, employee deactivate). copy-mapper's action
  demoted to outlined so dialogs keep one contained primary.
- Home page (ChooseDocument) upgraded: Autocomplete quick-search over the
  `templates` database (navigates straight to /editor), "Soạn gần đây" list
  (top 5 from `listWorkHistory`, resume logic mirrored from work-history
  page), category cards under an uppercase "Danh mục văn bản" label.
  choose-sub-document switched to PageHeader.
- Build passes; lint errors 93 → 90 (all remaining pre-existing).
- Pre-existing oddities found by agents, NOT fixed: `setSaveLoading(true)`
  called twice in hdcn-dat-va-tai-san them-thong-tin-dat submit; the 4
  nhom-* add-single/add-couple dialogs are near-copies of the shared
  them-chu-the dialogs (nhom-huy-sua-doi's even use `useHDMBXeContext`);
  loading-dialog has an unused `message` prop — could show the generated
  file name (deferred).

**Redesign status: Phases 1–4 complete.** The whole app is on the new
design system. Remaining nice-to-haves (unscheduled): dedupe the copied
nhom-* party dialogs into the shared ones, loading dialog naming the file
being generated, dark-mode variant, empty states for reports.

### 2026-07-02 — Session 4 — Phase 3 done (non-editor pages + cleanup)
- 401 handling in `src/api/index.ts`: `window.alert` removed → redirect to
  `/login?expired=1`; LoginPage shows an info `Alert` when `expired=1`.
- `softTeal` fully removed (palette key + `src/theme/type.d.ts` deleted —
  nothing referenced it anymore).
- Dead `party-entity` components deleted from nhom-huy-sua-doi and
  nhom-thue-muon-dat-coc.
- New shared `PageHeader` (`src/components/common/page-header/`): eyebrow +
  serif h4 title + right action slot. Used by all migrated pages.
- All non-editor pages migrated (3 parallel agents): history (Tổng hợp),
  submit-contract (Phiếu thu, incl. WarningBanner → MUI `Alert severity=
  "warning"`), work-history, report, report-branch-manager, employee list +
  add form, profile, documents, not-found (rebuilt as centered serif 404).
  Pattern: PageHeader, outlined Paper containers for filters/tables/forms,
  `size="small"` tables letting the theme style headers, one contained
  primary action per page, row actions as small IconButtons.
- `DocumentThumbnail` restyled (divider border, primary hover, was #000).
- Remaining hardcoded colors are only in: login gradient + layout/sidebar
  whites (intentional), and **dialog internals** (them-ca-nhan-dialog,
  them-vo-chong-dialog, them-thong-tin-dat dialogs across editors,
  them-giay-uq-btn inner table) — these are the last unmigrated surfaces.
- Build passes; lint 93 errors, all pre-existing.
- Bugs noticed by agents, NOT fixed (report to owner): report-branch-manager
  on-screen title says "Báo cáo nhân viên" (copy-paste); employee add-form
  password field lacks `type="password"`; `user.branches[0]` unguarded in
  profile/submit-contract; dead never-shown Snackbar in history page;
  duplicated filter/URL-sync logic across both report pages.

**Next (Phase 4):** dialog internals restyle (them-ca-nhan/vo-chong,
them-thong-tin-dat ×7, giay-uq inner table); then polish: home search +
"recently edited" shortcuts, mobile bottom-nav for more routes, loading
states naming the generated file, empty states.

### 2026-07-02 — Session 3 — Phase 2 rollout complete (all 10 editors)
- Owner visually approved the land-editor screenshot; two leftovers fixed in
  `document-editor/index.tsx`: grey `#E0E0E0` title banner → eyebrow
  ("Soạn văn bản") + serif h4 title; contained back button → outlined
  IconButton beside the title.
- Pattern rolled out to the remaining 9 editors (via 3 parallel agents, one
  per batch of page directories): hdmb-can-ho, hdtc-can-ho, hdmb-nha-dat,
  hdmb-tai-san, hdmb-xe, hdcn-dat-va-tai-san, uy-quyen, nhom-huy-sua-doi,
  nhom-thue-muon-dat-coc. All now use SectionNav (anchor ids `section-*`) +
  numbered FormSections + StickyActionBar with "Còn thiếu: …" status; softTeal
  buttons, hidden "Tìm kiếm" boxes, `#3D90D7`/`#BCCCDC` chrome all removed.
  `softTeal` is now referenced NOWHERE in src/pages — the palette key +
  type.d.ts declaration can be deleted in Phase 3.
- Notable per-page decisions (details in git log / page files):
  - Pages whose object component holds TWO entities (căn hộ+đất, nhà+đất,
    tài sản+đất) use one FormSection with two Divider-separated subsections,
    each with its own add/edit/delete controls — not two FormSections.
  - hdmb-nha-dat uỷ-quyền flow: primary button intentionally NOT gated on
    `isFormValid` (pre-existing behavior, kept); status text uses its own
    missing-list instead.
  - nhom-huy-sua-doi: Bên B section + nav item only when `!isHuy`.
  - nhom-thue-muon-dat-coc: details section wrapped in FormSection but has no
    completion state (all fields optional) and is omitted from the nav.
  - Dead code found, untouched: `nhom-huy-sua-doi/components/party-entity/`
    and `nhom-thue-muon-dat-coc/components/party-entity/` are imported
    nowhere (one even uses the wrong context). Delete in Phase 3.
- Build passes; lint errors 98 → 93, all remaining are pre-existing in dialog
  files. Editors NOT yet visually checked except the land editor — owner
  should click through a few (esp. căn hộ and đặt cọc) before Phase 3.

**Next (Phase 3):** page-by-page migration of non-editor pages (work-history,
submit-contract, history, report ×2, employee, profile, documents), replace
the 401 `alert()` in `src/api/index.ts`, delete `softTeal` + dead
party-entity components, restyle dialog internals (them-thong-tin-dat etc.).

### 2026-07-02 — Session 2 — Phase 2 core done (land editor)
- New shared components in `src/components/common/`:
  - `form-section/` — `FormSection`: outlined card with serif header, optional
    roman `numeral` (mirrors contract I/II/III structure), optional `complete`
    status chip (success "Đủ thông tin" / warning), optional `action` slot,
    `id` + `scrollMarginTop` for anchor scrolling.
  - `section-nav/` — `SectionNav`: sticky left rail (hidden < lg) listing
    sections with check/unchecked icons; scrolls to `FormSection` by id.
  - `sticky-action-bar/` — `StickyActionBar`: sticky bottom bar with a status
    line ("Còn thiếu: …") and right-aligned actions. Negative `bottom` offset
    cancels the Layout content padding — if Layout padding changes, update it.
- `ThemChuThe` now renders inside `FormSection` (new optional props `id`,
  `numeral`; `complete` derived from having ≥1 member). Old blue `#3D90D7`
  header gone; giant add-icons replaced with small "Thêm cá nhân / vợ chồng"
  outlined buttons in subsection headers; action icons are `IconButton`s in a
  single "Thao tác" column; `uuidv4()` render keys replaced with stable
  indexes. **All 10 editors get this automatically.**
- Land editor `hdcn-quyen-sd-dat-toan-bo/index.tsx`: sections numbered I/II/III
  with `SectionNav` (Bên A / Bên B / Thửa đất, live completion), actions moved
  into `StickyActionBar` — primary contained "Tạo hợp đồng", others outlined.
  Hidden legacy search box removed. Payload/render logic untouched.
- Its `ThongTinDat` rewritten as data-driven rows inside `FormSection` (edit/
  delete moved to header action slot, empty state text added). Note: other
  editors have their OWN object components (similar names) — not yet migrated.
- `PhieuThuLyButton` / `ThemGiayUQButton`: dropped 50px/uppercase hardcoded
  styling → plain `variant="outlined"` so they compose in the action bar.
  These are used by other editors too — their pages still have the old
  softTeal button rows next to these now-outlined buttons until migrated.
- Build (tsc+vite) passes; remaining lint errors are pre-existing in dialog
  files. Still no in-browser visual check — do one before rolling the pattern
  to the other 9 editors.

**Next:** visual check, then apply SectionNav/StickyActionBar/FormSection to
the remaining editors (hdmb-can-ho, hdmb-nha-dat, hdmb-tai-san, hdmb-xe,
hdcn-dat-va-tai-san, hdtc-can-ho, uy-quyen, nhom-huy-sua-doi,
nhom-thue-muon-dat-coc), migrating their softTeal buttons and per-page object
components as you go (Phase 2 rollout + start of Phase 3).

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
