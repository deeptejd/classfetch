---
layout: default
title: Privacy Policy
---

# Privacy Policy for ClassFetch

_Last updated: October 5, 2026_

ClassFetch is a free, open-source browser extension that downloads files attached to Google Classroom posts. This policy describes what data the extension handles.

## Data collection

ClassFetch does **not** collect, store, transmit, or sell any personal data. No analytics, tracking, telemetry, or remote servers are used. The extension has no backend.

## How the extension works

When you click the ClassFetch toolbar icon on a Google Classroom page, the extension:

1. Reads the links on the currently open Classroom page to find attached Google Drive files.
2. Lists those files in the extension popup.
3. When you choose to download, your browser downloads the selected files from Google Drive to your computer using the browser's normal download manager.

Everything happens locally in your browser. File names and links are held in memory only while the popup is open and are not written to disk, synced, or sent anywhere.

## Permissions

- **activeTab** — lets ClassFetch read the Google Classroom tab you are currently viewing, only when you click the extension icon.
- **downloads** — lets ClassFetch save the files you select, and report download success or failure.
- **Host access to classroom.google.com / drive.google.com** — needed to detect attachments on Classroom pages and to fetch Drive files for download. ClassFetch does not read your Google account data beyond the pages and files you explicitly choose to download.

## Third parties

ClassFetch does not share data with any third party. Downloads are served directly by Google Drive.

## Changes

Any changes to this policy will be posted in this repository alongside the extension release that introduces them.

## Contact

Questions or concerns: open an issue at https://github.com/deeptejd/classfetch/issues.