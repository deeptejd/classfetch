const fileList = document.getElementById('fileList');
const statusEl = document.getElementById('status');
const downloadSelectedBtn = document.getElementById('downloadSelected');
const downloadAllBtn = document.getElementById('downloadAll');
const refreshBtn = document.getElementById('refresh');

let currentTab = null;
let currentFiles = [];

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
            // Permission-blocked files still "download", but Drive serves an .htm error page
            chrome.downloads.search({ id: downloadId }, function (items) {
                const item = items && items[0];
                if (item && /\.html?$/i.test(item.filename)) {
                    onDone(false, name, 'downloaded as .htm — the owner may have disabled downloads for this file');
                } else {
                    onDone(true, name, null);
                }
            });
        }
    });
}

function runDownloads(list) {
    let failed = 0;
    let fallback = 0;
    let done = 0;
    let firstReason = null;
    list.forEach(f => downloadFile(f.link, f.name, function (ok, name, reason) {
        done++;
        if (!ok) failed++;
        else if (reason) { fallback++; if (!firstReason) firstReason = reason; }
        if (done === list.length) {
            setStatus(buildStatus(list.length - failed - fallback, fallback, failed, firstReason));
        }
    }));
}

function renderFiles(files) {
    fileList.textContent = '';
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
}

function loadFiles() {
    if (!currentTab) return;
    fileList.textContent = '';
    setButtonsEnabled(false);
    setStatus('Scanning…');
    chrome.tabs.sendMessage(currentTab.id, { action: "getDriveLinks" }, function (response) {
        if (chrome.runtime.lastError) {
            setStatus('Could not reach the Classroom page. Refresh the tab, then press Refresh.');
            return;
        }
        if (response && Array.isArray(response.files) && response.files.length > 0) {
            const seenLinks = new Set();
            currentFiles = response.files.filter(f => {
                if (!f || !f.link || !f.name || seenLinks.has(f.link)) return false;
                seenLinks.add(f.link);
                return true;
            });

            if (currentFiles.length === 0) {
                showEmpty(response);
                return;
            }

            renderFiles(currentFiles);
            setButtonsEnabled(true);
            if (response.skipped > 0) {
                setStatus(`Found ${currentFiles.length} file(s); skipped ${response.skipped} non-Drive attachment(s).`);
            } else {
                setStatus(`Found ${currentFiles.length} file(s).`);
            }
        } else {
            currentFiles = [];
            showEmpty(response);
        }
    });
}

function showEmpty(response) {
    fileList.textContent = 'No Google Drive files found. Scroll the stream so attachments load, then press Refresh.'
        + (response && response.skipped > 0 ? ` (${response.skipped} non-Drive attachment(s) skipped.)` : '');
    setStatus('Nothing to download yet.');
}

downloadSelectedBtn.addEventListener('click', function () {
    const selected = Array.from(fileList.children)
        .filter(li => li.querySelector('input[type="checkbox"]').checked)
        .map(li => ({ link: li.dataset.link, name: li.dataset.name }));
    if (selected.length === 0) {
        setStatus('No files selected.');
        return;
    }
    runDownloads(selected);
});

downloadAllBtn.addEventListener('click', function () {
    if (currentFiles.length === 0) return;
    runDownloads(currentFiles);
});

refreshBtn.addEventListener('click', function () {
    loadFiles();
});

setButtonsEnabled(false);

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs && tabs[0];
    if (!activeTab || !activeTab.url || !activeTab.url.startsWith('https://classroom.google.com/')) {
        setStatus('This extension only works on Google Classroom. (For now)');
        return;
    }
    currentTab = activeTab;
    loadFiles();
});
