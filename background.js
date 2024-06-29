// Import the validateTabLimit function
importScripts('utils.js');

// Function to cache tab limit from sync to local storage
function cacheTabLimit() {
    chrome.storage.sync.get('tabLimit', (data) => {
        chrome.storage.local.set({ tabLimit: data.tabLimit });
    });
}

// Initialize the extension by caching the tab limit
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "closeTabsToLeft",
        title: "Close tabs to the left",
        contexts: ["page"]
    });

    cacheTabLimit();
});

// Ensure the cache is updated when the browser starts
chrome.runtime.onStartup.addListener(() => {
    cacheTabLimit();
});

// Listen for changes in sync storage and update the local cache
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.tabLimit) {
        chrome.storage.local.set({ tabLimit: changes.tabLimit.newValue });
    }
});

// Handle context menu click to close tabs to the left
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "closeTabsToLeft") {
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
            const tabIndex = tabs.findIndex(t => t.id === tab.id);
            // Filter out tabs that are in groups
            const tabsToClose = tabs.slice(0, tabIndex).filter(t => t.groupId === -1);
            tabsToClose.forEach(t => chrome.tabs.remove(t.id));
        });
    }
});

// Handle new tab creation and enforce tab limit while ignoring grouped tabs
chrome.tabs.onCreated.addListener(() => {
    chrome.storage.local.get('tabLimit', (data) => {
        const tabLimit = validateTabLimit(data.tabLimit);
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
            // Filter out tabs that are in groups
            const ungroupedTabs = tabs.filter(t => t.groupId === -1);

            // Calculate the number of tabs to close
            const excessTabs = ungroupedTabs.length - tabLimit;
            if (excessTabs > 0) {
                const tabsToClose = ungroupedTabs.slice(0, excessTabs);
                tabsToClose.forEach(t => chrome.tabs.remove(t.id));
            }
        });
    });
});