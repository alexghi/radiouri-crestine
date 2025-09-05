// Background service worker for Radio Crestin extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Radio Crestin extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // The popup will automatically open due to the manifest configuration
  console.log('Extension icon clicked');
});

// Optional: Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CURRENT_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tab: tabs[0] });
    });
    return true; // Indicates we will send a response asynchronously
  }
  
  if (message.type === 'OPEN_WEBSITE') {
    chrome.tabs.create({ url: 'https://radiocrestin.ro' });
  }
});
