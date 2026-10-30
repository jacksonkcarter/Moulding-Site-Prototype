# Agent instructions

**Before writing or changing code in this project, always read the latest documentation that is relevant to the task.**

- Check this file (AGENTS.md) and any project-specific docs (e.g. README, CONTRIBUTING) for conventions and setup.
- For Next.js, Tailwind, or TypeScript behavior, refer to the official docs or in-repo config (e.g. `tsconfig.json`, `next.config.ts`, Tailwind config) so changes stay consistent with the stack and existing patterns.
- For images inside browse/product tiles, use `TileImage` (`src/components/TileImage.tsx`) so artwork sits on a white background. Column counts and other layout choices stay page-specific.
- After changing `Project_Info/All-Profiles.xlsx` or Profile-Browser drawings, run `npm run generate-profiles` to refresh `src/data/profiles.ts` and `src/data/profile-moulding-types.ts`.
- After changing folders or images under `Project_Info/Accessories`, run `npm run generate-accessories` to refresh `src/data/accessories.ts` and `public/accessories`.
- After changing `Project_Info/Gallery/gallery-media.xlsx` or files under `Project_Info/Gallery` category folders, run `npm run generate-gallery` to refresh `src/data/gallery-applications.ts` and `public/gallery`. Use `npm run generate-gallery -- --merge` to append new folder files into the spreadsheet.
- When asked to shrink/grow spacing or size by a physical amount (e.g. inches), compute the result yourself and write a single resolved value in code (e.g. `81vh`, `mt-3.5`). Do not leave `calc()` equations for arithmetic you can resolve. Keep `calc()` only when mixed live units are required (e.g. `%` + `px`, `100vh` − CSS variables, `100vw` − padding).
- PowerPoint (`Project_Info/Flex-Trim-Product-Process-Review.pptx`): treat the file on disk as source of truth. The user may have edited it. For updates, open the existing `.pptx` and patch in place — never full-regenerate via `scripts/build-product-process-pptx.py` unless they explicitly ask for a rebuild from the script.
