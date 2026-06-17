function getDirectDownloadLink(driveLink) {
    const fileIdMatch = driveLink.match(/\/file\/d\/(.*?)\//);
    if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return null;
}

function cleanFileName(fileName) {
    if (!fileName) return null;
    
    // Trim whitespace first
    let cleaned = fileName.trim();
    
    // Remove common prefixes with flexible separators (spaces, colons, commas, hyphens)
    cleaned = cleaned.replace(/^(Attachment[\s:,\-]*|PDF[\s:,\-]*|Word Document[\s:,\-]*|Microsoft Word[\s:,\-]*|Microsoft Excel[\s:,\-]*|Microsoft PowerPoint[\s:,\-]*|Google Docs[\s:,\-]*|Google Sheets[\s:,\-]*|Google Slides[\s:,\-]*|Document[\s:,\-]*|Spreadsheet[\s:,\-]*|Presentation[\s:,\-]*)+/gi, '');
    
    // Trim again after removing prefixes
    cleaned = cleaned.trim();
    
    // Replace spaces with underscores
    cleaned = cleaned.replace(/\s+/g, '_');
    
    // Remove any invalid filename characters
    cleaned = cleaned.replace(/[<>:"\/\\|?*]/g, '');
    
    // Ensure we still have a file extension
    if (!cleaned.includes('.')) {
        return null;
    }
    
    return cleaned;
}

function extractFileName(anchor) {
    // Try multiple selector strategies to find the actual filename
    
    // Strategy 1: Look for aria-label which often contains the full filename
    const ariaLabel = anchor.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim() && ariaLabel.includes('.')) {
        return ariaLabel.trim();
    }
    
    // Strategy 2: Look for title attribute
    const title = anchor.getAttribute('title');
    if (title && title.trim() && title.includes('.')) {
        return title.trim();
    }
    
    // Strategy 3: Search all descendant divs for filename with extension
    const allDivs = anchor.querySelectorAll('div');
    for (const div of allDivs) {
        const text = div.textContent.trim();
        // Check if text contains a file extension
        if (text && /\.[a-zA-Z0-9]{2,5}$/.test(text)) {
            return text;
        }
    }
    
    // Strategy 4: Try specific Google Classroom selectors
    const secondDiv = anchor.querySelector('div:nth-child(2)');
    if (secondDiv) {
        const firstDivInsideSecondDiv = secondDiv.querySelector('div:nth-child(1)');
        if (firstDivInsideSecondDiv) {
            const text = firstDivInsideSecondDiv.textContent.trim();
            if (text && text.length > 0 && /\.[a-zA-Z0-9]{2,5}$/.test(text)) {
                return text;
            }
        }
    }
    
    // Strategy 5: Look in parent container for filename
    const parent = anchor.closest('[data-item-id]') || anchor.closest('div[role="listitem"]');
    if (parent) {
        const allText = parent.textContent;
        const matches = allText.match(/([^\\/:"*?<>|]+\.[a-zA-Z0-9]{2,5})/g);
        if (matches && matches.length > 0) {
            // Return the first match that looks like a real filename
            for (const match of matches) {
                const cleaned = match.trim();
                if (cleaned.length > 3) {  // Minimum filename.ext length
                    return cleaned;
                }
            }
        }
    }
    
    return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getDriveLinks") {
        const driveFiles = Array.from(document.querySelectorAll('a'))
            .filter(a => a.href.includes("drive.google.com/file/d/"))
            .map(a => {
                let fileName = extractFileName(a);
                const fileLink = getDirectDownloadLink(a.href);
                
                // Clean the filename
                fileName = cleanFileName(fileName);
                
                // If we still don't have a filename with extension, use file ID as fallback
                if (!fileName || !fileName.includes('.')) {
                    const fileIdMatch = a.href.match(/\/file\/d\/(.*?)\//);
                    if (fileIdMatch) {
                        fileName = `download_${fileIdMatch[1]}.file`;
                    }
                }
                
                console.log('Extracted:', { fileName, fileLink }); // Debug logging
                
                return { name: fileName, link: fileLink };
            })
            .filter(file => file.link !== null && file.name !== null);

        console.log('Total files found:', driveFiles.length); // Debug logging
        sendResponse({ files: driveFiles });
    }
});
