// Minimal cross-browser shim: prefer Firefox's promise-based `browser`,
// fall back to callback-style `chrome` (Chrome/Edge).
const extAPI = (() => {
    const hasBrowser = typeof browser !== 'undefined' && browser.runtime;
    if (hasBrowser) {
        return {
            queryTabs: (q) => browser.tabs.query(q),
            sendToTab: (id, msg) => browser.tabs.sendMessage(id, msg),
            download: (opts) => browser.downloads.download(opts),
            downloadsSearch: (q) => browser.downloads.search(q),
            createTab: (opts) => browser.tabs.create(opts),
            onMessage: (fn) => browser.runtime.onMessage.addListener((req) => fn(req)),
        };
    }
    const call = (fn, ctx, ...args) => new Promise((resolve, reject) => {
        fn.call(ctx, ...args, (result) => {
            const err = chrome.runtime.lastError;
            if (err) reject(new Error(err.message));
            else resolve(result);
        });
    });
    return {
        queryTabs: (q) => call(chrome.tabs.query, chrome.tabs, q),
        sendToTab: (id, msg) => call(chrome.tabs.sendMessage, chrome.tabs, id, msg),
        download: (opts) => call(chrome.downloads.download, chrome.downloads, opts),
        downloadsSearch: (q) => call(chrome.downloads.search, chrome.downloads, q),
        createTab: (opts) => call(chrome.tabs.create, chrome.tabs, opts),
        onMessage: (fn) => chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
            sendResponse(fn(req));
        }),
    };
})();
