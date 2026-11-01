function getFileId(driveLink) {
    const fileIdMatch = driveLink.match(/\/file\/d\/([^/?#]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
}

function getAuthUser() {
    const pathMatch = window.location.pathname.match(/\/u\/(\d+)/);
    if (pathMatch) return pathMatch[1];
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('authuser') || null;
}

function getDirectDownloadLink(driveLink) {
    const fileId = getFileId(driveLink);
    if (fileId) {
        const authUser = getAuthUser();
        const authParam = authUser !== null ? `&authuser=${authUser}` : '';
        return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t${authParam}`;
    }
    return null;
}

function extractFileName(anchor) {
    // Most reliable first: explicit attributes/fields Classroom may expose
    const dataName = anchor.getAttribute('data-filename');
    if (dataName && dataName.trim()) return dataName.trim();

    const secondDiv = anchor.querySelector('div:nth-child(2)');
    if (secondDiv) {
        const firstDivInsideSecondDiv = secondDiv.querySelector('div:nth-child(1)');
        if (firstDivInsideSecondDiv && firstDivInsideSecondDiv.textContent.trim()) {
            return firstDivInsideSecondDiv.textContent.trim();
        }
    }
    // Fallbacks: aria-label, title, first non-empty descendant div, visible text
    const aria = anchor.getAttribute('aria-label');
    if (aria && aria.trim()) return aria.trim();
    if (anchor.title && anchor.title.trim()) return anchor.title.trim();
    const descendantDivs = Array.from(anchor.querySelectorAll('div'));
    const firstWithText = descendantDivs.find(d => d.children.length === 0 && d.textContent.trim());
    if (firstWithText) return firstWithText.textContent.trim();
    if (anchor.textContent && anchor.textContent.trim()) return anchor.textContent.trim();
    console.warn('[ClassFetch] Could not extract file name for', anchor.href);
    return null;
}

extAPI.onMessage((request) => {
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

        return { files: driveFiles, skipped: skipped };
    }
});
