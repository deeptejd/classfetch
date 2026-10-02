const fileList = document.getElementById('fileList');
const statusEl = document.getElementById('status');
const downloadSelectedBtn = document.getElementById('downloadSelected');
const downloadAllBtn = document.getElementById('downloadAll');

function setStatus(message) {
    statusEl.textContent = message;
}

function setButtonsEnabled(enabled) {
    downloadSelectedBtn.disabled = !enabled;
    downloadAllBtn.disabled = !enabled;
}

function buildStatus(started, openedTab, failed, reason) {
    const parts = [];
    if (started > 0) parts.push(`Started ${started} download(s)`);
    if (openedTab > 0) parts.push(`opened ${openedTab} in a new tab`);
    if (failed > 0) parts.push(`${failed} failed${reason ? ' (' + reason + ')' : ''}`);
    return parts.length > 0 ? parts.join('; ') + '.' : 'Nothing happened.';
}

setButtonsEnabled(false);

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs && tabs[0];
    if (!currentTab || !currentTab.url || !currentTab.url.startsWith('https://classroom.google.com/')) {
        statusEl.textContent = 'This extension only works on Google Classroom. (For now)';
        return;
    }
    chrome.tabs.sendMessage(currentTab.id, { action: "getDriveLinks" }, function (response) {
        if (chrome.runtime.lastError) {
            setStatus('Could not reach the Classroom page. Refresh the tab, then reopen ClassFetch.');
            return;
        }
        if (response && Array.isArray(response.files) && response.files.length > 0) {
            const seenLinks = new Set();
            const files = response.files.filter(f => {
                if (!f || !f.link || !f.name || seenLinks.has(f.link)) return false;
                seenLinks.add(f.link);
                return true;
            });

            if (files.length === 0) {
                fileList.textContent = 'No Google Drive files found. Scroll the stream so attachments load, refresh the page, then reopen this popup.';
                return;
            }

            files.forEach(file => {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';

                const text = document.createElement('span');
                text.textContent = file.name;

                li.appendChild(checkbox);
                li.appendChild(text);
                li.dataset.link = file.link;
                li.dataset.name = file.name;
                fileList.appendChild(li);

                li.addEventListener('click', function (event) {
                    if (event.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                    }
                });
            });

            setButtonsEnabled(true);
            if (response.skipped > 0) {
                setStatus(`Found ${files.length} file(s); skipped ${response.skipped} non-Drive attachment(s).`);
            }

            function downloadFile(link, name, onDone) {
                chrome.downloads.download({ url: link, filename: name }, function (downloadId) {
                    const err = chrome.runtime.lastError;
                    if (err || downloadId === undefined) {
                        const reason = err ? err.message : 'unknown error';
                        console.warn('[ClassFetch] chrome.downloads failed for', name, ':', reason, '— opening in a new tab instead.');
                        chrome.tabs.create({ url: link }, function () {
                            if (chrome.runtime.lastError) {
                                onDone(false, name, reason);
                            } else {
                                onDone(true, name, reason);
                            }
                        });
                    } else {
                        onDone(true, name, null);
                    }
                });
            }

            downloadSelectedBtn.addEventListener('click', function () {
                const selected = Array.from(fileList.children)
                    .filter(li => li.querySelector('input[type="checkbox"]').checked)
                    .map(li => ({ link: li.dataset.link, name: li.dataset.name }));
                if (selected.length === 0) {
                    setStatus('No files selected.');
                    return;
                }
                let failed = 0;
                let fallback = 0;
                let done = 0;
                let firstReason = null;
                selected.forEach(f => downloadFile(f.link, f.name, function (ok, name, reason) {
                    done++;
                    if (!ok) failed++;
                    else if (reason) { fallback++; if (!firstReason) firstReason = reason; }
                    if (done === selected.length) {
                        setStatus(buildStatus(selected.length - failed - fallback, fallback, failed, firstReason));
                    }
                }));
            });

            downloadAllBtn.addEventListener('click', function () {
                let failed = 0;
                let fallback = 0;
                let done = 0;
                let firstReason = null;
                files.forEach(f => downloadFile(f.link, f.name, function (ok, name, reason) {
                    done++;
                    if (!ok) failed++;
                    else if (reason) { fallback++; if (!firstReason) firstReason = reason; }
                    if (done === files.length) {
                        setStatus(buildStatus(files.length - failed - fallback, fallback, failed, firstReason));
                    }
                }));
            });

        } else {
            fileList.textContent = 'No Google Drive files found. Scroll the stream so attachments load, refresh the page, then reopen this popup.'
                + (response && response.skipped > 0 ? ` (${response.skipped} non-Drive attachment(s) skipped.)` : '');
        }
    });
});
