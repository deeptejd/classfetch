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
                        // Removing the 'filename' parameter lets the browser use Google Drive's native filename with the extension
                        chrome.downloads.download({ 
                            url: appendAuthUser(checkbox.value)
                        });
                    }
                });
            });

            document.getElementById('downloadAll').addEventListener('click', function () {
                response.files.forEach(file => {
                    // Removing the 'filename' parameter lets the browser use Google Drive's native filename with the extension
                    chrome.downloads.download({ 
                        url: appendAuthUser(file.link)
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
