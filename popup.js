const domainInput = document.getElementById('domainInput');
const addBtn = document.getElementById('addBtn');
const greyListDisplay = document.getElementById('greyListDisplay');
const tempDisableBtn = document.getElementById('tempDisableBtn');

// Add this function to check if we're on a greylisted site
async function isCurrentSiteGreylisted() {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  if (tabs[0]) {
    const domain = new URL(tabs[0].url).hostname.replace(/^www\./, '');
    const { greyList } = await chrome.storage.sync.get({greyList: []});
    return greyList.includes(domain);
  }
  return false;
}

// Add this function to update button state
async function updateTempDisableButton() {
  const { tempDisableEnd } = await chrome.storage.local.get({tempDisableEnd: 0});
  const isGreylisted = await isCurrentSiteGreylisted();
  
  if (!isGreylisted) {
    tempDisableBtn.style.display = 'none';
    return;
  }

  tempDisableBtn.style.display = 'block';
  
  if (Date.now() < tempDisableEnd) {
    const remainingSeconds = Math.round((tempDisableEnd - Date.now()) / 1000);
    tempDisableBtn.textContent = `Disabled (${remainingSeconds}s remaining)`;
    tempDisableBtn.classList.add('disabled');
  } else {
    tempDisableBtn.textContent = 'Disable Grey Mode (2min)';
    tempDisableBtn.classList.remove('disabled');
  }
}

// Add temporary disable button handler
tempDisableBtn.addEventListener('click', async () => {
  const { tempDisableEnd } = await chrome.storage.local.get({tempDisableEnd: 0});
  
  if (Date.now() < tempDisableEnd) return; // Still disabled
  
  const newDisableEnd = Date.now() + (2 * 60 * 1000); // 2 minutes
  await chrome.storage.local.set({tempDisableEnd: newDisableEnd});
  
  // Notify content script
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  if (tabs[0]) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'TEMP_DISABLE',
      disableEnd: newDisableEnd
    });
  }
  
  updateTempDisableButton();
});

// Update the existing loadList function
async function loadList() {
  const { greyList } = await chrome.storage.sync.get({greyList: []});
  
  greyListDisplay.innerHTML = '';
  greyList.forEach(domain => {
    const li = document.createElement('li');
    li.textContent = domain;
    const removeBtn = document.createElement('span');
    removeBtn.textContent = "X";
    removeBtn.className = "remove-button";
    removeBtn.addEventListener('click', async () => {
      const newList = greyList.filter(d => d !== domain);
      await chrome.storage.sync.set({greyList: newList});
      loadList();
      updateTempDisableButton();
    });
    li.appendChild(removeBtn);
    greyListDisplay.appendChild(li);
  });
  
  updateTempDisableButton();
}

addBtn.addEventListener('click', async () => {
  const domain = domainInput.value.trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
  if (!domain) return;
  
  const { greyList } = await chrome.storage.sync.get({greyList: []});
  if (!greyList.includes(domain)) {
    greyList.push(domain);
    await chrome.storage.sync.set({greyList});
    domainInput.value = '';
    loadList();
  }
});

// Add this to your initialization
setInterval(updateTempDisableButton, 1000); // Update countdown every second
loadList();
