chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockingEnabled: false, blockedUrls: [] });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.blockingEnabled !== undefined) {
    if (message.blockingEnabled) {
      enableBlocking();
    } else {
      disableBlocking();
    }
  }

  if (message.blockedUrls) {
    updateBlockingRules(message.blockedUrls);
  }
});

function enableBlocking() {
  chrome.storage.sync.get({ blockedUrls: [] }, function(data) {
    updateBlockingRules(data.blockedUrls);
  });
}

function disableBlocking() {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2, 3, 4, 5] 
  }, () => {
    console.log('Blocking disabled');
  });
}

function updateBlockingRules(urls) {
  const rules = urls.map((url, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: url, resourceTypes: ["main_frame"] }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules,
    removeRuleIds: rules.map(rule => rule.id)
  }, () => {
    console.log('Blocking rules updated');
  });
}
