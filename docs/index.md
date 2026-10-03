ClassFetch is a free, open-source browser extension for Chrome, Edge, and Firefox. Open any Classroom stream or post, click the ClassFetch icon, and grab every Drive attachment at once.

<a href="https://github.com/deeptejd/classfetch/releases/latest" class="button"><small>Download</small> ClassFetch .zip</a>

## Features

- Lists Drive attachments from the current Classroom stream or post and downloads them in bulk
- Select individual files or grab everything listed
- Skips Drive folders / Docs links and tells you what was skipped
- Deduplicates the same file appearing multiple times on a page
- Reports per-file status: done, opened in a new tab, or failed (with the reason)
- Refresh button re-scans the page without reopening the popup

## Installation

### From a browser store

Install [ClassFetch on Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/classfetch/ffmompjmgnnleondhldhdmekfcbjjnii), or the Chrome Web Store / Firefox listing when available.

### From source

1. Clone this repository, or download a release zip from [Releases](https://github.com/deeptejd/classfetch/releases) and extract it.
2. Open your extensions page:
   - Chrome / Edge: `chrome://extensions`
   - Firefox: `about:debugging#/runtime/this-firefox`
3. **Chrome / Edge:** enable **Developer mode**, click **Load unpacked**, and select the folder containing `manifest.json`.
   **Firefox:** click **Load Temporary Add-on** and select `manifest.json`.
4. Reload any open Google Classroom tab. Re-run the add-on after every update.

## How to Use

![Demo](https://github.com/user-attachments/assets/9e8112b9-e25f-41d3-bf19-54f754e2c616)

1. Open a Google Classroom post or stream with Drive attachments, and scroll so the attachments load.
2. Click the ClassFetch toolbar icon. Files that ClassFetch can download are listed with checkboxes.
3. Check the files you want and click **Download Selected**, or click **Download All**.
4. The status line reports how many downloads started, fell back to a new tab, or failed — and why.
5. If more files loaded while scrolling, click **Refresh** to re-scan the page.

## FAQ

**My files aren't showing up, even though they're in the stream.**
Scroll the stream so the attachment actually renders, then press Refresh in the popup. ClassFetch only downloads real Google Drive file attachments — Google Slides/Docs links are skipped and counted as "skipped."

**A downloaded file was flagged as `.htm` rather than the real file.**
The file's owner disabled downloads for it. Ask them to allow it.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change. See the [README](https://github.com/deeptejd/classfetch#readme) for development notes.

## Privacy

See the [Privacy Policy](privacy-policy.md) — ClassFetch collects no data.
