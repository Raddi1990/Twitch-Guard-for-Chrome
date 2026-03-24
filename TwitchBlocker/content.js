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

const observer = new MutationObserver(() => hideBlockedStreams());
observer.observe(document.body, { childList: true, subtree: true });
setInterval(hideBlockedStreams, 1000);
hideBlockedStreams();