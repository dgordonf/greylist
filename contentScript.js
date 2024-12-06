(async () => {
  // Get current domain
  const domain = window.location.hostname.replace(/^www\./, '');
  
  // Fetch greylist from storage
  const { greyList } = await chrome.storage.sync.get({greyList: []});
  
  if (greyList.includes(domain)) {
    const style = document.createElement('style');
    style.innerHTML = `
      html {
        filter: grayscale(100%) !important;
      }
    `;
    document.documentElement.appendChild(style);
  }
})();
