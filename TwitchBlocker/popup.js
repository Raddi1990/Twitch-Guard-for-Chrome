const input = document.getElementById('streamUrl');
const list = document.getElementById('list');

// Liste laden
chrome.storage.local.get(['blockedChannels'], (res) => {
  const channels = res.blockedChannels || [];
  channels.forEach(renderChannel);
});

document.getElementById('addBtn').onclick = () => {
  const url = input.value.trim();
  if (!url) return;
  
  // Extrahiere Kanalnamen aus URL (z.B. twitch.tv/username)
  const channelName = url.split('/').pop().toLowerCase();

  chrome.storage.local.get(['blockedChannels'], (res) => {
    const channels = res.blockedChannels || [];
    if (!channels.includes(channelName)) {
      const newList = [...channels, channelName];
      chrome.storage.local.set({ blockedChannels: newList }, () => {
        renderChannel(channelName);
        input.value = '';
      });
    }
  });
};

function renderChannel(name) {
  const li = document.createElement('li');
  li.textContent = name;
  const delBtn = document.createElement('button');
  delBtn.textContent = 'X';
  delBtn.onclick = () => {
    chrome.storage.local.get(['blockedChannels'], (res) => {
      const newList = res.blockedChannels.filter(c => c !== name);
      chrome.storage.local.set({ blockedChannels: newList }, () => li.remove());
    });
  };
  li.appendChild(delBtn);
  list.appendChild(li);
}

const powerBtn = document.getElementById('powerBtn');

// Status beim Öffnen laden
chrome.storage.local.get(['filterActive'], (res) => {
  // Standardmäßig auf "true" setzen, wenn noch nie definiert
  powerBtn.checked = res.filterActive !== false;
});

// Status speichern bei Klick
powerBtn.onchange = () => {
  chrome.storage.local.set({ filterActive: powerBtn.checked });
};

function renderChannel(name) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${name}</span>
    <button class="delete-btn" title="Löschen">✕</button>
  `;

  li.querySelector('.delete-btn').onclick = () => {
    chrome.storage.local.get(['blockedChannels'], (res) => {
      const newList = res.blockedChannels.filter(c => c !== name);
      chrome.storage.local.set({ blockedChannels: newList }, () => li.remove());
    });
  };
  
  list.appendChild(li);
}

// Button-Listener für das Hinzufügen
document.getElementById('addBtn').onclick = () => {
  const input = document.getElementById('streamUrl');
  let val = input.value.trim().toLowerCase();
  if (!val) return;

  // Falls URL eingegeben wurde, nur den Namen nehmen
  if (val.includes('twitch.tv/')) {
    val = val.split('twitch.tv/')[1].split('/')[0].split('?')[0];
  }

  chrome.storage.local.get(['blockedChannels'], (res) => {
    const channels = res.blockedChannels || [];
    if (!channels.includes(val)) {
      const newList = [...channels, val];
      chrome.storage.local.set({ blockedChannels: newList }, () => {
        renderChannel(val);
        input.value = '';
      });
    }
  });
};