![Promo Title Edge Large (1)](https://github.com/user-attachments/assets/9ea407c4-3a69-4b30-b242-d5b58e0070b9)
[![Edge Add-on](https://img.shields.io/badge/Edge%20Add--on-ClassFetch-blue?logo=microsoftedge&logoColor=white&style=plastic)](https://microsoftedge.microsoft.com/addons/detail/classfetch/ffmompjmgnnleondhldhdmekfcbjjnii) [![Product Hunt](https://img.shields.io/badge/Product%20Hunt-ClassFetch-ff3c00?logo=product-hunt&logoColor=white&style=plastic)](https://www.producthunt.com/posts/classfetch) [![GitHub Release](https://img.shields.io/github/v/release/deeptejd/classfetch?style=plastic)](https://github.com/deeptejd/classfetch/releases)



#### Download all your Google Classroom files in one click! This browser extension lets you bulk download attachments from assignments and posts, saving you from the hassle of opening each file manually or relying on tedious hacks. 'Fast, simple, efficient'.

## Features

- Download all the drive files in a Google Classroom announcement
- Select multiple files to be downloaded at once

## Installation

1. Download or clone this repository.
2. Open the Extension Management page by navigating to `chrome://extensions`
   - Alternatively, open this page by clicking on the Extensions menu button and selecting Manage Extensions at the bottom of the menu
   - Alternatively, open this page by clicking on the Chrome menu, hovering over More Tools then selecting Extensions
3. Enable Developer Mode by clicking the toggle switch next to Developer mode
4. Click the Load unpacked button and select the extension directory
   Note: Remember to select the root folder, and reload the classroom website if it is open in the background
5. Pin the extension for easier access

## Usage

![Demo Screenshot](https://github.com/user-attachments/assets/9e8112b9-e25f-41d3-bf19-54f754e2c616)

1. Open the Google Classroom announcement where your teacher has attached multiple files
2. While this page is open, click on the 'ClassFetch' exntension. Your files should now be listed along with a checkbox on the left
3. Select the files that you want to download and click the 'Download Selected' button. (This might take a while depending on the size of the files)
4. Alternatively, select the 'Download All' button to download all the files that are currently being listed
> Scroll down for FAQs (Common issue: Downloading ```.htm``` files)

## Releasing (maintainers)

1. Bump `version` in `manifest.json` (SemVer) and add a `CHANGELOG.md` entry. Commit both.
2. `git tag vX.Y.Z && git push origin main --tags`
3. Pushing the tag builds the zip and creates the GitHub release automatically. If it fails with "version does not match", fix the manifest and re-tag.

## Contributing

Pull requests are welcome, there's so much that could be added to make this extension better for everyone! For major changes, please open an issue first to discuss what you would like to change.

## FAQ
### 1. My files arent showing up in the extension even if they are clearly visible in the classroom stream
If this happens, try refreshing your classroom page. If the files still don't show up then check if they are indeed google drive files. This extension only works with google drive files for now, which means google slides or other files will not show up. This will be added in a future release so keep an eye out for a new release.

### 2. The extension downloads ```.htm``` files instead of the actual files, and says ```No permissions```
This happens when the owner of the file (likely your prof) manually unchecked the permission that allows you to download the files. Talk to the owner of the file and ask them to enable download permissions. See [this issue response](https://github.com/DeeptejD/ClassFetch/issues/1#issuecomment-3014991188) for a detailed explanation on how to do just that.
