function getFileId(driveLink) {
    const fileIdMatch = driveLink.match(/\/file\/d\/([^/?#]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
}

function getDirectDownloadLink(driveLink) {
    const fileId = getFileId(driveLink);
    if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
    }
    return null;
}

function extractFileName(anchor) {
    const secondDiv = anchor.querySelector('div:nth-child(2)');
    if (secondDiv) {
        const firstDivInsideSecondDiv = secondDiv.querySelector('div:nth-child(1)');
        if (firstDivInsideSecondDiv && firstDivInsideSecondDiv.textContent.trim()) {
            return firstDivInsideSecondDiv.textContent.trim();
        }
    }
    // Fallbacks: aria-label, title, visible text of the anchor
    const aria = anchor.getAttribute('aria-label');
    if (aria && aria.trim()) return aria.trim();
    if (anchor.title && anchor.title.trim()) return anchor.title.trim();
    if (anchor.textContent && anchor.textContent.trim()) return anchor.textContent.trim();
    console.warn('[ClassFetch] Could not extract file name for', anchor.href);
    return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getDriveLinks") {
        const seen = new Set();
        const anchors = Array.from(document.querySelectorAll('a'));
        const skipped = anchors.filter(a =>
            (a.href.includes('drive.google.com') && !a.href.includes('drive.google.com/file/d/')) ||
            a.href.includes('docs.google.com')
        ).length;
        const driveFiles = anchors
            .filter(a => a.href.includes("drive.google.com/file/d/"))
            .map(a => {
                const fileName = extractFileName(a);
                const fileLink = getDirectDownloadLink(a.href);
                return { name: fileName, link: fileLink, id: getFileId(a.href) };
            })
            .filter(file => file.link !== null && file.name !== null && file.id !== null)
            .filter(file => {
                if (seen.has(file.id)) return false;
                seen.add(file.id);
                return true;
            })
            .map(({ name, link }) => ({ name, link }));

        sendResponse({ files: driveFiles, skipped: skipped });
    }
});
