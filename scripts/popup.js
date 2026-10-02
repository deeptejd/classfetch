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

            function downloadFile(link, name, onDone) {
                chrome.downloads.download({ url: link, filename: name }, function (downloadId) {
                    if (chrome.runtime.lastError || downloadId === undefined) {
                        console.warn('[ClassFetch] Download failed for', name, chrome.runtime.lastError && chrome.runtime.lastError.message);
                        onDone(false, name);
                    } else {
                        onDone(true, name);
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
                let done = 0;
                selected.forEach(f => downloadFile(f.link, f.name, function (ok, name) {
                    done++;
                    if (!ok) failed++;
                    if (done === selected.length) {
                        setStatus(failed === 0
                            ? `Started ${selected.length} download(s).`
                            : `Started ${selected.length - failed} download(s); ${failed} failed (check permissions — files may need download access enabled by the owner).`);
                    }
                }));
            });

            downloadAllBtn.addEventListener('click', function () {
                let failed = 0;
                let done = 0;
                files.forEach(f => downloadFile(f.link, f.name, function (ok) {
                    done++;
                    if (!ok) failed++;
                    if (done === files.length) {
                        setStatus(failed === 0
                            ? `Started ${files.length} download(s).`
                            : `Started ${files.length - failed} download(s); ${failed} failed (check permissions — files may need download access enabled by the owner).`);
                    }
                }));
            });

        } else {
            fileList.textContent = 'No Google Drive files found. Scroll the stream so attachments load, refresh the page, then reopen this popup.';
        }
    });
});
