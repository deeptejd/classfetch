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

                const text = document.createElement('span');
                text.textContent = file.name;

                li.appendChild(checkbox);
                li.appendChild(text);
                fileList.appendChild(li);

                li.addEventListener('click', function (event) {
                    if (event.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                    }
                    // select-all
                    const allChecked = Array.from(fileList.querySelectorAll('input[type="checkbox"]')).every(cb => cb.checked);
                    document.getElementById('selectAll').checked = allChecked;
                });
            });

            // select-all
            document.getElementById('selectAll').addEventListener('change', function () {
                Array.from(fileList.querySelectorAll('input[type="checkbox"]')).forEach(cb => {
                    cb.checked = this.checked;
                });
            });

            // select-all-buttons
            document.getElementById('downloadSelected').addEventListener('click', function () {
                Array.from(fileList.children).forEach(li => {
                    const checkbox = li.querySelector('input[type="checkbox"]');
                    if (checkbox.checked) {
                        chrome.downloads.download({ url: checkbox.value, filename: li.textContent });
                    }
                });
            });

            document.getElementById('downloadAll').addEventListener('click', function () {
                response.files.forEach(file => {
                    chrome.downloads.download({ url: file.link, filename: file.name });
                });
            });

        } else {
            document.getElementById('fileList').textContent = 'No Google Drive files found. Try refreshing your page.';
        }
    });
});