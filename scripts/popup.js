const fileList = document.getElementById('fileList');
const statusEl = document.getElementById('status');
const downloadSelectedBtn = document.getElementById('downloadSelected');
const downloadAllBtn = document.getElementById('downloadAll');
const refreshBtn = document.getElementById('refresh');

let currentTab = null;
let currentFiles = [];

function setStatus(message, { error = false } = {}) {
    statusEl.textContent = message;
    statusEl.classList.toggle('error', error);
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

async function downloadFile(link, name, li) {
    li.dataset.state = 'pending';
    let downloadId;
    try {
        downloadId = await extAPI.download({ url: link, filename: name });
    } catch (err) {
        const reason = err && err.message ? err.message : 'unknown error';
        console.warn('[ClassFetch] download failed for', name, ':', reason, '— opening in a new tab instead.');
        try {
            await extAPI.createTab({ url: link });
            li.dataset.state = 'opened';
            return { ok: true, fallback: true, reason };
        } catch (tabErr) {
            li.dataset.state = 'failed';
            return { ok: false, reason };
        }
    }
    // Permission-blocked files still "download", but Drive serves an .htm error page
    try {
        const items = await extAPI.downloadsSearch({ id: downloadId });
        const item = items && items[0];
        if (item && /\.html?$/i.test(item.filename)) {
            li.dataset.state = 'failed';
            return { ok: false, reason: 'downloaded as .htm — the owner may have disabled downloads for this file' };
        }
    } catch (_) { /* best-effort check */ }
    li.dataset.state = 'done';
    return { ok: true };
}

async function runDownloads(entries) {
    let failed = 0;
    let fallback = 0;
    let done = 0;
    let firstReason = null;
    await Promise.all(entries.map(async ({ link, name, li }) => {
        const result = await downloadFile(link, name, li);
        done++;
        if (!result.ok) { failed++; if (!firstReason) firstReason = result.reason; }
        else if (result.fallback) { fallback++; if (!firstReason) firstReason = result.reason; }
        if (done === entries.length) {
            setStatus(buildStatus(entries.length - failed - fallback, fallback, failed, firstReason), { error: failed > 0 });
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

function showEmpty(response) {
    fileList.textContent = 'No Google Drive files found. Scroll the stream so attachments load, then press Refresh.'
        + (response && response.skipped > 0 ? ` (${response.skipped} non-Drive attachment(s) skipped.)` : '');
    setStatus('Nothing to download yet.');
}

async function loadFiles() {
    if (!currentTab) return;
    fileList.textContent = '';
    setButtonsEnabled(false);
    setStatus('Scanning…');
    let response;
    try {
        response = await extAPI.sendToTab(currentTab.id, { action: "getDriveLinks" });
    } catch (err) {
        setStatus('Could not reach the Classroom page. Refresh the tab, then press Refresh.', { error: true });
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
}

downloadSelectedBtn.addEventListener('click', function () {
    const selected = Array.from(fileList.children)
        .filter(li => li.querySelector('input[type="checkbox"]').checked)
        .map(li => ({ link: li.dataset.link, name: li.dataset.name, li }));
    if (selected.length === 0) {
        setStatus('No files selected.');
        return;
    }
    runDownloads(selected);
});

downloadAllBtn.addEventListener('click', function () {
    if (currentFiles.length === 0) return;
    const entries = currentFiles.map((f, i) => ({ link: f.link, name: f.name, li: fileList.children[i] }));
    runDownloads(entries);
});

refreshBtn.addEventListener('click', function () {
    loadFiles();
});

setButtonsEnabled(false);

(async function () {
    try {
        const tabs = await extAPI.queryTabs({ active: true, currentWindow: true });
        const activeTab = tabs && tabs[0];
        if (!activeTab || !activeTab.url || !activeTab.url.startsWith('https://classroom.google.com/')) {
            setStatus('This extension only works on Google Classroom. (For now)');
            return;
        }
        currentTab = activeTab;
        loadFiles();
    } catch (_) {
        setStatus('Could not access the current tab.', { error: true });
    }
})();
