chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    if (!currentTab.url.startsWith('https://classroom.google.com/')) {
        document.body.textContent = 'This extension only works on Google Classroom. (For now)';
        return;
    }

    // Extract the authuser parameter from the Classroom URL (defaults to 0 if not found)
    const authuserMatch = currentTab.url.match(/\/u\/(\d+)\//);
    const authuser = authuserMatch ? authuserMatch[1] : '0';

    // Helper function to safely append authuser to the download link
    const appendAuthUser = (url) => {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}authuser=${authuser}`;
    };

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
                        const filename = checkbox.dataset.filename;
                        console.log('Downloading:', filename, 'from:', checkbox.value);
                        chrome.downloads.download({ 
                            url: appendAuthUser(checkbox.value), 
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
                        url: appendAuthUser(file.link), 
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
document.getElementById("darkModeButton").addEventListener('click',function() {
    if(document.getElementById("darkModeButton").textContent == "Light Mode"){
        document.getElementById("body").classList.remove("dm");
        document.getElementById("darkModeButton").textContent = "Dark Mode";}
    else{
        document.getElementById("body").classList.add("dm");
        document.getElementById("darkModeButton").textContent = "Light Mode";
    }
});
