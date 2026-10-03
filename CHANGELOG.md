# Changelog

All notable changes to this project are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/), versioning follows [SemVer](https://semver.org/). `manifest.json` is the single source of truth for the version; release tags are `vX.Y.Z`.

## [1.6.1]

### Added
- Refresh button: re-scan the page without reopening the popup (Classroom virtualizes its stream, so newly scrolled-in attachments are picked up).
- Per-file download state markers in the popup (pending / done / opened in tab / failed).
- Report of skipped non-Drive attachments (e.g. Google Docs links) that can't be downloaded.
- Cross-browser shim (`scripts/ext-api.js`) so the same code uses promise-based `browser.*` on Firefox and `chrome.*` on Chrome/Edge.
- `action.default_title` in the manifest.

### Fixed
- File-ID extraction no longer rejects URLs without a trailing slash.
- Duplicate listings of the same Drive file (stream, thumbnail, preview) are deduplicated.
- File name extraction has aria-label/title/leaf-div fallbacks instead of silently dropping files.
- Large-file downloads no longer save Drive's "can't scan" page as an `.htm` file (`confirm=t`).
- Successfully "downloaded" but actually `.htm` permission-error pages are now reported as failures.
- Download failures now surface in the popup (with the real error), and fall back to opening the file in a new tab.
- Popup no longer crashes on `chrome://` tabs or unloaded tabs, and distinguishes "content script not injected" from "no files found".
- Errors during failed downloads no longer wipe the popup body; they render in a status line.
- Download buttons are disabled until files exist; empty selections are reported.

### Changed
- Popup UI: quieter palette, single accent color, sharper corners, slimmer header (Product Hunt badge removed).
- Release workflow is triggered by pushing a `v*` tag and refuses to publish if the tag doesn't match `manifest.json`'s version.
- Release zip now puts `manifest.json` at the root so it can be uploaded to Chrome/Edge/Firefox stores directly (previously nested under a `classfetch/` folder).
- Reworked README: accurate features/usage, per-browser install steps, development and FAQ sections.

### Version note

`1.6.0` was kept local only and folded into `1.6.1`; the public version history jumps from `1.5.1` to `1.6.1`.

## [1.5.1] and earlier

Predates this changelog; see git history and the GitHub release notes.
