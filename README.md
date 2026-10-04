# ClassFetch

[![Edge Add-on](https://img.shields.io/badge/Edge%20Add--on-ClassFetch-blue?logo=microsoftedge&logoColor=white&style=plastic)](https://microsoftedge.microsoft.com/addons/detail/classfetch/ffmompjmgnnleondhldhdmekfcbjjnii) [![GitHub Release](https://img.shields.io/github/v/release/deeptejd/classfetch?style=plastic)](https://github.com/deeptejd/classfetch/releases)

Bulk-download Google Drive attachments from Google Classroom posts in one click — no more opening each file by hand.

## Features

- Lists Drive attachments from the current Classroom stream or post and downloads them in bulk
- Select individual files or grab everything listed
- Skips Drive folders / Docs links and tells you what was skipped
- Deduplicates the same file appearing multiple times on a page
- Reports per-file status: done, opened in a new tab, or failed (with the reason)
- Refresh button re-scans the page without reopening the popup

## Installation

**From a store:** install [ClassFetch on Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/classfetch/ffmompjmgnnleondhldhdmekfcbjjnii), or the Chrome Web Store / Firefox listing when available.

**From source:**

1. Clone this repository (or download a release zip and extract it).
2. Open the extensions page:
   - Chrome/Edge: `chrome://extensions`
   - Firefox: `about:debugging#/runtime/this-firefox`
3. Chrome/Edge: enable **Developer mode**, click **Load unpacked**, and select the repository root (the folder containing `manifest.json`).
   Firefox: click **Load Temporary Add-on** and select `manifest.json`.
4. Reload any open Google Classroom tab, and re-run the add-on after every update.

## Usage

![Demo Screenshot](https://github.com/user-attachments/assets/9e8112b9-e25f-41d3-bf19-54f754e2c616)

1. Open a Google Classroom post or stream with Drive attachments, and scroll so the attachments load.
2. Click the ClassFetch toolbar icon. Files that ClassFetch can download are listed with checkboxes.
3. Check the files you want and click **Download Selected**, or click **Download All**.
4. The status line at the bottom reports how many downloads started, fell back to a new tab, or failed — and why.
5. If more files loaded while scrolling, click **Refresh** to re-scan the page.

Notes:
- Only real Drive file attachments are downloadable. Google Slides, native Docs/Sheets links, and folders are skipped (ClassFetch tells you how many) — export those manually from Drive.
- If a file's owner has disabled downloading, ClassFetch reports it instead of saving a junk file.

## Development

No build step: it's a plain MV3 extension (`manifest.json`, `scripts/`, `views/`, `styles/`, `icons/`). Edit files, reload the extension at the browser's extensions page, and refresh the Classroom tab.

- `scripts/content.js` — runs on `classroom.google.com`, scrapes Drive attachments
- `scripts/popup.js` + `views/popup.html` — toolbar popup UI
- `scripts/ext-api.js` — Firefox/Chrome API shim
- See `AGENTS.md` for repo conventions and gotchas.

## FAQ

**My files aren't showing up, even though they're in the stream.**
Scroll the stream so the attachment actually renders, then press Refresh in the popup. ClassFetch only downloads real Google Drive file attachments — Google Slides/Docs links are skipped and counted as "skipped."

**A downloaded file was flagged as `.htm` rather than the real file.**
The file's owner disabled downloads for it. Ask them to allow it.

## Releasing (maintainers)

1. Bump `version` in `manifest.json` (SemVer) and add a `CHANGELOG.md` entry. Commit both.
2. `git tag vX.Y.Z && git push origin main --tags`
3. Pushing the tag builds the zip and creates the GitHub release automatically. If it fails with "version does not match," fix the manifest and re-tag.

## License

[MIT](LICENSE)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.
