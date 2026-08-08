chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    if (!currentTab.url.startsWith('https://classroom.google.com/')) {
        document.body.textContent = 'This extension only works on Google Classroom. (For now)';
        return;
    }
    chrome.tabs.sendMessage(tabs[0].id, { action: "getDriveLinks" }, function (response) {
        if (response && response.files.length > 0) {
            const fileList = document.getElementById('fileList');
            response.files.forEach(file => {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = file.link;
                checkbox.dataset.filename = file.name; // Store filename with extension

                const text = document.createElement('span');
                text.textContent = file.name;

                li.appendChild(checkbox);
                li.appendChild(text);
                fileList.appendChild(li);

                li.addEventListener('click', function (event) {
                    // Prevent the default action if the click is directly on the checkbox
                    if (event.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                    }
                });
            });

            // buttons
            document.getElementById('downloadSelected').addEventListener('click', function () {
                Array.from(fileList.children).forEach(li => {
                    const checkbox = li.querySelector('input[type="checkbox"]');
                    if (checkbox.checked) {
                        const filename = checkbox.dataset.filename;
                        console.log('Downloading:', filename, 'from:', checkbox.value);
                        chrome.downloads.download({ 
                            url: checkbox.value, 
                            filename: filename,
                            saveAs: false
                        }, function(downloadId) {
                            if (chrome.runtime.lastError) {
                                console.error('Download error:', chrome.runtime.lastError);
                            } else {
                                console.log('Download started:', downloadId);
                            }
                        });
                    }
                });
            });

            document.getElementById('downloadAll').addEventListener('click', function () {
                response.files.forEach(file => {
                    console.log('Downloading:', file.name, 'from:', file.link);
                    chrome.downloads.download({ 
                        url: file.link, 
                        filename: file.name,
                        saveAs: false
                    }, function(downloadId) {
                        if (chrome.runtime.lastError) {
                            console.error('Download error:', chrome.runtime.lastError);
                        } else {
                            console.log('Download started:', downloadId);
                        }
                    });
                });
            });

        } else {
            document.getElementById('fileList').textContent = 'No Google Drive files found. Try refreshing your page.';
        }
    });
});