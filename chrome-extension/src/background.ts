// Background service worker for Radio Crestin extension

let offscreenCreating = false;
let offscreenReady = false;

async function createOffscreenDocument() {
  // Check if document already exists
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT']
  });

  if (existingContexts.length > 0) {
    console.log('Offscreen document already exists');
    offscreenReady = true;
    return;
  }

  if (offscreenCreating) {
    return;
  }

  offscreenCreating = true;

  try {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Keep audio playing when extension popup is closed'
    });
    
    console.log('Offscreen document created');
  } catch (error) {
    console.error('Error creating offscreen document:', error);
  } finally {
    offscreenCreating = false;
  }
}

let pendingMessages = new Map();
let messageId = 0;

async function sendMessageToOffscreen(message: any): Promise<any> {
  if (!offscreenReady) {
    await createOffscreenDocument();
    // Give the offscreen document time to initialize and load saved state
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const id = ++messageId;
  message.messageId = id;

  return new Promise((resolve, reject) => {
    // Store the resolver for this message
    pendingMessages.set(id, resolve);
    
    // Set timeout to prevent hanging
    setTimeout(() => {
      if (pendingMessages.has(id)) {
        pendingMessages.delete(id);
        reject(new Error('Message timeout'));
      }
    }, 5000);

    // Send message to all contexts
    chrome.runtime.sendMessage(message).catch(() => {
      // Message failed to send
      if (pendingMessages.has(id)) {
        pendingMessages.delete(id);
        reject(new Error('Failed to send message'));
      }
    });
  });
}

function updateBadge(isPlaying: boolean) {
  if (isPlaying) {
    chrome.action.setBadgeText({ text: '♪' });
    chrome.action.setBadgeBackgroundColor({ color: '#9333ea' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Radio Crestin extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // The popup will automatically open due to the manifest configuration
  console.log('Extension icon clicked');
});

// Handle messages from popup and offscreen document
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message.type, 'from:', sender.url);

  // Messages from popup to offscreen
  if (message.type === 'AUDIO_LOAD_STATION' || 
      message.type === 'AUDIO_PLAY' || 
      message.type === 'AUDIO_PAUSE' || 
      message.type === 'AUDIO_SET_VOLUME' || 
      message.type === 'AUDIO_SET_MUTED' || 
      message.type === 'AUDIO_GET_STATE') {
    
    // If message is from popup, forward to offscreen
    if (sender.url?.includes('popup.html')) {
      sendMessageToOffscreen(message).then(response => {
        sendResponse(response);
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
      });
      return true; // Indicates we will send a response asynchronously
    }
  }

  // Response from offscreen document
  if (message.type === 'OFFSCREEN_RESPONSE' && message.messageId) {
    const resolver = pendingMessages.get(message.messageId);
    if (resolver) {
      pendingMessages.delete(message.messageId);
      resolver(message.response);
    }
    return;
  }

  // Messages from offscreen document
  if (message.type === 'OFFSCREEN_READY') {
    console.log('Offscreen document is ready');
    offscreenReady = true;
    updateBadge(message.state?.isPlaying || false);
    return;
  }

  if (message.type === 'AUDIO_STATE_CHANGED') {
    console.log('Audio state changed:', message.state);
    updateBadge(message.state.isPlaying);
    
    // Forward state changes to popup if it's open
    chrome.runtime.sendMessage({
      type: 'BACKGROUND_AUDIO_STATE_CHANGED',
      state: message.state
    }).catch(() => {
      // Popup might not be open, ignore error
    });
    return;
  }

  // Storage operations for offscreen document
  if (message.type === 'SAVE_AUDIO_STATE') {
    chrome.storage.local.set({
      lastAudioState: message.state
    }).then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      console.error('Failed to save audio state:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  if (message.type === 'GET_AUDIO_STATE') {
    chrome.storage.local.get(['lastAudioState']).then(result => {
      sendResponse({ success: true, state: result.lastAudioState });
    }).catch(error => {
      console.error('Failed to get audio state:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  // Original messages
  if (message.type === 'GET_CURRENT_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tab: tabs[0] });
    });
    return true;
  }
  
  if (message.type === 'OPEN_WEBSITE') {
    chrome.tabs.create({ url: 'https://radiocrestin.ro' });
  }
});
