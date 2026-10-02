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

- `manifest.json` is the single source of truth for the version; use SemVer (`MAJOR.MINOR.PATCH`). Bump it and add a `CHANGELOG.md` entry in the same commit.
- To release: `git commit` the version bump, then `git tag vX.Y.Z && git push origin main --tags`. Pushing a `v*` tag runs `.github/workflows/new-release.yml`, which validates the manifest, **fails if the tag doesn't match `manifest.json`'s version**, zips `icons scripts styles views manifest.json`, and creates the GitHub release.
- Any new runtime file/directory must be added to the `cp -r` line in the workflow or releases will miss it.
- History may contain tags (v1.0, v1.1, v1.4.1) that skipped versions — that's legacy; keep the tag/manifest pair consistent from v1.6.0 onward.
