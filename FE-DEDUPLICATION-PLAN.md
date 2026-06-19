# Front-end De-duplication Refactor

## Context

This is a Vietnamese notary app (`front-end` React+TS+MUI+Formik, `tran-gia-be` Spring/Kotlin)
that generates `.docx` contracts from forms. While wiring the `hd-tang-cho-mot-phan-dat-co-cong-van`
template we hit the core pain: adding/changing one template requires editing the **same facts in
many places** (registry, routing switch, label switch, api fn, editor, model, dialog).

A codebase survey (3 Explore passes + 1 Plan pass) found:
- **Backend is already clean and data-driven** — single generic render pipeline (`TemplateService.render`,
  `sub__` includes), `PhieuThuLyService` already collapsed 20 templates → 1 + data, `AssetDescriptionService`
  shared. **Do not refactor the backend.**
- **Duplication lives almost entirely in the front-end.** Six concrete clusters (below).

Goal: cut FE duplication so future template work touches one place, without changing the legal
output of any existing document. Constraint: **no automated tests exist** and this is production —
every step verified by `npx tsc -b` plus targeted manual docx generation, committed per-file so each
change is bisectable/revertible. New abstractions land first; call sites migrate one at a time; old
code deleted last.

## The six duplication clusters (evidence)

1. **3 parallel registries, hand-synced** — root cause of the multi-place edit:
   `src/database/index.ts` (39 entries) · `src/pages/document-editor/index.tsx` (39-case switch →
   10 editors, props decoded by `/regex/.test(name)`) · `src/utils/common.ts` `getTemplateName()`
   (78-case name→label switch).
2. **7 copies of `them-thong-tin-dat.tsx`** (`src/pages/document-editor/*/dialogs/`, 220–1117 lines),
   60–70% identical MUI+Formik boilerplate; the verbose `<TextField … error/helperText>` pattern
   repeated 8–40×/file. No shared `FormikTextField`.
3. **7 context providers** (`src/context/*.tsx`) each redefine the **same 16 party add/edit/delete
   methods** — and these are **dead code**: editors + party dialogs read/mutate parties only via
   `useThemChuTheContext()` (verified). One copy (`hdmb-can-ho.tsx` `addCouplePartyAEntity`) has a bug.
4. **10 editor `index.tsx`** duplicate `getBenABenB()` / base-payload assembly /
   `handleGenerateDocument()` (~50–60%).
5. **5 variant `ThongTinThuaDat` interfaces** + 2 Party type defs. NOTE: the 5 are **not** identical —
   only the GCN/parcel core genuinely matches; `agreement-object.ts` and `hdmb-tai-san.ts` use a
   different field vocabulary.
6. **`src/api/index.ts`: 32 `render_*`** — 7 khai-thue fns ~70% identical (url + `-cm`/`-v2` suffix +
   `vpdkdd`); ~25 share an identical POST tail. `render_phieu_thu_ly(payload, name)` is already the
   parameterized model to follow.

---

## Phase 0 — Baseline (no code, ~30 min)
- New branch off `main`. `npx tsc -b` green.
- Write a throwaway script that runs the **current** routing regexes over all 39 `path`s and dumps the
  derived flags (`isTangCho/isMotPhan/isCoCongVan/isNongNghiep/isXeMay/isDauGia/scope/…`); save as the
  reference table for Phase 3c. Likewise capture every khai-thue URL string per flag combo for Phase 6.

## Phase 1 — `FormikTextField` / `FormikAutocomplete` (SAFE, high volume, ~1–1.5 d)
New: `src/components/common/formik-fields/{formik-text-field,formik-autocomplete,index}.tsx`.
```tsx
interface FormikTextFieldProps extends Omit<TextFieldProps,"name"|"value"|"error"|"helperText"> {
  formik: FormikProps<any>; name: string; label: string;
  onValueChange?: (value: string, formik: FormikProps<any>) => void; // derived siblings (số→chữ)
}
```
- Stop destructuring formik in each dialog; pass `formik` down. Validation schemas / submit / flag-gating
  stay. Only field JSX collapses. Derived-value `onChange`s (e.g. `numberToVietnamese`) port to `onValueChange`.
- Migrate simplest→hardest: can-ho → uy-quyen → tai-san → xe → hdtc-can-ho → nha-dat → dat-va-tsglvd →
  **last** `hdcn-quyen-sd-dat` (1117 lines; convert its plain fields only, **leave** the
  `mục_đích_và_thời_hạn_sử_dụng` add/edit/delete table as-is).
- Verify per file: `tsc -b`; open dialog, trigger a validation error, save, reopen → prefill intact.

## Phase 2 — `ThongTinThuaDat` base (SAFE, type-only, ~2–3 h)
New: `src/models/thua-dat-base.ts` with `GiayChungNhanCore` (số_thửa_đất, số_tờ_bản_đồ, loại_gcn, số_gcn,
số_vào_sổ_cấp_gcn, nơi_cấp_gcn, ngày_cấp_gcn) and `QuyenSuDungDatCore extends GiayChungNhanCore` (diện tích
+ mục đích/thời hạn/nguồn gốc/hình thức).
- `hdmb-can-ho.ts`: `extends QuyenSuDungDatCore` (exact). `uy-quyen.ts`: `extends GiayChungNhanCore`.
  `hdmb-nha-dat.ts` / `hdcn-dat-va-tsglvd.ts`: `extends QuyenSuDungDatCore` + extras.
- **Leave `agreement-object.ts` and `hdmb-tai-san.ts` alone** (different vocabulary / backend placeholders).
- Verify: `tsc -b` (near-total); quick generate nha-dat + dat-va-tsglvd.

## Phase 3 — Single data-driven registry (HIGH leverage; one behavior-changing step, ~1 d)
Extend `src/database/index.ts` in place (keep the `@/database` import path). Entry shape adds:
`displayName` (absorbs `getTemplateName`), `editor: EditorKind` (replaces the routing switch), and
explicit `flags: {…}` + `scope` (replaces every `/regex/.test(name)`). Add `getTemplate(path)` +
`byPath` map; `getTemplateName()` in `utils/common.ts` becomes a thin lookup re-export (all 3 import
sites keep working).
- **3a (safe):** move `displayName` in, re-export `getTemplateName`; spot-check labels.
- **3b (safe):** add `editor`+`flags` to all 39 entries (nothing consumes yet).
- **3c (BEHAVIOR-CHANGING):** rewrite `renderContent()` to `switch(entry.editor)` spreading `{...entry.flags}`,
  delete all regex. Pre-verify against the Phase-0 old-regex-vs-new-flags table for all 39 rows.
- Verify: `tsc -b`; smoke-test all 10 editor kinds + edge templates that drove the regex:
  `hd-tang-cho-mot-phan-dat-co-cong-van`, `hdcn-…-nong-nghiep-toan-bo`, `hdmb-xe-may` vs
  `hdmb-xe-oto-bien-so-xe`, all three `vb-*`, `hd-dat-coc-chua-xoa-chap`, each `mot-phan`/`dong-su-dung` pair.

## Phase 4 — Remove dead party state from per-document contexts (de-risked, ~0.5–1 d)
Finding: the 16 party methods in the 7 per-doc contexts are **defined but unused**.
- First confirm: grep each per-doc context's party methods for any external consumer (expect none;
  consumers use `useThemChuTheContext`).
- Then **delete** the duplicated `partyA/partyB` state + 16 methods from each per-doc context, keeping
  only doc-specific object state (`agreementObject`/`canHo`/`nhaDat`/`taiSan`). Trim each `ContextType`
  accordingly. Fix the `addCouplePartyAEntity` index bug in the surviving `them-chu-the` provider if present.
- If any context turns out to be genuinely consumed, fall back to a shared `useParties()` hook
  (`src/context/use-parties.ts`) implementing the 16 methods once and spreading into that provider.
- Verify: `tsc -b`; add/edit/delete cá nhân + vợ chồng on bên A and B in 2–3 editors; reload a saved
  contract from history and confirm parties hydrate.

## Phase 5 — `getBenABenB` / `buildBasePayload` editor helpers (MEDIUM risk — feeds legal docx, ~1.5–2 d)
Add to `src/utils/common.ts` (home of `extractCoupleFromParty`): `getBenABenB(partyA, partyB)` and
`buildBasePayload(meta)` (ngày/ngày_bằng_chữ, số_bản_gốc(+pad2)/bằng_chữ, số_bản_công_chứng/bằng_chữ,
ký_bên_ngoài, công_chứng_viên, template_id, số_hợp_đồng, isUchi, uchi_id, notary_id default "13",
template_name, id). Editors become
`{ ...getBenABenB(partyA,partyB), ...buildBasePayload(meta), ...docSpecificFields, original_payload }`.
- Keep the **khai-thue** party mapping separate (it calls `extractCoupleFromParty(party, true)`).
- Migrate one editor at a time, least-used first; for identical form input, diff
  `JSON.stringify(payload)` before/after AND generate a real docx and diff bytes/text vs `main`.

## Phase 6 — `api/index.ts` collapse (LOW–MEDIUM risk, ~0.5 d)
- **6a:** `postTemplate(url, payload) = api.post(url, convertEmptyStringsToNull(payload), {responseType:"blob"})`;
  apply to the ~25 identical tails (mechanical).
- **6b:** `renderKhaiThue(slug, payload, {isCM,isND373})` building `…/${slug}${isCM?'-cm':''}${isND373?'-v2':''}`
  + `vpdkdd`; the 7 khai-thue fns become 1-line wrappers (callers unchanged). Diff every URL string for
  every flag combo against the Phase-0 table.
- **Skip** the multi-flag URL builders (`render_hdmb_nha_dat`, `render_hdtc_*`) — branching differs per fn.
- Verify: `tsc -b`; generate one doc per khai-thue type incl. `-cm`/`-v2`; check the network route.

---

## Do NOT refactor (diminishing returns / high risk)
- Merging `agreement-object.ts` / `hdmb-tai-san.ts` `ThongTinThuaDat` into the base (different vocabulary
  + backend placeholders, near-zero reuse, high risk to legal output).
- The `mục_đích_và_thời_hạn_sử_dụng` add/edit/delete table in the hdcn-quyen-sd-dat dialog (bespoke, used once).
- api multi-flag URL builders; per-editor khai-thue payload bodies (field mappings genuinely differ).
- The backend — already data-driven.

## Verification cheatsheet
- Every phase ends `npx tsc -b` green; Phases 1–2 are essentially fully covered by `tsc`.
- Behavior-changing steps (3c, 4, 5, 6b): manual docx generation + payload/URL diff vs `main` for
  identical input — the generated-doc diff is the only safety net absent tests.
- Commit per file/editor.

## Critical files
- `src/database/index.ts` · `src/pages/document-editor/index.tsx` · `src/utils/common.ts`
- `src/context/them-chu-the.tsx` + the 7 `src/context/*.tsx` providers
- `src/api/index.ts` · `src/components/common/formik-fields/*` (new) · `src/models/thua-dat-base.ts` (new)
- 7× `src/pages/document-editor/*/dialogs/them-thong-tin-dat.tsx`

## Rough effort
~6–8 working days total if done sequentially. Phases are independent and shippable on their own;
Phase 3 (registry) gives the biggest "wire a new template in one place" payoff and can be done early
after Phase 1–2 if you want value fastest.
