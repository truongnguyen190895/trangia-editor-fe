# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` – start the Vite dev server (uses `VITE_BASE_API_URL` from `.env`; default points to `http://localhost:8080`)
- `pnpm build` – type-check with `tsc -b` then build with Vite
- `pnpm lint` – run ESLint over the project
- `pnpm preview` – serve the production build locally

No test runner is configured.

## Domain

This is the front-end for **Công chứng Trần Gia**, a Vietnamese notary office. The app collects form data and POSTs it to a backend that returns rendered `.docx` files as blobs (always `responseType: "blob"`). Document slugs are Vietnamese kebab-case abbreviations; the same naming convention is shared with the backend route paths, so do not rename slugs unilaterally.

Common slug prefixes:

- `hdmb-*` – hợp đồng mua bán (sale contract: căn hộ/nhà đất/xe/tài sản)
- `hdcn-*` – hợp đồng chuyển nhượng (transfer of land-use rights)
- `hd-tang-cho-*` / `hdtc-*` / `nhom-tang-cho` – tặng cho (gift contracts)
- `uy-quyen-*` / `nhom-uy-quyen` – ủy quyền (power of attorney)
- `khai-thue-*` – tax declarations
- `vb-huy`, `vb-cham-dut-*` – cancellation/termination documents (`nhom-huy-sua-doi`)
- `hd-dat-coc*` – deposit contract
- `ptl-*` – phiếu thụ lý (intake receipts, generated via `render_phieu_thu_ly`)

Suffix variants encode the scope of the asset being transferred and the buyer's ownership outcome:

- `-toan-bo` – whole asset
- `-mot-phan-de-dong-su-dung` – partial → buyer becomes co-owner (`scope: "partial"`)
- `-mot-phan-de-su-dung-toan-bo` / `-mot-phan-so-huu-toan-bo` – partial → buyer becomes sole owner (`scope: "full"`)
- `-nong-nghiep` – agricultural land variant
- `-cm`, `-v2` (with `isND373` flag) – alternate tax declaration formats

`DocumentEditor` in [src/pages/document-editor/index.tsx](src/pages/document-editor/index.tsx) dispatches on the `name` query param using `switch` + regex tests on these substrings to pick the right provider + editor and to compute boolean props (`isMotPhan`, `isTangCho`, `isUyQuyen`, `isNongNghiep`, etc.). When adding a new document slug, extend this switch and update [src/api/index.ts](src/api/index.ts) with the matching `render_*` function.

## Architecture

**Stack:** React 19 + TypeScript + Vite 7, MUI v7 (`@mui/material` + `@mui/x-date-pickers` on dayjs), Formik + Yup for forms, axios, react-router-dom v6.

**Routing.** A single `createBrowserRouter` in [src/router/index.tsx](src/router/index.tsx). All authenticated routes are children of `<Layout />`, which redirects to `/login` if `username`/`access_token` is missing in localStorage. `/login`, `*` are top-level. SPA fallback is handled by `vercel.json`. The main editing flow is:

```
/  (ChooseDocument)
  → /van-ban/:category
    → /van-ban/:category/:subCategory
      → /editor?name=<slug>&id=<workHistoryId?>   (DocumentEditor)
```

`/editor` is wrapped in `<ThemChuTheProvider>` so party-A/party-B participants survive across the various per-template forms.

**API layer.** A single axios instance is created in [src/api/index.ts](src/api/index.ts):
- baseURL from `VITE_BASE_API_URL`
- request interceptor injects `Authorization: Bearer <access_token>` from localStorage
- response interceptor: on 401, clears localStorage, `alert`s the user, and redirects to `/login`

Most write/render endpoints run their payload through `convertEmptyStringsToNull` ([src/utils/common.ts](src/utils/common.ts)) before sending — keep this convention so the backend's nullable-field handling works. Tax-declaration endpoints additionally derive `vpdkdd` (chi nhánh văn phòng đăng ký đất) via `getChiNhanhVanPhongDangKyDat(payload.phường)` from [src/utils/extract-address.ts](src/utils/extract-address.ts) and merge it into the payload.

**State.** No global store. Each document type has its own React Context provider in [src/context/](src/context/) (`HdcnQuyenSdDatProvider`, `HDMBCanHoProvider`, `HDMBNhaDatProvider`, `HDMBTaiSanProvider`, `HDDatCocProvider`, `HDMBXeProvider`, `HDCNDatVaTaiSanGanLienVoiDatToanBoProvider`) that holds form scratch state for that template's editor. `ThemChuTheProvider` is shared across all editors and manages two `AgreementParty` records (`cá_nhân`/individuals and `vợ_chồng`/couples) for party A and party B. Auth/user state lives in `localStorage` (`access_token`, `username`, `user_info`).

**Models.** TypeScript payload/entity types per document family live in [src/models/](src/models/). The `render_*` functions in [src/api/index.ts](src/api/index.ts) are the source of truth for which payload shape maps to which backend route.

**Build-time constant.** `vite.config.ts` defines `__BUILD_TIME__` (ISO string at build). It is read in [src/components/layout/index.tsx](src/components/layout/index.tsx) to show the build timestamp in the footer. Declare with `declare const __BUILD_TIME__: string;` when used elsewhere.

**Path aliases.** Configured in both `vite.config.ts` and `tsconfig.app.json` — keep them in sync:

- `@/*` → `src/*`
- `@components/*`, `@pages/*`, `@models/*`, `@router/*`, `@assets/*`, `@theme/*`

**Language.** Identifiers, field names, and many constants are written in Vietnamese, including with diacritics (e.g. `cá_nhân`, `vợ_chồng`, `phường`, `số_cc`). Do not transliterate or rename without checking backend payload contracts — these keys are wire-format.
