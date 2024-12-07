let styleElement = null;

function applyGreyscale(enabled = true) {
  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }
  
  if (enabled) {
    styleElement = document.createElement('style');
    styleElement.innerHTML = `
      html {
        filter: grayscale(100%) !important;
      }
    `;
    document.documentElement.appendChild(styleElement);
  }
}

async function checkTempDisable() {
  const { tempDisableEnd } = await chrome.storage.local.get({tempDisableEnd: 0});
  return Date.now() < tempDisableEnd;
}

// Initial setup
(async () => {
  const domain = window.location.hostname.replace(/^www\./, '');
  const { greyList } = await chrome.storage.sync.get({greyList: []});
  
  if (greyList.includes(domain)) {
    const isTemporarilyDisabled = await checkTempDisable();
    applyGreyscale(!isTemporarilyDisabled);
    
    // If temporarily disabled, set up re-enable timer
    if (isTemporarilyDisabled) {
      const { tempDisableEnd } = await chrome.storage.local.get({tempDisableEnd: 0});
      const timeoutMs = tempDisableEnd - Date.now();
      setTimeout(() => applyGreyscale(true), timeoutMs);
    }
  }
})();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TEMP_DISABLE') {
    applyGreyscale(false);
    const timeoutMs = message.disableEnd - Date.now();
    setTimeout(() => applyGreyscale(true), timeoutMs);
  }
});
