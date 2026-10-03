ClassFetch is a free, open-source browser extension for Chrome, Edge, and Firefox. Open any Classroom stream or post, click the ClassFetch icon, and grab every Drive attachment at once.

[View on GitHub](https://github.com/deeptejd/classfetch) · [Latest Release](https://github.com/deeptejd/classfetch/releases)

<style>
.btn {
  display: inline-block;
  padding: 6px 14px;
  margin: 4px 4px 4px 0;
  border: 1px solid #dfe2e5;
  border-radius: 4px;
  color: #333 !important;
  text-decoration: none !important;
  background: #fafbfc;
  font-size: 14px;
  line-height: 20px;
}
.btn:hover { background: #eff1f3; }
.btn svg { vertical-align: -3px; margin-right: 6px; }
</style>

<a class="btn" href="https://github.com/deeptejd/classfetch/releases/latest">⬇ Download ClassFetch (.zip)</a>

## Available on

<a class="btn" href="#">
<svg width="16" height="16" viewBox="0 0 24 24" fill="#0078D7"><path d="M21.86 17.86q.14 0 .25.12.1.13.1.25t-.11.33l-.32.46-.43.53-.44.5q-.21.25-.38.42l-.22.23q-.58.53-1.34 1.04-.76.51-1.6.91-.86.4-1.74.64t-1.67.24q-.9 0-1.69-.28-.8-.28-1.48-.78-.68-.5-1.22-1.17-.53-.66-.92-1.44-.38-.77-.58-1.6-.2-.83-.2-1.67 0-1 .32-1.96.33-.97.87-1.8.14.95.55 1.77.41.82 1.02 1.5.6.68 1.38 1.21.78.54 1.64.9.86.36 1.77.56.92.2 1.8.2 1.12 0 2.18-.24 1.06-.23 2.06-.72l.2-.1.2-.05zm-15.5-1.27q0 1.1.27 2.15.27 1.06.78 2.03.51.96 1.24 1.77.74.82 1.66 1.4-1.47-.2-2.8-.74-1.33-.55-2.48-1.37-1.15-.83-2.08-1.9-.92-1.07-1.58-2.33T.36 14.94Q0 13.54 0 12.06q0-.81.32-1.49.31-.68.83-1.23.53-.55 1.2-.96.66-.4 1.35-.66.74-.27 1.5-.39.78-.12 1.55-.12.7 0 1.42.1.72.12 1.4.35.68.23 1.32.57.63.35 1.16.83-.35 0-.7.07-.33.07-.65.23v-.02q-.63.28-1.2.74-.57.46-1.05 1.04-.48.58-.87 1.26-.38.67-.65 1.39-.27.71-.42 1.44-.15.72-.15 1.38zM11.96.06q1.7 0 3.33.39 1.63.38 3.07 1.15 1.43.77 2.62 1.93 1.18 1.16 1.98 2.7.49.94.76 1.96.28 1 .28 2.08 0 .89-.23 1.7-.24.8-.69 1.48-.45.68-1.1 1.22-.64.53-1.45.88-.54.24-1.11.36-.58.13-1.16.13-.42 0-.97-.03-.54-.03-1.1-.12-.55-.1-1.05-.28-.5-.19-.84-.5-.12-.09-.23-.24-.1-.16-.1-.33 0-.15.16-.35.16-.2.35-.5.2-.28.36-.68.16-.4.16-.95 0-1.06-.4-1.96-.4-.91-1.06-1.64-.66-.74-1.52-1.28-.86-.55-1.79-.89-.84-.3-1.72-.44-.87-.14-1.76-.14-1.55 0-3.06.45T.94 7.55q.71-1.74 1.81-3.13 1.1-1.38 2.52-2.35Q6.68 1.1 8.37.58q1.7-.52 3.58-.52Z"/></svg>
Microsoft Edge Add-ons</a>
<a class="btn" href="#">
<svg width="16" height="16" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728Z"/></svg>
Chrome Web Store</a>

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

> **Notes**
> - Only real Drive file attachments are downloadable. Google Slides, native Docs/Sheets links, and folders are skipped (ClassFetch tells you how many) — export those manually from Drive.
> - If a file's owner has disabled downloading, ClassFetch reports it instead of saving a junk file.

## FAQ

**My files aren't showing up, even though they're in the stream.**
Scroll the stream so the attachment actually renders, then press Refresh in the popup. ClassFetch only downloads real Google Drive file attachments — Google Slides/Docs links are skipped and counted as "skipped."

**A downloaded file was flagged as `.htm` rather than the real file.**
The file's owner disabled downloads for it. Ask them to allow it.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change. See the [README](https://github.com/deeptejd/classfetch#readme) for development notes.
