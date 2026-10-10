ClassFetch is a free, open-source browser extension for Chrome, Edge, and Firefox. Open any Classroom stream or post, click the ClassFetch icon, and grab every Drive attachment at once.

## Why?
The goal was simple, to let users select multiple files and download them in one click instead of having to click on each file and downloading it one by one.

## How to install?
### From browser extension store
<p>
  <a href="https://chromewebstore.google.com/detail/classfetch/dbjklefiffdfemplccpoenafhnpimjil"><img height="48" alt="Available in the Chrome Web Store" src="assets/chrome-webstore.png" /></a>
  <a href="https://addons.mozilla.org/addon/classfetch/"><img height="48" alt="Get the Firefox add-on" src="assets/firefox-addons.png" /></a>
  <a href="https://microsoftedge.microsoft.com/addons/detail/classfetch/ffmompjmgnnleondhldhdmekfcbjjnii"><img height="48" alt="Get it from Microsoft Edge" src="assets/edge-extensions.png" /></a>
</p>

### From GitHub releases
1. Download the latest release from the [Releases page](https://github.com/deeptejd/classfetch/releases/latest). Get the `.zip` asset (not the source code!)
2. Unzip it somewhere permanent. Browsers load the extension from that folder, so don't delete or move it afterwards. The folder you load must be the one that directly contains `manifest.json`
3. Follow the steps for your browser:

**Chrome**
1. Open `chrome://extensions`
2. Turn on **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the unzipped folder

**Edge**
1. Open `edge://extensions`
2. Turn on **Developer mode** (left sidebar toggle)
3. Click **Load unpacked** and select the unzipped folder

**Brave**
1. Open `brave://extensions`
2. Turn on **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the unzipped folder

**Firefox**
1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select the `manifest.json` file inside the unzipped folder

> Firefox removes temporary add-ons when the browser closes, so you'll need to load it again after each restart

**After installing or updating**
- Reload any open Google Classroom tab so the extension is picked up
- To update, download the new release, replace the old folder's contents, then click the **reload** icon on the extension's card (Chrome/Edge/Brave) or **Reload** (Firefox) on the same extensions page

## How to use?
1. Open a Google Classroom post or stream with Drive attachments, and scroll so the attachments load
2. Click the ClassFetch toolbar icon. Files that ClassFetch can download are listed with checkboxes
3. Check the files you want and click **Download Selected**, or click **Download All**

<img alt="Screenshot showing a file from Google Classroom listed in the extension" src="assets/screenshot.png" />

## FAQ
**My files aren't showing up, even though they're in the stream.**
Scroll the stream so the attachment actually renders, then press Refresh in the popup. ClassFetch only downloads real Google Drive file attachments — Google Slides/Docs links are skipped and counted as "skipped."

**A downloaded file was flagged as `.htm` rather than the real file.**
The file's owner disabled downloads for it. Ask them to allow it.

## Privacy
See the [Privacy Policy](privacy-policy.md) — ClassFetch collects no data.
