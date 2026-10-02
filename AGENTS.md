# AGENTS.md

ClassFetch is a Manifest V3 browser extension (Chrome/Edge/Firefox). No build step, no `package.json`, no tests, no lint/typecheck — plain JS/CSS/HTML loaded directly by the browser.

## Layout

- `manifest.json` — MV3 manifest, version source of truth. Permissions: `activeTab`, `downloads`. Content script matches `https://classroom.google.com/*` only.
- `scripts/content.js` — content script. Answers `getDriveLinks` messages by scraping Google Classroom's DOM for `drive.google.com/file/d/` anchors.
- `scripts/popup.js` + `views/popup.html` — extension popup. Checks active tab is classroom.google.com, sends `getDriveLinks`, renders checkbox list, calls `chrome.downloads.download`.
- `styles/styles.css`, `icons/` — static assets.

## Gotchas

- **Fragile selectors**: `extractFileName` in `content.js` depends on Classroom's internal DOM structure (`div:nth-child(2) > div:nth-child(1)`). Classroom markup changes break name extraction silently — files with `name: null` are filtered out.
- **Only Google Drive files work**: Google Slides/Docs etc. are skipped by design; the drive link filter requires `/file/d/`.
- **Content script must be loaded**: after installing/updating the extension, the Classroom tab must be reloaded or `chrome.tabs.sendMessage` returns nothing. Popup shows "No Google Drive files found" in that case.
- Uses callback-style `chrome.*` APIs (MV3); keep consistent, no bundler/imports — files are plain scripts loaded via manifest/HTML `<script>` tags.
- To test changes: reload the extension at `chrome://extensions` and refresh the Classroom tab. There is no other verification tooling.

## Release

- Bump `version` in `manifest.json` manually.
- `.github/workflows/new-release.yml` (manual `workflow_dispatch`) zips exactly: `icons scripts styles views manifest.json`. **Any new file/directory needed at runtime must be added to the `cp -r` line** or releases will be missing it.
- Release tag/name come from the workflow's `version` input, which is not auto-checked against `manifest.json`.
