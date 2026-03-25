const blockChannel = (name) => {
    const channelName = name.toLowerCase().trim();
    chrome.storage.local.get(['blockedChannels'], (res) => {
        const channels = res.blockedChannels || [];
        if (!channels.includes(channelName)) {
            const newList = [...channels, channelName];
            chrome.storage.local.set({ blockedChannels: newList }, () => {
                console.log(`%c[Twitch-Blocker] "${channelName}" zur Liste hinzugefügt.`, "color: #9146FF; font-weight: bold;");
                hideBlockedStreams(); 
            });
        }
    });
};

const injectBlockButtons = () => {
    const unfollowBtn = document.querySelector('[data-a-target="unfollow-button"]');
    const followBtn = document.querySelector('[data-a-target="follow-button"]');
    const anchorBtn = unfollowBtn || followBtn;

    if (anchorBtn) {
        const parent = anchorBtn.parentElement;
        if (parent && !parent.querySelector('.tg-block-btn')) {
            
            const channelPath = window.location.pathname.replace(/\//g, '').split('?')[0];
            if (!channelPath || ['directory', 'following', 'search'].includes(channelPath)) return;

            const btn = document.createElement('button');
            btn.innerHTML = '🚫 Block'; 
            btn.className = 'tg-block-btn';
            
            Object.assign(btn.style, {
                backgroundColor: '#eb0400',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0 10px',
                marginLeft: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '12px',
                height: '30px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
            });

            btn.onmouseover = () => btn.style.backgroundColor = '#ff2a26';
            btn.onmouseout = () => btn.style.backgroundColor = '#eb0400';

            btn.onclick = () => {
                if (confirm(`Möchtest du "${channelPath}" wirklich blockieren?`)) {
                    blockChannel(channelPath);
                    window.location.href = 'https://www.twitch.tv';
                }
            };

            anchorBtn.insertAdjacentElement('afterend', btn);
            console.log(`%c[Twitch-Blocker] Button für "${channelPath}" injiziert.`, "color: green;");
        }
    }
};

const hideBlockedStreams = () => {
  if (!chrome.runtime?.id) return;

  chrome.storage.local.get(['blockedChannels', 'filterActive'], (res) => {
    const isActive = res.filterActive !== false; // Default true
    const blocked = (res.blockedChannels || []).map(c => c.toLowerCase().trim());

    if (!isActive) {
      document.querySelectorAll('[data-blocked="true"]').forEach(el => {
        el.style.display = '';
        el.removeAttribute('data-blocked');
      });
      return;
    }

    if (blocked.length === 0) return;

    // --- SIDEBAR CHECK ---
    const sideNavTitles = document.querySelectorAll('p[data-a-target="side-nav-title"]');
    sideNavTitles.forEach(p => {
      const channelName = p.textContent.toLowerCase().trim();
      if (blocked.includes(channelName)) {
        const card = p.closest('.side-nav-card');
        if (card && card.style.display !== 'none') {
          card.style.setProperty('display', 'none', 'important');
          card.setAttribute('data-blocked', 'true'); // Markierung zum Wieder-Einblenden
          console.log(`%c[Twitch-Blocker] Ausgeblendet: ${channelName}`, "color: orange;");
        }
      }
    });

    // --- KACHELN/LINKS CHECK ---
    const allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(link => {
      const href = link.getAttribute('href').replace(/^\/|\/$/g, '').split('?')[0].toLowerCase();
      if (blocked.includes(href)) {
        const container = link.closest('article, [data-a-target="shelf-card-layout"], .tw-tower > div');
        if (container && container.style.display !== 'none') {
          container.style.setProperty('display', 'none', 'important');
          container.setAttribute('data-blocked', 'true');
          console.log(`%c[Twitch-Blocker] Kachel entfernt: ${href}`, "color: red;");
        }
      }
    });
  });
};

const observer = new MutationObserver(() => {
  hideBlockedStreams();
  injectBlockButtons();
});

observer.observe(document.body, { childList: true, subtree: true });
setInterval(injectBlockButton, 1500);
setInterval(hideElements, 1500);
hideBlockedStreams();
injectBlockButtons();