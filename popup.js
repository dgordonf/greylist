const domainInput = document.getElementById('domainInput');
const addBtn = document.getElementById('addBtn');
const greyListDisplay = document.getElementById('greyListDisplay');

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
    });
    li.appendChild(removeBtn);
    greyListDisplay.appendChild(li);
  });
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

loadList();
